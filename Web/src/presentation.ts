import type {
  MouthVowelWeights,
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
  mouthVowels: MouthVowelWeights | null;
  mouthCuesEnabled: boolean;
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
    lastProjectionSequence: number | null;
    generationID: string | null;
    phase: PresentationPhase;
    playbackID: string | null;
    mouthScalar: number;
    mouthCuesEnabled: boolean;
    reducedMotion: boolean;
  }
  | { type: "set_mouth_cues_enabled"; enabled: boolean };

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
    mouthVowels: null,
    mouthCuesEnabled: true,
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
  if (input.type === "reconcile_presentation") return reconcile(state, input);
  if (input.type === "project_phase") return project(state, input);
  if (input.type === "set_mouth") return mouth(state, input);
  if (input.type === "set_policy") return policy(state, input.payload);
  if (input.type === "reset") return reset(state, input.payload.generation_id, input.payload.reason);
  if (input.type === "suspend") {
    if (state.suspended) {
      return input.visibility === "hidden" ? changed(revoke(state), []) : unchanged(state);
    }
    let next = clearMouthOutput({ ...state, suspended: true });
    if (input.visibility === "hidden") next = revoke(next);
    return changed(next, [{ type: "clear_mouth" }]);
  }
  if (input.type === "resume") {
    if (!state.suspended) return unchanged(state);
    const next = clearMouthOutput({ ...state, suspended: false });
    return changed(next, [{
      type: "reconcile",
      lastProjectionSequence: next.lastProjectionSequence ?? null,
      generationID: next.generationID,
      phase: next.phase,
      playbackID: next.playbackID,
      mouthScalar: next.mouthScalar,
      mouthCuesEnabled: next.mouthCuesEnabled,
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
  if (
    !Number.isSafeInteger(value.projection_sequence)
    || value.projection_sequence < 1
    || value.projection_sequence > Number.MAX_SAFE_INTEGER
    || value.projection_sequence <= (state.lastProjectionSequence ?? 0)
  ) return unchanged(state);
  const replacesLease = value.generation_id !== state.generationID
    || value.playback_id !== state.playbackID
    || value.phase === "stopped"
    || value.phase === "succeeded"
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

function reconcile(
  state: PresentationState,
  command: Extract<PresentationCommand, { type: "reconcile_presentation" }>,
): PresentationResult {
  const value = command.payload;
  if (
    (value.last_projection_sequence !== null
      && (!Number.isSafeInteger(value.last_projection_sequence)
        || value.last_projection_sequence < 1
        || value.last_projection_sequence > Number.MAX_SAFE_INTEGER))
    || (state.lastProjectionSequence !== undefined
      && (value.last_projection_sequence === null
        || value.last_projection_sequence < state.lastProjectionSequence))
    || !validPhase(value.phase, value.generation_id, value.playback_id)
  ) return unchanged(state);

  const samePlaybackLease = value.generation_id === state.generationID
    && value.playback_id === state.playbackID;
  const next = clearMouthOutput({
    ...state,
    generationID: value.generation_id,
    phase: value.phase,
    playbackID: value.playback_id,
    mouthCuesEnabled: value.mouth_cues_enabled,
    reducedMotion: value.reduced_motion,
    suspended: false,
  });
  if (!samePlaybackLease) {
    delete next.lastCueIndex;
    delete next.lastPlaybackOffsetMilliseconds;
  }
  if (value.last_projection_sequence === null) {
    delete next.lastProjectionSequence;
  } else {
    next.lastProjectionSequence = value.last_projection_sequence;
  }
  return changed(next, [{
    type: "reconcile",
    lastProjectionSequence: value.last_projection_sequence,
    generationID: value.generation_id,
    phase: value.phase,
    playbackID: value.playback_id,
    mouthScalar: 0,
    mouthCuesEnabled: next.mouthCuesEnabled,
    reducedMotion: value.reduced_motion,
  }]);
}

function mouth(
  state: PresentationState,
  command: Extract<PresentationCommand, { type: "set_mouth" }>,
): PresentationResult {
  const cue = command.payload;
  const vowels = Object.hasOwn(cue, "vowels")
    ? (cue as { vowels: MouthVowelWeights }).vowels
    : null;
  if (!Number.isSafeInteger(cue.cue_index)
    || cue.cue_index < 1
    || cue.cue_index > Number.MAX_SAFE_INTEGER
    || !Number.isSafeInteger(cue.playback_offset_ms)
    || cue.playback_offset_ms < 0
    || cue.playback_offset_ms > Number.MAX_SAFE_INTEGER
    || cue.playback_offset_ms > 86_400_000
    || !Number.isFinite(cue.scalar)
    || cue.scalar < 0
    || cue.scalar > 1
    || (vowels !== null && !validVowelWeights(vowels))
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
  if (state.suspended || state.reducedMotion || !state.mouthCuesEnabled) {
    return changed(clearMouthOutput(accepted), []);
  }
  return changed({
    ...accepted,
    mouthScalar: cue.scalar,
    mouthVowels: vowels,
  }, [{ type: "apply_mouth", command }]);
}

function validVowelWeights(vowels: MouthVowelWeights): boolean {
  return [vowels.aa, vowels.ih, vowels.ou, vowels.ee, vowels.oh]
    .every((weight) => Number.isFinite(weight) && weight >= 0 && weight <= 1);
}

function policy(
  state: PresentationState,
  payload: Extract<PresentationCommand, { type: "set_policy" }>["payload"],
): PresentationResult {
  const reducedMotion = payload.reduced_motion;
  const mouthCuesEnabled = payload.mouth_cues_enabled;
  const reducedChanged = reducedMotion !== state.reducedMotion;
  const cuesChanged = mouthCuesEnabled !== state.mouthCuesEnabled;
  if (!reducedChanged && !cuesChanged) return unchanged(state);
  let next = { ...state, reducedMotion, mouthCuesEnabled };
  const suppressOutput = reducedMotion || !mouthCuesEnabled;
  if (suppressOutput) next = clearMouthOutput(next);
  if (state.suspended) return changed(next, []);
  const effects: PresentationEffect[] = [];
  if (reducedChanged) effects.push({ type: "set_reduced_motion", enabled: reducedMotion });
  if (cuesChanged) effects.push({ type: "set_mouth_cues_enabled", enabled: mouthCuesEnabled });
  if (suppressOutput) effects.push({ type: "clear_mouth" });
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
  const next = clearMouthOutput({ ...state });
  delete next.lastCueIndex;
  delete next.lastPlaybackOffsetMilliseconds;
  return next;
}

function clearMouthOutput(state: PresentationState): PresentationState {
  return { ...state, mouthScalar: 0, mouthVowels: null };
}

function validPhase(phase: PresentationPhase, generationID: string | null, playbackID: string | null): boolean {
  if (phase === "speaking") return generationID !== null && playbackID !== null;
  if (["thinking", "responding", "succeeded", "stopped", "failed"].includes(phase)) {
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
