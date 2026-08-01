import assert from "node:assert/strict";
import test from "node:test";
import { fitCamera } from "../src/camera.js";

const bounds = {
  min: { x: -1, y: 0, z: -0.25 },
  max: { x: 1, y: 2, z: 0.25 },
  visibleMeshes: 1,
};

test("camera fits padded bounds in portrait and landscape viewports", () => {
  const landscape = fitCamera(bounds, 1600, 900);
  const portrait = fitCamera(bounds, 900, 1600);
  assert.equal(landscape.fovDegrees, 30);
  assert.equal(landscape.target.x, 0);
  assert.ok(portrait.position.z > landscape.position.z);
  for (const fit of [landscape, portrait]) {
    assert.ok(Number.isFinite(fit.near) && fit.near >= 0.01);
    assert.ok(Number.isFinite(fit.far) && fit.far > fit.near);
    assert.ok(Number.isFinite(fit.position.z));
    const distance = fit.position.z - fit.target.z;
    const paddedHalfDepth = ((bounds.max.z - bounds.min.z) * 1.2) / 2;
    assert.ok(fit.near <= distance - paddedHalfDepth);
    assert.ok(fit.far >= distance + paddedHalfDepth);
  }
});

test("camera recalculates aspect and rejects invalid or degenerate bounds", () => {
  assert.notEqual(fitCamera(bounds, 1600, 900).aspect, fitCamera(bounds, 900, 1600).aspect);
  assert.throws(() => fitCamera({ ...bounds, visibleMeshes: 0 }, 100, 100));
  assert.throws(() => fitCamera({ min: { x: 0, y: 0, z: 0 }, max: { x: 0, y: 0, z: 0 }, visibleMeshes: 1 }, 100, 100));
  assert.throws(() => fitCamera({ ...bounds, max: { ...bounds.max, y: Number.NaN } }, 100, 100));
  assert.throws(() => fitCamera(bounds, 8_193, 100), /viewport/);
  assert.throws(() => fitCamera(bounds, Number.MAX_VALUE, 1), /viewport/);
  const depthDominated = fitCamera({
    min: { x: 0, y: 0, z: -5 },
    max: { x: 0, y: 0, z: 5 },
    visibleMeshes: 1,
  }, 100, 100);
  assert.ok(depthDominated.position.z - depthDominated.target.z > 6);
  assert.equal(depthDominated.near, 0.01);
});
