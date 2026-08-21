import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  createVRMAnimationClip,
  VRMAnimationLoaderPlugin,
  type VRMAnimation,
} from "@pixiv/three-vrm-animation";
import type { VRM } from "@pixiv/three-vrm";

const localMotionURL = /^miller-avatar-local:\/\/app\/session\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.vrma$/u;
const defaultMotionTimeoutMilliseconds = 10_000;

export interface UniqueMotionInput {
  readonly sessionID: string;
  readonly generationID: string;
  readonly profileRevision: number;
  readonly motionToken: string;
  readonly url: string;
  readonly isCurrent?: () => boolean;
}

export interface ConvertedMotion {
  readonly motionToken: string;
  readonly clip: THREE.AnimationClip;
  /** The same motion with planar hips travel removed for semantic steady roles. */
  readonly steadyClip?: THREE.AnimationClip;
}

export type MotionLoaderResult = ConvertedMotion;

export interface MotionParser {
  readonly json: MotionJSON;
}

export interface MotionGLTF {
  readonly userData: Record<string, unknown>;
  readonly parser: MotionParser;
}

export interface MotionLoader {
  register(callback: (parser: MotionParser) => unknown): unknown;
  load(
    url: string,
    onLoad: (gltf: MotionGLTF) => void,
    onProgress: undefined,
    onError: (error: unknown) => void,
  ): void;
}

export interface MotionTimeoutScheduler {
  request(callback: () => void, delayMilliseconds: number): number;
  cancel(handle: number): void;
}

export interface MotionLoaderDependencies {
  createLoader(): MotionLoader;
  createPlugin(parser: MotionParser): unknown;
  createClip(animation: unknown, avatar: VRM): THREE.AnimationClip;
  disposeClip?: (clip: THREE.AnimationClip) => void;
  timeoutMilliseconds?: number;
  timeoutScheduler?: MotionTimeoutScheduler;
}

export type MotionLoadFailureCode =
  | "motion_load_failed"
  | "motion_load_timeout"
  | "cancelled";

export class MotionLoadError extends Error {
  constructor(
    public readonly code: MotionLoadFailureCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "MotionLoadError";
  }
}

export function requireSessionMotionURL(url: string): void {
  if (!localMotionURL.test(url)) throw new Error("renderer rejected non-session motion URL");
}

export async function loadMotion(
  input: UniqueMotionInput,
  avatar: VRM,
  signal: AbortSignal,
  dependencies: MotionLoaderDependencies = defaultMotionLoaderDependencies,
): Promise<ConvertedMotion> {
  requireSessionMotionURL(input.url);
  if (signal.aborted || !isCurrent(input)) throw cancelledError();

  const timeoutMilliseconds = dependencies.timeoutMilliseconds ?? defaultMotionTimeoutMilliseconds;
  if (!Number.isSafeInteger(timeoutMilliseconds) || timeoutMilliseconds <= 0) {
    throw new RangeError("motion load timeout must be a positive safe integer");
  }
  const timeoutScheduler = dependencies.timeoutScheduler ?? browserMotionTimeoutScheduler;
  const loader = dependencies.createLoader();
  if (signal.aborted || !isCurrent(input)) throw cancelledError();

  let timeoutHandle: number | null = null;
  let timedOut = false;
  let settled = false;
  let resolveLoad: (value: MotionGLTF) => void = () => {};
  let rejectLoad: (reason?: unknown) => void = () => {};
  let createdClip: THREE.AnimationClip | undefined;
  const loaded = new Promise<MotionGLTF>((resolve, reject) => {
    resolveLoad = resolve;
    rejectLoad = reject;
  });
  const abort = () => {
    if (!settled) rejectLoad(cancelledError());
  };
  signal.addEventListener("abort", abort, { once: true });
  try {
    loader.register((parser) => dependencies.createPlugin(parser));
    if (signal.aborted || !isCurrent(input)) throw cancelledError();
    timeoutHandle = timeoutScheduler.request(() => {
      timedOut = true;
      rejectLoad(new MotionLoadError("motion_load_timeout", "motion load timed out"));
    }, timeoutMilliseconds);
    loader.load(
      input.url,
      (gltf) => resolveLoad(gltf),
      undefined,
      (error) => rejectLoad(error),
    );
    const gltf = await loaded;
    if (signal.aborted || !isCurrent(input)) throw cancelledError();
    validateMotionDocument(gltf.parser.json);
    const animations = gltf.userData.vrmAnimations;
    if (!Array.isArray(animations) || animations.length !== 1) {
      throw new MotionLoadError("motion_load_failed", "expected exactly one VRMA animation");
    }
    const skeletalNames = normalizedHumanoidNodeNames(avatar);
    const clip = dependencies.createClip(animations[0], avatar);
    createdClip = clip;
    const filteredTracks = clip.tracks.filter((track) => isSkeletalTrack(track, skeletalNames));
    if (filteredTracks.length === 0) {
      disposeDetachedClip(clip, dependencies);
      createdClip = undefined;
      throw new MotionLoadError("motion_load_failed", "VRMA animation has no usable humanoid tracks");
    }
    requireFiniteConvertedTracks(filteredTracks);
    clip.tracks = filteredTracks;
    const hipsTarget = normalizedHipsTarget(avatar);
    const steadyClip = hipsTarget === null
      ? undefined
      : deriveSteadyInPlaceClip(clip, hipsTarget.name, hipsTarget.restPlanar);
    if (signal.aborted || !isCurrent(input)) {
      disposeDetachedClip(clip, dependencies);
      createdClip = undefined;
      throw cancelledError();
    }
    return { motionToken: input.motionToken, clip, steadyClip };
  } catch (error) {
    if (createdClip !== undefined) {
      disposeDetachedClip(createdClip, dependencies);
      createdClip = undefined;
    }
    if (timedOut) throw new MotionLoadError("motion_load_timeout", "motion load timed out", { cause: error });
    if (signal.aborted || !isCurrent(input)) throw cancelledError();
    if (error instanceof MotionLoadError) throw error;
    throw new MotionLoadError("motion_load_failed", errorMessage(error), { cause: error });
  } finally {
    settled = true;
    signal.removeEventListener("abort", abort);
    if (timeoutHandle !== null) timeoutScheduler.cancel(timeoutHandle);
  }
}

