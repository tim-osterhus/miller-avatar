import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import {
  WebRendererCore,
  type FrameScheduler,
  type LoadTimeoutScheduler,
  type RendererBackend,
  type RendererPolicy,
} from "../src/bridge.js";
import type { PresentationEffect } from "../src/presentation.js";
import type { MotionActiveEvent, MotionFault } from "../src/motion-controller.js";

const session = "11111111-1111-4111-8111-111111111111";
const model = "22222222-2222-4222-8222-222222222222";
const motion = "33333333-3333-4333-8333-333333333333";

test("fake backend proves scheduling, suspension, exact resume deltas, and disposal", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
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

test("configure propagates both policy fields into the backend policy object and presentation policy", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const core = new WebRendererCore(session, backend, scheduler, () => {});
  core.start();

  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: false }));

  assert.deepEqual(backend.configurations, [{ reducedMotion: false, mouthCuesEnabled: false }]);
  const presentation = core.snapshot().presentation;
  assert.equal(presentation.reducedMotion, false);
  assert.equal(presentation.mouthCuesEnabled, false);
});

test("set_policy propagates both fields through reducer effects and backend application", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const core = new WebRendererCore(session, backend, scheduler, () => {});
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2));

  await core.accept(command(3, "set_policy", { reduced_motion: true, mouth_cues_enabled: false }));

  const presentation = core.snapshot().presentation;
  assert.equal(presentation.reducedMotion, true);
  assert.equal(presentation.mouthCuesEnabled, false);
  assert.deepEqual(backend.appliedEffects, [
    { type: "set_reduced_motion", enabled: true },
    { type: "set_mouth_cues_enabled", enabled: false },
    { type: "clear_mouth" },
  ]);
});

test("profile_model_loaded retains legacy capabilities for a legacy fake backend", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2));

  const loaded = messages.find((message) => message.type === "profile_model_loaded");
  assert.deepEqual(loaded?.payload, {
    profile_revision: 1,
    model_token: model,
    capabilities: { aa: true, look_at: true, spring_bone: true, mtoon_materials: 2 },
  });
});

test("profile_model_loaded reports enriched five-vowel capabilities when the backend reports them", async () => {
  const backend = new EnrichedCapabilitiesBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2));

  const loaded = messages.find((message) => message.type === "profile_model_loaded");
  assert.deepEqual(loaded?.payload, {
    profile_revision: 1,
    model_token: model,
    capabilities: {
      aa: true,
      look_at: true,
      spring_bone: true,
      mtoon_materials: 2,
      vowels: { aa: true, ih: false, ou: true, ee: false, oh: false },
    },
  });
});

test("enabling Reduced Motion while live renders one zero-delta static frame", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const core = new WebRendererCore(session, backend, scheduler, () => {});
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2));
  await core.accept(command(3, "project_phase", {
    projection_sequence: 1,
    generation_id: null,
    phase: "listening",
    playback_id: null,
  }));
  backend.events.length = 0;

  await core.accept(command(4, "set_policy", { reduced_motion: true, mouth_cues_enabled: true }));

  assert.deepEqual(backend.events, [
    "apply:set_reduced_motion",
    "apply:clear_mouth",
    "update:0",
    "render",
  ]);
  assert.equal(scheduler.pending, 0);
});

test("terminal presentation phases render without re-running first-frame proof", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const core = new WebRendererCore(session, backend, scheduler, () => {});
  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
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
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: true, mouth_cues_enabled: true }));
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
  await core.accept(command(5, "set_policy", { reduced_motion: false, mouth_cues_enabled: true }));
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
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
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
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
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
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
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
    mouth_cues_enabled: false,
  }));

  assert.deepEqual(core.snapshot().presentation, {
    lastProjectionSequence: 1,
    generationID: generation,
    phase: "speaking",
    playbackID: playback,
    mouthScalar: 0,
    mouthVowels: null,
    mouthCuesEnabled: false,
    reducedMotion: true,
    suspended: false,
    terminated: false,
  });
  const reconcileEffects = backend.appliedEffects.filter((effect) => effect.type === "reconcile");
  assert.equal(reconcileEffects.length, 2);
  assert.deepEqual(reconcileEffects.at(-1), {
    type: "reconcile",
    lastProjectionSequence: 1,
    generationID: generation,
    phase: "speaking",
    playbackID: playback,
    mouthScalar: 0,
    mouthCuesEnabled: false,
    reducedMotion: true,
  });
});

