import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import {
  collectAvatarEvidence,
  countAlphaPixels,
  disposeAvatarResources,
  phasePresentationFor,
  requireVRM1,
  requireSessionAssetURL,
  requireSessionMotionURL,
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
