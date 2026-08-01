import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  MToonMaterial,
  VRMLoaderPlugin,
  type VRM,
} from "@pixiv/three-vrm";
import type { LoadedAvatar, RendererBackend } from "./bridge.js";
import { fitCamera, type Bounds3 } from "./camera.js";
import type { PresentationPhase } from "./contract.js";
import type { PresentationEffect } from "./presentation.js";

const localAssetURL = /^miller-avatar-local:\/\/app\/session\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.vrm$/u;
const maximumViewportDimension = 8_192;
const probeDimension = 64;

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

export function countAlphaPixels(pixels: Uint8Array): number {
  if (pixels.length % 4 !== 0) throw new RangeError("alpha probe requires RGBA pixels");
  let count = 0;
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] !== 0) count += 1;
  }
  return count;
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
    const objectBounds = new THREE.Box3().setFromObject(object);
    if (objectBounds.isEmpty()) return;
    visibleMeshes += 1;
    bounds.union(objectBounds);
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material.visible) continue;
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

export class ThreeVRMRendererBackend implements RendererBackend {
  private readonly canvas = globalThis.document.createElement("canvas");
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  private readonly clock = new THREE.Clock(false);
  private avatar: VRM | undefined;
  private evidence: AvatarEvidence | undefined;
  private reducedMotion = false;
  private viewport = { width: 0, height: 0 };

  constructor(private readonly root: HTMLElement) {
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
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x293040, 2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(1, 2, 3);
    this.scene.add(keyLight);
    root.replaceChildren(this.canvas);
    this.resize();
  }

  configure(reducedMotion: boolean): void {
    this.reducedMotion = reducedMotion;
    if (reducedMotion) this.clock.stop();
  }

  async loadAsset(url: string, signal: AbortSignal): Promise<LoadedAvatar> {
    requireSessionAssetURL(url);
    const { avatar, specVersion } = await loadVRM(url, signal);
    try {
      requireVRM1(avatar, specVersion);
      this.removeAvatar();
      this.avatar = avatar;
      this.scene.add(avatar.scene);
      if (avatar.lookAt) avatar.lookAt.target = this.camera;
      this.evidence = collectAvatarEvidence(avatar.scene);
      this.fitToAvatar();
      return {
        capabilities: {
          aa: avatar.expressionManager?.getExpression("aa") !== null
            && avatar.expressionManager !== undefined,
          look_at: avatar.lookAt !== undefined,
          spring_bone: avatar.springBoneManager !== undefined,
          mtoon_materials: this.evidence.mtoonMaterials,
        },
      };
    } catch (error) {
      disposeAvatarResources(avatar.scene);
      throw error;
    }
  }

  renderOnce() {
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
    if (!this.reducedMotion) this.avatar?.update(deltaSeconds);
  }

  apply(effect: PresentationEffect): void {
    switch (effect.type) {
      case "apply_mouth":
        this.setMouth(effect.command.payload.scalar);
        return;
      case "clear_mouth":
        this.setMouth(0);
        return;
      case "apply_projection":
        this.applyPhase(effect.command.payload.phase);
        return;
      case "set_reduced_motion":
        this.configure(effect.enabled);
        return;
      case "reset":
        this.applyPhase("idle");
        this.setMouth(0);
        return;
      case "reconcile":
        this.configure(effect.reducedMotion);
        this.applyPhase(effect.phase);
        this.setMouth(effect.mouthScalar);
        return;
    }
  }

  startClock(): void {
    if (!this.reducedMotion) this.clock.start();
  }

  stopClock(): void {
    this.clock.stop();
  }

  dispose(): void {
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
    if (!this.evidence) return;
    const fit = fitCamera(this.evidence.bounds, this.viewport.width, this.viewport.height);
    this.camera.aspect = fit.aspect;
    this.camera.near = fit.near;
    this.camera.far = fit.far;
    this.camera.position.set(fit.position.x, fit.position.y, fit.position.z);
    this.camera.lookAt(fit.target.x, fit.target.y, fit.target.z);
    this.camera.updateProjectionMatrix();
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

  private setMouth(value: number): void {
    const manager = this.avatar?.expressionManager;
    if (manager?.getExpression("aa")) manager.setValue("aa", value);
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
    if (!this.avatar) return;
    this.scene.remove(this.avatar.scene);
    disposeAvatarResources(this.avatar.scene);
    this.avatar = undefined;
    this.evidence = undefined;
  }
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
