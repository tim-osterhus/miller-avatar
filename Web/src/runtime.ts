import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";
import {
  WebRendererCore,
  type FrameScheduler,
  type RendererBackend,
} from "./bridge.js";
import type { PresentationEffect } from "./presentation.js";

const sessionPath = /^\/session\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/bundle\/index\.html$/u;

export interface BrowserRendererReceiver {
  accept(commandJSON: string): Promise<void>;
}

export interface BrowserRendererDependencies {
  entryURL: string;
  backend: RendererBackend;
  scheduler: FrameScheduler;
  postObservation(message: string): void;
  installReceiver(receiver: BrowserRendererReceiver): void;
}

export function startBrowserRenderer(
  dependencies: BrowserRendererDependencies,
): WebRendererCore {
  const core = new WebRendererCore(
    sessionIDFromEntryURL(dependencies.entryURL),
    dependencies.backend,
    dependencies.scheduler,
    dependencies.postObservation,
  );
  dependencies.installReceiver({
    accept(commandJSON) {
      return core.accept(commandJSON);
    },
  });
  core.start();
  return core;
}

export function startBrowserRuntime(): WebRendererCore {
  const root = globalThis.document.getElementById("avatar");
  if (!(root instanceof HTMLElement)) {
    throw new Error("missing renderer root");
  }
  return startBrowserRenderer({
    entryURL: globalThis.location.href,
    backend: new BrowserRendererBackend(root),
    scheduler: browserFrameScheduler,
    postObservation(message) {
      const handler = webkitObservationHandler();
      if (!handler) throw new Error("missing observation transport");
      handler.postMessage(message);
    },
    installReceiver(receiver) {
      if ("millerAvatarBridge" in globalThis) {
        throw new Error("bridge receiver already installed");
      }
      Object.defineProperty(globalThis, "millerAvatarBridge", {
        value: Object.freeze(receiver),
        configurable: false,
        enumerable: false,
        writable: false,
      });
    },
  });
}

function sessionIDFromEntryURL(rawURL: string): string {
  const url = new URL(rawURL);
  const match = sessionPath.exec(url.pathname);
  if (
    url.protocol !== "miller-avatar-local:"
    || url.hostname !== "app"
    || url.username !== ""
    || url.password !== ""
    || url.port !== ""
    || url.search !== ""
    || url.hash !== ""
    || match === null
    || match[1] !== match[1]?.toLowerCase()
  ) {
    throw new Error("invalid renderer entry URL");
  }
  return match[1];
}

type WebKitObservationHandler = { postMessage(message: string): void };

function webkitObservationHandler(): WebKitObservationHandler | undefined {
  const webkit = (globalThis as typeof globalThis & {
    webkit?: { messageHandlers?: { millerAvatarObservation?: WebKitObservationHandler } };
  }).webkit;
  return webkit?.messageHandlers?.millerAvatarObservation;
}

const browserFrameScheduler: FrameScheduler = {
  request(callback) {
    return globalThis.requestAnimationFrame(callback);
  },
  cancel(handle) {
    globalThis.cancelAnimationFrame(handle);
  },
};

class BrowserRendererBackend implements RendererBackend {
  private readonly canvas = globalThis.document.createElement("canvas");
  private readonly context: WebGL2RenderingContext;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  private readonly clock = new THREE.Clock(false);
  private avatar: VRM | undefined;
  private reducedMotion = false;

