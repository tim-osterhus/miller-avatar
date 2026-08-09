import {
  avatarMotionRoles,
  bridgeContract,
  type AvatarMotionRole,
  type DisposalReason,
  type LoadProfilePayload,
  type PresentationCommand,
  type PresentationCommandEnvelope,
  type PresentationObservation,
} from "./contract.js";
import {
  MotionLoadError,
  type ConvertedMotion,
  type UniqueMotionInput,
} from "./motion-loader.js";
import { reduceLifecycle, type RendererState } from "./lifecycle.js";
import {
  initialPresentationState,
  reducePresentation,
  type PresentationEffect,
  type PresentationInput,
  type PresentationState,
} from "./presentation.js";
import { BridgeValidationError, PresentationCommandDecoder } from "./validation.js";

export interface FirstFrameEvidence {
  viewport_width: number;
  viewport_height: number;
  visible_meshes: number;
  decoded_textures: number;
  material_bindings: number;
  alpha_probe_pixels: number;
}

export interface LoadedAvatar {
  capabilities: {
    aa: boolean;
    look_at: boolean;
    spring_bone: boolean;
    mtoon_materials: number;
  };
}

export type MotionRegistry = ReadonlyMap<AvatarMotionRole, ConvertedMotion>;

export interface RendererBackend {
  configure(reducedMotion: boolean): void;
  loadModel(url: string, signal: AbortSignal): Promise<LoadedAvatar>;
  loadMotion(input: UniqueMotionInput, signal: AbortSignal): Promise<ConvertedMotion>;
  replaceMotions(registry: MotionRegistry): void;
  discardMotion?(motion: ConvertedMotion): void;
  renderOnce(): FirstFrameEvidence;
  renderFrame(): void;
  update(deltaSeconds: number): void;
  apply(effect: PresentationEffect): void;
  startClock(): void;
  stopClock(): void;
  dispose(): void;
}

export interface FrameScheduler {
  request(callback: (timestampMilliseconds: number) => void): number;
  cancel(handle: number): void;
}

export interface LoadTimeoutScheduler {
  request(callback: () => void, delayMilliseconds: number): number;
  cancel(handle: number): void;
}

export interface WebRendererCoreOptions {
  loadTimeoutMilliseconds?: number;
  loadTimeoutScheduler?: LoadTimeoutScheduler;
  motionTimeoutMilliseconds?: number;
  profileMotionTimeoutMilliseconds?: number;
  motionTimeoutScheduler?: LoadTimeoutScheduler;
}

export interface RendererCounters {
  frames: number;
  updates: number;
  renders: number;
}

export class WebRendererCore {
  private readonly decoder: PresentationCommandDecoder;
  private state: RendererState = "booting";
  private presentation: PresentationState = initialPresentationState();
  private observationSequence = 0;
  private frameHandle: number | null = null;
  private lastTimestamp: number | null = null;
  private counters: RendererCounters = { frames: 0, updates: 0, renders: 0 };
  private activeLoad: AbortController | null = null;
  private activeMotionLoad: AbortController | null = null;
  private backendReleased = false;
  private awaitingReconciliation = false;
  private activeProfile: LoadProfilePayload | null = null;
  private activeProfileLoadSequence: number | null = null;
  private latestPhaseCommandSequence: number | null = null;
  private readonly loadTimeoutMilliseconds: number;
  private readonly loadTimeoutScheduler: LoadTimeoutScheduler;
  private readonly motionTimeoutMilliseconds: number;
  private readonly profileMotionTimeoutMilliseconds: number;
  private readonly motionTimeoutScheduler: LoadTimeoutScheduler;
  private avatarGeneration = 0;
  private readonly discardedMotions = new WeakSet<ConvertedMotion>();

  constructor(
    private readonly sessionID: string,
    private readonly backend: RendererBackend,
    private readonly scheduler: FrameScheduler,
    private readonly post: (message: string) => void,
    options: WebRendererCoreOptions = {},
  ) {
    this.decoder = new PresentationCommandDecoder(sessionID);
    this.loadTimeoutMilliseconds = options.loadTimeoutMilliseconds ?? 15_000;
    if (!Number.isSafeInteger(this.loadTimeoutMilliseconds) || this.loadTimeoutMilliseconds <= 0) {
      throw new RangeError("load timeout must be a positive safe integer");
    }
    this.loadTimeoutScheduler = options.loadTimeoutScheduler ?? browserLoadTimeoutScheduler;
    this.motionTimeoutMilliseconds = options.motionTimeoutMilliseconds ?? 10_000;
    this.profileMotionTimeoutMilliseconds = options.profileMotionTimeoutMilliseconds ?? 60_000;
    if (!Number.isSafeInteger(this.motionTimeoutMilliseconds) || this.motionTimeoutMilliseconds <= 0) {
      throw new RangeError("motion timeout must be a positive safe integer");
    }
    if (!Number.isSafeInteger(this.profileMotionTimeoutMilliseconds) || this.profileMotionTimeoutMilliseconds <= 0) {
      throw new RangeError("profile motion timeout must be a positive safe integer");
    }
    this.motionTimeoutScheduler = options.motionTimeoutScheduler ?? browserLoadTimeoutScheduler;
  }

