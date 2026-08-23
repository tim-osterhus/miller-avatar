import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  MToonMaterial,
  VRMLoaderPlugin,
  type VRM,
} from "@pixiv/three-vrm";
import {
  loadMotion,
  requireSessionMotionURL,
  type ConvertedMotion,
  type UniqueMotionInput,
} from "./motion-loader.js";
import type { LoadedAvatar, MotionRegistry, RendererBackend, RendererPolicy } from "./bridge.js";
import {
  MouthController,
  mouthVowelNames,
  zeroMouthVowelWeights,
  type MouthCapabilities,
  type MouthTarget,
  type MouthVowelWeights,
} from "./mouth-controller.js";
import {
  MotionController,
  type MotionActiveEvent,
  type MotionFault,
  type MotionMixerLike,
  type MotionRuntimeIdentity,
} from "./motion-controller.js";
import { expandBoundsForOffsets, fitCamera, type Bounds3 } from "./camera.js";
import type { AvatarMotionRole, PresentationPhase } from "./contract.js";
import type { PresentationEffect } from "./presentation.js";

const localAssetURL = /^miller-avatar-local:\/\/app\/session\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.vrm$/u;
const maximumViewportDimension = 8_192;
const probeDimension = 64;

export interface MouthExpressionManager {
  getExpression(name: string): unknown | null | undefined;
  setValue(name: string, value: number): void;
}

/**
 * Narrow non-WebGL construction seam for renderer lifecycle tests. Production
 * construction leaves this undefined and creates the real canvas/renderer and
 * loader.
 */
export interface RendererTestSeam {
  readonly canvas: HTMLCanvasElement;
  readonly renderer: THREE.WebGLRenderer;
  readonly loadVRM: typeof loadVRM;
}

export function detectMouthCapabilities(
  expressionManager: MouthExpressionManager | null | undefined,
): MouthCapabilities {
  const capabilities = Object.fromEntries(
    mouthVowelNames.map((vowel) => {
      const expression = expressionManager?.getExpression(vowel);
      return [vowel, expression !== null && expression !== undefined];
    }),
  ) as MouthCapabilities;
  return Object.freeze(capabilities);
}

export function applyMouthExpressionValues(
  expressionManager: MouthExpressionManager | null | undefined,
  capabilities: MouthCapabilities,
  values: MouthVowelWeights,
): void {
  if (!expressionManager) return;
  for (const vowel of mouthVowelNames) {
    if (capabilities[vowel]) expressionManager.setValue(vowel, values[vowel]);
  }
}

export interface AvatarEvidence {
  bounds: Bounds3;
  visibleMeshes: number;
  decodedTextures: number;
  materialBindings: number;
  mtoonMaterials: number;
}

export interface PhasePresentation {
  visible: true;
  expression: "relaxed" | "sad" | null;
  weight: number;
}

export function phasePresentationFor(phase: PresentationPhase): PhasePresentation {
  if (phase === "thinking") return { visible: true, expression: "relaxed", weight: 0.35 };
  if (phase === "failed") return { visible: true, expression: "sad", weight: 0.55 };
  return { visible: true, expression: null, weight: 0 };
}

export function requireVRM1<T>(
  candidate: T,
  specVersion = "1.0",
): asserts candidate is T & { meta: { metaVersion: "1" } } {
  const metaVersion = (candidate as { meta?: { metaVersion?: unknown } } | null)?.meta?.metaVersion;
  if (metaVersion !== "1" || specVersion !== "1.0") throw new Error("asset is not VRM 1.0");
}

export function requireSessionAssetURL(url: string): void {
  if (!localAssetURL.test(url)) throw new Error("renderer rejected non-session asset URL");
}

export { requireSessionMotionURL } from "./motion-loader.js";

export function countAlphaPixels(pixels: Uint8Array): number {
  if (pixels.length % 4 !== 0) throw new RangeError("alpha probe requires RGBA pixels");
  let count = 0;
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] !== 0) count += 1;
  }
  return count;
}

export function observeRootResize(
  root: HTMLElement,
  onResize: () => void,
  Observer: typeof ResizeObserver | undefined = typeof ResizeObserver === "function"
    ? ResizeObserver
    : undefined,
): () => void {
  if (!Observer) return () => {};
  const observer = new Observer(() => onResize());
  observer.observe(root);
  return () => observer.disconnect();
}

