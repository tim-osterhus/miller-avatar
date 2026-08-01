// src/contract.ts
var bridgeContract = {
  commandSchema: "miller-avatar.presentation-command/v1",
  observationSchema: "miller-avatar.presentation-observation/v1",
  maximumMessageBytes: 16384,
  maximumContainerDepth: 8,
  maximumArrayLength: 64,
  maximumSafeInteger: Number.MAX_SAFE_INTEGER
};
var presentationPhases = [
  "idle",
  "listening",
  "transcribing",
  "thinking",
  "responding",
  "speaking",
  "stopped",
  "failed"
];
var presentationVisibilities = ["visible", "occluded", "hidden"];
var resetReasons = ["stopped", "cancelled", "replaced", "operator"];
var disposalReasons = [
  "operator",
  "hidden_before_live",
  "failure",
  "retry",
  "termination"
];
var failureCodes = [
  "bridge_invalid",
  "renderer_unavailable",
  "webgl_unavailable",
  "wrapper_timeout",
  "asset_rejected",
  "asset_load_failed",
  "asset_load_timeout",
  "render_failed",
  "context_lost",
  "scheme_rejected",
  "policy_violation",
  "resource_limit",
  "disposed_during_operation"
];
var failureOperations = [
  "startup",
  "configure",
  "load",
  "render",
  "suspend",
  "resume",
  "dispose",
  "scheme",
  "policy"
];

// src/lifecycle.ts
function reduceLifecycle(state, input) {
  if (input.type === "dispose" && (state === "disposing" || state === "disposed")) {
    return { state };
  }
  if (input.type === "dispose" && state !== "disposed") {
    return { state: "disposing", effect: "begin_disposal" };
  }
  if (input.type === "fail" && !["disposing", "disposed", "failed"].includes(state)) {
    return { state: "failed" };
  }
  if (state === "booting" && input.type === "configured") return { state: "ready" };
  if (state === "ready" && input.type === "load_started") return { state: "loading" };
  if (state === "loading" && input.type === "first_frame") return { state: "live" };
  if (state === "live" && input.type === "suspend") return { state: "suspended" };
  if (state === "suspended" && input.type === "resume") return { state: "live" };
  if (state === "disposing" && input.type === "disposed") return { state: "disposed" };
  return { state, effect: "rejected" };
}

