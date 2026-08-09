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
const model = "22222222-2222-4222-8222-222222222222";
const motion = "33333333-3333-4333-8333-333333333333";

test("fake backend proves scheduling, suspension, exact resume deltas, and disposal", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false }));
  await core.accept(loadProfileCommand(2));
  assert.equal(backend.loadedURL, `miller-avatar-local://app/session/${session}/${model}.vrm`);
  assert.deepEqual(messages.slice(0, 4).map((message) => message.type), [
    "wrapper_ready",
    "renderer_ready",
    "profile_model_loaded",
    "first_frame",
  ]);
  assert.equal(messages[2]?.caused_by_sequence, 2);
  assert.equal(messages[3]?.caused_by_sequence, 2);
  const initialStatuses = messages.filter((message) => message.type === "motion_status");
  assert.equal(initialStatuses.length, 6);
  for (const message of initialStatuses) {
    assert.equal(message.caused_by_sequence, 2);
    assert.deepEqual(message.payload, {
      profile_revision: 1,
      model_token: model,
      motion_token: null,
      role: (message.payload as { role: string }).role,
      status: "missing",
      motion_code: null,
    });
  }
  assert.equal(core.snapshot().state, "live");
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

test("terminal presentation phases render without re-running first-frame proof", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const core = new WebRendererCore(session, backend, scheduler, () => {});
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false }));
  await core.accept(loadProfileCommand(2));
  await core.accept(command(3, "project_phase", {
    projection_sequence: 1,
    generation_id: "33333333-3333-4333-8333-333333333333",
    phase: "stopped",
    playback_id: null,
  }));

  scheduler.run(100);

  assert.equal(core.snapshot().state, "live");
  assert.equal(backend.firstFrameProofs, 1);
  assert.equal(backend.frameRenders, 1);
});

test("context loss emits one failure, disposes, and fences later commands", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: true }));
  await core.accept(loadProfileCommand(2));
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
  const loading = core.accept(loadProfileCommand(2));
  assert.equal(timeout.pending, 1);
  timeout.run();
  await loading;
  assert.equal(backend.aborted, true);
  assert.equal(backend.disposals, 1);
  assert.equal(core.snapshot().state, "disposed");
  assert.equal(core.snapshot().presentation.terminated, true);
  assertFailureDisposal(messages.slice(terminalStart), "asset_load_timeout", 2);
});

test("resume-only reconciliation restores the native snapshot after Web suspension", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const core = new WebRendererCore(session, backend, scheduler, () => {});
  const generation = "33333333-3333-4333-8333-333333333333";
  const playback = "44444444-4444-4444-8444-444444444444";

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false }));
  await core.accept(loadProfileCommand(2));
  await core.accept(command(3, "project_phase", {
    projection_sequence: 1,
    generation_id: generation,
    phase: "speaking",
    playback_id: playback,
  }));
  await core.accept(command(4, "set_visibility", { visibility: "occluded" }));
  await core.accept(command(5, "set_visibility", { visibility: "visible" }));
  await core.accept(command(6, "reconcile_presentation", {
    last_projection_sequence: 1,
    generation_id: generation,
    phase: "speaking",
    playback_id: playback,
    reduced_motion: true,
  }));

  assert.deepEqual(core.snapshot().presentation, {
    lastProjectionSequence: 1,
    generationID: generation,
    phase: "speaking",
    playbackID: playback,
    mouthScalar: 0,
    reducedMotion: true,
    suspended: false,
    terminated: false,
  });
});

test("profile load reports only nonterminal missing and rejected bindings", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: true }));
  await core.accept(loadProfileCommand(2, {
    idle: { status: "ready", token: motion },
    speaking: { status: "rejected", token: null },
  }));

  const statuses = messages.filter((message) => message.type === "motion_status");
  assert.equal(statuses.length, 5);
  assert.deepEqual(statuses.map((message) => (message.payload as { role: string }).role).sort(), [
    "failure",
    "listening",
    "speaking",
    "success",
    "thinking",
  ]);
  assert.equal(statuses.some((message) => (message.payload as { status: string }).status === "ready"), false);
  assert.equal(core.snapshot().state, "live");
  assert.equal(messages.some((message) => message.type === "failed"), false);
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
  firstFrameProofs = 0;
  frameRenders = 0;
  configure(): void {}
  async loadAsset(url: string, _signal: AbortSignal) {
    this.loadedURL = url;
    return { capabilities: { aa: true, look_at: true, spring_bone: true, mtoon_materials: 2 } };
  }
  renderOnce() {
    this.firstFrameProofs += 1;
    return { viewport_width: 800, viewport_height: 600, visible_meshes: 1, decoded_textures: 2, material_bindings: 2, alpha_probe_pixels: 5 };
  }
  renderFrame(): void { this.frameRenders += 1; }
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
    schema: "miller-avatar.presentation-command/v2",
    session_id: session,
    sequence,
    type,
    payload,
  });
}

function loadProfileCommand(
  sequence: number,
  overrides: Record<string, { status: string; token: string | null }> = {},
): string {
  const roles = ["idle", "listening", "thinking", "speaking", "success", "failure"];
  return command(sequence, "load_profile", {
    profile_revision: 1,
    model_token: model,
    motion_bindings: Object.fromEntries(roles.map((role) => [
      role,
      overrides[role] ?? { status: "missing", token: null },
    ])),
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