  start(): void {
    this.observe(null, { type: "wrapper_ready", payload: { bridge_version: 2 } });
  }

  async accept(input: string | Uint8Array): Promise<void> {
    if (["failed", "disposing", "disposed"].includes(this.state)) return;
    let envelope: PresentationCommandEnvelope;
    try {
      envelope = this.decoder.decode(input);
    } catch (error) {
      if (error instanceof BridgeValidationError) {
        this.fail("bridge_invalid", "configure", null);
        return;
      }
      throw error;
    }
    try {
      await this.execute(envelope.command, envelope.sequence);
    } catch {
      this.fail("render_failed", operationFor(envelope.command), envelope.sequence);
    }
  }

  contextLost(): void {
    this.fail("context_lost", "render", null);
  }

  snapshot(): { state: RendererState; presentation: PresentationState; counters: RendererCounters } {
    return {
      state: this.state,
      presentation: { ...this.presentation },
      counters: { ...this.counters },
    };
  }

  private async execute(command: PresentationCommand, sequence: number): Promise<void> {
    if (command.type === "dispose") {
      this.dispose(command.payload.reason, sequence);
      return;
    }
    if (!this.commandIsLegal(command)) {
      this.fail("bridge_invalid", operationFor(command), sequence);
      return;
    }
    switch (command.type) {
      case "configure":
        this.backend.configure(command.payload.reduced_motion);
        this.presentation = reducePresentation(this.presentation, {
          type: "set_policy",
          payload: { reduced_motion: command.payload.reduced_motion },
        }).state;
        this.state = reduceLifecycle(this.state, { type: "configured" }).state;
        this.observe(sequence, { type: "renderer_ready", payload: { webgl: "webgl2" } });
        return;
      case "load_profile":
        await this.load(command.payload, sequence);
        return;
      case "set_visibility":
        this.visibility(command.payload.visibility, sequence);
        return;
      case "project_phase":
      case "set_policy":
      case "set_mouth":
      case "reset":
        this.applyPresentation(command, sequence);
        return;
      case "reconcile_presentation":
        if (!this.awaitingReconciliation) {
          this.fail("bridge_invalid", "resume", sequence);
          return;
        }
        this.applyPresentation(command, sequence);
        this.awaitingReconciliation = false;
        return;
    }
  }

  private async load(profile: LoadProfilePayload, sequence: number): Promise<void> {
    this.state = reduceLifecycle(this.state, { type: "load_started" }).state;
    this.abortActiveMotionLoad();
    const generation = ++this.avatarGeneration;
    this.activeProfile = profile;
    this.activeProfileLoadSequence = sequence;
    const controller = new AbortController();
    this.activeLoad = controller;
    let timeoutHandle: number | null = null;
    let timedOut = false;
    try {
      const timeout = new Promise<never>((_resolve, reject) => {
        timeoutHandle = this.loadTimeoutScheduler.request(() => {
          timedOut = true;
          controller.abort();
          reject(new LoadTimeoutError());
        }, this.loadTimeoutMilliseconds);
      });
      const loaded = await Promise.race([
        this.backend.loadModel(
          `miller-avatar-local://app/session/${this.sessionID}/${profile.model_token}.vrm`,
          controller.signal,
        ),
        timeout,
      ]);
      if (this.state !== "loading") return;
      this.observe(sequence, {
        type: "profile_model_loaded",
        payload: {
          profile_revision: profile.profile_revision,
          model_token: profile.model_token,
          capabilities: loaded.capabilities,
        },
      });
      const evidence = this.backend.renderOnce();
      if (!this.advanceCounters(1, 0, 1, "render", sequence)) return;
      this.state = reduceLifecycle(this.state, { type: "first_frame" }).state;
      this.observe(sequence, {
        type: "first_frame",
        payload: {
          profile_revision: profile.profile_revision,
          model_token: profile.model_token,
          ...evidence,
        },
      });
      this.emitInitialMotionStatuses(profile, sequence);
      this.startMotionLoading(profile, sequence, generation);
      if (!this.presentation.reducedMotion) this.schedule();
    } catch {
      if (this.state === "loading") {
        this.fail(timedOut ? "asset_load_timeout" : "asset_load_failed", "load", sequence);
      }
    } finally {
      if (timeoutHandle !== null) this.loadTimeoutScheduler.cancel(timeoutHandle);
      if (this.activeLoad === controller) this.activeLoad = null;
    }
  }