// src/presentation.ts
function initialPresentationState() {
  return {
    generationID: null,
    phase: "idle",
    playbackID: null,
    mouthScalar: 0,
    reducedMotion: false,
    suspended: false,
    terminated: false
  };
}
function reducePresentation(state, input) {
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
    return changed({ ...state, suspended: false, mouthScalar: 0 }, [{ type: "reconcile" }]);
  }
  if (input.type === "renderer_failed" || input.type === "dispose") {
    return changed(revoke({ ...state, terminated: true }), [{ type: "clear_mouth" }]);
  }
  return unchanged(state);
}
function project(state, command) {
  const value = command.payload;
  if (!validPhase(value.phase, value.generation_id, value.playback_id)) return unchanged(state);
  if (value.projection_sequence <= (state.lastProjectionSequence ?? 0)) return unchanged(state);
  const replacesLease = value.generation_id !== state.generationID || value.playback_id !== state.playbackID || value.phase === "stopped" || value.phase === "failed";
  let next = {
    ...state,
    lastProjectionSequence: value.projection_sequence,
    generationID: value.generation_id,
    phase: value.phase,
    playbackID: value.playback_id
  };
  if (replacesLease) next = clearLeaseOutput(next);
  if (state.suspended) return changed(next, []);
  const effects = replacesLease ? [{ type: "clear_mouth" }] : [];
  effects.push({ type: "apply_projection", command });
  return changed(next, effects);
}
function mouth(state, command) {
  const cue = command.payload;
  if (!Number.isSafeInteger(cue.cue_index) || cue.cue_index < 1 || !Number.isSafeInteger(cue.playback_offset_ms) || cue.playback_offset_ms < 0 || cue.playback_offset_ms > 864e5 || !Number.isFinite(cue.scalar) || cue.scalar < 0 || cue.scalar > 1 || state.phase !== "speaking" || cue.generation_id !== state.generationID || cue.playback_id !== state.playbackID || cue.cue_index <= (state.lastCueIndex ?? 0) || cue.playback_offset_ms < (state.lastPlaybackOffsetMilliseconds ?? 0)) return unchanged(state);
  const accepted = {
    ...state,
    lastCueIndex: cue.cue_index,
    lastPlaybackOffsetMilliseconds: cue.playback_offset_ms
  };
  if (state.suspended || state.reducedMotion) return changed({ ...accepted, mouthScalar: 0 }, []);
  return changed({ ...accepted, mouthScalar: cue.scalar }, [{ type: "apply_mouth", command }]);
}
function policy(state, enabled) {
  if (enabled === state.reducedMotion) return unchanged(state);
  const next = { ...state, reducedMotion: enabled, mouthScalar: enabled ? 0 : state.mouthScalar };
  if (state.suspended) return changed(next, []);
  const effects = [{ type: "set_reduced_motion", enabled }];
  if (enabled) effects.push({ type: "clear_mouth" });
  return changed(next, effects);
}
function reset(state, generationID, reason) {
  if (!(generationID === null && reason === "operator") && generationID !== state.generationID) {
    return unchanged(state);
  }
  const next = revoke({ ...state, generationID: null, phase: "idle" });
  if (state.suspended) return changed(next, []);
  return changed(next, [
    { type: "clear_mouth" },
    { type: "reset", generationID, reason }
  ]);
}
function revoke(state) {
  return { ...clearLeaseOutput(state), playbackID: null };
}
function clearLeaseOutput(state) {
  const next = { ...state, mouthScalar: 0 };
  delete next.lastCueIndex;
  delete next.lastPlaybackOffsetMilliseconds;
  return next;
}
function validPhase(phase, generationID, playbackID) {
  if (phase === "speaking") return generationID !== null && playbackID !== null;
  if (["thinking", "responding", "stopped", "failed"].includes(phase)) {
    return generationID !== null && playbackID === null;
  }
  return generationID === null && playbackID === null;
}
function unchanged(state) {
  return { state, effects: [] };
}
function changed(state, effects) {
  return { state, effects };
}

