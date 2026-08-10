import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import {
  MotionController,
  type MotionActiveEvent,
  type MotionFault,
  type MotionMixerLike,
  type MotionActionLike,
  type MotionProjection,
  type MotionRegistryInput,
} from "../src/motion-controller.js";
import type { AvatarMotionRole, PresentationPhase } from "../src/contract.js";

const sessionID = "11111111-1111-4111-8111-111111111111";
const modelToken = "22222222-2222-4222-8222-222222222222";
const replacementModelToken = "55555555-5555-4555-8555-555555555555";

test("an already-configured Reduced Motion policy suppresses the first projection", () => {
  const harness = new ControllerHarness(undefined, undefined, true);
  harness.replaceAll();

  harness.project("speaking");

  assert.equal(harness.action("speaking").playCalls, 0);
  assert.equal(harness.activeEvents.length, 0);
});

test("routes every presentation phase through the six semantic roles", () => {
  const harness = new ControllerHarness();
  harness.replaceAll();

  const cases: Array<[PresentationPhase, AvatarMotionRole, "loop" | "one_shot"]> = [
    ["idle", "idle", "loop"],
    ["listening", "listening", "loop"],
    ["transcribing", "listening", "loop"],
    ["thinking", "thinking", "loop"],
    ["responding", "thinking", "loop"],
    ["speaking", "speaking", "loop"],
    ["stopped", "idle", "loop"],
    ["succeeded", "success", "one_shot"],
    ["failed", "failure", "one_shot"],
  ];

  for (const [phase, role, mode] of cases) {
    harness.project(phase);
    const active = harness.latestActive();
    assert.equal(active?.role, role, phase);
    assert.equal(active?.mode, mode, phase);
  }
});

test("steady loops are idempotent and transition with the exact 200 ms fade", () => {
  const harness = new ControllerHarness();
  harness.replaceAll();
  harness.project("idle");
  const idle = harness.action("idle");
  harness.project("idle");
  harness.project("listening");
  const listening = harness.action("listening");

  assert.equal(idle.playCalls, 1);
  assert.equal(idle.resetCalls, 1);
  assert.equal(listening.loopModes.at(-1)?.mode, THREE.LoopRepeat);
  assert.deepEqual(idle.fadeOutDurations, [0.2]);
  assert.deepEqual(listening.fadeInDurations, [0.2]);
  assert.equal(harness.latestActive()?.mode, "loop");
});

test("terminal gestures use LoopOnce, clamp, exact 120 ms, and return to latest steady", async () => {
  const harness = new ControllerHarness();
  harness.replaceAll();
  harness.project("speaking");
  harness.project("succeeded");
  const success = harness.action("success");
  assert.deepEqual(harness.action("speaking").fadeOutDurations, [0.12]);

  assert.equal(success.loopModes.at(-1)?.mode, THREE.LoopOnce);
  assert.equal(success.loopModes.at(-1)?.repetitions, 1);
  assert.equal(success.clampWhenFinished, true);
  assert.deepEqual(success.fadeInDurations, [0.12]);
  harness.project("listening");
  harness.finish(success);
  await Promise.resolve();

  assert.equal(harness.latestActive()?.role, "listening");
  assert.equal(harness.latestActive()?.mode, "loop");
  assert.equal(harness.action("listening").loopModes.at(-1)?.mode, THREE.LoopRepeat);
  assert.equal(harness.action("listening").resetCalls, 1);
});

test("newer steady requests interrupt terminals and stale finished callbacks do nothing", () => {
  const harness = new ControllerHarness();
  harness.replaceAll();
  harness.project("succeeded");
  const success = harness.action("success");
  harness.project("thinking");
  const eventCount = harness.activeEvents.length;
  harness.finish(success);

  assert.equal(harness.latestActive()?.role, "thinking");
  assert.equal(harness.activeEvents.length, eventCount);
  assert.deepEqual(success.fadeOutDurations, [0.2]);
});

