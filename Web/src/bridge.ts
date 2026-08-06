import {
  bridgeContract,
  type DisposalReason,
  type PresentationCommand,
  type PresentationCommandEnvelope,
  type PresentationObservation,
} from "./contract.js";
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

export interface RendererBackend {
  configure(reducedMotion: boolean): void;
  loadAsset(url: string, signal: AbortSignal): Promise<LoadedAvatar>;
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
  private backendReleased = false;
  private awaitingReconciliation = false;
  private readonly loadTimeoutMilliseconds: number;
  private readonly loadTimeoutScheduler: LoadTimeoutScheduler;

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
  }

  start(): void {
    this.observe(null, { type: "wrapper_ready", payload: { bridge_version: 1 } });
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
      case "load_asset":
        await this.load(command.payload.asset_token, sequence);
        return;
      case "set_visibility":
        this.visibility(command.payload.visibility, sequence);
        return;
      case "project_phase":
      case "set_policy":
      case "set_mouth":
      case "reset":
        this.applyPresentation(command);
        return;
      case "reconcile_presentation":
        if (!this.awaitingReconciliation) {
          this.fail("bridge_invalid", "resume", sequence);
          return;
        }
        this.applyPresentation(command);
        this.awaitingReconciliation = false;
        return;
    }
  }

  private async load(assetToken: string, sequence: number): Promise<void> {
    this.state = reduceLifecycle(this.state, { type: "load_started" }).state;
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
        this.backend.loadAsset(
          `miller-avatar-local://app/session/${this.sessionID}/${assetToken}.vrm`,
          controller.signal,
        ),
        timeout,
      ]);
      if (this.state !== "loading") return;
      this.observe(sequence, {
        type: "asset_loaded",
        payload: { asset_token: assetToken, capabilities: loaded.capabilities },
      });
      const evidence = this.backend.renderOnce();
      if (!this.advanceCounters(1, 0, 1, "render", sequence)) return;
      this.state = reduceLifecycle(this.state, { type: "first_frame" }).state;
      this.observe(sequence, {
        type: "first_frame",
        payload: { asset_token: assetToken, ...evidence },
      });
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

  private applyPresentation(command: PresentationCommand): void {
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
    this.terminatePresentation();
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
    this.terminatePresentation();
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
    if (command.type === "load_asset") return this.state === "ready";
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
  if (command.type === "load_asset") return "load";
  if (command.type === "set_visibility") return command.payload.visibility === "visible" ? "resume" : "suspend";
  if (command.type === "set_policy") return "policy";
  if (command.type === "reconcile_presentation") return "resume";
  if (command.type === "dispose") return "dispose";
  return "render";
}