export function normalizedHumanoidNodeNames(avatar: VRM): ReadonlySet<string> {
  const bones = avatar.humanoid?.normalizedHumanBones as unknown as Record<string, unknown> | undefined;
  if (!bones) throw new MotionLoadError("motion_load_failed", "avatar has no normalized humanoid bones");
  const names = new Set<string>();
  for (const bone of Object.values(bones)) {
    const node = (bone as { node?: { name?: unknown } } | undefined)?.node;
    const name = node?.name;
    if (typeof name !== "string" || name.trim() === "") {
      throw new MotionLoadError("motion_load_failed", "normalized humanoid bone name is empty");
    }
    if (names.has(name)) {
      throw new MotionLoadError("motion_load_failed", "normalized humanoid bone names are not unique");
    }
    names.add(name);
  }
  if (names.size === 0) throw new MotionLoadError("motion_load_failed", "avatar has no normalized humanoid bones");
  return names;
}

export function deriveSteadyInPlaceClip(
  clip: THREE.AnimationClip,
  hipsName: string,
  restPlanar?: { readonly x: number; readonly z: number },
): THREE.AnimationClip {
  const steady = clip.clone();
  steady.name = `${clip.name}:steady`;
  const track = steady.tracks.find((candidate) => candidate.name === `${hipsName}.position`);
  if (!track || track.times.length === 0) return steady;

  const stride = track.values.length / track.times.length;
  const cubic = track.createInterpolant?.isInterpolantFactoryMethodGLTFCubicSpline === true;
  if (!cubic && stride === 3) {
    const firstX = restPlanar?.x ?? track.values[0];
    const firstZ = restPlanar?.z ?? track.values[2];
    for (let index = 0; index < track.values.length; index += 3) {
      track.values[index] = firstX;
      track.values[index + 2] = firstZ;
    }
  } else if (cubic && stride === 9) {
    const firstValue = 3;
    const firstX = restPlanar?.x ?? track.values[firstValue];
    const firstZ = restPlanar?.z ?? track.values[firstValue + 2];
    for (let index = 0; index < track.values.length; index += 9) {
      track.values[index] = 0;
      track.values[index + 2] = 0;
      track.values[index + 3] = firstX;
      track.values[index + 5] = firstZ;
      track.values[index + 6] = 0;
      track.values[index + 8] = 0;
    }
  }
  return steady;
}

interface NormalizedHipsTarget {
  readonly name: string;
  readonly restPlanar?: { readonly x: number; readonly z: number };
}

function normalizedHipsTarget(avatar: VRM): NormalizedHipsTarget | null {
  const humanoid = avatar.humanoid as typeof avatar.humanoid & {
    normalizedHumanBones?: Record<string, unknown>;
    normalizedRestPose?: {
      hips?: {
        position?: readonly unknown[] | { x?: unknown; y?: unknown; z?: unknown };
      };
    };
  };
  const bones = humanoid?.normalizedHumanBones;
  const node = (bones?.hips as { node?: { name?: unknown } } | undefined)?.node;
  if (typeof node?.name !== "string" || node.name.trim() === "") return null;

  const rawRest = humanoid?.normalizedRestPose?.hips?.position;
  const rest = Array.isArray(rawRest)
    ? rawRest
    : rawRest
      ? [rawRest.x, rawRest.y, rawRest.z]
      : [];
  const restX = rest[0];
  const restZ = rest[2];
  const restPlanar = typeof restX === "number"
    && Number.isFinite(restX)
    && typeof restZ === "number"
    && Number.isFinite(restZ)
    ? { x: restX, z: restZ }
    : undefined;
  return { name: node.name, restPlanar };
}

