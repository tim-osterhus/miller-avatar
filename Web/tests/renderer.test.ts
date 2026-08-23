import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import {
  applyMouthExpressionValues,
  collectAvatarEvidence,
  collectMotionBounds,
  collectRootMotionOffsets,
  countAlphaPixels,
  detectMouthCapabilities,
  disposeAvatarResources,
  phasePresentationFor,
  requireVRM1,
  requireSessionAssetURL,
  requireSessionMotionURL,
  settleStaticRestPose,
  observeRootResize,
  ThreeVRMRendererBackend,
  type MouthExpressionManager,
  type RendererTestSeam,
} from "../src/renderer.js";

test("VRM admission accepts only version 1 metadata", () => {
  assert.doesNotThrow(() => requireVRM1({ meta: { metaVersion: "1" } }));
  assert.throws(() => requireVRM1({ meta: { metaVersion: "0" } }), /VRM 1.0/);
  assert.throws(() => requireVRM1({ meta: { metaVersion: "1" } }, "1.0-beta"), /VRM 1.0/);
  assert.throws(() => requireVRM1({}), /VRM 1.0/);
});

test("asset loading accepts only a session-bound custom-scheme URL", () => {
  assert.doesNotThrow(() => requireSessionAssetURL(
    "miller-avatar-local://app/session/11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.vrm",
  ));
  assert.throws(() => requireSessionAssetURL("https://example.com/avatar.vrm"), /session/);
  assert.throws(() => requireSessionAssetURL(
    "miller-avatar-local://app/session/11111111-1111-4111-8111-111111111111/avatar.vrm",
  ), /session/);
});

test("motion loading accepts only a session-bound VRMA URL", () => {
  assert.doesNotThrow(() => requireSessionMotionURL(
    "miller-avatar-local://app/session/11111111-1111-4111-8111-111111111111/33333333-3333-4333-8333-333333333333.vrma",
  ));
  assert.throws(() => requireSessionMotionURL("https://example.com/motion.vrma"), /session/);
  assert.throws(() => requireSessionMotionURL(
    "miller-avatar-local://app/session/11111111-1111-4111-8111-111111111111/33333333-3333-4333-8333-333333333333.vrm",
  ), /session/);
});

test("root resize observation triggers refits and disconnects cleanly", () => {
  let callback: (() => void) | undefined;
  let observed: unknown;
  let disconnected = false;
  class FakeResizeObserver {
    constructor(next: () => void) {
      callback = next;
    }

    observe(target: Element): void {
      observed = target;
    }

    disconnect(): void {
      disconnected = true;
    }
  }
  const root = {} as HTMLElement;
  let refits = 0;
  const stop = observeRootResize(
    root,
    () => { refits += 1; },
    FakeResizeObserver as unknown as typeof ResizeObserver,
  );

  assert.equal(observed, root);
  callback?.();
  assert.equal(refits, 1);
  stop();
  assert.equal(disconnected, true);
});

test("avatar evidence measures visible geometry, material bindings, and decoded textures", () => {
  const root = new THREE.Group();
  const texture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  const visible = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 1),
    [new THREE.MeshBasicMaterial({ map: texture }), new THREE.MeshBasicMaterial()],
  );
  visible.position.set(1, 2, -1);
  root.add(visible);
  const hidden = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  hidden.visible = false;
  root.add(hidden);
  root.updateMatrixWorld(true);

  const evidence = collectAvatarEvidence(root);
  assert.equal(evidence.visibleMeshes, 1);
  assert.equal(evidence.materialBindings, 2);
  assert.equal(evidence.decodedTextures, 1);
  assert.deepEqual(evidence.bounds.min, { x: 0, y: 0, z: -1.5 });
  assert.deepEqual(evidence.bounds.max, { x: 2, y: 4, z: -0.5 });
});

test("avatar evidence counts one decoded source across derived texture views", () => {
  const root = new THREE.Group();
  const sourceTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  const transformedTexture = sourceTexture.clone();
  assert.equal(transformedTexture.source, sourceTexture.source);
  root.add(new THREE.Mesh(
    new THREE.BoxGeometry(),
    [
      new THREE.MeshBasicMaterial({ map: sourceTexture }),
      new THREE.MeshBasicMaterial({ map: transformedTexture }),
    ],
  ));

  assert.equal(collectAvatarEvidence(root).decodedTextures, 1);
});

test("avatar evidence rejects a scene without visible renderable geometry", () => {
  assert.throws(() => collectAvatarEvidence(new THREE.Group()), /visible geometry/);
});

