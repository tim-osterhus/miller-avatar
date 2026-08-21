import * as THREE from "three";
import {
  type AvatarMotionRole,
  type MotionActiveMode,
  type PresentationPhase,
} from "./contract.js";
import type { ConvertedMotion } from "./motion-loader.js";

export interface MotionRuntimeIdentity {
  readonly sessionID: string;
  readonly profileRevision: number;
  readonly modelToken: string;
  readonly generation: number;
}

export interface MotionRegistryInput extends MotionRuntimeIdentity {
  readonly motions: ReadonlyMap<AvatarMotionRole, ConvertedMotion>;
}

export interface MotionProjection extends MotionRuntimeIdentity {
  readonly projectionSequence: number;
  readonly phase: PresentationPhase;
  readonly generationID: string | null;
  readonly playbackID?: string | null;
  readonly isReconciliation?: boolean;
  readonly causedBySequence: number | null;
}

export interface MotionActiveEvent extends MotionRuntimeIdentity {
  readonly motionToken: string | null;
  readonly role: AvatarMotionRole | null;
  readonly mode: MotionActiveMode;
  readonly causedBySequence: number | null;
}

export interface MotionFault extends MotionRuntimeIdentity {
  readonly motionToken: string;
  readonly code: "motion_runtime_failed";
  readonly causedBySequence: number | null;
}

export interface MotionActionLike {
  clampWhenFinished: boolean;
  enabled: boolean;
  paused?: boolean;
  time?: number;
  weight?: number;
  play(): MotionActionLike;
  stop(): MotionActionLike;
  reset(): MotionActionLike;
  setLoop(mode: number, repetitions: number): MotionActionLike;
  fadeIn(duration: number): MotionActionLike;
  fadeOut(duration: number): MotionActionLike;
  getClip(): THREE.AnimationClip;
  getEffectiveWeight?(): number;
}

export interface MotionMixerEvent {
  readonly type: "finished";
  readonly action: MotionActionLike;
}

export interface MotionMixerLike {
  clipAction(clip: THREE.AnimationClip, root?: THREE.Object3D): MotionActionLike;
  update(deltaSeconds: number): MotionMixerLike;
  stopAllAction(): MotionMixerLike;
  uncacheAction?(clip: THREE.AnimationClip, root?: THREE.Object3D): void;
  uncacheClip?(clip: THREE.AnimationClip): void;
  uncacheRoot?(root: THREE.Object3D): void;
  addEventListener(type: "finished", listener: (event: MotionMixerEvent) => void): unknown;
  removeEventListener(type: "finished", listener: (event: MotionMixerEvent) => void): unknown;
}

export interface MotionControllerOptions {
  readonly mixer: MotionMixerLike;
  readonly root: THREE.Object3D;
  readonly resetNormalizedPose: () => void;
  readonly initialReducedMotion?: boolean;
  readonly onActive?: (event: MotionActiveEvent) => void;
  readonly onFault?: (fault: MotionFault) => void;
}

type SteadyRole = "idle" | "listening" | "thinking" | "speaking";
type ActiveState = {
  readonly token: string;
  readonly role: AvatarMotionRole;
  readonly mode: "loop" | "one_shot";
  readonly action: MotionActionLike;
} | { readonly role: null; readonly mode: "rest"; readonly token: null };

interface ActionRecord {
  readonly key: string;
  readonly token: string;
  readonly clip: THREE.AnimationClip;
  readonly action: MotionActionLike;
}

interface TransitionState {
  readonly source: ActionRecord;
  readonly target: ActionRecord;
  remainingSeconds: number;
}

/**
 * The semantic router is deliberately a six-role controller. It has no
 * graph, script, priority, or user-defined edge surface.
 */
export class MotionController {
  private readonly mixer: MotionMixerLike;
  private readonly root: THREE.Object3D;
  private readonly resetNormalizedPose: () => void;
  private readonly onActive?: (event: MotionActiveEvent) => void;
  private readonly onFault?: (fault: MotionFault) => void;
  private readonly finishedListener = (event: MotionMixerEvent) => this.finished(event);
  private readonly actions = new Map<string, ActionRecord>();
  private readonly roleRecords = new Map<AvatarMotionRole, ActionRecord>();
  private readonly failedTokens = new Set<string>();
  private identity: MotionRuntimeIdentity | null = null;
  private active: ActiveState = { role: null, mode: "rest", token: null };
  private latestProjection: MotionProjection | null = null;
  private desiredSteadyRole: SteadyRole = "idle";
  private lastActiveSignature: string | null = null;
  private transition: TransitionState | null = null;
  private suspended = false;
  private reducedMotion: boolean;
  private disposed = false;
  private completionGeneration = 0;

