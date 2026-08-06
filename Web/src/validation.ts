import {
  bridgeContract,
  disposalReasons,
  failureCodes,
  failureOperations,
  presentationPhases,
  presentationVisibilities,
  resetReasons,
  type PresentationCommand,
  type PresentationCommandEnvelope,
  type PresentationObservation,
  type PresentationObservationEnvelope,
  type PresentationPhase,
} from "./contract.js";

type BridgeObject = Record<string, unknown>;

export class BridgeValidationError extends Error {
  constructor(
    public readonly code:
      | "message_too_large"
      | "invalid_json"
      | "duplicate_key"
      | "invalid_shape"
      | "invalid_keys"
      | "invalid_value"
      | "stale_session"
      | "invalid_sequence"
      | "disposed",
  ) {
    super(code);
    this.name = "BridgeValidationError";
  }
}

export class PresentationCommandDecoder {
  private nextSequence = 1;
  private lastProjectionSequence: number | undefined;
  private activeGenerationID: string | null = null;
  private activePlaybackID: string | null = null;
  private lastCueIndex: number | undefined;
  private lastPlaybackOffsetMilliseconds: number | undefined;
  private disposed = false;

  constructor(private readonly sessionID: string) {
    requireUUID(sessionID);
  }

  dispose(): void {
    this.disposed = true;
    this.clearActiveLease();
  }