test("avatar evidence excludes geometry whose materials cannot render", () => {
  const root = new THREE.Group();
  const visible = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshBasicMaterial(),
  );
  visible.position.y = 1;
  root.add(visible);
  const hiddenMaterial = new THREE.MeshBasicMaterial();
  hiddenMaterial.visible = false;
  const hidden = new THREE.Mesh(
    new THREE.BoxGeometry(100, 100, 100),
    hiddenMaterial,
  );
  root.add(hidden);

  const evidence = collectAvatarEvidence(root);

  assert.equal(evidence.visibleMeshes, 1);
  assert.equal(evidence.materialBindings, 1);
  assert.deepEqual(evidence.bounds.min, { x: -0.5, y: 0, z: -0.5 });
  assert.deepEqual(evidence.bounds.max, { x: 0.5, y: 2, z: 0.5 });
});

test("root-motion framing derives target-relative offsets from each unique hips track", () => {
  const clip = new THREE.AnimationClip("motion", 1, [
    new THREE.VectorKeyframeTrack("normalizedHips.position", [0, 1], [
      0.1, 0.4, -0.2,
      0.3, 1.1, 0.5,
    ]),
  ]);
  const registry = new Map([
    ["listening", { motionToken: "one", clip }],
    ["speaking", { motionToken: "one", clip }],
  ]) as never;
  const avatar = {
    humanoid: {
      normalizedHumanBones: { hips: { node: { name: "normalizedHips" } } },
      normalizedRestPose: { hips: { position: [0.1, 0.9, 0] } },
    },
  } as never;

  const offsets = collectRootMotionOffsets(avatar, registry);
  assert.equal(offsets.length, 2);
  for (const [actual, expected] of [
    [offsets[0]!, { x: 0, y: -0.5, z: -0.2 }],
    [offsets[1]!, { x: 0.2, y: 0.2, z: 0.5 }],
  ] as const) {
    assert.ok(Math.abs(actual.x - expected.x) < 1e-6);
    assert.ok(Math.abs(actual.y - expected.y) < 1e-6);
    assert.ok(Math.abs(actual.z - expected.z) < 1e-6);
  }
});

test("root-motion framing includes cubic-spline extrema between keys", () => {
  const track = new THREE.VectorKeyframeTrack("normalizedHips.position", [0, 1], [
    0, 0, 0, 0, 0.9, 0, 0, 4, 0,
    0, 0, 0, 0, 0.9, 0, 0, 0, 0,
  ]);
  const cubicInterpolant = (() => ({})) as typeof track.createInterpolant;
  cubicInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
  track.createInterpolant = cubicInterpolant;
  const clip = new THREE.AnimationClip("cubic", 1, [track]);
  const avatar = {
    humanoid: {
      normalizedHumanBones: { hips: { node: { name: "normalizedHips" } } },
      normalizedRestPose: { hips: { position: [0, 0.9, 0] } },
    },
  } as never;
  const offsets = collectRootMotionOffsets(
    avatar,
    new Map([["listening", { motionToken: "cubic", clip }]]) as never,
  );

  assert.ok(Math.abs(Math.max(...offsets.map((offset) => offset.y)) - 16 / 27) < 1e-6);
});

test("root-motion framing is isolated to the active motion role", () => {
  const listening = new THREE.AnimationClip("listening", 1, [
    new THREE.VectorKeyframeTrack("normalizedHips.position", [0, 1], [
      0, 0.7, 0,
      0, 0.9, 0,
    ]),
  ]);
  const speaking = new THREE.AnimationClip("speaking", 1, [
    new THREE.VectorKeyframeTrack("normalizedHips.position", [0, 1], [
      0, 0.9, 0,
      0, 3.9, 0,
    ]),
  ]);
  const avatar = {
    humanoid: {
      normalizedHumanBones: { hips: { node: { name: "normalizedHips" } } },
      normalizedRestPose: { hips: { position: [0, 0.9, 0] } },
    },
  } as never;
  const base = {
    min: { x: -0.5, y: 0, z: -0.25 },
    max: { x: 0.5, y: 1.8, z: 0.25 },
    visibleMeshes: 1,
  };
  const registry = new Map([
    ["listening", { motionToken: "listen", clip: listening }],
    ["speaking", { motionToken: "speak", clip: speaking }],
  ]) as never;

  const byRole = collectMotionBounds(avatar, registry, base);

  const listeningBounds = byRole.get("listening");
  const speakingBounds = byRole.get("speaking");
  assert.ok(listeningBounds);
  assert.ok(speakingBounds);
  assert.ok(Math.abs(listeningBounds.min.y + 0.2) < 1e-6);
  assert.equal(listeningBounds.max.y, 1.8);
  assert.equal(listeningBounds.visibleMeshes, 1);
  assert.ok(Math.abs(speakingBounds.min.y) < 1e-6);
  assert.ok(Math.abs(speakingBounds.max.y - 4.8) < 1e-6);
  assert.equal(speakingBounds.visibleMeshes, 1);
});

