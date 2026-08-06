import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  bridgeContract,
  disposalReasons,
  failureCodes,
  failureOperations,
  presentationPhases,
  presentationVisibilities,
  resetReasons,
} from "../src/contract.js";
import {
  PresentationCommandDecoder,
  PresentationObservationDecoder,
} from "../src/validation.js";

interface Fixture {
  direction: "command" | "observation";
  session_id: string;
  messages: Record<string, unknown>[];
  mutation?: string;
}

const fixtureRoot = resolve(process.cwd(), "../Tests/ContractFixtures");
const sessionID = "11111111-1111-4111-8111-111111111111";
const generationID = "33333333-3333-4333-8333-333333333333";
const playbackID = "44444444-4444-4444-8444-444444444444";
const replacementGenerationID = "55555555-5555-4555-8555-555555555555";
const replacementPlaybackID = "66666666-6666-4666-8666-666666666666";

assert.equal(bridgeContract.commandSchema, "miller-avatar.presentation-command/v1");
assert.equal(bridgeContract.observationSchema, "miller-avatar.presentation-observation/v1");
assert.equal(bridgeContract.maximumMessageBytes, 16_384);
assert.equal(bridgeContract.maximumContainerDepth, 8);
assert.equal(bridgeContract.maximumArrayLength, 64);
assert.equal(bridgeContract.maximumSafeInteger, 9_007_199_254_740_991);

const validNames = fixtureNames("valid");
assert.deepEqual(validNames, [
  "command-configure.json",
  "command-dispose.json",
  "command-load-asset.json",
  "command-project-phase.json",
  "command-reset.json",
  "command-set-mouth.json",
  "command-set-policy.json",
  "command-set-visibility.json",
  "observation-asset-loaded.json",
  "observation-disposed.json",
  "observation-failed.json",
  "observation-first-frame.json",
  "observation-renderer-ready.json",
  "observation-resumed.json",
  "observation-suspended.json",
  "observation-wrapper-ready.json",
]);
for (const name of validNames) {
  assert.doesNotThrow(() => decodeFixture("valid", name), name);
}

const invalidNames = fixtureNames("invalid");
assert.ok(invalidNames.length >= 24);
for (const name of invalidNames) {
  assert.throws(() => decodeFixture("invalid", name), name);
}

for (const phase of presentationPhases) {
  let generation_id: string | null = null;
  let playback_id: string | null = null;
  if (phase === "speaking") {
    generation_id = generationID;
    playback_id = playbackID;
  } else if (["thinking", "responding", "stopped", "failed"].includes(phase)) {
    generation_id = generationID;
  }
  assert.doesNotThrow(() =>
    commandDecoder().decode(
      JSON.stringify(
        command("project_phase", {
          projection_sequence: 1,
          generation_id,
          phase,
          playback_id,
        }),
      ),
    ),
  );
}

for (const visibility of presentationVisibilities) {
  assert.doesNotThrow(() =>
    commandDecoder().decode(
      JSON.stringify(command("set_visibility", { visibility })),
    ),
  );
}

for (const reason of resetReasons) {
  assert.doesNotThrow(() =>
    commandDecoder().decode(
      JSON.stringify(
        command("reset", {
          generation_id: reason === "operator" ? null : generationID,
          reason,
        }),
      ),
    ),
  );
}

for (const reason of disposalReasons) {
  assert.doesNotThrow(() =>
    commandDecoder().decode(JSON.stringify(command("dispose", { reason }))),
  );
}

for (const code of failureCodes) {
  for (const operation of failureOperations) {
    assert.doesNotThrow(() =>
      observationDecoder().decode(
        JSON.stringify(observation("failed", { code, operation })),
      ),
    );
  }
}

for (const key of ["path", "url", "exception", "asset_metadata"]) {
  assert.throws(() =>
    observationDecoder().decode(
      JSON.stringify(
        observation("failed", {
          code: "render_failed",
          operation: "render",
          [key]: "not allowed",
        }),
      ),
    ),
  );
}

assert.throws(() =>
  commandDecoder().decode(
    new Uint8Array([0x7b, 0x22, 0x78, 0x22, 0x3a, 0x22, 0xff, 0x22, 0x7d]),
  ),
);