export function collectAvatarEvidence(root: THREE.Object3D): AvatarEvidence {
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3();
  const decodedSources = new Set<THREE.Source>();
  const mtoonMaterials = new Set<MToonMaterial>();
  let visibleMeshes = 0;
  let materialBindings = 0;

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || !effectivelyVisible(object)) return;
    const materials = (Array.isArray(object.material) ? object.material : [object.material])
      .filter((material) => material.visible);
    if (materials.length === 0) return;
    const objectBounds = new THREE.Box3().setFromObject(object);
    if (objectBounds.isEmpty()) return;
    visibleMeshes += 1;
    bounds.union(objectBounds);
    for (const material of materials) {
      materialBindings += 1;
      if (material instanceof MToonMaterial) mtoonMaterials.add(material);
      for (const texture of materialTextures(material)) {
        if (textureIsDecoded(texture)) decodedSources.add(texture.source);
      }
    }
  });

  if (visibleMeshes < 1 || materialBindings < 1 || bounds.isEmpty()) {
    throw new Error("renderer has no visible geometry with material bindings");
  }
  const min = bounds.min;
  const max = bounds.max;
  const values = [min.x, min.y, min.z, max.x, max.y, max.z];
  if (!values.every(Number.isFinite)) throw new Error("avatar bounds are not finite");
  return {
    bounds: {
      min: { x: min.x, y: min.y, z: min.z },
      max: { x: max.x, y: max.y, z: max.z },
      visibleMeshes,
    },
    visibleMeshes,
    decodedTextures: decodedSources.size,
    materialBindings,
    mtoonMaterials: mtoonMaterials.size,
  };
}

export function collectRootMotionOffsets(
  avatar: VRM,
  registry: MotionRegistry,
): Array<{ x: number; y: number; z: number }> {
  const target = rootMotionTarget(avatar);
  if (!target) return [];
  const offsets: Array<{ x: number; y: number; z: number }> = [];
  const visited = new Set<THREE.AnimationClip>();
  for (const motion of registry.values()) {
    if (visited.has(motion.clip)) continue;
    visited.add(motion.clip);
    appendRootMotionOffsets(motion.clip, target, offsets);
  }
  return offsets;
}

export function collectMotionBounds(
  avatar: VRM,
  registry: MotionRegistry,
  baseBounds: Bounds3,
): ReadonlyMap<AvatarMotionRole, Bounds3> {
  const target = rootMotionTarget(avatar);
  const bounds = new Map<AvatarMotionRole, Bounds3>();
  if (!target) return bounds;
  for (const [role, motion] of registry) {
    const clip = isSteadyRole(role) ? (motion.steadyClip ?? motion.clip) : motion.clip;
    const offsets: Array<{ x: number; y: number; z: number }> = [];
    appendRootMotionOffsets(clip, target, offsets);
    bounds.set(
      role,
      expandBoundsForOffsets(baseBounds, offsets),
    );
  }
  return bounds;
}

export function settleStaticRestPose(avatar: VRM): void {
  const humanoid = avatar.humanoid as typeof avatar.humanoid & {
    resetNormalizedPose?: () => void;
  };
  const springBoneManager = avatar.springBoneManager as typeof avatar.springBoneManager & {
    reset?: () => void;
  };
  humanoid.resetNormalizedPose?.();
  avatar.update(0);
  springBoneManager?.reset?.();
  avatar.scene.updateMatrixWorld(true);
}

interface RootMotionTarget {
  readonly hipsName: string;
  readonly rest: readonly number[];
}

function rootMotionTarget(avatar: VRM): RootMotionTarget | null {
  const humanoid = avatar.humanoid as typeof avatar.humanoid & {
    normalizedHumanBones?: { hips?: { node?: { name?: string } } };
    normalizedRestPose?: { hips?: { position?: readonly number[] | { x?: number; y?: number; z?: number } } };
  };
  const hipsName = humanoid?.normalizedHumanBones?.hips?.node?.name;
  const rawRest = humanoid?.normalizedRestPose?.hips?.position;
  const rest = Array.isArray(rawRest)
    ? rawRest
    : rawRest
      ? [rawRest.x, rawRest.y, rawRest.z]
      : [];
  if (typeof hipsName !== "string"
    || rest.length !== 3
    || !rest.every((value) => typeof value === "number" && Number.isFinite(value))) return null;
  return { hipsName, rest: rest as number[] };
}