  private visibility(visibility: "visible" | "occluded" | "hidden", sequence: number): void {
    if (visibility !== "visible") {
      this.awaitingReconciliation = false;
      if (this.state === "live") {
        this.cancelFrame();
        this.backend.stopClock();
        this.state = reduceLifecycle(this.state, { type: "suspend" }).state;
      }
      if (this.state === "suspended") this.applyPresentationInput({ type: "suspend", visibility });
      this.observe(sequence, {
        type: "suspended",
        payload: { visibility, ...this.counters },
      });
      return;
    }
    this.backend.startClock();
    this.applyPresentationInput({ type: "resume" });
    this.awaitingReconciliation = true;
    this.state = reduceLifecycle(this.state, { type: "resume" }).state;
    if (!this.advanceCounters(1, this.presentation.reducedMotion ? 0 : 1, 1, "resume", sequence)) return;
    if (!this.presentation.reducedMotion) {
      this.backend.update(0);
    }
    this.backend.renderFrame();
    this.observe(sequence, { type: "resumed", payload: { ...this.counters } });
    if (!this.presentation.reducedMotion) this.schedule();
  }

  private emitInitialMotionStatuses(profile: LoadProfilePayload, sequence: number): void {
    for (const role of avatarMotionRoles) {
      const binding = profile.motion_bindings[role];
      if (binding.status === "ready") continue;
      this.observe(sequence, {
        type: "motion_status",
        payload: {
          profile_revision: profile.profile_revision,
          model_token: profile.model_token,
          motion_token: null,
          role,
          status: binding.status,
          motion_code: null,
        },
      });
    }
  }

  private startMotionLoading(
    profile: LoadProfilePayload,
    sequence: number,
    generation: number,
  ): void {
    const controller = new AbortController();
    this.activeMotionLoad = controller;
    void this.loadMotions(profile, sequence, generation, controller)
      .catch(() => undefined)
      .finally(() => {
        if (this.activeMotionLoad === controller) this.activeMotionLoad = null;
      });
  }

  private async loadMotions(
    profile: LoadProfilePayload,
    sequence: number,
    generation: number,
    controller: AbortController,
  ): Promise<void> {
    const groups = new Map<string, AvatarMotionRole[]>();
    for (const role of avatarMotionRoles) {
      const binding = profile.motion_bindings[role];
      if (binding.status !== "ready" || binding.token === null) continue;
      const roles = groups.get(binding.token) ?? [];
      roles.push(role);
      groups.set(binding.token, roles);
    }
    const profileTimedOut = { value: false };
    const profileTimeoutHandle = this.motionTimeoutScheduler.request(() => {
      profileTimedOut.value = true;
      controller.abort();
    }, this.profileMotionTimeoutMilliseconds);
    const inputFor = (motionToken: string): UniqueMotionInput => ({
      sessionID: this.sessionID,
      generationID: String(generation),
      profileRevision: profile.profile_revision,
      motionToken,
      url: `miller-avatar-local://app/session/${this.sessionID}/${motionToken}.vrma`,
      isCurrent: () => this.isCurrentMotion(profile, sequence, generation, motionToken),
    });
    try {
      const outcomes = await Promise.all([...groups.entries()].map(async ([motionToken]) => (
        this.loadOneMotion(inputFor(motionToken), controller.signal, profileTimedOut)
      )));
      if (!this.isCurrentProfile(profile, sequence, generation)) {
        for (const outcome of outcomes) this.discardMotion(outcome.motion);
        return;
      }
      const outcomeByToken = new Map(outcomes.map((outcome) => [outcome.motionToken, outcome]));
      const registry = new Map<AvatarMotionRole, ConvertedMotion>();
      for (const role of avatarMotionRoles) {
        const binding = profile.motion_bindings[role];
        if (binding.status !== "ready" || binding.token === null) continue;
        const outcome = outcomeByToken.get(binding.token);
        if (!outcome || outcome.status === "cancelled") return;
        if (outcome.status === "ready" && outcome.motion !== undefined) {
          registry.set(role, outcome.motion);
          this.observe(sequence, {
            type: "motion_status",
            payload: {
              profile_revision: profile.profile_revision,
              model_token: profile.model_token,
              motion_token: binding.token,
              role,
              status: "ready",
              motion_code: null,
            },
          });
        } else {
          this.observe(sequence, {
            type: "motion_status",
            payload: {
              profile_revision: profile.profile_revision,
              model_token: profile.model_token,
              motion_token: binding.token,
              role,
              status: outcome.status,
              motion_code: outcome.code,
            },
          });
        }
      }
      if (!this.isCurrentProfile(profile, sequence, generation)) {
        this.discardRegistry(registry);
        return;
      }
      this.backend.replaceMotions(registry);
    } finally {
      this.motionTimeoutScheduler.cancel(profileTimeoutHandle);
    }
  }