test("same-action terminal restarts fence an early finished callback", async () => {
  const harness = new ControllerHarness();
  harness.replaceAll({ success: "shared", idle: "shared" });
  harness.project("succeeded");
  const success = harness.action("shared");
  harness.project("succeeded");
  harness.finish(success, 0);

  assert.equal(harness.latestActive()?.mode, "one_shot");
  harness.finish(success);
  await Promise.resolve();
  assert.equal(harness.latestActive()?.role, "idle");
});

test("shared terminal tokens still report a semantic success-to-failure role change", () => {
  const harness = new ControllerHarness();
  harness.replaceAll({ success: "shared", failure: "shared" });

  harness.project("succeeded");
  harness.project("failed");

  assert.deepEqual(harness.activeEvents.map((event) => event.role), ["success", "failure"]);
});

test("missing steady and terminal bindings fall back to idle or normalized rest", () => {
  const resetCalls: string[] = [];
  const harness = new ControllerHarness(() => resetCalls.push("rest"));
  harness.replaceAll({
    idle: null,
    listening: null,
    success: null,
    failure: null,
  });
  harness.project("listening");
  assert.equal(harness.latestActive()?.mode, "rest");
  assert.deepEqual(resetCalls, ["rest"]);
  harness.project("succeeded");
  assert.equal(harness.latestActive()?.mode, "rest");

  const fallback = new ControllerHarness();
  fallback.replaceAll({ success: null });
  fallback.project("succeeded");
  assert.equal(fallback.latestActive()?.role, "idle");
  assert.equal(fallback.latestActive()?.mode, "loop");
});

test("shared tokens create one action and change mode without self-crossfading", async () => {
  const harness = new ControllerHarness();
  harness.replaceAll({ idle: "shared", listening: "shared", success: "shared" });
  harness.project("idle");
  harness.project("listening");
  const shared = harness.action("shared");
  assert.equal(harness.mixer.clipActionCalls, 4);
  assert.equal(shared.playCalls, 1);
  assert.equal(shared.fadeInDurations.length, 0);
  assert.equal(shared.fadeOutDurations.length, 0);

  harness.project("succeeded");
  assert.equal(shared.loopModes.at(-1)?.mode, THREE.LoopOnce);
  assert.equal(shared.resetCalls, 2);
  const terminalPlayCalls = shared.playCalls;
  harness.project("succeeded");
  assert.equal(shared.playCalls, terminalPlayCalls + 1);
  harness.finish(shared);
  await Promise.resolve();
  assert.equal(shared.loopModes.at(-1)?.mode, THREE.LoopRepeat);
  assert.equal(shared.resetCalls, 4);
});

test("session, model, generation, profile, motion, and projection identities fence work", () => {
  const harness = new ControllerHarness();
  harness.replaceAll();
  harness.project("idle");
  const before = harness.activeEvents.length;
  harness.controller.project({
    ...harness.identity,
    sessionID: "99999999-9999-4999-8999-999999999999",
    projectionSequence: 2,
    phase: "speaking",
    generationID: null,
    causedBySequence: 2,
  });
  harness.controller.project({
    ...harness.identity,
    modelToken: replacementModelToken,
    projectionSequence: 2,
    phase: "speaking",
    generationID: null,
    causedBySequence: 2,
  });
  harness.controller.project({
    ...harness.identity,
    generation: 2,
    projectionSequence: 2,
    phase: "speaking",
    generationID: null,
    causedBySequence: 2,
  });
  harness.controller.project({
    ...harness.identity,
    profileRevision: 2,
    projectionSequence: 2,
    phase: "speaking",
    generationID: null,
    causedBySequence: 2,
  });
  harness.controller.project({
    ...harness.identity,
    projectionSequence: 1,
    phase: "speaking",
    generationID: null,
    causedBySequence: 1,
  });
  assert.equal(harness.activeEvents.length, before);

  const staleAction = harness.action("idle");
  harness.replaceAll({ idle: "replacement-idle" });
  harness.project("idle");
  const afterReplacement = harness.activeEvents.length;
  harness.finish(staleAction);
  assert.equal(harness.activeEvents.length, afterReplacement);
});

