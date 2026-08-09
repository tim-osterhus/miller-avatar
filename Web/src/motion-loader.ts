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
    const restHipsPosition = normalizedRestHipsPosition(avatar);
    const clip = dependencies.createClip(animations[0], avatar);
    createdClip = clip;
    const filteredTracks = clip.tracks.filter((track) => isSkeletalTrack(track, skeletalNames));
    if (filteredTracks.length === 0) {
      disposeDetachedClip(clip, dependencies);
      createdClip = undefined;
      throw new MotionLoadError("motion_load_failed", "VRMA animation has no usable humanoid tracks");
    }
    clip.tracks = filteredTracks;
    reanchorHipsTrack(clip, avatar, restHipsPosition);
    if (signal.aborted || !isCurrent(input)) {
      disposeDetachedClip(clip, dependencies);
      createdClip = undefined;
      throw cancelledError();
    }
    return { motionToken: input.motionToken, clip };
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

function normalizedRestHipsPosition(avatar: VRM): readonly [number, number, number] {
  const position = (avatar.humanoid?.normalizedRestPose as Record<string, unknown> | undefined)?.hips;
  const raw = (position as { position?: unknown } | undefined)?.position;
  const values = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
      ? [
        (raw as { x?: unknown }).x,
        (raw as { y?: unknown }).y,
        (raw as { z?: unknown }).z,
      ]
      : [];
  if (values.length !== 3 || !values.every((value) => typeof value === "number" && Number.isFinite(value))) {
    throw new MotionLoadError("motion_load_failed", "avatar has no normalized rest hips position");
  }
  return [values[0] as number, values[1] as number, values[2] as number];
}

function reanchorHipsTrack(
  clip: THREE.AnimationClip,
  avatar: VRM,
  restHipsPosition: readonly [number, number, number],
): void {
  const hipsBone = (avatar.humanoid?.normalizedHumanBones as unknown as Record<string, unknown> | undefined)?.hips;
  const hipsName = ((hipsBone as { node?: { name?: unknown } } | undefined)?.node?.name);
  if (typeof hipsName !== "string" || hipsName.length === 0) return;
  const track = clip.tracks.find((candidate) => candidate.name === `${hipsName}.position`);
  if (!track) return;
  const times = track.times;
  const values = track.values;
  if (times.length === 0) return;
  const valueSize = values.length / times.length;
  const isCubicSpline = track.createInterpolant?.isInterpolantFactoryMethodGLTFCubicSpline === true;
  if (!isCubicSpline && valueSize === 3) {
    offsetValues(values, 3, restHipsPosition, 0);
    return;
  }
  if (isCubicSpline && valueSize === 9) {
    offsetValues(values, 9, restHipsPosition, 3);
    return;
  }
  throw new MotionLoadError("motion_load_failed", "hips position track is not VEC3");
}

function offsetValues(
  values: ArrayLike<number> & { [index: number]: number },
  stride: number,
  rest: readonly [number, number, number],
  centerOffset: number,
): void {
  const first = [
    values[centerOffset] ?? Number.NaN,
    values[centerOffset + 1] ?? Number.NaN,
    values[centerOffset + 2] ?? Number.NaN,
  ];
  if (!first.every(Number.isFinite)) throw new MotionLoadError("motion_load_failed", "hips position values are not finite");
  const delta = [first[0] - rest[0], first[1] - rest[1], first[2] - rest[2]];
  for (let index = centerOffset; index < values.length; index += stride) {
    values[index] -= delta[0];
    values[index + 1] -= delta[1];
    values[index + 2] -= delta[2];
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