test("role-specific framing uses the actual steady or terminal clip when a token is shared", () => {
  const original = new THREE.AnimationClip("shared-original", 1, [
    new THREE.VectorKeyframeTrack("normalizedHips.position", [0, 1], [0, 0.9, 0, 0, 0.9, 3]),
  ]);
  const steady = new THREE.AnimationClip("shared-steady", 1, [
    new THREE.VectorKeyframeTrack("normalizedHips.position", [0, 1], [0, 0.9, 0, 0, 0.9, 0]),
  ]);
  const avatar = {
    humanoid: {
      normalizedHumanBones: { hips: { node: { name: "normalizedHips" } } },
      normalizedRestPose: { hips: { position: [0, 0.9, 0] } },
    },
  } as never;
  const base = {
    min: { x: -0.5, y: 0, z: -0.25 },
    max: { x: 0.5, y: 1.8, z: 0.25 },
    visibleMeshes: 1,
  };
  const bounds = collectMotionBounds(avatar, new Map([
    ["idle", { motionToken: "shared", clip: original, steadyClip: steady }],
    ["success", { motionToken: "shared", clip: original, steadyClip: steady }],
  ]) as never, base);

  assert.equal(bounds.get("idle")?.max.z, 0.25);
  assert.equal(bounds.get("success")?.max.z, 3.25);
});

test("Reduced Motion settles normalized and spring state before rendering", () => {
  const calls: string[] = [];
  const avatar = {
    humanoid: { resetNormalizedPose: () => calls.push("reset-normalized") },
    springBoneManager: { reset: () => calls.push("reset-springs") },
    update: (delta: number) => calls.push(`update:${delta}`),
    scene: { updateMatrixWorld: (force: boolean) => calls.push(`matrices:${force}`) },
  } as never;

  settleStaticRestPose(avatar);

  assert.deepEqual(calls, [
    "reset-normalized",
    "update:0",
    "reset-springs",
    "matrices:true",
  ]);
});

test("alpha evidence counts rendered pixels instead of the clear background", () => {
  assert.equal(countAlphaPixels(new Uint8Array([
    0, 0, 0, 0,
    255, 255, 255, 1,
    255, 255, 255, 200,
  ])), 2);
  assert.throws(() => countAlphaPixels(new Uint8Array([0, 0, 0])), /RGBA/);
});

test("synthetic phases remain visible and use only bounded standard expressions", () => {
  assert.deepEqual(phasePresentationFor("thinking"), {
    visible: true,
    expression: "relaxed",
    weight: 0.35,
  });
  assert.deepEqual(phasePresentationFor("failed"), {
    visible: true,
    expression: "sad",
    weight: 0.55,
  });
  for (const phase of ["idle", "listening", "transcribing", "responding", "speaking", "succeeded", "stopped"] as const) {
    assert.deepEqual(phasePresentationFor(phase), {
      visible: true,
      expression: null,
      weight: 0,
    });
  }
});

test("avatar disposal releases each shared GPU resource exactly once", () => {
  const root = new THREE.Group();
  const texture = new THREE.Texture();
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const geometry = new THREE.BoxGeometry();
  const calls = { texture: 0, material: 0, geometry: 0 };
  texture.dispose = () => { calls.texture += 1; };
  material.dispose = () => { calls.material += 1; };
  geometry.dispose = () => { calls.geometry += 1; };
  root.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, material));

  disposeAvatarResources(root);
  assert.deepEqual(calls, { texture: 1, material: 1, geometry: 1 });
});


test("mouth capability detection probes every standard vowel expression", () => {
  const lookedUp: string[] = [];
  const supported = new Set(["aa", "ou"]);
  const manager = {
    getExpression(name: string): object | null {
      lookedUp.push(name);
      return supported.has(name) ? {} : null;
    },
    setValue(_name: string, _value: number): void {},
  };

  assert.deepEqual(detectMouthCapabilities(manager), {
    aa: true,
    ih: false,
    ou: true,
    ee: false,
    oh: false,
  });
  assert.deepEqual(lookedUp, ["aa", "ih", "ou", "ee", "oh"]);
});

