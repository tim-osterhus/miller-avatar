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
  type LoadProfilePayload,
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
const modelToken = "22222222-2222-4222-8222-222222222222";
const motionToken = "33333333-3333-4333-8333-333333333333";
const replacementMotionToken = "55555555-5555-4555-8555-555555555555";
const generationID = "33333333-3333-4333-8333-333333333333";
const playbackID = "44444444-4444-4444-8444-444444444444";
const replacementGenerationID = "55555555-5555-4555-8555-555555555555";
const replacementPlaybackID = "66666666-6666-4666-8666-666666666666";
const roles = ["idle", "listening", "thinking", "speaking", "success", "failure"] as const;
const steadyRoles = ["idle", "listening", "thinking", "speaking"] as const;
const motionStatuses = ["ready", "missing", "rejected", "load_failed", "timed_out", "runtime_failed"] as const;

assert.equal(bridgeContract.commandSchema, "miller-avatar.presentation-command/v2");
assert.equal(bridgeContract.observationSchema, "miller-avatar.presentation-observation/v2");
assert.equal(bridgeContract.maximumMessageBytes, 16_384);
assert.equal(bridgeContract.maximumContainerDepth, 8);
assert.equal(bridgeContract.maximumArrayLength, 64);
assert.equal(bridgeContract.maximumSafeInteger, 9_007_199_254_740_991);

assert.doesNotThrow(() => observationDecoder().decode(JSON.stringify(observationAt(
  1,
  1,
  "profile_model_loaded",
  {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: { aa: true, look_at: true, spring_bone: false, mtoon_materials: 10_240 },
  },
))));
assert.throws(() => observationDecoder().decode(JSON.stringify(observationAt(
  1,
  1,
  "profile_model_loaded",
  {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: { aa: true, look_at: true, spring_bone: false, mtoon_materials: 10_241 },
  },
))), /invalid_value/);

for (const [key, maximum] of Object.entries({
  visible_meshes: 40_960,
  decoded_textures: 1_280,
  material_bindings: 10_240,
})) {
  const accepted = { ...firstFramePayload(), [key]: maximum };
  assert.doesNotThrow(() => {
    const decoder = observationDecoder();
    decoder.decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: capabilities(),
    })));
    decoder.decode(JSON.stringify(observationAt(2, 1, "first_frame", accepted)));
  }, `${key} accepts HQ maximum`);

  const rejected = { ...accepted, [key]: maximum + 1 };
  assert.throws(() => {
    const decoder = observationDecoder();
    decoder.decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: capabilities(),
    })));
    decoder.decode(JSON.stringify(observationAt(2, 1, "first_frame", rejected)));
  }, /invalid_value/, `${key} rejects above HQ maximum`);
}

const validNames = fixtureNames("valid");
assert.deepEqual(validNames, [
  "command-configure.json",
  "command-dispose.json",
  "command-load-profile.json",
  "command-project-phase.json",
  "command-project-succeeded.json",
  "command-reset.json",
  "command-set-mouth-vowels.json",
  "command-set-mouth.json",
  "command-set-policy.json",
  "command-set-visibility.json",
  "observation-disposed.json",
  "observation-failed.json",
  "observation-first-frame.json",
  "observation-motion-active.json",
  "observation-motion-status.json",
  "observation-profile-model-loaded-vowels.json",
  "observation-profile-model-loaded.json",
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
  } else if (["thinking", "responding", "succeeded", "stopped", "failed"].includes(phase)) {
    generation_id = generationID;
  }
  assert.doesNotThrow(() =>
    commandDecoder().decode(JSON.stringify(command("project_phase", {
      projection_sequence: 1,
      generation_id,
      phase,
      playback_id,
    }))),
  );
}

assert.doesNotThrow(() => commandDecoder().decode(JSON.stringify(commandAt(1, "project_phase", {
  projection_sequence: 1,
  generation_id: generationID,
  phase: "succeeded",
  playback_id: null,
}))));

assert.throws(() => commandDecoder().decode(JSON.stringify(commandAt(1, "project_phase", {
  projection_sequence: 1,
  generation_id: null,
  phase: "succeeded",
  playback_id: null,
}))), /invalid_value/);