  constructor(options: MotionControllerOptions) {
    this.mixer = options.mixer;
    this.root = options.root;
    this.resetNormalizedPose = options.resetNormalizedPose;
    this.reducedMotion = options.initialReducedMotion ?? false;
    this.onActive = options.onActive;
    this.onFault = options.onFault;
    this.mixer.addEventListener("finished", this.finishedListener);
  }

  replaceRegistry(input: MotionRegistryInput): void {
    if (this.disposed) return;
    this.clearActions();
    this.identity = {
      sessionID: input.sessionID,
      profileRevision: input.profileRevision,
      modelToken: input.modelToken,
      generation: input.generation,
    };
    this.latestProjection = null;
    this.desiredSteadyRole = "idle";
    this.failedTokens.clear();
    this.roleRecords.clear();
    this.active = { role: null, mode: "rest", token: null };
    this.lastActiveSignature = null;

    for (const role of ["idle", "listening", "thinking", "speaking", "success", "failure"] as const) {
      const motion = input.motions.get(role);
      if (!motion) continue;
      const steady = isSteadyRole(role);
      const clip = steady ? (motion.steadyClip ?? motion.clip) : motion.clip;
      const key = actionKey(motion.motionToken, steady ? "steady" : "terminal");
      const existing = this.actions.get(key)
        ?? [...this.actions.values()].find((record) => (
          record.token === motion.motionToken && record.clip === clip
        ));
      if (existing) {
        this.roleRecords.set(role, existing);
        continue;
      }
      try {
        const action = this.mixer.clipAction(clip, this.root);
        const record = {
          key,
          token: motion.motionToken,
          clip,
          action,
        };
        this.actions.set(key, record);
        this.roleRecords.set(role, record);
      } catch {
        this.reportFault(motion.motionToken);
      }
    }
  }

  project(input: MotionProjection): void {
    if (this.disposed || !this.matchesIdentity(input)) return;
    const latestProjection = this.latestProjection;
    if (!Number.isSafeInteger(input.projectionSequence)
      || input.projectionSequence < 1
      || input.projectionSequence < (latestProjection?.projectionSequence ?? 0)
      || (latestProjection !== null
        && input.projectionSequence === latestProjection.projectionSequence
        && (!input.isReconciliation || this.sameProjection(input, latestProjection)))) {
      return;
    }
    this.latestProjection = input;
    switch (input.phase) {
      case "succeeded":
        this.desiredSteadyRole = "idle";
        this.activateTerminal("success", input.causedBySequence);
        return;
      case "failed":
        this.desiredSteadyRole = "idle";
        this.activateTerminal("failure", input.causedBySequence);
        return;
      case "idle":
      case "listening":
      case "transcribing":
      case "thinking":
      case "responding":
      case "speaking":
      case "stopped":
        this.desiredSteadyRole = steadyRoleFor(input.phase);
        this.activateSteady(this.desiredSteadyRole, input.causedBySequence);
        return;
    }
  }