function appendRootMotionOffsets(
  clip: THREE.AnimationClip,
  target: RootMotionTarget,
  offsets: Array<{ x: number; y: number; z: number }>,
): void {
  const track = clip.tracks.find((candidate) => candidate.name === `${target.hipsName}.position`);
  if (!track || track.times.length === 0) return;
  const stride = track.values.length / track.times.length;
  const cubic = track.createInterpolant?.isInterpolantFactoryMethodGLTFCubicSpline === true;
  if ((!cubic && stride !== 3) || (cubic && stride !== 9)) return;
  if (!cubic) {
    for (let index = 0; index < track.values.length; index += stride) {
      pushRootOffset(offsets, track.values, index, target.rest);
    }
    return;
  }
  collectCubicRootOffsets(track, target.rest, offsets);
}

function collectCubicRootOffsets(
  track: THREE.KeyframeTrack,
  rest: readonly unknown[],
  offsets: Array<{ x: number; y: number; z: number }>,
): void {
  for (let index = 3; index < track.values.length; index += 9) {
    pushRootOffset(offsets, track.values, index, rest);
  }
  for (let key = 0; key + 1 < track.times.length; key += 1) {
    const duration = track.times[key + 1] - track.times[key];
    if (!Number.isFinite(duration) || duration <= 0) continue;
    const left = key * 9;
    const right = (key + 1) * 9;
    const parameters = new Set<number>();
    for (let axis = 0; axis < 3; axis += 1) {
      for (const value of hermiteExtremaParameters(
        track.values[left + 3 + axis],
        track.values[right + 3 + axis],
        duration * track.values[left + 6 + axis],
        duration * track.values[right + axis],
      )) parameters.add(value);
    }
    for (const parameter of parameters) {
      const values = [0, 1, 2].map((axis) => cubicHermiteValue(
        track.values[left + 3 + axis],
        track.values[right + 3 + axis],
        duration * track.values[left + 6 + axis],
        duration * track.values[right + axis],
        parameter,
      ));
      pushRootOffset(offsets, values, 0, rest);
    }
  }
}

function hermiteExtremaParameters(
  start: number,
  end: number,
  startTangent: number,
  endTangent: number,
): number[] {
  const quadratic = 3 * (2 * start - 2 * end + startTangent + endTangent);
  const linear = 2 * (-3 * start + 3 * end - 2 * startTangent - endTangent);
  const constant = startTangent;
  if (![quadratic, linear, constant].every(Number.isFinite)) return [];
  if (Math.abs(quadratic) < 1e-12) {
    if (Math.abs(linear) < 1e-12) return [];
    const root = -constant / linear;
    return root > 0 && root < 1 ? [root] : [];
  }
  const discriminant = linear * linear - 4 * quadratic * constant;
  if (discriminant < 0) return [];
  const squareRoot = Math.sqrt(discriminant);
  return [
    (-linear - squareRoot) / (2 * quadratic),
    (-linear + squareRoot) / (2 * quadratic),
  ].filter((root) => root > 0 && root < 1 && Number.isFinite(root));
}

function cubicHermiteValue(
  start: number,
  end: number,
  startTangent: number,
  endTangent: number,
  parameter: number,
): number {
  const squared = parameter * parameter;
  const cubed = squared * parameter;
  return (2 * cubed - 3 * squared + 1) * start
    + (cubed - 2 * squared + parameter) * startTangent
    + (-2 * cubed + 3 * squared) * end
    + (cubed - squared) * endTangent;
}

function pushRootOffset(
  offsets: Array<{ x: number; y: number; z: number }>,
  values: ArrayLike<number>,
  index: number,
  rest: readonly unknown[],
): void {
  const x = values[index] - (rest[0] as number);
  const y = values[index + 1] - (rest[1] as number);
  const z = values[index + 2] - (rest[2] as number);
  if ([x, y, z].every(Number.isFinite)) offsets.push({ x, y, z });
}

