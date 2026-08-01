declare module "three" {
  export const SRGBColorSpace: string;
  export const RGBAFormat: number;
  export const UnsignedByteType: number;

  export class Color {
    constructor(value?: number);
  }

  export class Object3D {
    readonly userData: Record<string, unknown>;
    visible: boolean;
    parent: Object3D | null;
    readonly position: { set(x: number, y: number, z: number): void };
    traverse(callback: (object: Object3D) => void): void;
    updateMatrixWorld(force?: boolean): void;
  }

  export class Group extends Object3D {}

  export class Scene extends Object3D {
    add(...objects: Object3D[]): this;
    remove(...objects: Object3D[]): this;
  }

  export class PerspectiveCamera extends Object3D {
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    aspect: number;
    near: number;
    far: number;
    lookAt(x: number, y: number, z: number): void;
    updateProjectionMatrix(): void;
  }

  export class HemisphereLight extends Object3D {
    constructor(skyColor?: number, groundColor?: number, intensity?: number);
  }

  export class DirectionalLight extends Object3D {
    constructor(color?: number, intensity?: number);
  }

  export class Material {
    visible: boolean;
    dispose(): void;
  }
  export class Texture {
    readonly source: { data: unknown };
    dispose(): void;
  }
  export class BufferGeometry { dispose(): void; }

  export class Mesh extends Object3D {
    geometry: BufferGeometry;
    material: Material | Material[];
  }

  export class SkinnedMesh extends Mesh {}

  export class Clock {
    constructor(autoStart?: boolean);
    start(): void;
    stop(): void;
  }

  export class WebGLRenderer {
    constructor(parameters: {
      canvas: HTMLCanvasElement;
      context: WebGL2RenderingContext;
      antialias: boolean;
      alpha?: boolean;
    });
    outputColorSpace: string;
    setClearColor(color: number | Color, alpha?: number): void;
    getClearColor(target: Color): Color;
    getClearAlpha(): number;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
    clear(color?: boolean, depth?: boolean, stencil?: boolean): void;
    getRenderTarget(): WebGLRenderTarget | null;
    setRenderTarget(target: WebGLRenderTarget | null): void;
    readRenderTargetPixels(
      target: WebGLRenderTarget,
      x: number,
      y: number,
      width: number,
      height: number,
      buffer: Uint8Array,
    ): void;
    forceContextLoss(): void;
    dispose(): void;
  }

  export class Box3 {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
    isEmpty(): boolean;
    setFromObject(object: Object3D): this;
    union(box: Box3): this;
  }

  export class WebGLRenderTarget {
    constructor(width: number, height: number, options?: {
      depthBuffer?: boolean;
      format?: number;
      stencilBuffer?: boolean;
      type?: number;
    });
    dispose(): void;
  }
}

declare module "three/addons/loaders/GLTFLoader.js" {
  export class GLTFParser {
    readonly json: {
      extensions?: { VRMC_vrm?: { specVersion?: string } };
    };
  }

  export interface GLTF {
    userData: Record<string, unknown>;
    parser: GLTFParser;
  }

  export class GLTFLoader {
    register(callback: (parser: GLTFParser) => unknown): this;
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress: undefined,
      onError: (error: unknown) => void,
    ): void;
  }
}