test("mouth expression application writes every supported output, including inactive zeros", () => {
  const calls: Array<[string, number]> = [];
  const manager = {
    getExpression(_name: string): object | null { return {}; },
    setValue(name: string, value: number): void { calls.push([name, value]); },
  };

  applyMouthExpressionValues(manager, {
    aa: true,
    ih: false,
    ou: true,
    ee: false,
    oh: false,
  }, {
    aa: 0.4,
    ih: 0,
    ou: 0,
    ee: 0,
    oh: 0,
  });

  assert.deepEqual(calls, [["aa", 0.4], ["ou", 0]]);
});


const rendererTestVowels = ["aa", "ih", "ou", "ee", "oh"] as const;
type RendererTestVowelWeights = Record<(typeof rendererTestVowels)[number], number>;

class RecordingExpressionManager implements MouthExpressionManager {
  readonly values = new Map<string, number>();
  readonly calls: Array<[string, number]> = [];

  getExpression(name: string): object | null {
    return rendererTestVowels.includes(name as (typeof rendererTestVowels)[number])
      ? {}
      : null;
  }

  setValue(name: string, value: number): void {
    this.values.set(name, value);
    this.calls.push([name, value]);
  }
}

type RendererTestModel = {
  readonly token: string;
  readonly avatar: never;
  readonly manager: RecordingExpressionManager;
  readonly geometryDisposals: () => number;
  readonly materialDisposals: () => number;
  readonly specVersion: string;
};

function makeRendererTestModel(
  token: string,
  metaVersion: "0" | "1" = "1",
): RendererTestModel {
  const manager = new RecordingExpressionManager();
  const scene = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshBasicMaterial();
  let geometryDisposals = 0;
  let materialDisposals = 0;
  const disposeGeometry = geometry.dispose.bind(geometry);
  const disposeMaterial = material.dispose.bind(material);
  geometry.dispose = () => {
    geometryDisposals += 1;
    disposeGeometry();
  };
  material.dispose = () => {
    materialDisposals += 1;
    disposeMaterial();
  };
  scene.add(new THREE.Mesh(geometry, material));
  const avatar = {
    meta: { metaVersion },
    scene,
    expressionManager: manager,
    update(_deltaSeconds: number): void {},
    humanoid: {
      resetNormalizedPose(): void {},
      normalizedHumanBones: { hips: { node: { name: "hips" } } },
      normalizedRestPose: { hips: { position: [0, 0, 0] } },
    },
  };
  return {
    token,
    avatar: avatar as never,
    manager,
    geometryDisposals: () => geometryDisposals,
    materialDisposals: () => materialDisposals,
    specVersion: "1.0",
  };
}

class RendererSurfaceDouble {
  outputColorSpace = THREE.SRGBColorSpace;
  disposeCount = 0;
  contextLossCount = 0;

  setClearColor(_color: THREE.ColorRepresentation, _alpha: number): void {}
  setSize(_width: number, _height: number, _updateStyle?: boolean): void {}
  render(_scene: THREE.Scene, _camera: THREE.Camera): void {}
  dispose(): void { this.disposeCount += 1; }
  forceContextLoss(): void { this.contextLossCount += 1; }
  getRenderTarget(): THREE.WebGLRenderTarget | null { return null; }
  getClearColor(target: THREE.Color): THREE.Color { return target.set(0); }
  getClearAlpha(): number { return 0; }
  setRenderTarget(_target: THREE.WebGLRenderTarget | null): void {}
  clear(_color?: boolean, _depth?: boolean, _stencil?: boolean): void {}
  readRenderTargetPixels(
    _target: THREE.WebGLRenderTarget,
    _x: number,
    _y: number,
    _width: number,
    _height: number,
    pixels: Uint8Array,
  ): void { pixels.fill(0); }
}

function modelURL(token: string): string {
  return `miller-avatar-local://app/session/11111111-1111-4111-8111-111111111111/${token}.vrm`;
}