export class ThreeVRMRendererBackend implements RendererBackend {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly loadVRMCandidate: typeof loadVRM;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  private readonly clock = new THREE.Clock(false);
  private avatar: VRM | undefined;
  private mixer: THREE.AnimationMixer | undefined;
  private motionController: MotionController | undefined;
  private motionIdentity: MotionRuntimeIdentity | undefined;
  private motionRegistry: MotionRegistry = new Map();
  private evidence: AvatarEvidence | undefined;
  private cameraBounds: Bounds3 | undefined;
  private motionBounds: ReadonlyMap<AvatarMotionRole, Bounds3> = new Map();
  private reducedMotion = false;
  private mouthCuesEnabled = true;
  private mouthCapabilities: MouthCapabilities = emptyMouthCapabilities();
  private mouthController: MouthController | undefined;
  private mouthTarget: MouthTarget | null = null;
  private suspended = false;
  private phase: PresentationPhase = "idle";
  private projectionSequence = 0;
  private motionFaultHandler: ((fault: MotionFault) => void) | undefined;
  private motionActiveHandler: ((event: MotionActiveEvent) => void) | undefined;
  private viewport = { width: 0, height: 0 };
  private readonly stopResizeObservation: () => void;

  constructor(private readonly root: HTMLElement, testSeam?: RendererTestSeam) {
    this.canvas = testSeam?.canvas ?? globalThis.document.createElement("canvas");
    this.loadVRMCandidate = testSeam?.loadVRM ?? loadVRM;
    if (testSeam) {
      this.renderer = testSeam.renderer;
    } else {
      const context = this.canvas.getContext("webgl2", {
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      if (!context) throw new Error("webgl2 unavailable");
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: this.canvas,
        context,
      });
    }
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x293040, 2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(1, 2, 3);
    this.scene.add(keyLight);
    root.replaceChildren(this.canvas);
    this.stopResizeObservation = testSeam
      ? () => {}
      : observeRootResize(root, () => {
        this.resize();
        if (this.reducedMotion && this.avatar && this.evidence) {
          this.applyFramePresentation(0);
          this.renderer.render(this.scene, this.camera);
        }
      });
    this.resize();
  }

  configure(policy: RendererPolicy): void {
    const { reducedMotion, mouthCuesEnabled } = policy;
    const changed = this.reducedMotion !== reducedMotion;
    this.reducedMotion = reducedMotion;
    this.mouthCuesEnabled = mouthCuesEnabled;
    this.motionController?.setReducedMotion(reducedMotion);
    if (reducedMotion || this.suspended) this.clock.stop();
    else this.clock.start();
    if (reducedMotion || !mouthCuesEnabled) {
      this.applyPhase(this.phase);
      this.clearMouth();
    }
    if (changed) this.fitToAvatar();
  }

  async loadModel(url: string, signal: AbortSignal): Promise<LoadedAvatar> {
    requireSessionAssetURL(url);
    const { avatar, specVersion } = await this.loadVRMCandidate(url, signal);
    let candidateMotionController: MotionController | undefined;
    try {
      requireVRM1(avatar, specVersion);
      const evidence = collectAvatarEvidence(avatar.scene);
      const mouthCapabilities = detectMouthCapabilities(avatar.expressionManager);
      const mouthController = new MouthController(mouthCapabilities);
      const mixer = new THREE.AnimationMixer(avatar.scene);
      candidateMotionController = new MotionController({
        mixer: mixer as unknown as MotionMixerLike,
        root: avatar.scene,
        resetNormalizedPose: () => {
          settleStaticRestPose(avatar);
        },
        initialReducedMotion: this.reducedMotion,
        onFault: (fault) => this.motionFaultHandler?.(fault),
        onActive: (event) => {
          this.applyActiveMotionBounds(event);
          this.motionActiveHandler?.(event);
        },
      });

      this.removeAvatar();
      this.avatar = avatar;
      this.mouthCapabilities = mouthCapabilities;
      this.mouthController = mouthController;
      this.mixer = mixer;
      this.motionController = candidateMotionController;
      candidateMotionController = undefined;
      this.scene.add(avatar.scene);
      if (avatar.lookAt) avatar.lookAt.target = this.camera;
      this.evidence = evidence;
      this.cameraBounds = evidence.bounds;
      this.fitToAvatar();
      return {
        capabilities: {
          aa: this.mouthCapabilities.aa,
          vowels: this.mouthCapabilities,
          look_at: avatar.lookAt !== undefined,
          spring_bone: avatar.springBoneManager !== undefined,
          mtoon_materials: this.evidence.mtoonMaterials,
        },
      };
    } catch (error) {
      candidateMotionController?.dispose();
      this.scene.remove(avatar.scene);
      disposeAvatarResources(avatar.scene);
      throw error;
    }
  }

  async loadMotion(input: UniqueMotionInput, signal: AbortSignal): Promise<ConvertedMotion> {
    requireSessionMotionURL(input.url);
    if (!this.avatar) throw new Error("renderer has no admitted avatar");
    return loadMotion(input, this.avatar, signal);
  }