// src/validation.ts
var BridgeValidationError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
    this.name = "BridgeValidationError";
  }
  code;
};
var PresentationCommandDecoder = class {
  constructor(sessionID) {
    this.sessionID = sessionID;
    requireUUID(sessionID);
  }
  sessionID;
  nextSequence = 1;
  lastProjectionSequence;
  activeGenerationID = null;
  activePlaybackID = null;
  lastCueIndex;
  lastPlaybackOffsetMilliseconds;
  disposed = false;
  dispose() {
    this.disposed = true;
    this.clearActiveLease();
  }
  decode(input) {
    if (this.disposed) {
      fail("disposed");
    }
    const object = decodeObject(input);
    requireKeys(object, ["schema", "session_id", "sequence", "type", "payload"]);
    if (requireString(object.schema) !== bridgeContract.commandSchema) {
      fail("invalid_value");
    }
    const sessionID = requireUUID(object.session_id);
    if (sessionID !== this.sessionID) {
      fail("stale_session");
    }
    const sequence = requireInteger(object.sequence);
    if (sequence !== this.nextSequence) {
      fail("invalid_sequence");
    }
    const type = requireString(object.type);
    const payload = requireObject(object.payload);
    const command = decodeCommand(type, payload);
    this.accept(command);
    this.nextSequence += 1;
    if (command.type === "dispose") {
      this.dispose();
    }
    return { session_id: sessionID, sequence, command };
  }
  accept(command) {
    switch (command.type) {
      case "project_phase": {
        const projection = command.payload;
        if (this.lastProjectionSequence !== void 0 && projection.projection_sequence <= this.lastProjectionSequence) {
          fail("invalid_sequence");
        }
        const replacesLease = projection.generation_id !== this.activeGenerationID || projection.playback_id !== this.activePlaybackID || projection.phase !== "speaking";
        this.lastProjectionSequence = projection.projection_sequence;
        this.activeGenerationID = projection.generation_id;
        this.activePlaybackID = projection.playback_id;
        if (replacesLease) this.clearCueLease();
        return;
      }
      case "set_mouth": {
        const cue = command.payload;
        if (cue.generation_id !== this.activeGenerationID || cue.playback_id !== this.activePlaybackID || cue.cue_index <= (this.lastCueIndex ?? 0) || cue.playback_offset_ms < (this.lastPlaybackOffsetMilliseconds ?? 0)) {
          fail("invalid_sequence");
        }
        this.lastCueIndex = cue.cue_index;
        this.lastPlaybackOffsetMilliseconds = cue.playback_offset_ms;
        return;
      }
      case "reset":
        if (command.payload.generation_id === null || command.payload.generation_id === this.activeGenerationID) {
          this.clearActiveLease();
        }
        return;
      case "set_visibility":
        if (command.payload.visibility === "hidden") this.revokePlaybackLease();
        return;
      case "dispose":
        this.clearActiveLease();
        return;
      default:
        return;
    }
  }
  clearActiveLease() {
    this.activeGenerationID = null;
    this.revokePlaybackLease();
  }
  revokePlaybackLease() {
    this.activePlaybackID = null;
    this.clearCueLease();
  }
  clearCueLease() {
    this.lastCueIndex = void 0;
    this.lastPlaybackOffsetMilliseconds = void 0;
  }
};
var PresentationObservationDecoder = class {
  constructor(sessionID) {
    this.sessionID = sessionID;
    requireUUID(sessionID);
  }
  sessionID;
  nextSequence = 1;
  lastFrames;
  lastUpdates;
  lastRenders;
  decode(input) {
    const object = decodeObject(input);
    requireKeys(object, [
      "schema",
      "session_id",
      "sequence",
      "caused_by_sequence",
      "type",
      "payload"
    ]);
    if (requireString(object.schema) !== bridgeContract.observationSchema) {
      fail("invalid_value");
    }
    const sessionID = requireUUID(object.session_id);
    if (sessionID !== this.sessionID) {
      fail("stale_session");
    }
    const sequence = requireInteger(object.sequence);
    if (sequence !== this.nextSequence) {
      fail("invalid_sequence");
    }
    const causedBySequence = object.caused_by_sequence === null ? null : requireInteger(object.caused_by_sequence, 1);
    const type = requireString(object.type);
    const payload = requireObject(object.payload);
    const observation = decodeObservation(type, payload);
    if (observation.type === "suspended" || observation.type === "resumed") {
      this.acceptCounters(
        observation.payload.frames,
        observation.payload.updates,
        observation.payload.renders
      );
    }
    this.nextSequence += 1;
    return {
      session_id: sessionID,
      sequence,
      caused_by_sequence: causedBySequence,
      observation
    };
  }
  acceptCounters(frames, updates, renders) {
    if (this.lastFrames !== void 0 && frames < this.lastFrames || this.lastUpdates !== void 0 && updates < this.lastUpdates || this.lastRenders !== void 0 && renders < this.lastRenders) {
      fail("invalid_sequence");
    }
    this.lastFrames = frames;
    this.lastUpdates = updates;
    this.lastRenders = renders;
  }
};
function decodeCommand(type, payload) {
  switch (type) {
    case "configure": {
      requireKeys(payload, ["profile", "reduced_motion"]);
      const profile = requireString(payload.profile);
      if (profile !== "lightweight") fail("invalid_value");
      return { type, payload: { profile, reduced_motion: requireBoolean(payload.reduced_motion) } };
    }
    case "load_asset":
      requireKeys(payload, ["asset_token"]);
      return { type, payload: { asset_token: requireUUID(payload.asset_token) } };
    case "project_phase": {
      requireKeys(payload, ["projection_sequence", "generation_id", "phase", "playback_id"]);
      const phase = requireVocabulary(payload.phase, presentationPhases);
      const generationID = requireOptionalUUID(payload.generation_id);
      const playbackID = requireOptionalUUID(payload.playback_id);
      requirePhaseIdentities(phase, generationID, playbackID);
      return {
        type,
        payload: {
          projection_sequence: requireInteger(payload.projection_sequence, 1),
          generation_id: generationID,
          phase,
          playback_id: playbackID
        }
      };
    }
    case "set_visibility":
      requireKeys(payload, ["visibility"]);
      return {
        type,
        payload: { visibility: requireVocabulary(payload.visibility, presentationVisibilities) }
      };
    case "set_policy":
      requireKeys(payload, ["reduced_motion"]);
      return { type, payload: { reduced_motion: requireBoolean(payload.reduced_motion) } };
    case "set_mouth":
      requireKeys(payload, [
        "generation_id",
        "playback_id",
        "cue_index",
        "playback_offset_ms",
        "scalar"
      ]);
      return {
        type,
        payload: {
          generation_id: requireUUID(payload.generation_id),
          playback_id: requireUUID(payload.playback_id),
          cue_index: requireInteger(payload.cue_index, 1),
          playback_offset_ms: requireInteger(payload.playback_offset_ms, 0, 864e5),
          scalar: requireNumber(payload.scalar, 0, 1)
        }
      };
    case "reset": {
      requireKeys(payload, ["generation_id", "reason"]);
      const generationID = requireOptionalUUID(payload.generation_id);
      const reason = requireVocabulary(payload.reason, resetReasons);
      if (generationID === null && reason !== "operator") fail("invalid_value");
      return { type, payload: { generation_id: generationID, reason } };
    }
    case "dispose":
      requireKeys(payload, ["reason"]);
      return { type, payload: { reason: requireVocabulary(payload.reason, disposalReasons) } };
    default:
      return fail("invalid_value");
  }
}
function decodeObservation(type, payload) {
  switch (type) {
    case "wrapper_ready": {
      requireKeys(payload, ["bridge_version"]);
      const bridgeVersion = requireInteger(payload.bridge_version);
      if (bridgeVersion !== 1) fail("invalid_value");
      return { type, payload: { bridge_version: bridgeVersion } };
    }
    case "renderer_ready": {
      requireKeys(payload, ["webgl"]);
      const webgl = requireString(payload.webgl);
      if (webgl !== "webgl2") fail("invalid_value");
      return { type, payload: { webgl } };
    }
    case "asset_loaded": {
      requireKeys(payload, ["asset_token", "capabilities"]);
      const capabilities = requireObject(payload.capabilities);
      requireKeys(capabilities, ["aa", "look_at", "spring_bone", "mtoon_materials"]);
      return {
        type,
        payload: {
          asset_token: requireUUID(payload.asset_token),
          capabilities: {
            aa: requireBoolean(capabilities.aa),
            look_at: requireBoolean(capabilities.look_at),
            spring_bone: requireBoolean(capabilities.spring_bone),
            mtoon_materials: requireInteger(capabilities.mtoon_materials, 0, 512)
          }
        }
      };
    }
    case "first_frame":
      requireKeys(payload, [
        "asset_token",
        "viewport_width",
        "viewport_height",
        "visible_meshes",
        "decoded_textures",
        "material_bindings",
        "alpha_probe_pixels"
      ]);
      return {
        type,
        payload: {
          asset_token: requireUUID(payload.asset_token),
          viewport_width: requireInteger(payload.viewport_width, 1, 8192),
          viewport_height: requireInteger(payload.viewport_height, 1, 8192),
          visible_meshes: requireInteger(payload.visible_meshes, 1, 2048),
          decoded_textures: requireInteger(payload.decoded_textures, 0, 64),
          material_bindings: requireInteger(payload.material_bindings, 1, 512),
          alpha_probe_pixels: requireInteger(payload.alpha_probe_pixels, 1, 4096)
        }
      };
    case "suspended": {
      requireKeys(payload, ["visibility", "frames", "updates", "renders"]);
      const visibility = requireVocabulary(payload.visibility, ["occluded", "hidden"]);
      return {
        type,
        payload: {
          visibility,
          frames: requireInteger(payload.frames),
          updates: requireInteger(payload.updates),
          renders: requireInteger(payload.renders)
        }
      };
    }
    case "resumed":
      requireKeys(payload, ["frames", "updates", "renders"]);
      return {
        type,
        payload: {
          frames: requireInteger(payload.frames),
          updates: requireInteger(payload.updates),
          renders: requireInteger(payload.renders)
        }
      };
    case "disposed":
      requireKeys(payload, ["reason"]);
      return { type, payload: { reason: requireVocabulary(payload.reason, disposalReasons) } };
    case "failed":
      requireKeys(payload, ["code", "operation"]);
      return {
        type,
        payload: {
          code: requireVocabulary(payload.code, failureCodes),
          operation: requireVocabulary(payload.operation, failureOperations)
        }
      };
    default:
      return fail("invalid_value");
  }
}
function decodeObject(input) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  if (bytes.byteLength > bridgeContract.maximumMessageBytes) {
    fail("message_too_large");
  }
  let source;
  try {
    source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return fail("invalid_json");
  }
  let value;
  let hasDuplicateKey;
  try {
    hasDuplicateKey = hasDuplicateObjectKey(source);
    value = JSON.parse(source);
  } catch {
    return fail("invalid_json");
  }
  if (hasDuplicateKey) fail("duplicate_key");
  validateTree(value, 0);
  return requireObject(value);
}
function hasDuplicateObjectKey(source) {
  let index = 0;
  let duplicate = false;
  parseValue();
  skipWhitespace();
  if (index !== source.length) throw new SyntaxError("unexpected trailing JSON input");
  return duplicate;
  function parseValue() {
    skipWhitespace();
    switch (source[index]) {
      case "{":
        parseObject();
        return;
      case "[":
        parseArray();
        return;
      case '"':
        parseString();
        return;
      default:
        parsePrimitive();
    }
  }
  function parseObject() {
    index += 1;
    skipWhitespace();
    const keys = /* @__PURE__ */ new Set();
    if (source[index] === "}") {
      index += 1;
      return;
    }
    while (true) {
      skipWhitespace();
      if (source[index] !== '"') throw new SyntaxError("object key must be a string");
      const key = parseString();
      if (keys.has(key)) duplicate = true;
      keys.add(key);
      skipWhitespace();
      if (source[index] !== ":") throw new SyntaxError("object key is missing a value");
      index += 1;
      parseValue();
      skipWhitespace();
      if (source[index] === "}") {
        index += 1;
        return;
      }
      if (source[index] !== ",") throw new SyntaxError("object is missing a separator");
      index += 1;
    }
  }
  function parseArray() {
    index += 1;
    skipWhitespace();
    if (source[index] === "]") {
      index += 1;
      return;
    }
    while (true) {
      parseValue();
      skipWhitespace();
      if (source[index] === "]") {
        index += 1;
        return;
      }
      if (source[index] !== ",") throw new SyntaxError("array is missing a separator");
      index += 1;
    }
  }
  function parseString() {
    const start = index;
    index += 1;
    while (index < source.length) {
      const character = source[index];
      if (character === '"') {
        index += 1;
        return JSON.parse(source.slice(start, index));
      }
      if (character === "\\") {
        index += 2;
        continue;
      }
      if (character < " ") throw new SyntaxError("control character in string");
      index += 1;
    }
    throw new SyntaxError("unterminated string");
  }
  function parsePrimitive() {
    const start = index;
    while (index < source.length && !/[\s,\]}]/u.test(source[index])) index += 1;
    if (index === start) throw new SyntaxError("missing JSON value");
  }
  function skipWhitespace() {
    while (/[\t\n\r ]/u.test(source[index] ?? "")) index += 1;
  }
}
function validateTree(value, depth) {
  if (Array.isArray(value)) {
    const nextDepth = depth + 1;
    if (nextDepth > bridgeContract.maximumContainerDepth || value.length > bridgeContract.maximumArrayLength) {
      fail("invalid_shape");
    }
    for (const child of value) validateTree(child, nextDepth);
    return;
  }
  if (isObject(value)) {
    const nextDepth = depth + 1;
    if (nextDepth > bridgeContract.maximumContainerDepth) fail("invalid_shape");
    for (const [key, child] of Object.entries(value)) {
      validateString(key);
      validateTree(child, nextDepth);
    }
    return;
  }
  if (typeof value === "string") {
    validateString(value);
    return;
  }
  if (value !== null && typeof value !== "boolean" && (typeof value !== "number" || !Number.isFinite(value))) {
    fail("invalid_value");
  }
}
function requireObject(value) {
  if (!isObject(value)) fail("invalid_shape");
  return value;
}
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requireKeys(value, keys) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    fail("invalid_keys");
  }
}
function requireString(value) {
  if (typeof value !== "string") fail("invalid_value");
  return value;
}
function requireBoolean(value) {
  if (typeof value !== "boolean") fail("invalid_value");
  return value;
}
function requireInteger(value, minimum = 0, maximum = bridgeContract.maximumSafeInteger) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum || value > maximum) {
    fail("invalid_value");
  }
  return value;
}
function requireNumber(value, minimum, maximum) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < minimum || value > maximum) {
    fail("invalid_value");
  }
  return value;
}
function requireUUID(value) {
  const string = requireString(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(string)) {
    fail("invalid_value");
  }
  return string;
}
function requireOptionalUUID(value) {
  return value === null ? null : requireUUID(value);
}
function requireVocabulary(value, vocabulary) {
  const string = requireString(value);
  if (!vocabulary.includes(string)) fail("invalid_value");
  return string;
}
function requirePhaseIdentities(phase, generationID, playbackID) {
  if (phase === "speaking") {
    if (generationID === null || playbackID === null) fail("invalid_value");
    return;
  }
  if (["thinking", "responding", "stopped", "failed"].includes(phase)) {
    if (generationID === null || playbackID !== null) fail("invalid_value");
    return;
  }
  if (generationID !== null || playbackID !== null) fail("invalid_value");
}
function validateString(value) {
  if (new TextEncoder().encode(value).byteLength > 64 || /[\u0000-\u001f\u007f]/u.test(value)) {
    fail("invalid_value");
  }
}
function fail(code) {
  throw new BridgeValidationError(code);
}