test("resume applies an authoritative reset reconciliation before unsuspending motion", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const core = new WebRendererCore(session, backend, scheduler, () => {});
  const generation = "33333333-3333-4333-8333-333333333333";
  const playback = "44444444-4444-4444-8444-444444444444";

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2));
  await core.accept(command(3, "project_phase", {
    projection_sequence: 1,
    generation_id: generation,
    phase: "speaking",
    playback_id: playback,
  }));
  await core.accept(command(4, "set_visibility", { visibility: "occluded" }));
  await core.accept(command(5, "reset", { generation_id: generation, reason: "cancelled" }));

  backend.events.length = 0;
  await core.accept(command(6, "set_visibility", { visibility: "visible" }));

  assert.deepEqual(backend.events.slice(0, 2), ["apply:reconcile", "setSuspended:false"]);
});

test("reset-origin motion activity is suppressed when it has no projection cause", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2));
  await core.accept(command(3, "project_phase", {
    projection_sequence: 1,
    generation_id: null,
    phase: "idle",
    playback_id: null,
  }));
  await core.accept(command(4, "reset", { generation_id: null, reason: "operator" }));

  const resetApply = backend.applyCauses.find((entry) => entry.type === "reset");
  assert.equal(resetApply?.causedBySequence, null);
  backend.emitMotionActive(null);

  assert.equal(messages.filter((message) => message.type === "motion_active").length, 0);
});

test("profile load reports only nonterminal missing and rejected bindings", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: true, mouth_cues_enabled: true }));
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

test("model-first profile loading returns before asynchronous motion replacement and deduplicates tokens", async () => {
  const backend = new AsyncMotionBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2, {
    idle: { status: "ready", token: motion },
    speaking: { status: "ready", token: motion },
    listening: { status: "missing", token: null },
  }));

  assert.equal(core.snapshot().state, "live");
  assert.equal(backend.motionLoads, 1);
  assert.deepEqual(messages.slice(-3).map((entry) => entry.type), ["motion_status", "motion_status", "motion_status"]);
  assert.equal(messages.some((entry) => entry.type === "failed"), false);

  backend.resolveMotion();
  await backend.motionSettled;
  await new Promise<void>((resolve) => setImmediate(resolve));
  const statuses = messages.filter((entry) => entry.type === "motion_status");
  assert.equal(statuses.length, 6);
  assert.equal(statuses.filter((entry) => (entry.payload as { status: string }).status === "ready").length, 2);
  assert.equal(backend.replacedMotions, 1);
});

test("profile motion deadline is nonterminal and classifies every pending role as timed out", async () => {
  const backend = new PendingMotionBackend();
  const scheduler = new FakeScheduler();
  const timeout = new FakeLoadTimeoutScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)), {
    motionTimeoutMilliseconds: 100,
    profileMotionTimeoutMilliseconds: 60,
    motionTimeoutScheduler: timeout,
  });

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2, {
    idle: { status: "ready", token: motion },
    speaking: { status: "ready", token: motion },
  }));
  assert.equal(core.snapshot().state, "live");
  assert.equal(timeout.pending, 2);

  timeout.run();
  await new Promise<void>((resolve) => setImmediate(resolve));
  const statuses = messages.filter((entry) => entry.type === "motion_status");
  const timedOut = statuses.filter((entry) => (entry.payload as { status: string }).status === "timed_out");
  assert.equal(timedOut.length, 2);
  for (const entry of timedOut) {
    assert.deepEqual(entry.payload, {
      profile_revision: 1,
      model_token: model,
      motion_token: motion,
      role: (entry.payload as { role: string }).role,
      status: "timed_out",
      motion_code: "motion_load_timeout",
    });
  }
  assert.equal(core.snapshot().state, "live");
  assert.equal(messages.some((entry) => entry.type === "failed"), false);
});

test("runtime motion faults fan out nonterminal role status without failing the renderer", async () => {
  const backend = new FakeBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2, {
    idle: { status: "ready", token: motion },
  }));
  backend.emitMotionFault();

  const runtimeFailures = messages.filter((entry) => (
    entry.type === "motion_status"
    && (entry.payload as { status: string }).status === "runtime_failed"
  ));
  assert.equal(runtimeFailures.length, 1);
  assert.equal((runtimeFailures[0]?.payload as { role: string }).role, "idle");
  assert.equal(core.snapshot().state, "live");
  assert.equal(messages.some((entry) => entry.type === "failed"), false);
});