  private async loadOneMotion(
    input: UniqueMotionInput,
    profileSignal: AbortSignal,
    profileTimedOut: { value: boolean },
  ): Promise<MotionOutcome> {
    if (profileSignal.aborted || !input.isCurrent?.()) {
      return { motionToken: input.motionToken, status: "cancelled", code: null };
    }
    const controller = new AbortController();
    let rejectProfile: (reason?: unknown) => void = () => {};
    const profileAbort = new Promise<never>((_resolve, reject) => {
      rejectProfile = reject;
    });
    const abortProfile = () => {
      controller.abort();
      rejectProfile(
        profileTimedOut.value
          ? new MotionLoadError("motion_load_timeout", "profile motion load timed out")
          : new MotionLoadError("cancelled", "profile motion load cancelled"),
      );
    };
    profileSignal.addEventListener("abort", abortProfile, { once: true });
    let timeoutHandle: number | null = null;
    let timedOut = false;
    try {
      const timeout = new Promise<never>((_resolve, reject) => {
        timeoutHandle = this.motionTimeoutScheduler.request(() => {
          timedOut = true;
          controller.abort();
          reject(new MotionLoadError("motion_load_timeout", "motion load timed out"));
        }, this.motionTimeoutMilliseconds);
      });
      try {
        const backendMotion = this.backend.loadMotion(input, controller.signal);
        void backendMotion.then(
          (motion) => {
            if (timedOut || profileSignal.aborted || !input.isCurrent?.()) this.discardMotion(motion);
          },
          () => {
            // The raced load path classifies the rejection below.
          },
        );
        const motion = await Promise.race([
          backendMotion,
          timeout,
          profileAbort,
        ]);
        if (profileSignal.aborted || !input.isCurrent?.()) {
          this.discardMotion(motion);
          return {
            motionToken: input.motionToken,
            status: profileTimedOut.value ? "timed_out" : "cancelled",
            code: profileTimedOut.value ? "motion_load_timeout" : null,
          };
        }
        if (motion.motionToken !== input.motionToken) {
          this.discardMotion(motion);
          return {
            motionToken: input.motionToken,
            status: "load_failed",
            code: "motion_load_failed",
          };
        }
        return { motionToken: input.motionToken, status: "ready", code: null, motion };
      } catch (error) {
        if (!input.isCurrent?.()) return { motionToken: input.motionToken, status: "cancelled", code: null };
        if (profileTimedOut.value || timedOut) {
          return {
            motionToken: input.motionToken,
            status: "timed_out",
            code: "motion_load_timeout",
          };
        }
        if (profileSignal.aborted) {
          return { motionToken: input.motionToken, status: "cancelled", code: null };
        }
        const code = error instanceof MotionLoadError ? error.code : "motion_load_failed";
        if (code === "cancelled") return { motionToken: input.motionToken, status: "cancelled", code: null };
        if (code === "motion_load_timeout") {
          return {
            motionToken: input.motionToken,
            status: "timed_out",
            code,
          };
        }
        return {
          motionToken: input.motionToken,
          status: "load_failed",
          code: "motion_load_failed",
        };
      }
    } finally {
      profileSignal.removeEventListener("abort", abortProfile);
      if (timeoutHandle !== null) this.motionTimeoutScheduler.cancel(timeoutHandle);
    }
  }