  replaceMotions(registry: MotionRegistry, identity?: MotionRuntimeIdentity): void {
    if (!this.avatar || !this.mixer || !this.motionController || !identity) {
      throw new Error("renderer has no admitted avatar");
    }
    this.motionIdentity = identity;
    this.motionRegistry = new Map(registry);
    this.motionBounds = this.evidence
      ? collectMotionBounds(this.avatar, registry, this.evidence.bounds)
      : new Map();
    this.cameraBounds = this.evidence?.bounds;
    this.motionController.replaceRegistry({ ...identity, motions: registry });
    if (this.evidence) this.fitToAvatar();
  }

  setSuspended(suspended: boolean): void {
    this.suspended = suspended;
    this.motionController?.setSuspended(suspended);
    if (suspended) this.clearMouth();
    if (suspended || this.reducedMotion) this.clock.stop();
    else this.clock.start();
  }

  setMotionFaultHandler(handler: (fault: MotionFault) => void): void {
    this.motionFaultHandler = handler;
  }

  setMotionActiveHandler(handler: (event: MotionActiveEvent) => void): void {
    this.motionActiveHandler = handler;
  }

  discardMotion(_motion: ConvertedMotion): void {
    // AnimationClip values do not own GPU resources. The loader owns the
    // detached parse result and has already released any injected resources.
  }

  renderOnce() {
    this.applyFramePresentation(0);
    const { width, height } = this.renderFrame();
    if (!this.avatar || !this.evidence) throw new Error("renderer has no admitted avatar");
    const alphaProbePixels = this.probeAlpha();
    if (alphaProbePixels < 1) throw new Error("first frame alpha probe found no avatar pixels");
    return {
      viewport_width: width,
      viewport_height: height,
      visible_meshes: this.evidence.visibleMeshes,
      decoded_textures: this.evidence.decodedTextures,
      material_bindings: this.evidence.materialBindings,
      alpha_probe_pixels: alphaProbePixels,
    };
  }

  renderFrame(): { width: number; height: number } {
    const viewport = this.resize();
    if (!this.avatar || !this.evidence) throw new Error("renderer has no admitted avatar");
    this.renderer.render(this.scene, this.camera);
    return viewport;
  }

  update(deltaSeconds: number): void {
    if (this.suspended) return;
    this.motionController?.update(deltaSeconds);
    this.applyPhase(this.phase);
    this.setMouth();
    this.maintainLookAtTarget();
    if (!this.reducedMotion) this.avatar?.update(deltaSeconds);
  }

  apply(effect: PresentationEffect, causedBySequence?: number): void {
    switch (effect.type) {
      case "apply_mouth": {
        const target = copyMouthTarget(effect.command.payload);
        if (this.reducedMotion || !this.mouthCuesEnabled || this.suspended || !mouthTargetHasActivity(target)) {
          this.clearMouth();
        } else {
          this.mouthTarget = target;
        }
        return;
      }
      case "clear_mouth":
        this.clearMouth();
        return;
      case "apply_projection":
        this.phase = effect.command.payload.phase;
        this.projectionSequence = effect.command.payload.projection_sequence;
        this.projectMotion(effect.command.payload, causedBySequence ?? null);
        return;
      case "set_reduced_motion":
        this.configure({ reducedMotion: effect.enabled, mouthCuesEnabled: this.mouthCuesEnabled });
        return;
      case "set_mouth_cues_enabled":
        this.mouthCuesEnabled = effect.enabled;
        if (!effect.enabled) this.clearMouth();
        return;
      case "reset":
        this.phase = "idle";
        this.clearMouth();
        this.projectionSequence = Math.min(Number.MAX_SAFE_INTEGER, this.projectionSequence + 1);
        this.projectMotion({
          projection_sequence: this.projectionSequence,
          generation_id: null,
          phase: "idle",
          playback_id: null,
        }, causedBySequence ?? null);
        return;
      case "reconcile":
        this.configure({
          reducedMotion: effect.reducedMotion,
          mouthCuesEnabled: effect.mouthCuesEnabled,
        });
        this.phase = effect.phase;
        const reconciledMouth = copyMouthTarget({ scalar: effect.mouthScalar });
        if (this.reducedMotion
          || !this.mouthCuesEnabled
          || this.suspended
          || !mouthTargetHasActivity(reconciledMouth)) {
          this.clearMouth();
        } else {
          this.mouthTarget = reconciledMouth;
        }
        if (effect.lastProjectionSequence !== null) {
          this.projectionSequence = effect.lastProjectionSequence;
          this.projectMotion({
            projection_sequence: effect.lastProjectionSequence,
            generation_id: effect.generationID,
            phase: effect.phase,
            playback_id: effect.playbackID,
          }, causedBySequence ?? null, true);
        }
        return;
    }
  }

