import assert from "node:assert/strict";
import test from "node:test";
import { initialPresentationState, reducePresentation } from "../src/presentation.js";

const generation = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const playbackP = "11111111-1111-4111-8111-111111111111";
const playbackQ = "22222222-2222-4222-8222-222222222222";

test("projection reducer fences sequences and playback leases", () => {
  let state = initialPresentationState();
  state = reducePresentation(state, speaking(10, playbackP)).state;
  state = reducePresentation(state, speaking(12, playbackQ)).state;
  const delayed = reducePresentation(state, speaking(11, playbackP));
  assert.deepEqual(delayed.state, state);
  assert.deepEqual(delayed.effects, []);

  const oldCue = reducePresentation(state, mouth(playbackP, 1));
  assert.deepEqual(oldCue.state, state);
  const cue = reducePresentation(state, mouth(playbackQ, 1));
  assert.equal(cue.state.mouthScalar, 0.5);
  assert.equal(cue.effects[0]?.type, "apply_mouth");
});

test("suspension and reduced motion match native reducer behavior", () => {
  let state = reducePresentation(initialPresentationState(), speaking(1, playbackP)).state;
  state = reducePresentation(state, mouth(playbackP, 1)).state;
  const suspended = reducePresentation(state, { type: "suspend", visibility: "occluded" });
  assert.equal(suspended.state.mouthScalar, 0);
  assert.equal(suspended.state.generationID, generation);
  assert.equal(suspended.state.playbackID, playbackP);
  assert.deepEqual(suspended.effects, [{ type: "clear_mouth" }]);
  const skipped = reducePresentation(suspended.state, mouth(playbackP, 4));
  assert.equal(skipped.state.lastCueIndex, 4);
  assert.deepEqual(skipped.effects, []);
  const policy = reducePresentation(skipped.state, {
    type: "set_policy",
    payload: { reduced_motion: true },
  });
  assert.deepEqual(policy.effects, []);
  const resumed = reducePresentation(policy.state, { type: "resume" });
  assert.deepEqual(resumed.effects, [{
    type: "reconcile",
    lastProjectionSequence: 1,
    generationID: generation,
    phase: "speaking",
    playbackID: playbackP,
    mouthScalar: 0,
    reducedMotion: true,
  }]);
  assert.equal(resumed.state.mouthScalar, 0);
});

test("reset and resume carry enough state to restore renderer presentation", () => {
  const stopped = reducePresentation(initialPresentationState(), {
    type: "project_phase",
    payload: {
      projection_sequence: 1,
      generation_id: generation,
      phase: "stopped",
      playback_id: null,
    },
  }).state;
  const reset = reducePresentation(stopped, {
    type: "reset",
    payload: { generation_id: null, reason: "operator" },
  });
  assert.deepEqual(reset.effects, [
    { type: "clear_mouth" },
    { type: "reset", generationID: null, reason: "operator" },
  ]);

  const suspended = reducePresentation(stopped, { type: "suspend", visibility: "occluded" }).state;
  const resumed = reducePresentation(suspended, { type: "resume" });
  assert.deepEqual(resumed.effects, [{
    type: "reconcile",
    lastProjectionSequence: 1,
    generationID: generation,
    phase: "stopped",
    playbackID: null,
    mouthScalar: 0,
    reducedMotion: false,
  }]);
});

test("hidden suspension revokes playback and cues while preserving generation", () => {
  let state = reducePresentation(initialPresentationState(), speaking(1, playbackP)).state;
  state = reducePresentation(state, mouth(playbackP, 1)).state;

  const hidden = reducePresentation(state, { type: "suspend", visibility: "hidden" });
  assert.equal(hidden.state.generationID, generation);
  assert.equal(hidden.state.playbackID, null);
  assert.equal(hidden.state.lastCueIndex, undefined);
  assert.equal(hidden.state.lastPlaybackOffsetMilliseconds, undefined);
  assert.equal(hidden.state.mouthScalar, 0);
  assert.deepEqual(hidden.effects, [{ type: "clear_mouth" }]);
});

test("hidden revokes playback after an earlier occluded suspension", () => {
  const speakingState = reducePresentation(initialPresentationState(), speaking(1, playbackP)).state;
  const cued = reducePresentation(speakingState, mouth(playbackP, 1)).state;
  const occluded = reducePresentation(cued, { type: "suspend", visibility: "occluded" }).state;

  const hidden = reducePresentation(occluded, { type: "suspend", visibility: "hidden" });

  assert.equal(hidden.state.generationID, generation);
  assert.equal(hidden.state.playbackID, null);
  assert.equal(hidden.state.lastCueIndex, undefined);
  assert.equal(hidden.state.lastPlaybackOffsetMilliseconds, undefined);
  assert.deepEqual(hidden.effects, []);
});