assert.throws(() => commandDecoder().decode(JSON.stringify(commandAt(1, "project_phase", {
  projection_sequence: 1,
  generation_id: generationID,
  phase: "succeeded",
  playback_id: playbackID,
}))), /invalid_value/);

for (const visibility of presentationVisibilities) {
  assert.doesNotThrow(() =>
    commandDecoder().decode(JSON.stringify(command("set_visibility", { visibility }))),
  );
}

for (const reason of resetReasons) {
  assert.doesNotThrow(() =>
    commandDecoder().decode(JSON.stringify(command("reset", {
      generation_id: reason === "operator" ? null : generationID,
      reason,
    }))),
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
      observationDecoder().decode(JSON.stringify(observation("failed", { code, operation }))),
    );
  }
}

for (const code of [
  "motion_rejected",
  "bookmark_unavailable",
  "quarantined",
  "motion_load_failed",
  "motion_load_timeout",
  "motion_runtime_failed",
  "cancelled",
]) {
  assert.throws(() =>
    observationDecoder().decode(JSON.stringify(observation("failed", {
      code,
      operation: "load",
    }))),
  );
}

for (const key of ["path", "url", "exception", "asset_metadata"]) {
  assert.throws(() =>
    observationDecoder().decode(JSON.stringify(observation("failed", {
      code: "render_failed",
      operation: "render",
      [key]: "not allowed",
    }))),
  );
}

testLoadProfileShapeAndOneShotRule();
testObservationIdentityAndCausality();
testMotionStatusAndActiveMatrices();
testStructuralBoundaries();
testMouthCuePolicyValidation();

console.log(
  `contract fixtures: ${validNames.length} valid accepted, ${invalidNames.length} invalid rejected`,
);

function testLoadProfileShapeAndOneShotRule(): void {
  const decoder = commandDecoder();
  const envelope = decoder.decode(JSON.stringify(command("load_profile", loadProfilePayload())));
  assert.equal(envelope.command.type, "load_profile");
  assert.throws(() =>
    decoder.decode(JSON.stringify(commandAt(2, "load_profile", loadProfilePayload()))),
    /invalid_sequence/,
  );

  for (const mutation of [
    (payload: Record<string, unknown>) => {
      const bindings = payload.motion_bindings as Record<string, unknown>;
      delete bindings.failure;
    },
    (payload: Record<string, unknown>) => {
      (payload.motion_bindings as Record<string, unknown>).unexpected = { status: "missing", token: null };
    },
    (payload: Record<string, unknown>) => {
      ((payload.motion_bindings as Record<string, unknown>).idle as Record<string, unknown>).extra = false;
    },
    (payload: Record<string, unknown>) => {
      ((payload.motion_bindings as Record<string, unknown>).idle as Record<string, unknown>).status = "ready";
      ((payload.motion_bindings as Record<string, unknown>).idle as Record<string, unknown>).token = null;
    },
    (payload: Record<string, unknown>) => {
      ((payload.motion_bindings as Record<string, unknown>).idle as Record<string, unknown>).status = "missing";
      ((payload.motion_bindings as Record<string, unknown>).idle as Record<string, unknown>).token = motionToken;
    },
    (payload: Record<string, unknown>) => {
      ((payload.motion_bindings as Record<string, unknown>).idle as Record<string, unknown>).status = "unknown";
    },
  ]) {
    const payload = structuredClone(loadProfilePayload()) as Record<string, unknown>;
    mutation(payload);
    assert.throws(() => commandDecoder().decode(JSON.stringify(command("load_profile", payload))));
  }
}