  private isCurrentProfile(
    profile: LoadProfilePayload,
    sequence: number,
    generation: number,
  ): boolean {
    return (this.state === "live" || this.state === "suspended")
      && !this.backendReleased
      && this.activeProfile === profile
      && this.activeProfileLoadSequence === sequence
      && this.avatarGeneration === generation;
  }

  private isCurrentMotion(
    profile: LoadProfilePayload,
    sequence: number,
    generation: number,
    _motionToken: string,
  ): boolean {
    return this.isCurrentProfile(profile, sequence, generation);
  }

  private discardMotion(motion: ConvertedMotion | undefined): void {
    if (!motion) return;
    if (this.discardedMotions.has(motion)) return;
    this.discardedMotions.add(motion);
    try {
      this.backend.discardMotion?.(motion);
    } catch {
      // Detached motion output is already outside the active registry.
    }
  }

  private discardRegistry(registry: MotionRegistry): void {
    const motions = new Set(registry.values());
    for (const motion of motions) this.discardMotion(motion);
  }

  private applyPresentation(command: PresentationCommand, sequence: number): void {
    if (command.type === "project_phase") this.latestPhaseCommandSequence = sequence;
    const beforeReducedMotion = this.presentation.reducedMotion;
    const result = reducePresentation(this.presentation, command);
    this.presentation = result.state;
    for (const effect of result.effects) this.backend.apply(effect);
    if (this.state === "live" && beforeReducedMotion !== this.presentation.reducedMotion) {
      if (this.presentation.reducedMotion) this.cancelFrame();
      else this.schedule();
    }
  }

  private applyPresentationInput(
    input: Extract<PresentationInput, { type: "suspend" | "resume" | "renderer_failed" }>,
  ): void {
    const result = reducePresentation(this.presentation, input);
    this.presentation = result.state;
    for (const effect of result.effects) this.backend.apply(effect);
  }

  private schedule(): void {
    if (this.frameHandle !== null || this.state !== "live" || this.presentation.reducedMotion) return;
    this.frameHandle = this.scheduler.request((timestamp) => {
      this.frameHandle = null;
      if (this.state !== "live") return;
      try {
        if (!Number.isFinite(timestamp)) throw new RangeError("frame timestamp must be finite");
        const delta = this.lastTimestamp === null
          ? 0
          : Math.min(0.25, Math.max(0, (timestamp - this.lastTimestamp) / 1000));
        this.lastTimestamp = timestamp;
        if (!this.advanceCounters(1, 1, 1, "render", null)) return;
        this.backend.update(delta);
        this.backend.renderFrame();
        this.schedule();
      } catch {
        this.fail("render_failed", "render", null);
      }
    });
  }

  private cancelFrame(): void {
    if (this.frameHandle !== null) this.scheduler.cancel(this.frameHandle);
    this.frameHandle = null;
    this.lastTimestamp = null;
  }

  private dispose(reason: DisposalReason, sequence: number): void {
    const transition = reduceLifecycle(this.state, { type: "dispose", reason });
    if (transition.effect !== "begin_disposal") return;
    this.state = transition.state;
    this.cancelFrame();
    this.abortActiveLoad();
    this.abortActiveMotionLoad();
    this.terminatePresentation();
    this.avatarGeneration += 1;
    this.activeProfile = null;
    this.activeProfileLoadSequence = null;
    this.releaseBackend();
    this.state = reduceLifecycle(this.state, { type: "disposed" }).state;
    this.observe(sequence, { type: "disposed", payload: { reason } });
  }

  private fail(
    code: Extract<PresentationObservation, { type: "failed" }>['payload']['code'],
    operation: Extract<PresentationObservation, { type: "failed" }>['payload']['operation'],
    sequence: number | null,
  ): void {
    if (["disposing", "disposed", "failed"].includes(this.state)) return;
    this.cancelFrame();
    this.abortActiveLoad();
    this.abortActiveMotionLoad();
    this.terminatePresentation();
    this.avatarGeneration += 1;
    this.activeProfile = null;
    this.activeProfileLoadSequence = null;
    this.state = reduceLifecycle(this.state, { type: "fail", code }).state;
    this.decoder.dispose();
    this.observe(sequence, { type: "failed", payload: { code, operation } });
    const disposal = reduceLifecycle(this.state, { type: "dispose", reason: "failure" });
    if (disposal.effect === "begin_disposal") this.state = disposal.state;
    this.releaseBackend();
    if (this.state === "disposing") {
      this.state = reduceLifecycle(this.state, { type: "disposed" }).state;
      this.observe(sequence, { type: "disposed", payload: { reason: "failure" } });
    }
  }