  startClock(): void {
    if (!this.reducedMotion && !this.suspended) this.clock.start();
  }

  stopClock(): void {
    this.clock.stop();
  }

  dispose(): void {
    this.stopResizeObservation();
    this.removeAvatar();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.remove();
  }

  private resize(): { width: number; height: number } {
    const width = boundedDimension(this.root.clientWidth || 1);
    const height = boundedDimension(this.root.clientHeight || 1);
    if (width !== this.viewport.width || height !== this.viewport.height) {
      this.viewport = { width, height };
      this.renderer.setSize(width, height, false);
      if (this.evidence) this.fitToAvatar();
    }
    return { width, height };
  }

  private fitToAvatar(): void {
    const bounds = this.reducedMotion
      ? this.evidence?.bounds
      : this.cameraBounds ?? this.evidence?.bounds;
    if (!bounds) return;
    const fit = fitCamera(bounds, this.viewport.width, this.viewport.height);
    this.camera.aspect = fit.aspect;
    this.camera.near = fit.near;
    this.camera.far = fit.far;
    this.camera.position.set(fit.position.x, fit.position.y, fit.position.z);
    this.camera.lookAt(fit.target.x, fit.target.y, fit.target.z);
    this.camera.updateProjectionMatrix();
  }

  private applyActiveMotionBounds(event: MotionActiveEvent): void {
    this.cameraBounds = event.role === null
      ? this.evidence?.bounds
      : this.motionBounds.get(event.role) ?? this.evidence?.bounds;
    if (!this.reducedMotion && this.evidence) this.fitToAvatar();
  }

  private probeAlpha(): number {
    const target = new THREE.WebGLRenderTarget(probeDimension, probeDimension, {
      depthBuffer: true,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      type: THREE.UnsignedByteType,
    });
    const previousTarget = this.renderer.getRenderTarget();
    const previousColor = this.renderer.getClearColor(new THREE.Color());
    const previousAlpha = this.renderer.getClearAlpha();
    const pixels = new Uint8Array(probeDimension * probeDimension * 4);
    try {
      this.renderer.setRenderTarget(target);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.clear(true, true, true);
      this.renderer.render(this.scene, this.camera);
      this.renderer.readRenderTargetPixels(
        target,
        0,
        0,
        probeDimension,
        probeDimension,
        pixels,
      );
      return countAlphaPixels(pixels);
    } finally {
      this.renderer.setRenderTarget(previousTarget);
      this.renderer.setClearColor(previousColor, previousAlpha);
      target.dispose();
    }
  }

  private setMouth(): void {
    const manager = this.avatar?.expressionManager;
    const values = this.reducedMotion || !this.mouthCuesEnabled || !this.mouthTarget
      ? this.mouthController?.clear() ?? zeroMouthVowelWeights()
      : this.mouthController?.update(this.mouthTarget) ?? zeroMouthVowelWeights();
    applyMouthExpressionValues(manager, this.mouthCapabilities, values);
  }

  private clearMouth(): void {
    this.mouthTarget = null;
    const values = this.mouthController?.clear() ?? zeroMouthVowelWeights();
    applyMouthExpressionValues(this.avatar?.expressionManager, this.mouthCapabilities, values);
  }

  private applyPhase(phase: PresentationPhase): void {
    if (!this.avatar) return;
    const presentation = phasePresentationFor(phase);
    this.avatar.scene.visible = presentation.visible;
    const manager = this.avatar.expressionManager;
    if (!manager) return;
    for (const name of ["relaxed", "sad"] as const) {
      if (manager.getExpression(name)) manager.setValue(name, 0);
    }
    if (presentation.expression && manager.getExpression(presentation.expression)) {
      manager.setValue(presentation.expression, presentation.weight);
    }
  }