function testObservationIdentityAndCausality(): void {
  const expectedProfile = loadProfilePayload({
    idle: { status: "ready", token: motionToken },
    success: { status: "ready", token: replacementMotionToken },
  }) as unknown as LoadProfilePayload;
  const decoder = new PresentationObservationDecoder(sessionID, expectedProfile, 4);
  decoder.setExpectedPhaseCauseSequence(9);
  decoder.decode(JSON.stringify(observationAt(1, 4, "profile_model_loaded", {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: capabilities(),
  })));
  decoder.decode(JSON.stringify(observationAt(2, 4, "first_frame", firstFramePayload())));
  decoder.decode(JSON.stringify(observationAt(3, 4, "motion_status", {
    profile_revision: 1,
    model_token: modelToken,
    motion_token: motionToken,
    role: "idle",
    status: "ready",
    motion_code: null,
  })));
  decoder.decode(JSON.stringify(observationAt(4, 9, "motion_active", {
    profile_revision: 1,
    model_token: modelToken,
    motion_token: motionToken,
    role: "idle",
    mode: "loop",
  })));

  const unknownMotion = new PresentationObservationDecoder(sessionID, expectedProfile, 4);
  unknownMotion.decode(JSON.stringify(observationAt(1, 4, "profile_model_loaded", {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: capabilities(),
  })));
  assert.throws(() => unknownMotion.decode(JSON.stringify(observationAt(2, 4, "motion_status", {
    profile_revision: 1,
    model_token: modelToken,
    motion_token: replacementMotionToken,
    role: "idle",
    status: "ready",
    motion_code: null,
  }))));

  const otherSession = observationAt(1, 4, "profile_model_loaded", {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: capabilities(),
  });
  otherSession.session_id = "99999999-9999-4999-8999-999999999999";
  assert.throws(() => new PresentationObservationDecoder(sessionID).decode(JSON.stringify(otherSession)), /stale_session/);

  for (const badPayload of [
    { ...firstFramePayload(), profile_revision: 2 },
    { ...firstFramePayload(), model_token: replacementMotionToken },
  ]) {
    const isolated = new PresentationObservationDecoder(sessionID, expectedProfile, 4);
    isolated.decode(JSON.stringify(observationAt(1, 4, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: capabilities(),
    })));
    assert.throws(() => isolated.decode(JSON.stringify(observationAt(2, 4, "first_frame", badPayload))));
  }
  const wrongCause = new PresentationObservationDecoder(sessionID, expectedProfile);
  wrongCause.decode(JSON.stringify(observationAt(1, 4, "profile_model_loaded", {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: capabilities(),
  })));
  assert.throws(() => wrongCause.decode(JSON.stringify(observationAt(2, 5, "first_frame", firstFramePayload()))));

  const missingCause = new PresentationObservationDecoder(sessionID);
  assert.throws(() => missingCause.decode(JSON.stringify(observation("profile_model_loaded", {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: capabilities(),
  }))));

  const disposed = new PresentationObservationDecoder(sessionID);
  disposed.decode(JSON.stringify(observation("disposed", { reason: "operator" })));
  assert.throws(() => disposed.decode(JSON.stringify(observationAt(2, 1, "motion_status", {
    profile_revision: 1,
    model_token: modelToken,
    motion_token: motionToken,
    role: "idle",
    status: "ready",
    motion_code: null,
  }))), /disposed/);
}