  decode(input: string | Uint8Array): PresentationCommandEnvelope {
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

  private accept(command: PresentationCommand): void {
    switch (command.type) {
      case "project_phase": {
        const projection = command.payload;
        if (
          this.lastProjectionSequence !== undefined &&
          projection.projection_sequence <= this.lastProjectionSequence
        ) {
          fail("invalid_sequence");
        }
        const replacesLease = projection.generation_id !== this.activeGenerationID
          || projection.playback_id !== this.activePlaybackID
          || projection.phase !== "speaking";
        this.lastProjectionSequence = projection.projection_sequence;
        this.activeGenerationID = projection.generation_id;
        this.activePlaybackID = projection.playback_id;
        if (replacesLease) this.clearCueLease();
        return;
      }
      case "reconcile_presentation": {
        const reconciliation = command.payload;
        if (
          (this.lastProjectionSequence !== undefined
            && reconciliation.last_projection_sequence === null)
          || (this.lastProjectionSequence !== undefined
            && reconciliation.last_projection_sequence !== null
            && reconciliation.last_projection_sequence < this.lastProjectionSequence)
        ) {
          fail("invalid_sequence");
        }
        this.lastProjectionSequence = reconciliation.last_projection_sequence ?? undefined;
        this.activeGenerationID = reconciliation.generation_id;
        this.activePlaybackID = reconciliation.playback_id;
        this.clearCueLease();
        return;
      }
      case "set_mouth": {
        const cue = command.payload;
        if (
          cue.generation_id !== this.activeGenerationID ||
          cue.playback_id !== this.activePlaybackID ||
          cue.cue_index <= (this.lastCueIndex ?? 0) ||
          cue.playback_offset_ms < (this.lastPlaybackOffsetMilliseconds ?? 0)
        ) {
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

  private clearActiveLease(): void {
    this.activeGenerationID = null;
    this.revokePlaybackLease();
  }

  private revokePlaybackLease(): void {
    this.activePlaybackID = null;
    this.clearCueLease();
  }

  private clearCueLease(): void {
    this.lastCueIndex = undefined;
    this.lastPlaybackOffsetMilliseconds = undefined;
  }
}

export class PresentationObservationDecoder {
  private nextSequence = 1;
  private lastFrames: number | undefined;
  private lastUpdates: number | undefined;
  private lastRenders: number | undefined;

  constructor(private readonly sessionID: string) {
    requireUUID(sessionID);
  }

  decode(input: string | Uint8Array): PresentationObservationEnvelope {
    const object = decodeObject(input);
    requireKeys(object, [
      "schema",
      "session_id",
      "sequence",
      "caused_by_sequence",
      "type",
      "payload",
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
    const causedBySequence =
      object.caused_by_sequence === null
        ? null
        : requireInteger(object.caused_by_sequence, 1);
    const type = requireString(object.type);
    const payload = requireObject(object.payload);
    const observation = decodeObservation(type, payload);
    if (observation.type === "suspended" || observation.type === "resumed") {
      this.acceptCounters(
        observation.payload.frames,
        observation.payload.updates,
        observation.payload.renders,
      );
    }

    this.nextSequence += 1;
    return {
      session_id: sessionID,
      sequence,
      caused_by_sequence: causedBySequence,
      observation,
    };
  }

  private acceptCounters(frames: number, updates: number, renders: number): void {
    if (
      (this.lastFrames !== undefined && frames < this.lastFrames) ||
      (this.lastUpdates !== undefined && updates < this.lastUpdates) ||
      (this.lastRenders !== undefined && renders < this.lastRenders)
    ) {
      fail("invalid_sequence");
    }
    this.lastFrames = frames;
    this.lastUpdates = updates;
    this.lastRenders = renders;
  }
}

function decodeCommand(type: string, payload: BridgeObject): PresentationCommand {
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
          playback_id: playbackID,
        },
      };
    }
    case "reconcile_presentation": {
      requireKeys(payload, [
        "last_projection_sequence",
        "generation_id",
        "phase",
        "playback_id",
        "reduced_motion",
      ]);
      const lastProjectionSequence = payload.last_projection_sequence === null
        ? null
        : requireInteger(payload.last_projection_sequence, 1);
      const generationID = requireOptionalUUID(payload.generation_id);
      const phase = requireVocabulary(payload.phase, presentationPhases);
      const playbackID = requireOptionalUUID(payload.playback_id);
      requirePhaseIdentities(phase, generationID, playbackID);
      return {
        type,
        payload: {
          last_projection_sequence: lastProjectionSequence,
          generation_id: generationID,
          phase,
          playback_id: playbackID,
          reduced_motion: requireBoolean(payload.reduced_motion),
        },
      };
    }
    case "set_visibility":
      requireKeys(payload, ["visibility"]);
      return {
        type,
        payload: { visibility: requireVocabulary(payload.visibility, presentationVisibilities) },
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
        "scalar",
      ]);
      return {
        type,
        payload: {
          generation_id: requireUUID(payload.generation_id),
          playback_id: requireUUID(payload.playback_id),
          cue_index: requireInteger(payload.cue_index, 1),
          playback_offset_ms: requireInteger(payload.playback_offset_ms, 0, 86_400_000),
          scalar: requireNumber(payload.scalar, 0, 1),
        },
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

function decodeObservation(type: string, payload: BridgeObject): PresentationObservation {
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
            mtoon_materials: requireInteger(capabilities.mtoon_materials, 0, 512),
          },
        },
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
        "alpha_probe_pixels",
      ]);
      return {
        type,
        payload: {
          asset_token: requireUUID(payload.asset_token),
          viewport_width: requireInteger(payload.viewport_width, 1, 8_192),
          viewport_height: requireInteger(payload.viewport_height, 1, 8_192),
          visible_meshes: requireInteger(payload.visible_meshes, 1, 2_048),
          decoded_textures: requireInteger(payload.decoded_textures, 0, 64),
          material_bindings: requireInteger(payload.material_bindings, 1, 512),
          alpha_probe_pixels: requireInteger(payload.alpha_probe_pixels, 1, 4_096),
        },
      };
    case "suspended": {
      requireKeys(payload, ["visibility", "frames", "updates", "renders"]);
      const visibility = requireVocabulary(payload.visibility, ["occluded", "hidden"] as const);
      return {
        type,
        payload: {
          visibility,
          frames: requireInteger(payload.frames),
          updates: requireInteger(payload.updates),
          renders: requireInteger(payload.renders),
        },
      };
    }
    case "resumed":
      requireKeys(payload, ["frames", "updates", "renders"]);
      return {
        type,
        payload: {
          frames: requireInteger(payload.frames),
          updates: requireInteger(payload.updates),
          renders: requireInteger(payload.renders),
        },
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
          operation: requireVocabulary(payload.operation, failureOperations),
        },
      };
    default:
      return fail("invalid_value");
  }
}

