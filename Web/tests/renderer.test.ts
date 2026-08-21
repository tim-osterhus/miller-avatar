import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import {
  collectAvatarEvidence,
  collectMotionBounds,
  collectRootMotionOffsets,
  countAlphaPixels,
  disposeAvatarResources,
  phasePresentationFor,
  requireVRM1,
  requireSessionAssetURL,
  requireSessionMotionURL,
  settleStaticRestPose,
  observeRootResize,
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

test("root-motion framing is isolated to the active motion token", () => {
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

  const byToken = collectMotionBounds(avatar, registry, base);

  const listeningBounds = byToken.get("listen");
  const speakingBounds = byToken.get("speak");
  assert.ok(listeningBounds);
  assert.ok(speakingBounds);
  assert.ok(Math.abs(listeningBounds.min.y + 0.2) < 1e-6);
  assert.equal(listeningBounds.max.y, 1.8);
  assert.equal(listeningBounds.visibleMeshes, 1);
  assert.ok(Math.abs(speakingBounds.min.y) < 1e-6);
  assert.ok(Math.abs(speakingBounds.max.y - 4.8) < 1e-6);
  assert.equal(speakingBounds.visibleMeshes, 1);
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