function rendererHarness(models: readonly RendererTestModel[]) {
  const byURL = new Map(models.map((model) => [modelURL(model.token), model]));
  const surface = new RendererSurfaceDouble();
  let canvasRemoves = 0;
  const canvas = {
    remove(): void { canvasRemoves += 1; },
  } as unknown as HTMLCanvasElement;
  const root = {
    clientWidth: 640,
    clientHeight: 480,
    replaceChildren(): void {},
  } as unknown as HTMLElement;
  const seam: RendererTestSeam = {
    canvas,
    renderer: surface as unknown as THREE.WebGLRenderer,
    loadVRM: async (url: string, _signal: AbortSignal) => {
      const model = byURL.get(url);
      if (!model) throw new Error(`unexpected test model URL: ${url}`);
      return { avatar: model.avatar, specVersion: model.specVersion };
    },
  };
  return {
    backend: new ThreeVRMRendererBackend(root, seam),
    surface,
    canvasRemoves: () => canvasRemoves,
  };
}

async function loadRendererTestModel(
  backend: ThreeVRMRendererBackend,
  model: RendererTestModel,
): Promise<void> {
  await backend.loadModel(modelURL(model.token), new AbortController().signal);
}

function mouthValues(manager: RecordingExpressionManager): RendererTestVowelWeights {
  return Object.fromEntries(rendererTestVowels.map((vowel) => [
    vowel,
    manager.values.get(vowel) ?? 0,
  ])) as RendererTestVowelWeights;
}

function mouthEffect(target: {
  scalar: number;
  vowels?: RendererTestVowelWeights;
}): never {
  return {
    type: "apply_mouth",
    command: {
      type: "set_mouth",
      payload: {
        generation_id: "11111111-1111-4111-8111-111111111111",
        playback_id: "22222222-2222-4222-8222-222222222222",
        cue_index: 1,
        playback_offset_ms: 0,
        ...target,
      },
    },
  } as never;
}

function reconcileMouthEffect(options: {
  mouthCuesEnabled?: boolean;
  reducedMotion?: boolean;
} = {}): never {
  return {
    type: "reconcile",
    lastProjectionSequence: 1,
    generationID: null,
    phase: "idle",
    playbackID: null,
    mouthScalar: 1,
    mouthCuesEnabled: options.mouthCuesEnabled ?? true,
    reducedMotion: options.reducedMotion ?? false,
  } as never;
}

const zeroRendererTestMouth: RendererTestVowelWeights = {
  aa: 0,
  ih: 0,
  ou: 0,
  ee: 0,
  oh: 0,
};

const rendererMouthLifecycleCases: Array<{
  name: string;
  run(backend: ThreeVRMRendererBackend): void;
}> = [
  {
    name: "policy Off reconcile",
    run(backend) {
      backend.configure({ reducedMotion: false, mouthCuesEnabled: false });
      backend.apply(reconcileMouthEffect({ mouthCuesEnabled: false }));
      backend.configure({ reducedMotion: false, mouthCuesEnabled: true });
    },
  },
  {
    name: "Reduced Motion reconcile",
    run(backend) {
      backend.configure({ reducedMotion: true, mouthCuesEnabled: true });
      backend.apply(reconcileMouthEffect({ reducedMotion: true }));
      backend.configure({ reducedMotion: false, mouthCuesEnabled: true });
    },
  },
  {
    name: "suspension and resume reconcile",
    run(backend) {
      backend.setSuspended(true);
      backend.apply(reconcileMouthEffect());
      backend.setSuspended(false);
    },
  },
  {
    name: "reset",
    run(backend) {
      backend.apply(mouthEffect({ scalar: 1 }));
      backend.update(0);
      backend.apply({
        type: "reset",
        generationID: null,
        reason: "operator",
      } as never);
    },
  },
];

test("renderer mouth lifecycle keeps output zero through policy, suspension, reset, and reconcile transitions", async () => {
  for (const scenario of rendererMouthLifecycleCases) {
    const model = makeRendererTestModel(`33333333-3333-4333-8333-${scenario.name === "reset" ? "333333333333" : "444444444444"}`);
    const harness = rendererHarness([model]);
    await loadRendererTestModel(harness.backend, model);

    scenario.run(harness.backend);
    harness.backend.update(0);

    assert.deepEqual(mouthValues(model.manager), zeroRendererTestMouth, scenario.name);
    harness.backend.dispose();
  }
});