  update(deltaSeconds: number): void {
    if (this.disposed || this.suspended || this.reducedMotion) return;
    if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) return;
    const participating = this.participatingActions();
    try {
      this.mixer.update(deltaSeconds);
      this.advanceTransition(deltaSeconds);
    } catch {
      this.transition = null;
      for (const record of participating) this.reportFault(record.token);
      this.fallbackAfterFault();
    }
  }

  setSuspended(suspended: boolean): void {
    if (this.disposed || suspended === this.suspended) return;
    this.suspended = suspended;
    if (suspended) {
      this.clearTransition(true);
      this.stopActiveAction();
      try {
        this.mixer.stopAllAction();
      } catch {
        // Suspension remains nonterminal even if mixer cleanup is unavailable.
      }
      this.active = { role: null, mode: "rest", token: null };
      this.completionGeneration += 1;
      this.resetRestPose();
      this.emitActive(
        null,
        "rest",
        this.latestProjection?.causedBySequence ?? null,
      );
      return;
    }
    this.reconcileLatestProjection();
  }

  setReducedMotion(enabled: boolean): void {
    if (this.disposed || enabled === this.reducedMotion) return;
    this.reducedMotion = enabled;
    if (enabled) {
      this.clearTransition(true);
      this.stopActiveAction();
      try {
        this.mixer.stopAllAction();
      } catch {
        // Reduced Motion remains nonterminal even if mixer cleanup is unavailable.
      }
      this.active = { role: null, mode: "rest", token: null };
      this.completionGeneration += 1;
      this.resetRestPose();
      this.emitActive(
        null,
        "rest",
        this.latestProjection?.causedBySequence ?? null,
      );
      return;
    }
    this.reconcileLatestProjection();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.completionGeneration += 1;
    try {
      this.mixer.removeEventListener("finished", this.finishedListener);
    } catch {
      // Cleanup is best-effort and must remain idempotent.
    }
    this.clearTransition(true);
    this.stopActiveAction();
    try {
      this.mixer.stopAllAction();
    } catch {
      // Cleanup is best-effort and must remain idempotent.
    }
    for (const record of this.actions.values()) this.uncache(record);
    try {
      this.mixer.uncacheRoot?.(this.root);
    } catch {
      // Cleanup is best-effort and must remain idempotent.
    }
    this.actions.clear();
    this.roleRecords.clear();
    this.identity = null;
    this.latestProjection = null;
    this.active = { role: null, mode: "rest", token: null };
  }

  private activateSteady(role: SteadyRole, causedBySequence: number | null): void {
    if (this.reducedMotion || this.suspended || this.disposed) return;
    const targetRole = this.resolveSteadyRole(role);
    const target = targetRole === null ? null : this.recordForRole(targetRole);
    if (!target) {
      this.enterRest(causedBySequence);
      return;
    }
    const resolvedRole = targetRole as SteadyRole;

    if (this.active.mode === "loop"
      && this.active.token === target.token
      && this.active.role === resolvedRole) {
      return;
    }

    if (this.active.mode === "loop" && this.active.token === target.token) {
      this.clearTransition(true);
      this.active = {
        token: target.token,
        role: resolvedRole,
        mode: "loop",
        action: target.action,
      };
      this.emitActive(target.token, "loop", causedBySequence, resolvedRole);
      return;
    }

    const source = this.active.mode === "rest" ? null : this.recordForActive();
    const modeChangedSameAction = this.active.mode === "one_shot"
      && source === target;
    if (modeChangedSameAction) {
      this.clearTransition(true);
      if (!this.configureAndPlay(target, "loop")) {
        this.fallbackAfterFault(causedBySequence);
        return;
      }
      this.completionGeneration += 1;
      this.active = {
        token: target.token,
        role: resolvedRole,
        mode: "loop",
        action: target.action,
      };
      this.emitActive(target.token, "loop", causedBySequence, resolvedRole);
      return;
    }

    this.clearTransition(true);
    if (!this.configureAndPlay(target, "loop")) {
      this.fallbackAfterFault(causedBySequence);
      return;
    }
    if (source && source !== target) {
      if (!this.safeFadeOut(source, 0.2) || !this.safeFadeIn(target, 0.2)) {
        this.fallbackAfterFault(causedBySequence);
        return;
      }
      this.transition = {
        source,
        target,
        remainingSeconds: 0.2,
      };
    }
    this.completionGeneration += 1;
    this.active = {
      token: target.token,
      role: resolvedRole,
      mode: "loop",
      action: target.action,
    };
    this.emitActive(target.token, "loop", causedBySequence, resolvedRole);
  }

  private activateTerminal(role: "success" | "failure", causedBySequence: number | null): void {
    if (this.reducedMotion || this.suspended || this.disposed) return;
    const target = this.recordForRole(role);
    if (!target) {
      this.activateSteady(this.desiredSteadyRole, causedBySequence);
      return;
    }

    const source = this.active.mode === "rest" ? null : this.recordForActive();
    const restartingSameAction = this.active.mode === "one_shot" && source === target;
    this.clearTransition(true);
    if (!this.configureAndPlay(target, "one_shot")) {
      this.fallbackAfterFault(causedBySequence);
      return;
    }
    if (!restartingSameAction && source && source !== target) {
      if (!this.safeFadeOut(source, 0.12) || !this.safeFadeIn(target, 0.12)) {
        this.fallbackAfterFault(causedBySequence);
        return;
      }
      this.transition = {
        source,
        target,
        remainingSeconds: 0.12,
      };
    }
    this.completionGeneration += 1;
    this.active = {
      token: target.token,
      role,
      mode: "one_shot",
      action: target.action,
    };
    this.emitActive(target.token, "one_shot", causedBySequence, role);
  }

  private configureAndPlay(record: ActionRecord, mode: "loop" | "one_shot"): boolean {
    const repetitions = mode === "loop" ? Infinity : 1;
    const loop = mode === "loop" ? THREE.LoopRepeat : THREE.LoopOnce;
    try {
      record.action.reset();
      if (record.action.time !== undefined) record.action.time = 0;
      record.action.setLoop(loop, repetitions);
      record.action.clampWhenFinished = mode === "one_shot";
      record.action.enabled = true;
      if (record.action.paused !== undefined) record.action.paused = false;
      record.action.play();
      return true;
    } catch {
      this.reportFault(record.token);
      return false;
    }
  }

  private safeFadeIn(record: ActionRecord, duration: number): boolean {
    try {
      record.action.fadeIn(duration);
      return true;
    } catch {
      this.reportFault(record.token);
      return false;
    }
  }

  private safeFadeOut(record: ActionRecord, duration: number): boolean {
    try {
      record.action.fadeOut(duration);
      return true;
    } catch {
      this.reportFault(record.token);
      return false;
    }
  }

  private safeStop(record: ActionRecord): void {
    try {
      record.action.stop();
    } catch {
      // The action is already being removed or is in a failed state.
    }
  }

  private finished(event: MotionMixerEvent): void {
    if (this.disposed || this.active.mode !== "one_shot" || this.active.action !== event.action) return;
    const duration = event.action.getClip().duration;
    if (event.action.time !== undefined && Number.isFinite(event.action.time)
      && event.action.time < duration - Number.EPSILON) return;
    const completionGeneration = this.completionGeneration;
    const action = event.action;
    queueMicrotask(() => {
      if (this.disposed
        || completionGeneration !== this.completionGeneration
        || this.active.mode !== "one_shot"
        || this.active.action !== action) return;
      this.activateSteady(this.desiredSteadyRole, this.latestProjection?.causedBySequence ?? null);
    });
  }

  private reconcileLatestProjection(): void {
    if (this.reducedMotion || this.suspended || this.disposed) return;
    const projection = this.latestProjection;
    if (!projection) return;
    if (projection.phase === "succeeded") {
      this.activateTerminal("success", projection.causedBySequence);
    } else if (projection.phase === "failed") {
      this.activateTerminal("failure", projection.causedBySequence);
    } else {
      this.activateSteady(this.desiredSteadyRole, projection.causedBySequence);
    }
  }

  private resolveSteadyRole(role: SteadyRole): SteadyRole | null {
    if (this.recordForRole(role)) return role;
    if (role !== "idle" && this.recordForRole("idle")) return "idle";
    return null;
  }

  private recordForRole(role: AvatarMotionRole): ActionRecord | null {
    const record = this.roleRecords.get(role);
    return record && !this.failedTokens.has(record.token) ? record : null;
  }

  private recordForActive(): ActionRecord | null {
    if (this.active.mode === "rest" || this.active.role === null) return null;
    return this.recordForRole(this.active.role);
  }

  private participatingActions(): ActionRecord[] {
    const records = new Map<string, ActionRecord>();
    if (this.transition) {
      records.set(this.transition.source.key, this.transition.source);
      records.set(this.transition.target.key, this.transition.target);
    } else if (this.active.mode !== "rest") {
      const active = this.recordForActive();
      if (active) records.set(active.key, active);
    }
    return [...records.values()];
  }

  private reportFault(token: string): void {
    if (this.failedTokens.has(token)) return;
    this.failedTokens.add(token);
    this.clearTransition();
    const identity = this.identity;
    const cause = this.latestProjection?.causedBySequence ?? null;
    if (identity) {
      try {
        this.onFault?.({
          ...identity,
          motionToken: token,
          code: "motion_runtime_failed",
          causedBySequence: cause,
        });
      } catch {
        // Motion reporting must not turn an isolated motion fault into a
        // renderer-terminal failure.
      }
    }
    for (const [key, record] of this.actions) {
      if (record.token !== token) continue;
      this.safeStop(record);
      this.uncache(record);
      this.actions.delete(key);
    }
    for (const [role, record] of this.roleRecords) {
      if (record.token === token) this.roleRecords.delete(role);
    }
    if (this.active.mode !== "rest" && this.active.token === token) {
      this.active = { role: null, mode: "rest", token: null };
      this.completionGeneration += 1;
    }
  }

  private fallbackAfterFault(causedBySequence: number | null = this.latestProjection?.causedBySequence ?? null): void {
    if (this.reducedMotion || this.disposed) return;
    const target = this.resolveSteadyRole(this.desiredSteadyRole);
    if (target) {
      const record = this.recordForRole(target);
      if (record && this.configureAndPlay(record, "loop")) {
        this.active = {
          token: record.token,
          role: target,
          mode: "loop",
          action: record.action,
        };
        this.emitActive(record.token, "loop", causedBySequence, target);
        return;
      }
    }
    this.enterRest(causedBySequence);
  }

  private enterRest(causedBySequence: number | null): void {
    this.clearTransition(true);
    if (this.active.mode !== "rest") this.stopActiveAction();
    this.active = { role: null, mode: "rest", token: null };
    this.completionGeneration += 1;
    this.resetRestPose();
    this.emitActive(null, "rest", causedBySequence);
  }

  private resetRestPose(): void {
    try {
      this.resetNormalizedPose();
    } catch {
      // A rest-pose reset cannot make a valid model renderer-terminal.
    }
  }

  private stopActiveAction(): void {
    if (this.active.mode === "rest") return;
    const record = this.recordForActive();
    if (record) this.safeStop(record);
  }

  private clearActions(): void {
    this.completionGeneration += 1;
    this.clearTransition(true);
    this.stopActiveAction();
    try {
      this.mixer.stopAllAction();
    } catch {
      // Continue cleanup.
    }
    for (const record of this.actions.values()) this.uncache(record);
    try {
      this.mixer.uncacheRoot?.(this.root);
    } catch {
      // Continue cleanup.
    }
    this.actions.clear();
    this.roleRecords.clear();
  }

  private uncache(record: ActionRecord): void {
    try {
      this.mixer.uncacheAction?.(record.clip, this.root);
    } catch {
      // Continue cleanup.
    }
    try {
      this.mixer.uncacheClip?.(record.clip);
    } catch {
      // Continue cleanup.
    }
  }

  private matchesIdentity(input: MotionRuntimeIdentity): boolean {
    const identity = this.identity;
    return identity !== null
      && identity.sessionID === input.sessionID
      && identity.profileRevision === input.profileRevision
      && identity.modelToken === input.modelToken
      && identity.generation === input.generation;
  }

  private sameProjection(left: MotionProjection, right: MotionProjection | null): boolean {
    return right !== null
      && left.phase === right.phase
      && left.generationID === right.generationID
      && (left.playbackID ?? null) === (right.playbackID ?? null);
  }

  private emitActive(
    token: string | null,
    mode: MotionActiveMode,
    causedBySequence: number | null,
    role: AvatarMotionRole | null = null,
  ): void {
    if (mode === "rest" && this.latestProjection === null) return;
    const signature = `${token ?? "rest"}:${role ?? "none"}:${mode}`;
    if (signature === this.lastActiveSignature) return;
    this.lastActiveSignature = signature;
    const identity = this.identity;
    if (!identity) return;
    try {
      this.onActive?.({
        ...identity,
        motionToken: token,
        role,
        mode,
        causedBySequence,
      });
    } catch {
      // Active-motion diagnostics are advisory; playback remains local.
    }
  }

  private clearTransition(stopSource: boolean = false): void {
    const transition = this.transition;
    this.transition = null;
    if (stopSource && transition) this.safeStop(transition.source);
  }

  private advanceTransition(deltaSeconds: number): void {
    const transition = this.transition;
    if (!transition) return;
    transition.remainingSeconds -= deltaSeconds;
    if (transition.remainingSeconds <= 0) this.transition = null;
  }
}

function steadyRoleFor(phase: PresentationPhase): SteadyRole {
  if (phase === "listening" || phase === "transcribing") return "listening";
  if (phase === "thinking" || phase === "responding") return "thinking";
  if (phase === "speaking") return "speaking";
  return "idle";
}

function isSteadyRole(role: AvatarMotionRole): boolean {
  return role === "idle"
    || role === "listening"
    || role === "thinking"
    || role === "speaking";
}

function actionKey(token: string, variant: "steady" | "terminal"): string {
  return `${token}:${variant}`;
}