function decodeObject(input: string | Uint8Array): BridgeObject {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  if (bytes.byteLength > bridgeContract.maximumMessageBytes) {
    fail("message_too_large");
  }
  let source: string;
  try {
    source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return fail("invalid_json");
  }
  let value: unknown;
  let hasDuplicateKey: boolean;
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

function hasDuplicateObjectKey(source: string): boolean {
  let index = 0;
  let duplicate = false;

  parseValue();
  skipWhitespace();
  if (index !== source.length) throw new SyntaxError("unexpected trailing JSON input");
  return duplicate;

  function parseValue(): void {
    skipWhitespace();
    switch (source[index]) {
      case "{":
        parseObject();
        return;
      case "[":
        parseArray();
        return;
      case "\"":
        parseString();
        return;
      default:
        parsePrimitive();
    }
  }

  function parseObject(): void {
    index += 1;
    skipWhitespace();
    const keys = new Set<string>();
    if (source[index] === "}") {
      index += 1;
      return;
    }
    while (true) {
      skipWhitespace();
      if (source[index] !== "\"") throw new SyntaxError("object key must be a string");
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

  function parseArray(): void {
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

  function parseString(): string {
    const start = index;
    index += 1;
    while (index < source.length) {
      const character = source[index];
      if (character === "\"") {
        index += 1;
        return JSON.parse(source.slice(start, index)) as string;
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

  function parsePrimitive(): void {
    const start = index;
    while (index < source.length && !/[\s,\]}]/u.test(source[index])) index += 1;
    if (index === start) throw new SyntaxError("missing JSON value");
  }

  function skipWhitespace(): void {
    while (/[\t\n\r ]/u.test(source[index] ?? "")) index += 1;
  }
}

function validateTree(value: unknown, depth: number): void {
  if (Array.isArray(value)) {
    const nextDepth = depth + 1;
    if (
      nextDepth > bridgeContract.maximumContainerDepth ||
      value.length > bridgeContract.maximumArrayLength
    ) {
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
  if (
    value !== null &&
    typeof value !== "boolean" &&
    (typeof value !== "number" || !Number.isFinite(value))
  ) {
    fail("invalid_value");
  }
}

function requireObject(value: unknown): BridgeObject {
  if (!isObject(value)) fail("invalid_shape");
  return value;
}

function isObject(value: unknown): value is BridgeObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireKeys(value: BridgeObject, keys: readonly string[]): void {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    fail("invalid_keys");
  }
}

function requireString(value: unknown): string {
  if (typeof value !== "string") fail("invalid_value");
  return value;
}

function requireBoolean(value: unknown): boolean {
  if (typeof value !== "boolean") fail("invalid_value");
  return value;
}

function requireInteger(
  value: unknown,
  minimum = 0,
  maximum = bridgeContract.maximumSafeInteger,
): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    fail("invalid_value");
  }
  return value;
}

function requireNumber(value: unknown, minimum: number, maximum: number): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < minimum ||
    value > maximum
  ) {
    fail("invalid_value");
  }
  return value;
}

function requireUUID(value: unknown): string {
  const string = requireString(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(string)) {
    fail("invalid_value");
  }
  return string;
}

function requireOptionalUUID(value: unknown): string | null {
  return value === null ? null : requireUUID(value);
}

function requireVocabulary<const T extends readonly string[]>(
  value: unknown,
  vocabulary: T,
): T[number] {
  const string = requireString(value);
  if (!(vocabulary as readonly string[]).includes(string)) fail("invalid_value");
  return string as T[number];
}

function requirePhaseIdentities(
  phase: PresentationPhase,
  generationID: string | null,
  playbackID: string | null,
): void {
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

function validateString(value: string): void {
  if (
    new TextEncoder().encode(value).byteLength > 64 ||
    /[\u0000-\u001f\u007f]/u.test(value)
  ) {
    fail("invalid_value");
  }
}

function fail(code: BridgeValidationError["code"]): never {
  throw new BridgeValidationError(code);
}