// src/bridge.ts
var WebRendererCore = class {
  constructor(sessionID, backend, scheduler, post, options = {}) {
    this.sessionID = sessionID;
    this.backend = backend;
    this.scheduler = scheduler;
    this.post = post;
    this.decoder = new PresentationCommandDecoder(sessionID);
    this.loadTimeoutMilliseconds = options.loadTimeoutMilliseconds ?? 15e3;
    if (!Number.isSafeInteger(this.loadTimeoutMilliseconds) || this.loadTimeoutMilliseconds <= 0) {
      throw new RangeError("load timeout must be a positive safe integer");
    }
    this.loadTimeoutScheduler = options.loadTimeoutScheduler ?? browserLoadTimeoutScheduler;
  }
  sessionID;
  backend;
  scheduler;
  post;
  decoder;
  state = "booting";
  presentation = initialPresentationState();
  observationSequence = 0;
  frameHandle = null;
  lastTimestamp = null;
  counters = { frames: 0, updates: 0, renders: 0 };
  activeLoad = null;
  backendReleased = false;
  loadTimeoutMilliseconds;
  loadTimeoutScheduler;
  start() {
    this.observe(null, { type: "wrapper_ready", payload: { bridge_version: 1 } });
  }
  async accept(input) {
    if (["failed", "disposing", "disposed"].includes(this.state)) return;
    let envelope;
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
  contextLost() {
    this.fail("context_lost", "render", null);
  }
  snapshot() {
    return {
      state: this.state,
      presentation: { ...this.presentation },
      counters: { ...this.counters }
    };
  }
  async execute(command, sequence) {
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
          payload: { reduced_motion: command.payload.reduced_motion }
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
    }
  }
  async load(assetToken, sequence) {
    this.state = reduceLifecycle(this.state, { type: "load_started" }).state;
    const controller = new AbortController();
    this.activeLoad = controller;
    let timeoutHandle = null;
    let timedOut = false;
    try {
      const timeout = new Promise((_resolve, reject) => {
        timeoutHandle = this.loadTimeoutScheduler.request(() => {
          timedOut = true;
          controller.abort();
          reject(new LoadTimeoutError());
        }, this.loadTimeoutMilliseconds);
      });
      const loaded = await Promise.race([
        this.backend.loadAsset(
          `miller-avatar-local://app/session/${this.sessionID}/${assetToken}.vrm`,
          controller.signal
        ),
        timeout
      ]);
      if (this.state !== "loading") return;
      this.observe(sequence, {
        type: "asset_loaded",
        payload: { asset_token: assetToken, capabilities: loaded.capabilities }
      });
      const evidence = this.backend.renderOnce();
      if (!this.advanceCounters(1, 0, 1, "render", sequence)) return;
      this.state = reduceLifecycle(this.state, { type: "first_frame" }).state;
      this.observe(sequence, {
        type: "first_frame",
        payload: { asset_token: assetToken, ...evidence }
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
  visibility(visibility, sequence) {
    if (visibility !== "visible") {
      if (this.state === "live") {
        this.cancelFrame();
        this.backend.stopClock();
        this.state = reduceLifecycle(this.state, { type: "suspend" }).state;
      }
      if (this.state === "suspended") this.applyPresentationInput({ type: "suspend", visibility });
      this.observe(sequence, {
        type: "suspended",
        payload: { visibility, ...this.counters }
      });
      return;
    }
    this.backend.startClock();
    this.applyPresentationInput({ type: "resume" });
    this.state = reduceLifecycle(this.state, { type: "resume" }).state;
    if (!this.advanceCounters(1, this.presentation.reducedMotion ? 0 : 1, 1, "resume", sequence)) return;
    if (!this.presentation.reducedMotion) {
      this.backend.update(0);
    }
    this.backend.renderOnce();
    this.observe(sequence, { type: "resumed", payload: { ...this.counters } });
    if (!this.presentation.reducedMotion) this.schedule();
  }
  applyPresentation(command) {
    const beforeReducedMotion = this.presentation.reducedMotion;
    const result = reducePresentation(this.presentation, command);
    this.presentation = result.state;
    for (const effect of result.effects) this.backend.apply(effect);
    if (this.state === "live" && beforeReducedMotion !== this.presentation.reducedMotion) {
      if (this.presentation.reducedMotion) this.cancelFrame();
      else this.schedule();
    }
  }
  applyPresentationInput(input) {
    const result = reducePresentation(this.presentation, input);
    this.presentation = result.state;
    for (const effect of result.effects) this.backend.apply(effect);
  }
  schedule() {
    if (this.frameHandle !== null || this.state !== "live" || this.presentation.reducedMotion) return;
    this.frameHandle = this.scheduler.request((timestamp) => {
      this.frameHandle = null;
      if (this.state !== "live") return;
      try {
        if (!Number.isFinite(timestamp)) throw new RangeError("frame timestamp must be finite");
        const delta = this.lastTimestamp === null ? 0 : Math.min(0.25, Math.max(0, (timestamp - this.lastTimestamp) / 1e3));
        this.lastTimestamp = timestamp;
        if (!this.advanceCounters(1, 1, 1, "render", null)) return;
        this.backend.update(delta);
        this.backend.renderOnce();
        this.schedule();
      } catch {
        this.fail("render_failed", "render", null);
      }
    });
  }
  cancelFrame() {
    if (this.frameHandle !== null) this.scheduler.cancel(this.frameHandle);
    this.frameHandle = null;
    this.lastTimestamp = null;
  }
  dispose(reason, sequence) {
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
  fail(code, operation, sequence) {
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
  observe(causedBySequence, observation) {
    this.observationSequence += 1;
    this.post(JSON.stringify({
      schema: bridgeContract.observationSchema,
      session_id: this.sessionID,
      sequence: this.observationSequence,
      caused_by_sequence: causedBySequence,
      type: observation.type,
      payload: observation.payload
    }));
  }
  abortActiveLoad() {
    this.activeLoad?.abort();
  }
  terminatePresentation() {
    const result = reducePresentation(this.presentation, { type: "renderer_failed" });
    this.presentation = result.state;
    for (const effect of result.effects) {
      try {
        this.backend.apply(effect);
      } catch {
      }
    }
  }
  releaseBackend() {
    if (this.backendReleased) return;
    this.backendReleased = true;
    try {
      this.backend.stopClock();
    } catch {
    }
    try {
      this.backend.dispose();
    } catch {
    }
  }
  advanceCounters(frames, updates, renders, operation, sequence) {
    if (this.counters.frames > Number.MAX_SAFE_INTEGER - frames || this.counters.updates > Number.MAX_SAFE_INTEGER - updates || this.counters.renders > Number.MAX_SAFE_INTEGER - renders) {
      this.fail("resource_limit", operation, sequence);
      return false;
    }
    this.counters.frames += frames;
    this.counters.updates += updates;
    this.counters.renders += renders;
    return true;
  }
  commandIsLegal(command) {
    if (command.type === "configure") return this.state === "booting";
    if (command.type === "load_asset") return this.state === "ready";
    if (command.type === "set_mouth") return this.state === "live";
    if (command.type === "set_visibility") {
      return command.payload.visibility === "visible" ? this.state === "suspended" : this.state === "live" || this.state === "suspended";
    }
    return ["ready", "loading", "live", "suspended"].includes(this.state);
  }
};
var LoadTimeoutError = class extends Error {
};
var browserLoadTimeoutScheduler = {
  request(callback, delayMilliseconds) {
    return globalThis.setTimeout(callback, delayMilliseconds);
  },
  cancel(handle) {
    globalThis.clearTimeout(handle);
  }
};
function operationFor(command) {
  if (command.type === "configure") return "configure";
  if (command.type === "load_asset") return "load";
  if (command.type === "set_visibility") return command.payload.visibility === "visible" ? "resume" : "suspend";
  if (command.type === "set_policy") return "policy";
  if (command.type === "dispose") return "dispose";
  return "render";
}

// src/camera.ts
var minimumExtent = 1e-4;
var paddingFactor = 1.2;
var maximumViewportDimension = 8192;
var maximumViewportPixels = maximumViewportDimension * maximumViewportDimension;
function fitCamera(bounds, viewportWidth, viewportHeight) {
  const values = [
    bounds.min.x,
    bounds.min.y,
    bounds.min.z,
    bounds.max.x,
    bounds.max.y,
    bounds.max.z,
    viewportWidth,
    viewportHeight
  ];
  if (bounds.visibleMeshes < 1 || !values.every(Number.isFinite) || !Number.isSafeInteger(viewportWidth) || !Number.isSafeInteger(viewportHeight) || viewportWidth <= 0 || viewportHeight <= 0 || viewportWidth > maximumViewportDimension || viewportHeight > maximumViewportDimension || viewportWidth * viewportHeight > maximumViewportPixels) {
    throw new RangeError("camera fit requires finite visible bounds and viewport");
  }
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  const depth = bounds.max.z - bounds.min.z;
  if (![width, height, depth].every(Number.isFinite) || width < 0 || height < 0 || depth < 0 || Math.max(width, height, depth) < minimumExtent) {
    throw new RangeError("camera fit requires non-degenerate ordered bounds");
  }
  const aspect = viewportWidth / viewportHeight;
  const halfVerticalFov = 30 * Math.PI / 180 / 2;
  const verticalDistance = height * paddingFactor / 2 / Math.tan(halfVerticalFov);
  const horizontalDistance = width * paddingFactor / 2 / (Math.tan(halfVerticalFov) * aspect);
  const paddedDepth = Math.max(depth * paddingFactor, minimumExtent);
  const depthMargin = paddedDepth * 0.01;
  const distance = Math.max(
    verticalDistance,
    horizontalDistance,
    paddedDepth / 2 + depthMargin + 0.01
  );
  const target = {
    x: bounds.min.x + width / 2,
    y: bounds.min.y + height / 2,
    z: bounds.min.z + depth / 2
  };
  const near = Math.max(0.01, distance - paddedDepth / 2 - depthMargin);
  const far = Math.max(near + 0.01, distance + paddedDepth / 2 + depthMargin);
  const result = {
    fovDegrees: 30,
    aspect,
    target,
    position: { x: target.x, y: target.y, z: target.z + distance },
    near,
    far
  };
  if (![distance, near, far, ...Object.values(target), ...Object.values(result.position)].every(Number.isFinite)) {
    throw new RangeError("camera fit overflowed");
  }
  return result;
}

// src/disposal.ts
var DisposalBag = class {
  disposed = false;
  callbacks = [];
  recordedFailures = [];
  get failures() {
    return this.recordedFailures;
  }
  add(callback) {
    if (this.disposed) {
      this.run(callback);
      return;
    }
    this.callbacks.push(callback);
  }
  dispose() {
    if (this.disposed) return [];
    this.disposed = true;
    const failures = [];
    for (const callback of this.callbacks.splice(0).reverse()) {
      const failure = this.run(callback);
      if (failure !== void 0) failures.push(failure);
    }
    return failures;
  }
  run(callback) {
    try {
      callback();
      return void 0;
    } catch (error) {
      this.recordedFailures.push(error);
      return error;
    }
  }
};
export {
  BridgeValidationError,
  DisposalBag,
  PresentationCommandDecoder,
  PresentationObservationDecoder,
  WebRendererCore,
  bridgeContract,
  disposalReasons,
  failureCodes,
  failureOperations,
  fitCamera,
  initialPresentationState,
  maximumViewportDimension,
  maximumViewportPixels,
  presentationPhases,
  presentationVisibilities,
  reduceLifecycle,
  reducePresentation,
  resetReasons
};