test("disposing a profile cancels motion work without status and disposes a late result", async () => {
  const backend = new LateMotionBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2, { idle: { status: "ready", token: motion } }));
  const beforeDispose = messages.length;
  await core.accept(command(3, "dispose", { reason: "operator" }));
  backend.resolveMotion();
  await new Promise<void>((resolve) => setImmediate(resolve));

  assert.deepEqual(messages.slice(beforeDispose).map((entry) => entry.type), ["disposed"]);
  assert.equal(backend.discarded, 1);
  assert.equal(core.snapshot().state, "disposed");
});

test("suspended profile motion completion commits without advancing clocks", async () => {
  const backend = new AsyncMotionBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2, { idle: { status: "ready", token: motion } }));
  await core.accept(command(3, "set_visibility", { visibility: "hidden" }));
  const suspendedCounters = core.snapshot().counters;

  backend.resolveMotion();
  await backend.motionSettled;
  await new Promise<void>((resolve) => setImmediate(resolve));

  assert.equal(core.snapshot().state, "suspended");
  assert.deepEqual(core.snapshot().counters, suspendedCounters);
  assert.equal(backend.replacedMotions, 1);
  assert.equal(backend.discarded, 0);
  assert.equal(messages.filter((entry) => (
    entry.type === "motion_status"
    && (entry.payload as { status: string }).status === "ready"
  )).length, 1);
  assert.equal(messages.some((entry) => entry.type === "failed"), false);
});

test("late motion success after per-motion timeout is discarded exactly once", async () => {
  const backend = new LateMotionBackend();
  const scheduler = new FakeScheduler();
  const timeout = new FakeLoadTimeoutScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)), {
    motionTimeoutMilliseconds: 25,
    profileMotionTimeoutMilliseconds: 100,
    motionTimeoutScheduler: timeout,
  });

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2, { idle: { status: "ready", token: motion } }));
  assert.equal(timeout.pending, 2);

  timeout.runLatest();
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(messages.filter((entry) => (
    entry.type === "motion_status"
    && (entry.payload as { status: string }).status === "timed_out"
  )).length, 1);

  backend.resolveMotion();
  await new Promise<void>((resolve) => setImmediate(resolve));

  assert.equal(backend.discarded, 1);
  assert.equal(core.snapshot().state, "live");
  assert.equal(messages.some((entry) => entry.type === "failed"), false);
});

test("stale motion output racing renderer disposal is discarded exactly once", async () => {
  const backend = new StaleMotionBackend();
  const scheduler = new FakeScheduler();
  const messages: Array<Record<string, unknown>> = [];
  const core = new WebRendererCore(session, backend, scheduler, (value) => messages.push(JSON.parse(value)));
  backend.core = core;

  core.start();
  await core.accept(command(1, "configure", { profile: "lightweight", reduced_motion: false, mouth_cues_enabled: true }));
  await core.accept(loadProfileCommand(2, { idle: { status: "ready", token: motion } }));
  await new Promise<void>((resolve) => setImmediate(resolve));

  assert.equal(backend.discarded, 1);
  assert.equal(core.snapshot().state, "disposed");
  assert.equal(messages.filter((entry) => entry.type === "motion_status").length, 5);
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
  readonly events: string[] = [];
  readonly applyCauses: Array<{ type: string; causedBySequence: number | null }> = [];
  readonly appliedEffects: PresentationEffect[] = [];
  readonly configurations: RendererPolicy[] = [];
  private motionFaultHandler: ((fault: MotionFault) => void) | undefined;
  private motionActiveHandler: ((event: MotionActiveEvent) => void) | undefined;
  configure(policy: RendererPolicy): void {
    this.configurations.push(policy);
    this.events.push(`configure:${policy.reducedMotion}/${policy.mouthCuesEnabled}`);
  }
  async loadModel(url: string, _signal: AbortSignal) {
    this.loadedURL = url;
    return { capabilities: { aa: true, look_at: true, spring_bone: true, mtoon_materials: 2 } };
  }
  async loadMotion(input: { motionToken: string }): Promise<{ motionToken: string; clip: THREE.AnimationClip }> {
    return { motionToken: input.motionToken, clip: new THREE.AnimationClip("motion", 1, []) };
  }
  replaceMotions(): void {}
  renderOnce() {
    this.firstFrameProofs += 1;
    return { viewport_width: 800, viewport_height: 600, visible_meshes: 1, decoded_textures: 2, material_bindings: 2, alpha_probe_pixels: 5 };
  }
  renderFrame(): void { this.events.push("render"); this.frameRenders += 1; }
  update(delta: number): void { this.events.push(`update:${delta}`); }
  apply(effect: PresentationEffect, causedBySequence?: number): void {
    this.events.push(`apply:${effect.type}`);
    this.appliedEffects.push(effect);
    this.applyCauses.push({ type: effect.type, causedBySequence: causedBySequence ?? null });
  }
  setSuspended(suspended: boolean): void { this.events.push(`setSuspended:${suspended}`); }
  setMotionFaultHandler(handler: (fault: MotionFault) => void): void {
    this.motionFaultHandler = handler;
  }
  setMotionActiveHandler(handler: (event: MotionActiveEvent) => void): void {
    this.motionActiveHandler = handler;
  }
  emitMotionFault(): void {
    this.motionFaultHandler?.({
      sessionID: session,
      profileRevision: 1,
      modelToken: model,
      generation: 1,
      motionToken: motion,
      code: "motion_runtime_failed",
      causedBySequence: null,
    });
  }
  emitMotionActive(causedBySequence: number | null): void {
    this.motionActiveHandler?.({
      sessionID: session,
      profileRevision: 1,
      modelToken: model,
      generation: 1,
      motionToken: null,
      role: null,
      mode: "rest",
      causedBySequence,
    });
  }
  startClock(): void {}
  stopClock(): void {}
  dispose(): void { this.disposals += 1; }
}

class PendingBackend extends FakeBackend {
  aborted = false;

  override loadModel(url: string, signal: AbortSignal): Promise<Awaited<ReturnType<FakeBackend["loadModel"]>>> {
    this.loadedURL = url;
    return new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => {
        this.aborted = true;
        reject(new DOMException("aborted", "AbortError"));
      }, { once: true });
    });
  }
}