test("mixer faults attribute only the controller-owned crossfade source and target", () => {
  const faults: MotionFault[] = [];
  const harness = new ControllerHarness(undefined, (fault) => faults.push(fault));
  harness.replaceAll();
  harness.project("speaking");
  harness.project("listening");

  // Three.js actions can report an effective weight of one before the
  // controller has explicitly stopped them. Those inactive registry actions
  // must not become fault participants.
  for (const token of ["idle", "thinking", "success", "failure"]) {
    harness.action(token).weight = 1;
  }
  harness.mixer.throwOnUpdate = true;
  harness.controller.update(0.05);

  assert.deepEqual(
    new Set(faults.map((fault) => fault.motionToken)),
    new Set(["speaking", "listening"]),
  );
  assert.equal(faults.some((fault) => fault.motionToken === "idle"), false);
  assert.equal(faults.some((fault) => fault.motionToken === "thinking"), false);
});

test("reduced motion and suspension stop advancement and resume with zero delta", () => {
  const harness = new ControllerHarness();
  harness.replaceAll();
  harness.project("idle");
  harness.controller.update(0.25);
  harness.controller.setSuspended(true);
  harness.controller.update(9);
  harness.controller.setSuspended(false);
  harness.controller.update(0);
  harness.controller.setReducedMotion(true);
  harness.controller.update(9);

  assert.deepEqual(harness.mixer.updates, [0.25, 0]);
  assert.deepEqual(harness.resetCalls, ["rest", "rest"]);
  harness.controller.setReducedMotion(false);
  const stopCountBeforeDispose = harness.mixer.stopAllActionCalls;
  harness.controller.dispose();
  harness.controller.dispose();
  assert.equal(harness.mixer.listenerCount, 0);
  assert.equal(harness.mixer.stopAllActionCalls, stopCountBeforeDispose + 1);
  assert.equal(harness.mixer.uncacheRootCalls, 2);
});

test("equal-sequence reconciliation replaces a stale suspended projection before resume", () => {
  const harness = new ControllerHarness();
  harness.replaceAll();
  harness.project("speaking");
  harness.controller.setSuspended(true);

  harness.controller.project({
    ...harness.identity,
    projectionSequence: 1,
    phase: "idle",
    generationID: null,
    isReconciliation: true,
    causedBySequence: null,
  });
  harness.controller.setSuspended(false);

  assert.equal(harness.latestActive()?.role, "idle");
  assert.equal(harness.action("speaking").playCalls, 1);
});

test("rest is not announced before the first projection has an identity", () => {
  const harness = new ControllerHarness();
  harness.replaceAll();

  harness.controller.setReducedMotion(true);

  assert.equal(harness.activeEvents.length, 0);
});

test("action and mixer faults report each participating token once and remain nonterminal", () => {
  const faults: MotionFault[] = [];
  const harness = new ControllerHarness(undefined, (fault) => faults.push(fault));
  harness.replaceAll();
  harness.project("idle");
  harness.action("idle").throwOnPlay = true;
  harness.project("listening");
  harness.project("idle");
  assert.deepEqual(faults.map((fault) => fault.motionToken), ["idle"]);

  harness.project("listening");
  harness.project("thinking");
  harness.mixer.throwOnUpdate = true;
  harness.controller.update(0.1);
  harness.controller.update(0.1);
  assert.deepEqual(new Set(faults.map((fault) => fault.motionToken)), new Set(["idle", "listening", "thinking"]));
  assert.equal(harness.latestActive()?.mode, "rest");
});

class ControllerHarness {
  readonly mixer = new FakeMixer();
  readonly identity = {
    sessionID,
    profileRevision: 1,
    modelToken,
    generation: 1,
  };
  readonly controller: MotionController;
  readonly activeEvents: MotionActiveEvent[] = [];
  readonly resetCalls: string[] = [];
  private projectionSequence = 0;

  constructor(
    resetNormalizedPose?: () => void,
    onFault?: (fault: MotionFault) => void,
    initialReducedMotion = false,
  ) {
    this.controller = new MotionController(Object.assign({
      mixer: this.mixer,
      root: new THREE.Group(),
      resetNormalizedPose: resetNormalizedPose ?? (() => this.resetCalls.push("rest")),
      onActive: (event) => this.activeEvents.push(event),
      onFault,
    }, initialReducedMotion ? { initialReducedMotion: true } : {}));
  }