assert.throws(() =>
  commandDecoder().decode(
    `{"schema":"miller-avatar.presentation-command/v1","session_id":"${sessionID}","sequence":1,"type":"configure","payload":{"profile":"lightweight","reduced_motion":false,"reduced_motion":true}}`,
  ),
  /duplicate_key/,
);

assert.throws(() =>
  commandDecoder().decode(
    encoded(
      command("configure", { profile: "lightweight", reduced_motion: false }),
      "duplicate_reduced_motion_key",
    ),
  ),
  /duplicate_key/,
);

for (const invalidMouth of [
  { generation_id: replacementGenerationID, playback_id: playbackID, cue_index: 3, playback_offset_ms: 20 },
  { generation_id: generationID, playback_id: replacementPlaybackID, cue_index: 3, playback_offset_ms: 20 },
  { generation_id: generationID, playback_id: playbackID, cue_index: 2, playback_offset_ms: 20 },
  { generation_id: generationID, playback_id: playbackID, cue_index: 3, playback_offset_ms: 9 },
]) {
  const decoder = commandDecoder();
  decoder.decode(JSON.stringify(commandAt(1, "project_phase", {
    projection_sequence: 1,
    generation_id: generationID,
    phase: "speaking",
    playback_id: playbackID,
  })));
  decoder.decode(JSON.stringify(commandAt(2, "set_mouth", {
    generation_id: generationID,
    playback_id: playbackID,
    cue_index: 2,
    playback_offset_ms: 10,
    scalar: 0.5,
  })));
  assert.throws(() =>
    decoder.decode(JSON.stringify(commandAt(3, "set_mouth", { ...invalidMouth, scalar: 0.5 }))),
    /invalid_sequence/,
  );
}

const hiddenLeaseDecoder = commandDecoder();
hiddenLeaseDecoder.decode(JSON.stringify(commandAt(1, "project_phase", {
  projection_sequence: 1,
  generation_id: generationID,
  phase: "speaking",
  playback_id: playbackID,
})));
hiddenLeaseDecoder.decode(JSON.stringify(commandAt(2, "set_mouth", {
  generation_id: generationID,
  playback_id: playbackID,
  cue_index: 1,
  playback_offset_ms: 0,
  scalar: 0.5,
})));
hiddenLeaseDecoder.decode(JSON.stringify(commandAt(3, "set_visibility", { visibility: "hidden" })));
const hiddenDecoderState = hiddenLeaseDecoder as unknown as {
  activeGenerationID: string | null;
  activePlaybackID: string | null;
  lastCueIndex?: number;
  lastPlaybackOffsetMilliseconds?: number;
};
assert.equal(hiddenDecoderState.activeGenerationID, generationID);
assert.equal(hiddenDecoderState.activePlaybackID, null);
assert.equal(hiddenDecoderState.lastCueIndex, undefined);
assert.equal(hiddenDecoderState.lastPlaybackOffsetMilliseconds, undefined);
assert.throws(() =>
  hiddenLeaseDecoder.decode(JSON.stringify(commandAt(4, "set_mouth", {
    generation_id: generationID,
    playback_id: playbackID,
    cue_index: 2,
    playback_offset_ms: 1,
    scalar: 0.5,
  }))),
  /invalid_sequence/,
);

