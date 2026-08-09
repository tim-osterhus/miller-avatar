import assert from "node:assert/strict";
import test from "node:test";
import {
  startBrowserRenderer,
  type BrowserRendererReceiver,
  type FrameScheduler,
  type RendererBackend,
} from "../src/runtime.js";
import type { PresentationEffect } from "../src/presentation.js";

const session = "11111111-1111-4111-8111-111111111111";

test("production bootstrap installs its only receiver and reports renderer readiness", async () => {
  const backend = new RecordingBackend();
  const observations: Array<Record<string, unknown>> = [];
  let receiver: BrowserRendererReceiver | undefined;

  startBrowserRenderer({
    entryURL: `miller-avatar-local://app/session/${session}/bundle/index.html`,
    backend,
    scheduler: new NoopScheduler(),
    postObservation: (message) => observations.push(JSON.parse(message)),
    installReceiver: (candidate) => { receiver = candidate; },
  });

  assert.ok(receiver);
  assert.deepEqual(observations.map((observation) => observation.type), ["wrapper_ready"]);
  await receiver.accept(JSON.stringify({
    schema: "miller-avatar.presentation-command/v2",
    session_id: session,
    sequence: 1,
    type: "configure",
    payload: { profile: "lightweight", reduced_motion: false },
  }));

  assert.deepEqual(backend.configurations, [false]);
  assert.deepEqual(observations.map((observation) => observation.type), [
    "wrapper_ready",
    "renderer_ready",
  ]);
  assert.equal(observations[0]?.session_id, session);
});

test("production bootstrap rejects an entry URL without a canonical active session", () => {
  assert.throws(() => startBrowserRenderer({
    entryURL: "miller-avatar-local://app/bundle/index.html",
    backend: new RecordingBackend(),
    scheduler: new NoopScheduler(),
    postObservation: () => {},
    installReceiver: () => {},
  }));
});

class RecordingBackend implements RendererBackend {
  configurations: boolean[] = [];

  configure(reducedMotion: boolean): void { this.configurations.push(reducedMotion); }
  async loadAsset() {
    return { capabilities: { aa: true, look_at: true, spring_bone: true, mtoon_materials: 1 } };
  }
  renderOnce() {
    return {
      viewport_width: 1,
      viewport_height: 1,
      visible_meshes: 1,
      decoded_textures: 0,
      material_bindings: 1,
      alpha_probe_pixels: 1,
    };
  }
  renderFrame(): void {}
  update(): void {}
  apply(_effect: PresentationEffect): void {}
  startClock(): void {}
  stopClock(): void {}
  dispose(): void {}
}

class NoopScheduler implements FrameScheduler {
  request(_callback: (timestampMilliseconds: number) => void): number { return 1; }
  cancel(_handle: number): void {}
}