  replaceAll(overrides: Partial<Record<AvatarMotionRole, string | null>> = {}): void {
    const tokens: Record<AvatarMotionRole, string | null> = {
      idle: "idle",
      listening: "listening",
      thinking: "thinking",
      speaking: "speaking",
      success: "success",
      failure: "failure",
      ...overrides,
    };
    const clips = new Map<string, THREE.AnimationClip>();
    const motions = new Map<AvatarMotionRole, { motionToken: string; clip: THREE.AnimationClip }>();
    for (const [role, token] of Object.entries(tokens) as Array<[AvatarMotionRole, string | null]>) {
      if (token === null) continue;
      const clip = clips.get(token) ?? new THREE.AnimationClip(token, 1, []);
      clips.set(token, clip);
      motions.set(role, { motionToken: token, clip });
    }
    const input: MotionRegistryInput = { ...this.identity, motions };
    this.controller.replaceRegistry(input);
  }

  project(phase: PresentationPhase): void {
    const sequence = ++this.projectionSequence;
    const projection: MotionProjection = {
      ...this.identity,
      projectionSequence: sequence,
      phase,
      generationID: null,
      causedBySequence: sequence,
    };
    this.controller.project(projection);
  }

  action(token: string): FakeAction { return this.mixer.actions.get(token)!; }

  latestActive(): MotionActiveEvent | undefined { return this.activeEvents.at(-1); }

  finish(action: FakeAction, time = action.getClip().duration): void {
    action.time = time;
    this.mixer.emitFinished(action);
  }
}

class FakeAction implements MotionActionLike {
  readonly clip: THREE.AnimationClip;
  clampWhenFinished = false;
  enabled = true;
  time = 0;
  weight = 0;
  playCalls = 0;
  stopCalls = 0;
  resetCalls = 0;
  fadeInDurations: number[] = [];
  fadeOutDurations: number[] = [];
  loopModes: Array<{ mode: number; repetitions: number }> = [];
  throwOnPlay = false;

  constructor(clip: THREE.AnimationClip) { this.clip = clip; }
  play(): this {
    if (this.throwOnPlay) throw new Error("action play failed");
    this.playCalls += 1;
    this.weight = 1;
    return this;
  }
  stop(): this { this.stopCalls += 1; this.weight = 0; return this; }
  reset(): this { this.resetCalls += 1; return this; }
  setLoop(mode: number, repetitions: number): this {
    this.loopModes.push({ mode, repetitions });
    return this;
  }
  fadeIn(duration: number): this { this.fadeInDurations.push(duration); return this; }
  fadeOut(duration: number): this { this.fadeOutDurations.push(duration); return this; }
  getClip(): THREE.AnimationClip { return this.clip; }
}

class FakeMixer implements MotionMixerLike {
  readonly actions = new Map<string, FakeAction>();
  readonly updates: number[] = [];
  clipActionCalls = 0;
  stopAllActionCalls = 0;
  uncacheRootCalls = 0;
  throwOnUpdate = false;
  private listener: ((event: { type: "finished"; action: FakeAction }) => void) | null = null;

  get listenerCount(): number { return this.listener ? 1 : 0; }

  clipAction(clip: THREE.AnimationClip): FakeAction {
    this.clipActionCalls += 1;
    const action = this.actions.get(clip.name) ?? new FakeAction(clip);
    this.actions.set(clip.name, action);
    return action;
  }
  addEventListener(_type: "finished", listener: (event: { type: "finished"; action: FakeAction }) => void): this {
    this.listener = listener;
    return this;
  }
  removeEventListener(_type: "finished", _listener: unknown): this { this.listener = null; return this; }
  update(delta: number): this {
    if (this.throwOnUpdate) throw new Error("mixer update failed");
    this.updates.push(delta);
    return this;
  }
  stopAllAction(): this { this.stopAllActionCalls += 1; return this; }
  uncacheAction(): void {}
  uncacheClip(): void {}
  uncacheRoot(): void { this.uncacheRootCalls += 1; }
  emitFinished(action: FakeAction): void { this.listener?.({ type: "finished", action }); }
}