  private observe(causedBySequence: number | null, observation: PresentationObservation): void {
    if (
      observation.type === "profile_model_loaded"
      || observation.type === "first_frame"
      || observation.type === "motion_status"
    ) {
      const profile = this.activeProfile;
      if (
        profile === null
        || causedBySequence !== this.activeProfileLoadSequence
        || observation.payload.profile_revision !== profile.profile_revision
        || observation.payload.model_token !== profile.model_token
      ) {
        throw new Error("profile observation identity mismatch");
      }
    }
    if (observation.type === "motion_active") {
      if (
        this.activeProfile === null
        || causedBySequence !== this.latestPhaseCommandSequence
        || observation.payload.profile_revision !== this.activeProfile.profile_revision
        || observation.payload.model_token !== this.activeProfile.model_token
      ) {
        throw new Error("phase observation causality mismatch");
      }
    }
    this.observationSequence += 1;
    this.post(JSON.stringify({
      schema: bridgeContract.observationSchema,
      session_id: this.sessionID,
      sequence: this.observationSequence,
      caused_by_sequence: causedBySequence,
      type: observation.type,
      payload: observation.payload,
    }));
  }

  private abortActiveLoad(): void {
    this.activeLoad?.abort();
  }

  private abortActiveMotionLoad(): void {
    this.activeMotionLoad?.abort();
    this.activeMotionLoad = null;
  }

  private terminatePresentation(): void {
    this.awaitingReconciliation = false;
    const result = reducePresentation(this.presentation, { type: "renderer_failed" });
    this.presentation = result.state;
    for (const effect of result.effects) {
      try {
        this.backend.apply(effect);
      } catch {
        // Terminal state must remain observable even if a backend effect is unavailable.
      }
    }
  }

  private releaseBackend(): void {
    if (this.backendReleased) return;
    this.backendReleased = true;
    try {
      this.backend.stopClock();
    } catch {
      // Continue so backend disposal cannot be skipped by a failed clock stop.
    }
    try {
      this.backend.dispose();
    } catch {
      // The terminal observation is still the authoritative outcome.
    }
  }

  private advanceCounters(
    frames: number,
    updates: number,
    renders: number,
    operation: Extract<PresentationObservation, { type: "failed" }>["payload"]["operation"],
    sequence: number | null,
  ): boolean {
    if (
      this.counters.frames > Number.MAX_SAFE_INTEGER - frames ||
      this.counters.updates > Number.MAX_SAFE_INTEGER - updates ||
      this.counters.renders > Number.MAX_SAFE_INTEGER - renders
    ) {
      this.fail("resource_limit", operation, sequence);
      return false;
    }
    this.counters.frames += frames;
    this.counters.updates += updates;
    this.counters.renders += renders;
    return true;
  }

  private commandIsLegal(command: PresentationCommand): boolean {
    if (this.awaitingReconciliation && command.type !== "reconcile_presentation") return false;
    if (command.type === "configure") return this.state === "booting";
    if (command.type === "load_profile") return this.state === "ready";
    if (command.type === "set_mouth") return this.state === "live";
    if (command.type === "reconcile_presentation") {
      return this.awaitingReconciliation && this.state === "live";
    }
    if (command.type === "set_visibility") {
      return command.payload.visibility === "visible"
        ? this.state === "suspended"
        : this.state === "live" || this.state === "suspended";
    }
    return ["ready", "loading", "live", "suspended"].includes(this.state);
  }
}

class LoadTimeoutError extends Error {}

type MotionOutcome = {
  motionToken: string;
  status: "ready" | "load_failed" | "timed_out" | "cancelled";
  code: "motion_load_failed" | "motion_load_timeout" | null;
  motion?: ConvertedMotion;
};

const browserLoadTimeoutScheduler: LoadTimeoutScheduler = {
  request(callback, delayMilliseconds) {
    return globalThis.setTimeout(callback, delayMilliseconds) as unknown as number;
  },
  cancel(handle) {
    globalThis.clearTimeout(handle);
  },
};

function operationFor(command: PresentationCommand): Extract<PresentationObservation, { type: "failed" }>['payload']['operation'] {
  if (command.type === "configure") return "configure";
  if (command.type === "load_profile") return "load";
  if (command.type === "set_visibility") return command.payload.visibility === "visible" ? "resume" : "suspend";
  if (command.type === "set_policy") return "policy";
  if (command.type === "reconcile_presentation") return "resume";
  if (command.type === "dispose") return "dispose";
  return "render";
}