interface MotionJSON {
  readonly scene?: unknown;
  readonly scenes?: unknown;
  readonly nodes?: unknown;
  readonly animations?: unknown;
  readonly extensions?: unknown;
  readonly [key: string]: unknown;
}

function validateMotionDocument(json: MotionJSON): void {
  const extension = getRecord(json.extensions)?.VRMC_vrm_animation;
  if (getRecord(extension)?.specVersion !== "1.0") {
    throw new MotionLoadError("motion_load_failed", "VRMA document is not version 1.0");
  }
  const sceneIndex = typeof json.scene === "number" && Number.isSafeInteger(json.scene)
    ? json.scene
    : null;
  if (sceneIndex === null) {
    throw new MotionLoadError("motion_load_failed", "VRMA document has no default scene");
  }
  const scenes = json.scenes;
  if (!Array.isArray(scenes) || sceneIndex < 0 || sceneIndex >= scenes.length || !getRecord(scenes[sceneIndex])) {
    throw new MotionLoadError("motion_load_failed", "VRMA document has an invalid default scene");
  }
  if (!Array.isArray(json.animations) || json.animations.length !== 1) {
    throw new MotionLoadError("motion_load_failed", "VRMA document must declare exactly one source animation");
  }
  if (containsURI(json)) throw new MotionLoadError("motion_load_failed", "VRMA document contains an external URI");
  validateDefaultSceneNodes(json, getRecord(scenes[sceneIndex])!);
}

function validateDefaultSceneNodes(json: MotionJSON, scene: Record<string, unknown>): void {
  const nodes = json.nodes;
  const roots = scene.nodes;
  if (!Array.isArray(nodes) || !Array.isArray(roots)) {
    throw new MotionLoadError("motion_load_failed", "VRMA default scene is missing node references");
  }
  const visited = new Set<number>();
  const visiting = new Set<number>();
  const visit = (value: unknown) => {
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0 || value >= nodes.length) {
      throw new MotionLoadError("motion_load_failed", "VRMA default scene references an invalid node");
    }
    const nodeIndex = value;
    if (visiting.has(nodeIndex)) throw new MotionLoadError("motion_load_failed", "VRMA node hierarchy is cyclic");
    if (visited.has(nodeIndex)) return;
    const node = getRecord(nodes[nodeIndex]);
    if (!node) throw new MotionLoadError("motion_load_failed", "VRMA node is not an object");
    visiting.add(nodeIndex);
    visited.add(nodeIndex);
    if (Array.isArray(node.children)) for (const child of node.children) visit(child);
    visiting.delete(nodeIndex);
  };
  for (const root of roots) visit(root);
}

function containsURI(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsURI);
  if (!value || typeof value !== "object") return false;
  for (const [key, child] of Object.entries(value)) {
    if (key === "uri") return true;
    if (containsURI(child)) return true;
  }
  return false;
}

function isSkeletalTrack(track: THREE.KeyframeTrack, nodeNames: ReadonlySet<string>): boolean {
  const separator = track.name.lastIndexOf(".");
  if (separator <= 0) return false;
  const nodeName = track.name.slice(0, separator);
  const path = track.name.slice(separator + 1);
  return nodeNames.has(nodeName) && (path === "position" || path === "quaternion");
}

function requireFiniteConvertedTracks(tracks: readonly THREE.KeyframeTrack[]): void {
  for (const track of tracks) {
    if (![...track.times, ...track.values].every(Number.isFinite)) {
      throw new MotionLoadError(
        "motion_load_failed",
        "converted humanoid track samples must be finite",
      );
    }
  }
}

function isCurrent(input: UniqueMotionInput): boolean {
  return input.isCurrent?.() ?? true;
}

function disposeDetachedClip(clip: THREE.AnimationClip, dependencies: MotionLoaderDependencies): void {
  dependencies.disposeClip?.(clip);
}

function cancelledError(): MotionLoadError {
  const error = new MotionLoadError("cancelled", "motion load cancelled");
  error.name = "AbortError";
  return error;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "motion load failed";
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

const browserMotionTimeoutScheduler: MotionTimeoutScheduler = {
  request(callback, delayMilliseconds) {
    return globalThis.setTimeout(callback, delayMilliseconds) as unknown as number;
  },
  cancel(handle) {
    globalThis.clearTimeout(handle);
  },
};

const defaultMotionLoaderDependencies: MotionLoaderDependencies = {
  createLoader() {
    return new GLTFLoader() as unknown as MotionLoader;
  },
  createPlugin(parser) {
    return new VRMAnimationLoaderPlugin(parser as never);
  },
  createClip(animation, avatar) {
    return createVRMAnimationClip(animation as VRMAnimation, avatar);
  },
};