const reconcileDecoder = commandDecoder();
reconcileDecoder.decode(JSON.stringify(commandAt(1, "project_phase", {
  projection_sequence: 4,
  generation_id: generationID,
  phase: "speaking",
  playback_id: playbackID,
})));
reconcileDecoder.decode(JSON.stringify(commandAt(2, "set_visibility", { visibility: "hidden" })));
const reconciled = reconcileDecoder.decode(JSON.stringify(commandAt(3, "reconcile_presentation", {
  last_projection_sequence: 4,
  generation_id: generationID,
  phase: "speaking",
  playback_id: playbackID,
  reduced_motion: true,
})));
assert.equal(reconciled.command.type, "reconcile_presentation");
reconcileDecoder.decode(JSON.stringify(commandAt(4, "project_phase", {
  projection_sequence: 5,
  generation_id: null,
  phase: "idle",
  playback_id: null,
})));
assert.throws(() =>
  commandDecoder().decode(JSON.stringify(command("reconcile_presentation", {
    last_projection_sequence: Number.MAX_SAFE_INTEGER + 1,
    generation_id: null,
    phase: "idle",
    playback_id: null,
    reduced_motion: false,
  }))),
  /invalid_value/,
);
assert.throws(() =>
  reconcileDecoder.decode(JSON.stringify(commandAt(5, "reconcile_presentation", {
    last_projection_sequence: 3,
    generation_id: generationID,
    phase: "speaking",
    playback_id: playbackID,
    reduced_motion: false,
  }))),
  /invalid_sequence/,
);

console.log(
  `contract fixtures: ${validNames.length} valid accepted, ${invalidNames.length} invalid rejected`,
);

function fixtureNames(directory: string): string[] {
  return readdirSync(resolve(fixtureRoot, directory))
    .filter((name) => name.endsWith(".json"))
    .sort();
}

function decodeFixture(directory: string, name: string): void {
  const fixture = JSON.parse(
    readFileSync(resolve(fixtureRoot, directory, name), "utf8"),
  ) as Fixture;
  const decoder =
    fixture.direction === "command"
      ? new PresentationCommandDecoder(fixture.session_id)
      : new PresentationObservationDecoder(fixture.session_id);
  for (const message of fixture.messages) {
    decoder.decode(encoded(message, fixture.mutation));
  }
}

function encoded(
  message: Record<string, unknown>,
  mutation?: string,
): string | Uint8Array {
  const copy = structuredClone(message);
  switch (mutation) {
    case undefined:
      return JSON.stringify(copy);
    case "add_depth_nine": {
      let nested: Record<string, unknown> = { leaf: true };
      for (let index = 0; index < 7; index += 1) {
        nested = { nested };
      }
      copy.probe = nested;
      return JSON.stringify(copy);
    }
    case "add_array_65":
      copy.probe = Array.from({ length: 65 }, () => 0);
      return JSON.stringify(copy);
    case "add_string_over_64_bytes":
      copy.probe = "é".repeat(33);
      return JSON.stringify(copy);
    case "pad_to_16385_bytes": {
      const json = JSON.stringify(copy);
      return json + " ".repeat(bridgeContract.maximumMessageBytes + 1 - json.length);
    }
    case "replace_scalar_with_nan":
      return JSON.stringify(copy).replace('"scalar":0.5', '"scalar":NaN');
    case "replace_profile_with_control":
      return JSON.stringify(copy).replace(
        '"profile":"lightweight"',
        '"profile":"light\\nweight"',
      );
    case "raw_invalid_utf8":
      return new Uint8Array([0x7b, 0x22, 0x78, 0x22, 0x3a, 0x22, 0xff, 0x22, 0x7d]);
    case "duplicate_reduced_motion_key": {
      const json = JSON.stringify(copy);
      const duplicate = json.replace(
        /"reduced_motion":(true|false)/u,
        (_match, value: string) => `"reduced_motion":${value},"reduced_motion":${value}`,
      );
      if (duplicate === json) throw new Error("fixture has no reduced_motion key");
      return duplicate;
    }
    default:
      throw new Error(`unknown fixture mutation: ${mutation}`);
  }
}

function command(type: string, payload: Record<string, unknown>): Record<string, unknown> {
  return commandAt(1, type, payload);
}

function commandAt(
  sequence: number,
  type: string,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  return {
    schema: bridgeContract.commandSchema,
    session_id: sessionID,
    sequence,
    type,
    payload,
  };
}

function observation(
  type: string,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  return {
    schema: bridgeContract.observationSchema,
    session_id: sessionID,
    sequence: 1,
    caused_by_sequence: null,
    type,
    payload,
  };
}

function commandDecoder(): PresentationCommandDecoder {
  return new PresentationCommandDecoder(sessionID);
}

function observationDecoder(): PresentationObservationDecoder {
  return new PresentationObservationDecoder(sessionID);
}