test("idle, listening, and transcribing reject a generation identity", () => {
  for (const phase of ["idle", "listening", "transcribing"] as const) {
    const state = initialPresentationState();
    const result = reducePresentation(state, {
      type: "project_phase",
      payload: {
        projection_sequence: 1,
        generation_id: generation,
        phase,
        playback_id: null,
      },
    });
    assert.deepEqual(result.state, state, phase);
    assert.deepEqual(result.effects, [], phase);
  }
});

test("mouth reducer rejects hostile numeric values before state mutation", () => {
  const state = reducePresentation(initialPresentationState(), speaking(1, playbackP)).state;
  const hostile = [
    { cue_index: 0 },
    { cue_index: 1.5 },
    { cue_index: Number.NaN },
    { cue_index: Number.POSITIVE_INFINITY },
    { cue_index: Number.MAX_SAFE_INTEGER + 1 },
    { playback_offset_ms: -1 },
    { playback_offset_ms: 1.5 },
    { playback_offset_ms: Number.NaN },
    { playback_offset_ms: Number.POSITIVE_INFINITY },
    { playback_offset_ms: 86_400_001 },
    { scalar: -0.01 },
    { scalar: 1.01 },
    { scalar: Number.NaN },
    { scalar: Number.POSITIVE_INFINITY },
  ];

  for (const values of hostile) {
    const result = reducePresentation(state, mouth(playbackP, 1, values));
    assert.deepEqual(result.state, state, JSON.stringify(values));
    assert.deepEqual(result.effects, [], JSON.stringify(values));
  }
});

test("resume reconciliation replaces the snapshot while retaining caller sequencing", () => {
  let state = reducePresentation(initialPresentationState(), speaking(7, playbackP)).state;
  state = reducePresentation(state, mouth(playbackP, 1)).state;
  state = reducePresentation(state, { type: "suspend", visibility: "occluded" }).state;

  const result = reducePresentation(state, {
    type: "reconcile_presentation",
    payload: {
      last_projection_sequence: 9,
      generation_id: generation,
      phase: "speaking",
      playback_id: playbackQ,
      reduced_motion: true,
    },
  });

  assert.deepEqual(result.state, {
    lastProjectionSequence: 9,
    generationID: generation,
    phase: "speaking",
    playbackID: playbackQ,
    mouthScalar: 0,
    reducedMotion: true,
    suspended: false,
    terminated: false,
  });
  assert.deepEqual(result.effects, [{
    type: "reconcile",
    lastProjectionSequence: 9,
    generationID: generation,
    phase: "speaking",
    playbackID: playbackQ,
    mouthScalar: 0,
    reducedMotion: true,
  }]);
});

test("presentation reducer rejects unsafe projection sequences", () => {
  const state = initialPresentationState();
  const result = reducePresentation(state, {
    type: "project_phase",
    payload: {
      projection_sequence: Number.MAX_SAFE_INTEGER + 1,
      generation_id: null,
      phase: "idle",
      playback_id: null,
    },
  });
  assert.deepEqual(result.state, state);
  assert.deepEqual(result.effects, []);
});

test("reconciliation cannot lower the retained projection sequence", () => {
  const state = reducePresentation(initialPresentationState(), speaking(7, playbackP)).state;
  const result = reducePresentation(state, {
    type: "reconcile_presentation",
    payload: {
      last_projection_sequence: 6,
      generation_id: generation,
      phase: "speaking",
      playback_id: playbackP,
      reduced_motion: false,
    },
  });
  assert.deepEqual(result.state, state);
  assert.deepEqual(result.effects, []);
});

function speaking(sequence: number, playbackID: string) {
  return {
    type: "project_phase" as const,
    payload: {
      projection_sequence: sequence,
      generation_id: generation,
      phase: "speaking" as const,
      playback_id: playbackID,
    },
  };
}

function mouth(
  playbackID: string,
  cueIndex: number,
  overrides: Partial<{
    cue_index: number;
    playback_offset_ms: number;
    scalar: number;
  }> = {},
) {
  return {
    type: "set_mouth" as const,
    payload: {
      generation_id: generation,
      playback_id: playbackID,
      cue_index: cueIndex,
      playback_offset_ms: cueIndex * 100,
      scalar: 0.5,
      ...overrides,
    },
  };
}
