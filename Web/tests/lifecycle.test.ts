import assert from "node:assert/strict";
import test from "node:test";
import { reduceLifecycle, type LifecycleInput, type RendererState } from "../src/lifecycle.js";

test("lifecycle accepts only declared edges and disposal is idempotent", () => {
  const path: Array<[RendererState, LifecycleInput, RendererState]> = [
    ["booting", { type: "configured" }, "ready"],
    ["ready", { type: "load_started" }, "loading"],
    ["loading", { type: "first_frame" }, "live"],
    ["live", { type: "suspend" }, "suspended"],
    ["suspended", { type: "resume" }, "live"],
  ];
  for (const [state, input, expected] of path) {
    assert.deepEqual(reduceLifecycle(state, input), { state: expected });
  }
  assert.equal(reduceLifecycle("ready", { type: "resume" }).effect, "rejected");
  assert.deepEqual(reduceLifecycle("live", { type: "dispose", reason: "operator" }), {
    state: "disposing",
    effect: "begin_disposal",
  });
  assert.deepEqual(reduceLifecycle("disposing", { type: "dispose", reason: "operator" }), {
    state: "disposing",
  });
  assert.deepEqual(reduceLifecycle("disposing", { type: "disposed" }), { state: "disposed" });
});
