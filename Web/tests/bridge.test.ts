import assert from "node:assert/strict";
import test from "node:test";
import {
  WebRendererCore,
  type FrameScheduler,
  type LoadTimeoutScheduler,
  type RendererBackend,
} from "../src/bridge.js";
import type { PresentationEffect } from "../src/presentation.js";

const session = "11111111-1111-4111-8111-111111111111";
const asset = "22222222-2222-4222-8222-222222222222";

test("fake backend proves scheduling, suspension, exact resume deltas, and disposal", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false }));
  await core.accept(command(2, "load_asset", { asset_token: asset }));
  assert.equal(backend.loadedURL, `miller-avatar-local://app/session/${session}/${asset}.vrm`);
  scheduler.run(100);
  await core.accept(command(3, "set_visibility", { visibility: "hidden" }));
  const suspended = core.snapshot().counters;
  scheduler.run(2_100);
  assert.deepEqual(core.snapshot().counters, suspended);
  await core.accept(command(4, "project_phase", {
    projection_sequence: 1,
    generation_id: null,
    phase: "listening",
    playback_id: null,
  }));
  assert.equal(scheduler.pending, 0);
  await core.accept(command(5, "set_visibility", { visibility: "visible" }));
  const resumed = core.snapshot().counters;
  assert.deepEqual({
    frames: resumed.frames - suspended.frames,
    updates: resumed.updates - suspended.updates,
    renders: resumed.renders - suspended.renders,
  }, { frames: 1, updates: 1, renders: 1 });
  assert.equal(messages.at(-1)?.type, "resumed");
  assert.equal(scheduler.pending, 1);
  await core.accept(command(6, "dispose", { reason: "operator" }));
  assert.equal(backend.disposals, 1);
  assert.equal(scheduler.pending, 0);
  assert.equal(messages.at(-1)?.type, "disposed");
});

test("context loss emits one failure, disposes, and fences later commands", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: true }));
  await core.accept(command(2, "load_asset", { asset_token: asset }));
  await core.accept(command(3, "set_visibility", { visibility: "occluded" }));
  const before = core.snapshot().counters;
  await core.accept(command(4, "set_visibility", { visibility: "visible" }));
  const after = core.snapshot().counters;
  assert.deepEqual({ frames: after.frames - before.frames, updates: after.updates - before.updates, renders: after.renders - before.renders }, {
    frames: 1,
    updates: 0,
    renders: 1,
  });
  const terminalStart = messages.length;
  core.contextLost();
  assert.equal(core.snapshot().state, "disposed");
  assert.equal(core.snapshot().presentation.terminated, true);
  assert.equal(scheduler.pending, 0);
  assertFailureDisposal(messages.slice(terminalStart), "context_lost", null);
  assert.equal(backend.disposals, 1);
  const terminalMessageCount = messages.length;
  core.contextLost();
  await core.accept(command(5, "set_policy", { reduced_motion: false }));
  assert.equal(messages.length, terminalMessageCount);
  assert.equal(backend.disposals, 1);
});

test("first structurally invalid command emits failure then disposal and silently fences later commands", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  core.start();

  const terminalStart = messages.length;
  await core.accept(JSON.stringify({
    schema: "miller-avatar.presentation-command/v1",
    session_id: session,
    sequence: 1,
    type: "configure",
  }));
  assert.equal(core.snapshot().state, "disposed");
  assert.equal(core.snapshot().presentation.terminated, true);
  assert.equal(backend.disposals, 1);
  assertFailureDisposal(messages.slice(terminalStart), "bridge_invalid", null);

  const terminalMessageCount = messages.length;
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false }));
  core.contextLost();
  assert.equal(messages.length, terminalMessageCount);
  assert.equal(backend.disposals, 1);
});

test("timed out loads abort, dispose the backend, and retain command correlation", async () => {
  const backend = new PendingBackend();
  const scheduler = new FakeScheduler();
  const timeout = new FakeLoadTimeoutScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)), {
    loadTimeoutMilliseconds: 25,
    loadTimeoutScheduler: timeout,
  });
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false }));
  const terminalStart = messages.length;
  const loading = core.accept(command(2, "load_asset", { asset_token: asset }));
  assert.equal(timeout.pending, 1);
  timeout.run();
  await loading;
  assert.equal(backend.aborted, true);
  assert.equal(backend.disposals, 1);
  assert.equal(core.snapshot().state, "disposed");
  assert.equal(core.snapshot().presentation.terminated, true);
  assertFailureDisposal(messages.slice(terminalStart), "asset_load_timeout", 2);
});

class FakeScheduler implements FrameScheduler {
  private next = 1;
  private callbacks = new Map<number, (timestamp: number) => void>();
  get pending(): number { return this.callbacks.size; }
  request(callback: (timestamp: number) => void): number {
    const handle = this.next++;
    this.callbacks.set(handle, callback);
    return handle;
  }
  cancel(handle: number): void { this.callbacks.delete(handle); }
  run(timestamp: number): void {
    const callback = this.callbacks.entries().next().value as [number, (timestamp: number) => void] | undefined;
    if (!callback) return;
    this.callbacks.delete(callback[0]);
    callback[1](timestamp);
  }
}

class FakeBackend implements RendererBackend {
  loadedURL = "";
  disposals = 0;
  configure(): void {}
  async loadAsset(url: string, _signal: AbortSignal) {
    this.loadedURL = url;
    return { capabilities: { aa: true, look_at: true, spring_bone: true, mtoon_materials: 2 } };
  }
  renderOnce() {
    return { viewport_width: 800, viewport_height: 600, visible_meshes: 1, decoded_textures: 2, material_bindings: 2, alpha_probe_pixels: 5 };
  }
  update(): void {}
  apply(_effect: PresentationEffect): void {}
  startClock(): void {}
  stopClock(): void {}
  dispose(): void { this.disposals += 1; }
}

class PendingBackend extends FakeBackend {
  aborted = false;

  override loadAsset(url: string, signal: AbortSignal): Promise<Awaited<ReturnType<FakeBackend["loadAsset"]>>> {
    this.loadedURL = url;
    return new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => {
        this.aborted = true;
        reject(new DOMException("aborted", "AbortError"));
      }, { once: true });
    });
  }
}

class FakeLoadTimeoutScheduler implements LoadTimeoutScheduler {
  private next = 1;
  private readonly callbacks = new Map<number, () => void>();
  get pending(): number { return this.callbacks.size; }
  request(callback: () => void, _milliseconds: number): number {
    const handle = this.next++;
    this.callbacks.set(handle, callback);
    return handle;
  }
  cancel(handle: number): void { this.callbacks.delete(handle); }
  run(): void {
    const entry = this.callbacks.entries().next().value as [number, () => void] | undefined;
    if (!entry) return;
    this.callbacks.delete(entry[0]);
    entry[1]();
  }
}

function command(sequence: number, type: string, payload: Record<string, unknown>): string {
  return JSON.stringify({
    schema: "miller-avatar.presentation-command/v1",
    session_id: session,
    sequence,
    type,
    payload,
  });
}

function assertFailureDisposal(
  messages: Array<Record<string, unknown>>,
  code: string,
  causedBySequence: number | null,
): void {
  assert.deepEqual(messages.map((message) => message.type), ["failed", "disposed"]);
  assert.equal((messages[0]?.payload as { code: string }).code, code);
  assert.equal((messages[1]?.payload as { reason: string }).reason, "failure");
  assert.equal(messages[0]?.caused_by_sequence, causedBySequence);
  assert.equal(messages[1]?.caused_by_sequence, causedBySequence);
}
