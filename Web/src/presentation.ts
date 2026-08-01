import type {
  PresentationCommand,
  PresentationPhase,
  ResetReason,
} from "./contract.js";

export interface PresentationState {
  lastProjectionSequence?: number;
  generationID: string | null;
  phase: PresentationPhase;
  playbackID: string | null;
  lastCueIndex?: number;
  lastPlaybackOffsetMilliseconds?: number;
  mouthScalar: number;
  reducedMotion: boolean;
  suspended: boolean;
  terminated: boolean;
}

export type PresentationEffect =
  | { type: "apply_projection"; command: Extract<PresentationCommand, { type: "project_phase" }> }
  | { type: "apply_mouth"; command: Extract<PresentationCommand, { type: "set_mouth" }> }
  | { type: "set_reduced_motion"; enabled: boolean }
  | { type: "reset"; generationID: string | null; reason: ResetReason }
  | { type: "clear_mouth" }
  | {
    type: "reconcile";
    phase: PresentationPhase;
    mouthScalar: number;
    reducedMotion: boolean;
  };

export interface PresentationResult {
  state: PresentationState;
  effects: PresentationEffect[];
}

export type PresentationInput =
  | PresentationCommand
  | { type: "suspend"; visibility: "occluded" | "hidden" }
  | { type: "resume" | "renderer_failed" };

export function initialPresentationState(): PresentationState {
  return {
    generationID: null,
    phase: "idle",
    playbackID: null,
    mouthScalar: 0,
    reducedMotion: false,
    suspended: false,
    terminated: false,
  };
}

export function reducePresentation(
  state: PresentationState,
  input: PresentationInput,
): PresentationResult {
  if (state.terminated) return unchanged(state);
  if (input.type === "project_phase") return project(state, input);
  if (input.type === "set_mouth") return mouth(state, input);
  if (input.type === "set_policy") return policy(state, input.payload.reduced_motion);
  if (input.type === "reset") return reset(state, input.payload.generation_id, input.payload.reason);
  if (input.type === "suspend") {
    if (state.suspended) {
      return input.visibility === "hidden" ? changed(revoke(state), []) : unchanged(state);
    }
    let next = { ...state, suspended: true, mouthScalar: 0 };
    if (input.visibility === "hidden") next = revoke(next);
    return changed(next, [{ type: "clear_mouth" }]);
  }
  if (input.type === "resume") {
    if (!state.suspended) return unchanged(state);
    const next = { ...state, suspended: false, mouthScalar: 0 };
    return changed(next, [{
      type: "reconcile",
      phase: next.phase,
      mouthScalar: next.mouthScalar,
      reducedMotion: next.reducedMotion,
    }]);
  }
  if (input.type === "renderer_failed" || input.type === "dispose") {
    return changed(revoke({ ...state, terminated: true }), [{ type: "clear_mouth" }]);
  }
  return unchanged(state);
}

function project(
  state: PresentationState,
  command: Extract<PresentationCommand, { type: "project_phase" }>,
): PresentationResult {
  const value = command.payload;
  if (!validPhase(value.phase, value.generation_id, value.playback_id)) return unchanged(state);
  if (value.projection_sequence <= (state.lastProjectionSequence ?? 0)) return unchanged(state);
  const replacesLease = value.generation_id !== state.generationID
    || value.playback_id !== state.playbackID
    || value.phase === "stopped"
    || value.phase === "failed";
  let next: PresentationState = {
    ...state,
    lastProjectionSequence: value.projection_sequence,
    generationID: value.generation_id,
    phase: value.phase,
    playbackID: value.playback_id,
  };
  if (replacesLease) next = clearLeaseOutput(next);
  if (state.suspended) return changed(next, []);
  const effects: PresentationEffect[] = replacesLease ? [{ type: "clear_mouth" }] : [];
  effects.push({ type: "apply_projection", command });
  return changed(next, effects);
}

function mouth(
  state: PresentationState,
  command: Extract<PresentationCommand, { type: "set_mouth" }>,
): PresentationResult {
  const cue = command.payload;
  if (!Number.isSafeInteger(cue.cue_index)
    || cue.cue_index < 1
    || !Number.isSafeInteger(cue.playback_offset_ms)
    || cue.playback_offset_ms < 0
    || cue.playback_offset_ms > 86_400_000
    || !Number.isFinite(cue.scalar)
    || cue.scalar < 0
    || cue.scalar > 1
    || state.phase !== "speaking"
    || cue.generation_id !== state.generationID
    || cue.playback_id !== state.playbackID
    || cue.cue_index <= (state.lastCueIndex ?? 0)
    || cue.playback_offset_ms < (state.lastPlaybackOffsetMilliseconds ?? 0)) return unchanged(state);
  const accepted = {
    ...state,
    lastCueIndex: cue.cue_index,
    lastPlaybackOffsetMilliseconds: cue.playback_offset_ms,
  };
  if (state.suspended || state.reducedMotion) return changed({ ...accepted, mouthScalar: 0 }, []);
  return changed({ ...accepted, mouthScalar: cue.scalar }, [{ type: "apply_mouth", command }]);
}

function policy(state: PresentationState, enabled: boolean): PresentationResult {
  if (enabled === state.reducedMotion) return unchanged(state);
  const next = { ...state, reducedMotion: enabled, mouthScalar: enabled ? 0 : state.mouthScalar };
  if (state.suspended) return changed(next, []);
  const effects: PresentationEffect[] = [{ type: "set_reduced_motion", enabled }];
  if (enabled) effects.push({ type: "clear_mouth" });
  return changed(next, effects);
}

function reset(state: PresentationState, generationID: string | null, reason: ResetReason): PresentationResult {
  if (!(generationID === null && reason === "operator") && generationID !== state.generationID) {
    return unchanged(state);
  }
  const next = revoke({ ...state, generationID: null, phase: "idle" });
  if (state.suspended) return changed(next, []);
  return changed(next, [
    { type: "clear_mouth" },
    { type: "reset", generationID, reason },
  ]);
}

function revoke(state: PresentationState): PresentationState {
  return { ...clearLeaseOutput(state), playbackID: null };
}

function clearLeaseOutput(state: PresentationState): PresentationState {
  const next = { ...state, mouthScalar: 0 };
  delete next.lastCueIndex;
  delete next.lastPlaybackOffsetMilliseconds;
  return next;
}

function validPhase(phase: PresentationPhase, generationID: string | null, playbackID: string | null): boolean {
  if (phase === "speaking") return generationID !== null && playbackID !== null;
  if (["thinking", "responding", "stopped", "failed"].includes(phase)) {
    return generationID !== null && playbackID === null;
  }
  return generationID === null && playbackID === null;
}

function unchanged(state: PresentationState): PresentationResult {
  return { state, effects: [] };
}

function changed(state: PresentationState, effects: PresentationEffect[]): PresentationResult {
  return { state, effects };
}
