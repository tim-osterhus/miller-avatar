declare module "three" {
  export const SRGBColorSpace: string;

  export class Object3D {
    visible: boolean;
    readonly position: { set(x: number, y: number, z: number): void };
    traverse(callback: (object: Object3D) => void): void;
  }

  export class Group extends Object3D {}

  export class Scene extends Object3D {
    add(...objects: Object3D[]): this;
    remove(...objects: Object3D[]): this;
  }

  export class PerspectiveCamera extends Object3D {
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    aspect: number;
    updateProjectionMatrix(): void;
  }

  export class HemisphereLight extends Object3D {
    constructor(skyColor?: number, groundColor?: number, intensity?: number);
  }

  export class Material {}
  export class Texture {}

  export class Mesh extends Object3D {
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
    });
    outputColorSpace: string;
    setClearColor(color: number, alpha?: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(scene: Scene, camera: PerspectiveCamera): void;
    dispose(): void;
  }
}

declare module "three/addons/loaders/GLTFLoader.js" {
  export class GLTFParser {}

  export interface GLTF {
    userData: Record<string, unknown>;
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