class EnrichedCapabilitiesBackend extends FakeBackend {
  override async loadModel(url: string, _signal: AbortSignal): Promise<Awaited<ReturnType<FakeBackend["loadModel"]>>> {
    this.loadedURL = url;
    return {
      capabilities: {
        aa: true,
        look_at: true,
        spring_bone: true,
        mtoon_materials: 2,
        vowels: { aa: true, ih: false, ou: true, ee: false, oh: false },
      },
    };
  }
}

class AsyncMotionBackend extends FakeBackend {
  motionLoads = 0;
  replacedMotions = 0;
  discarded = 0;
  private resolveCurrent: (() => void) | null = null;
  motionSettled: Promise<void> = Promise.resolve();

  override loadMotion(input: { motionToken: string }): Promise<{ motionToken: string; clip: THREE.AnimationClip }> {
    this.motionLoads += 1;
    this.motionSettled = new Promise<void>((resolve) => {
      this.resolveCurrent = resolve;
    });
    return this.motionSettled.then(() => ({ motionToken: input.motionToken, clip: new THREE.AnimationClip("motion", 1, []) }));
  }

  override replaceMotions(): void {
    this.replacedMotions += 1;
  }

  override discardMotion(): void {
    this.discarded += 1;
  }

  resolveMotion(): void {
    this.resolveCurrent?.();
    this.resolveCurrent = null;
  }
}

class PendingMotionBackend extends FakeBackend {
  override loadMotion(_input: { motionToken: string }, _signal: AbortSignal): Promise<{ motionToken: string; clip: THREE.AnimationClip }> {
    return new Promise(() => {});
  }
}

class LateMotionBackend extends FakeBackend {
  discarded = 0;
  private resolveCurrent: (() => void) | null = null;

  override loadMotion(input: { motionToken: string }): Promise<{ motionToken: string; clip: THREE.AnimationClip }> {
    return new Promise((resolve) => {
      this.resolveCurrent = () => resolve({ motionToken: input.motionToken, clip: new THREE.AnimationClip("late", 1, []) });
    });
  }

  override discardMotion(): void {
    this.discarded += 1;
  }

  resolveMotion(): void {
    this.resolveCurrent?.();
    this.resolveCurrent = null;
  }
}

class StaleMotionBackend extends FakeBackend {
  core: WebRendererCore | null = null;
  discarded = 0;

  override loadMotion(input: { motionToken: string }): Promise<{ motionToken: string; clip: THREE.AnimationClip }> {
    queueMicrotask(() => this.core?.contextLost());
    return Promise.resolve({ motionToken: input.motionToken, clip: new THREE.AnimationClip("stale", 1, []) });
  }

  override discardMotion(): void {
    this.discarded += 1;
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
  runLatest(): void {
    const entries = [...this.callbacks.entries()];
    const entry = entries.at(-1);
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