  constructor(private readonly root: HTMLElement) {
    const context = this.canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    if (!context) throw new Error("webgl2 unavailable");
    this.context = context;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      context,
      antialias: true,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x101114, 1);
    this.camera.position.set(0, 1.35, 2);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x202030, 2));
    root.replaceChildren(this.canvas);
    this.resize();
  }

  configure(reducedMotion: boolean): void {
    this.reducedMotion = reducedMotion;
    if (reducedMotion) this.clock.stop();
  }

  async loadAsset(url: string, signal: AbortSignal) {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    const avatar = await new Promise<VRM>((resolve, reject) => {
      let settled = false;
      const settle = (callback: () => void) => {
        if (settled) return;
        settled = true;
        signal.removeEventListener("abort", abort);
        callback();
      };
      const abort = () => settle(() => {
        reject(new DOMException("asset load aborted", "AbortError"));
      });
      loader.load(
        url,
        (gltf) => settle(() => {
          const loaded = gltf.userData.vrm as VRM | undefined;
          loaded ? resolve(loaded) : reject(new Error("missing VRM 1.0 payload"));
        }),
        undefined,
        (error) => settle(() => reject(error)),
      );
      if (signal.aborted) {
        abort();
      } else {
        signal.addEventListener("abort", abort, { once: true });
      }
    });
    this.removeAvatar();
    this.avatar = avatar;
    this.scene.add(avatar.scene);
    return {
      capabilities: {
        aa: avatar.expressionManager !== undefined,
        look_at: avatar.lookAt !== undefined,
        spring_bone: avatar.springBoneManager !== undefined,
        mtoon_materials: this.materialCount(),
      },
    };
  }

  renderOnce() {
    const { width, height } = this.resize();
    const visibleMeshes = this.visibleMeshCount();
    const materialBindings = this.materialCount();
    if (visibleMeshes < 1 || materialBindings < 1) {
      throw new Error("renderer has no visible materialized mesh");
    }
    this.renderer.render(this.scene, this.camera);
    const alpha = new Uint8Array(4);
    this.context.readPixels(
      0,
      0,
      1,
      1,
      this.context.RGBA,
      this.context.UNSIGNED_BYTE,
      alpha,
    );
    if (alpha[3] === 0) throw new Error("first frame alpha probe failed");
    return {
      viewport_width: width,
      viewport_height: height,
      visible_meshes: visibleMeshes,
      decoded_textures: this.textureCount(),
      material_bindings: materialBindings,
      alpha_probe_pixels: 1,
    };
  }

  update(deltaSeconds: number): void {
    if (!this.reducedMotion) this.avatar?.update(deltaSeconds);
  }

  apply(effect: PresentationEffect): void {
    switch (effect.type) {
      case "apply_mouth":
        this.avatar?.expressionManager?.setValue("aa", effect.command.payload.scalar);
        return;
      case "clear_mouth":
        this.avatar?.expressionManager?.setValue("aa", 0);
        return;
      case "apply_projection": {
        if (this.avatar) {
          this.avatar.scene.visible = !["failed", "stopped"].includes(
            effect.command.payload.phase,
          );
        }
        return;
      }
      case "set_reduced_motion":
        this.configure(effect.enabled);
        return;
      case "reset":
      case "reconcile":
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
    this.canvas.remove();
  }

  private resize(): { width: number; height: number } {
    const width = boundedDimension(this.root.clientWidth || 1);
    const height = boundedDimension(this.root.clientHeight || 1);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    return { width, height };
  }

  private removeAvatar(): void {
    if (!this.avatar) return;
    this.scene.remove(this.avatar.scene);
    this.avatar = undefined;
  }

  private visibleMeshCount(): number {
    let count = 0;
    this.avatar?.scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh && object.visible) count += 1;
    });
    return count;
  }

  private materialCount(): number {
    const materials = new Set<THREE.Material>();
    this.avatar?.scene.traverse((object: THREE.Object3D) => {
      if (!(object instanceof THREE.Mesh)) return;
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material]) {
        materials.add(material);
      }
    });
    return materials.size;
  }

  private textureCount(): number {
    const textures = new Set<THREE.Texture>();
    this.avatar?.scene.traverse((object: THREE.Object3D) => {
      if (!(object instanceof THREE.Mesh)) return;
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material]) {
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) textures.add(value);
        }
      }
    });
    return textures.size;
  }
}

function boundedDimension(value: number): number {
  return Math.min(8_192, Math.max(1, Math.floor(value)));
}