function testMotionStatusAndActiveMatrices(): void {
  for (const status of motionStatuses) {
    const decoder = new PresentationObservationDecoder(sessionID);
    decoder.decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: capabilities(),
    })));
    const token = ["ready", "load_failed", "timed_out", "runtime_failed"].includes(status)
      ? motionToken
      : null;
    const motion_code = status === "load_failed"
      ? "motion_load_failed"
      : status === "timed_out"
        ? "motion_load_timeout"
        : status === "runtime_failed"
          ? "motion_runtime_failed"
          : null;
    assert.doesNotThrow(() => decoder.decode(JSON.stringify(observationAt(2, 1, "motion_status", {
      profile_revision: 1,
      model_token: modelToken,
      motion_token: token,
      role: "idle",
      status,
      motion_code,
    }))));
  }

  for (const bad of [
    { status: "ready", token: null, motion_code: null },
    { status: "missing", token: motionToken, motion_code: null },
    { status: "rejected", token: null, motion_code: "motion_rejected" },
    { status: "load_failed", token: motionToken, motion_code: "motion_runtime_failed" },
    { status: "timed_out", token: motionToken, motion_code: null },
    { status: "runtime_failed", token: null, motion_code: "motion_runtime_failed" },
  ]) {
    const decoder = new PresentationObservationDecoder(sessionID);
    decoder.decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: capabilities(),
    })));
    assert.throws(() => decoder.decode(JSON.stringify(observationAt(2, 1, "motion_status", {
      profile_revision: 1,
      model_token: modelToken,
      motion_token: bad.token,
      role: "idle",
      status: bad.status,
      motion_code: bad.motion_code,
    }))));
  }

  const activeCases = [
    { role: "idle", token: motionToken, mode: "loop" },
    { role: "success", token: motionToken, mode: "one_shot" },
    { role: null, token: null, mode: "rest" },
  ];
  for (const active of activeCases) {
    const decoder = new PresentationObservationDecoder(sessionID);
    decoder.decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: capabilities(),
    })));
    assert.doesNotThrow(() => decoder.decode(JSON.stringify(observationAt(2, 8, "motion_active", {
      profile_revision: 1,
      model_token: modelToken,
      motion_token: active.token,
      role: active.role,
      mode: active.mode,
    }))));
  }
  for (const active of [
    { role: "success", token: motionToken, mode: "loop" },
    { role: "idle", token: motionToken, mode: "one_shot" },
    { role: "idle", token: null, mode: "rest" },
    { role: null, token: motionToken, mode: "rest" },
  ]) {
    const decoder = new PresentationObservationDecoder(sessionID);
    decoder.decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: capabilities(),
    })));
    assert.throws(() => decoder.decode(JSON.stringify(observationAt(2, 8, "motion_active", {
      profile_revision: 1,
      model_token: modelToken,
      motion_token: active.token,
      role: active.role,
      mode: active.mode,
    }))));
  }

  const expectedProfile = loadProfilePayload({
    idle: { status: "ready", token: motionToken },
  }) as unknown as LoadProfilePayload;
  const runtimeFailure = new PresentationObservationDecoder(
    sessionID,
    expectedProfile,
    4,
  );
  runtimeFailure.setExpectedPhaseCauseSequence(9);
  runtimeFailure.decode(JSON.stringify(observationAt(1, 4, "profile_model_loaded", {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: capabilities(),
  })));
  assert.doesNotThrow(() => runtimeFailure.decode(JSON.stringify(observationAt(2, 9, "motion_status", {
    profile_revision: 1,
    model_token: modelToken,
    motion_token: motionToken,
    role: "idle",
    status: "runtime_failed",
    motion_code: "motion_runtime_failed",
  }))));

  const profileFailure = new PresentationObservationDecoder(
    sessionID,
    expectedProfile,
    4,
  );
  profileFailure.decode(JSON.stringify(observationAt(1, 4, "profile_model_loaded", {
    profile_revision: 1,
    model_token: modelToken,
    capabilities: capabilities(),
  })));
  assert.throws(() => profileFailure.decode(JSON.stringify(observationAt(2, 9, "motion_status", {
    profile_revision: 1,
    model_token: modelToken,
    motion_token: motionToken,
    role: "idle",
    status: "load_failed",
    motion_code: "motion_load_failed",
  }))), /invalid_sequence/);
}

function testStructuralBoundaries(): void {
  assert.throws(() => commandDecoder().decode(
    new Uint8Array([0x7b, 0x22, 0x78, 0x22, 0x3a, 0x22, 0xff, 0x22, 0x7d]),
  ));
  assert.throws(() => commandDecoder().decode(
    `{"schema":"miller-avatar.presentation-command/v2","session_id":"${sessionID}","sequence":1,"type":"configure","payload":{"profile":"lightweight","reduced_motion":false,"reduced_motion":true}}`,
  ), /duplicate_key/);

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
    assert.throws(() => decoder.decode(JSON.stringify(commandAt(3, "set_mouth", {
      ...invalidMouth,
      scalar: 0.5,
    }))), /invalid_sequence/);
  }
}