test("renderer mouth lifecycle bounds malformed scalar and vowel targets", async () => {
  const malformedTargets: Array<{
    name: string;
    target: { scalar: number; vowels?: RendererTestVowelWeights };
    expected: RendererTestVowelWeights;
  }> = [
    { name: "scalar NaN", target: { scalar: Number.NaN }, expected: zeroRendererTestMouth },
    { name: "scalar infinity", target: { scalar: Number.POSITIVE_INFINITY }, expected: zeroRendererTestMouth },
    { name: "scalar negative", target: { scalar: -0.5 }, expected: zeroRendererTestMouth },
    {
      name: "scalar over-range",
      target: { scalar: 1.5 },
      expected: { ...zeroRendererTestMouth, aa: 0.55 },
    },
    {
      name: "vowel NaN",
      target: { scalar: 0, vowels: { aa: Number.NaN, ih: 0, ou: 0, ee: 0, oh: 0 } },
      expected: zeroRendererTestMouth,
    },
    {
      name: "vowel infinity",
      target: { scalar: 0, vowels: { aa: Number.POSITIVE_INFINITY, ih: 0, ou: 0, ee: 0, oh: 0 } },
      expected: zeroRendererTestMouth,
    },
    {
      name: "vowel negative",
      target: { scalar: 0, vowels: { aa: -0.5, ih: 0, ou: 0, ee: 0, oh: 0 } },
      expected: zeroRendererTestMouth,
    },
    {
      name: "vowel over-range",
      target: { scalar: 0, vowels: { aa: 0, ih: 1.5, ou: 0, ee: 0, oh: 0 } },
      expected: { ...zeroRendererTestMouth, ih: 0.55 },
    },
  ];

  for (const malformed of malformedTargets) {
    const model = makeRendererTestModel("44444444-4444-4444-8444-444444444444");
    const harness = rendererHarness([model]);
    await loadRendererTestModel(harness.backend, model);

    harness.backend.apply(mouthEffect(malformed.target));
    harness.backend.update(0);

    assert.deepEqual(mouthValues(model.manager), malformed.expected, malformed.name);
    harness.backend.dispose();
  }
});

test("failed replacement admission preserves the active avatar mouth and motion runtime", async () => {
  const prior = makeRendererTestModel("55555555-5555-4555-8555-555555555555");
  const rejected = makeRendererTestModel("66666666-6666-4666-8666-666666666666", "0");
  const harness = rendererHarness([prior, rejected]);
  await loadRendererTestModel(harness.backend, prior);

  harness.backend.apply(mouthEffect({ scalar: 1 }));
  harness.backend.update(0);
  assert.equal(mouthValues(prior.manager).aa, 0.55);

  await assert.rejects(
    harness.backend.loadModel(modelURL(rejected.token), new AbortController().signal),
    /VRM 1.0/,
  );

  assert.doesNotThrow(() => harness.backend.replaceMotions(new Map() as never, {
    sessionID: "11111111-1111-4111-8111-111111111111",
    profileRevision: 1,
    modelToken: prior.token,
    generation: 1,
  }));
  harness.backend.apply(mouthEffect({ scalar: 1 }));
  harness.backend.update(0);
  assert.ok(Math.abs((mouthValues(prior.manager).aa) - 0.7975) < 1e-12);
  assert.equal(prior.geometryDisposals(), 0);
  assert.equal(prior.materialDisposals(), 0);
  assert.equal(rejected.geometryDisposals(), 1);
  assert.equal(rejected.materialDisposals(), 1);
  harness.backend.dispose();
});

test("successful replacement disposes the old avatar and leaves the new mouth runtime active", async () => {
  const prior = makeRendererTestModel("77777777-7777-4777-8777-777777777777");
  const replacement = makeRendererTestModel("88888888-8888-4888-8888-888888888888");
  const harness = rendererHarness([prior, replacement]);
  await loadRendererTestModel(harness.backend, prior);
  harness.backend.apply(mouthEffect({ scalar: 1 }));
  harness.backend.update(0);

  await loadRendererTestModel(harness.backend, replacement);

  assert.deepEqual(mouthValues(prior.manager), zeroRendererTestMouth);
  assert.equal(prior.geometryDisposals(), 1);
  assert.equal(prior.materialDisposals(), 1);
  assert.equal(replacement.geometryDisposals(), 0);
  assert.equal(replacement.materialDisposals(), 0);

  harness.backend.apply(mouthEffect({ scalar: 1 }));
  harness.backend.update(0);
  assert.equal(mouthValues(replacement.manager).aa, 0.55);
  harness.backend.dispose();
  assert.equal(replacement.geometryDisposals(), 1);
  assert.equal(replacement.materialDisposals(), 1);
  assert.equal(harness.surface.disposeCount, 1);
  assert.equal(harness.surface.contextLossCount, 1);
  assert.equal(harness.canvasRemoves(), 1);
});