  private removeAvatar(): void {
    this.clearMouth();
    this.mouthController = undefined;
    this.mouthCapabilities = emptyMouthCapabilities();
    this.motionController?.dispose();
    this.motionController = undefined;
    this.motionIdentity = undefined;
    this.motionRegistry = new Map();
    const avatar = this.avatar;
    if (avatar) {
      this.scene.remove(avatar.scene);
      disposeAvatarResources(avatar.scene);
    }
    this.mixer = undefined;
    this.avatar = undefined;
    this.evidence = undefined;
    this.cameraBounds = undefined;
    this.motionBounds = new Map();
  }

  private applyFramePresentation(_deltaSeconds: number): void {
    this.applyPhase(this.phase);
    this.setMouth();
    this.maintainLookAtTarget();
  }

  private maintainLookAtTarget(): void {
    if (this.avatar?.lookAt) this.avatar.lookAt.target = this.camera;
  }

  private projectMotion(
    projection: {
      projection_sequence: number;
      generation_id: string | null;
      phase: PresentationPhase;
      playback_id: string | null;
    },
    causedBySequence: number | null,
    isReconciliation = false,
  ): void {
    const identity = this.motionIdentity;
    if (!identity) return;
    this.motionController?.project({
      ...identity,
      projectionSequence: projection.projection_sequence,
      phase: projection.phase,
      generationID: projection.generation_id,
      playbackID: projection.playback_id,
      isReconciliation,
      causedBySequence,
    });
  }
}

function emptyMouthCapabilities(): MouthCapabilities {
  return Object.freeze({
    aa: false,
    ih: false,
    ou: false,
    ee: false,
    oh: false,
  });
}

function copyMouthTarget(target: { scalar: number; vowels?: MouthVowelWeights }): MouthTarget {
  if (!target.vowels) return Object.freeze({ scalar: target.scalar });
  return Object.freeze({
    scalar: target.scalar,
    vowels: Object.freeze({ ...target.vowels }),
  });
}

function mouthTargetHasActivity(target: MouthTarget): boolean {
  const vowels = target.vowels;
  if (!vowels) return target.scalar > 0;
  return mouthVowelNames.some((vowel) => vowels[vowel] > 0);
}

async function loadVRM(
  url: string,
  signal: AbortSignal,
): Promise<{ avatar: VRM; specVersion: string | undefined }> {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));
  return new Promise<{ avatar: VRM; specVersion: string | undefined }>((resolve, reject) => {
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return false;
      settled = true;
      signal.removeEventListener("abort", abort);
      callback();
      return true;
    };
    const abort = () => finish(() => reject(new DOMException("asset load aborted", "AbortError")));
    loader.load(
      url,
      (gltf) => {
        const loaded = gltf.userData.vrm as VRM | undefined;
        if (!loaded) {
          finish(() => reject(new Error("missing VRM payload")));
          return;
        }
        const specVersion = gltf.parser.json.extensions?.VRMC_vrm?.specVersion;
        if (!finish(() => resolve({ avatar: loaded, specVersion }))) {
          disposeAvatarResources(loaded.scene);
        }
      },
      undefined,
      (error) => finish(() => reject(error)),
    );
    if (signal.aborted) abort();
    else signal.addEventListener("abort", abort, { once: true });
  });
}

function effectivelyVisible(object: THREE.Object3D): boolean {
  for (let current: THREE.Object3D | null = object; current; current = current.parent) {
    if (!current.visible) return false;
  }
  return true;
}

function materialTextures(material: THREE.Material): Set<THREE.Texture> {
  const textures = new Set<THREE.Texture>();
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture) textures.add(value);
  }
  const uniforms = (material as THREE.Material & {
    uniforms?: Record<string, { value?: unknown }>;
  }).uniforms;
  for (const uniform of Object.values(uniforms ?? {})) {
    if (uniform.value instanceof THREE.Texture) textures.add(uniform.value);
  }
  return textures;
}

function textureIsDecoded(texture: THREE.Texture): boolean {
  return texture.source.data !== null && texture.source.data !== undefined;
}

function isSteadyRole(role: AvatarMotionRole): boolean {
  return role === "idle"
    || role === "listening"
    || role === "thinking"
    || role === "speaking";
}

export function disposeAvatarResources(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const texture of materialTextures(material)) textures.add(texture);
    }
  });
  for (const texture of textures) texture.dispose();
  for (const material of materials) material.dispose();
  for (const geometry of geometries) geometry.dispose();
}

function boundedDimension(value: number): number {
  return Math.min(maximumViewportDimension, Math.max(1, Math.floor(value)));
}