function testMouthCuePolicyValidation(): void {
  assert.throws(() =>
    commandDecoder().decode(JSON.stringify(command("configure", {
      profile: "lightweight",
      reduced_motion: false,
    }))), /invalid_keys/);
  assert.throws(() =>
    commandDecoder().decode(JSON.stringify(command("set_policy", {
      reduced_motion: false,
    }))), /invalid_keys/);
  assert.throws(() =>
    commandDecoder().decode(JSON.stringify(commandAt(1, "reconcile_presentation", {
      last_projection_sequence: null,
      generation_id: null,
      phase: "idle",
      playback_id: null,
      reduced_motion: false,
    }))), /invalid_keys/);
  assert.throws(() =>
    commandDecoder().decode(JSON.stringify(command("configure", {
      profile: "lightweight",
      reduced_motion: false,
      mouth_cues_enabled: "yes",
    }))), /invalid_value/);
  assert.throws(() =>
    commandDecoder().decode(JSON.stringify(command("set_policy", {
      reduced_motion: true,
      mouth_cues_enabled: 1,
    }))), /invalid_value/);

  const vowels = { aa: 0.9, ih: 0.8, ou: 0.7, ee: 0.6, oh: 0.5 };
  const cueEnvelope = commandDecoder();
  cueEnvelope.decode(JSON.stringify(commandAt(1, "project_phase", {
    projection_sequence: 1,
    generation_id: generationID,
    phase: "speaking",
    playback_id: playbackID,
  })));
  const enriched = cueEnvelope.decode(JSON.stringify(commandAt(2, "set_mouth", {
    generation_id: generationID,
    playback_id: playbackID,
    cue_index: 1,
    playback_offset_ms: 10,
    scalar: 0.25,
    vowels,
  })));
  assert.deepEqual(
    (enriched.command as { payload: Record<string, unknown> }).payload.vowels,
    vowels,
  );

  const legacyEnvelope = commandDecoder();
  legacyEnvelope.decode(JSON.stringify(commandAt(1, "project_phase", {
    projection_sequence: 1,
    generation_id: generationID,
    phase: "speaking",
    playback_id: playbackID,
  })));
  const legacy = legacyEnvelope.decode(JSON.stringify(commandAt(2, "set_mouth", {
    generation_id: generationID,
    playback_id: playbackID,
    cue_index: 1,
    playback_offset_ms: 10,
    scalar: 0.25,
  })));
  assert.equal("vowels" in (legacy.command as { payload: Record<string, unknown> }).payload, false);

  for (const badVowels of [
    { ...vowels, aa: 1.5 },
    { ...vowels, oh: -0.5 },
    { ...vowels, aa: Number.NaN },
    { ...vowels, ih: "0.8" },
  ]) {
    const decoder = commandDecoder();
    decoder.decode(JSON.stringify(commandAt(1, "project_phase", {
      projection_sequence: 1,
      generation_id: generationID,
      phase: "speaking",
      playback_id: playbackID,
    })));
    assert.throws(() => decoder.decode(JSON.stringify(commandAt(2, "set_mouth", {
      generation_id: generationID,
      playback_id: playbackID,
      cue_index: 1,
      playback_offset_ms: 10,
      scalar: 0.25,
      vowels: badVowels,
    }))), /invalid_value/);
  }

  const vowelCapabilities = {
    aa: true,
    look_at: true,
    spring_bone: false,
    mtoon_materials: 1,
    vowels: { aa: true, ih: true, ou: true, ee: true, oh: false },
  };
  const enrichedLoad = observationDecoder().decode(JSON.stringify(observationAt(
    1,
    1,
    "profile_model_loaded",
    { profile_revision: 1, model_token: modelToken, capabilities: vowelCapabilities },
  )));
  assert.deepEqual(
    (enrichedLoad.observation as { payload: { capabilities: Record<string, unknown> } })
      .payload.capabilities.vowels,
    vowelCapabilities.vowels,
  );
  assert.throws(() =>
    observationDecoder().decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: { ...vowelCapabilities, aa: false },
    }))), /invalid_value/);
  assert.throws(() =>
    observationDecoder().decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
      profile_revision: 1,
      model_token: modelToken,
      capabilities: {
        ...vowelCapabilities,
        vowels: { ...vowelCapabilities.vowels, ou: "true" },
      },
    }))), /invalid_value/);

  for (const badCapabilities of [
    { ...vowelCapabilities, vowels: null },
    { ...vowelCapabilities, vowels: { aa: true, ih: true, ou: true, ee: true } },
    { ...vowelCapabilities, vowels: { ...vowelCapabilities.vowels, blink: true } },
  ]) {
    assert.throws(() =>
      observationDecoder().decode(JSON.stringify(observationAt(1, 1, "profile_model_loaded", {
        profile_revision: 1,
        model_token: modelToken,
        capabilities: badCapabilities,
      }))), /invalid_(keys|value|shape)/);
  }

  Object.defineProperty(Object.prototype, "vowels", {
    configurable: true,
    value: { aa: false, ih: false, ou: false, ee: false, oh: false },
  });
  try {
    const scalarOnlyDecoder = commandDecoder();
    scalarOnlyDecoder.decode(JSON.stringify(commandAt(1, "project_phase", {
      projection_sequence: 1,
      generation_id: generationID,
      phase: "speaking",
      playback_id: playbackID,
    })));
    const scalarOnly = scalarOnlyDecoder.decode(JSON.stringify(commandAt(2, "set_mouth", {
      generation_id: generationID,
      playback_id: playbackID,
      cue_index: 1,
      playback_offset_ms: 10,
      scalar: 0.25,
    })));
    assert.equal(Object.hasOwn(
      (scalarOnly.command as { payload: Record<string, unknown> }).payload,
      "vowels",
    ), false);

    const legacyLoad = observationDecoder().decode(JSON.stringify(observationAt(
      1,
      1,
      "profile_model_loaded",
      { profile_revision: 1, model_token: modelToken, capabilities: capabilities() },
    )));
    assert.equal(Object.hasOwn(
      (legacyLoad.observation as { payload: { capabilities: Record<string, unknown> } })
        .payload.capabilities,
      "vowels",
    ), false);
  } finally {
    Reflect.deleteProperty(Object.prototype, "vowels");
  }
}

function capabilities(): Record<string, unknown> {
  return { aa: true, look_at: true, spring_bone: false, mtoon_materials: 1 };
}

function firstFramePayload(): Record<string, unknown> {
  return {
    profile_revision: 1,
    model_token: modelToken,
    viewport_width: 800,
    viewport_height: 600,
    visible_meshes: 1,
    decoded_textures: 2,
    material_bindings: 2,
    alpha_probe_pixels: 5,
  };
}

function loadProfilePayload(
  overrides: Record<string, { status: string; token: string | null }> = {},
): Record<string, unknown> {
  return {
    profile_revision: 1,
    model_token: modelToken,
    motion_bindings: Object.fromEntries(roles.map((role) => [
      role,
      overrides[role] ?? { status: "missing", token: null },
    ])),
  };
}

function fixtureNames(directory: string): string[] {
  return readdirSync(resolve(fixtureRoot, directory))
    .filter((name) => name.endsWith(".json"))
    .sort();
}

function decodeFixture(directory: string, name: string): void {
  const fixture = JSON.parse(readFileSync(resolve(fixtureRoot, directory, name), "utf8")) as Fixture;
  const decoder = fixture.direction === "command"
    ? new PresentationCommandDecoder(fixture.session_id)
    : new PresentationObservationDecoder(fixture.session_id);
  for (const message of fixture.messages) decoder.decode(encoded(message, fixture.mutation));
}

function encoded(message: Record<string, unknown>, mutation?: string): string | Uint8Array {
  const copy = structuredClone(message);
  switch (mutation) {
    case undefined:
      return JSON.stringify(copy);
    case "add_depth_nine": {
      let nested: Record<string, unknown> = { leaf: true };
      for (let index = 0; index < 7; index += 1) nested = { nested };
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
      return JSON.stringify(copy).replace('"profile":"lightweight"', '"profile":"light\\nweight"');
    case "raw_invalid_utf8":
      return new Uint8Array([0x7b, 0x22, 0x78, 0x22, 0x3a, 0x22, 0xff, 0x22, 0x7d]);
    case "duplicate_reduced_motion_key": {
      const json = JSON.stringify(copy);
      return json.replace(
        /"reduced_motion":(true|false)/u,
        (_match, value: string) => `"reduced_motion":${value},"reduced_motion":${value}`,
      );
    }
    default:
      throw new Error(`unknown fixture mutation: ${mutation}`);
  }
}

function command(type: string, payload: Record<string, unknown>): Record<string, unknown> {
  return commandAt(1, type, payload);
}

function commandAt(sequence: number, type: string, payload: Record<string, unknown>): Record<string, unknown> {
  return {
    schema: bridgeContract.commandSchema,
    session_id: sessionID,
    sequence,
    type,
    payload,
  };
}

function observation(type: string, payload: Record<string, unknown>): Record<string, unknown> {
  return observationAt(1, null, type, payload);
}

function observationAt(
  sequence: number,
  causedBySequence: number | null,
  type: string,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  return {
    schema: bridgeContract.observationSchema,
    session_id: sessionID,
    sequence,
    caused_by_sequence: causedBySequence,
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
