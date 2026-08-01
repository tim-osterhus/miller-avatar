import CoreFoundation
import Foundation

public enum BridgeContract {
    public static let commandSchema = "miller-avatar.presentation-command/v1"
    public static let observationSchema = "miller-avatar.presentation-observation/v1"
    public static let maximumMessageBytes = 16_384
    public static let maximumContainerDepth = 8
    public static let maximumArrayLength = 64
    public static let maximumSafeInteger: UInt64 = 9_007_199_254_740_991
}

public enum BridgeContractError: Error, Equatable, Sendable {
    case messageTooLarge
    case invalidJSON
    case invalidShape
    case invalidKeys
    case invalidValue
    case staleSession
    case invalidSequence
    case disposed
}

public enum PresentationPhase: String, CaseIterable, Codable, Equatable, Sendable {
    case idle
    case listening
    case transcribing
    case thinking
    case responding
    case speaking
    case stopped
    case failed
}

public enum PresentationVisibility: String, CaseIterable, Codable, Equatable, Sendable {
    case visible
    case occluded
    case hidden
}

public enum ResetReason: String, CaseIterable, Codable, Equatable, Sendable {
    case stopped
    case cancelled
    case replaced
    case `operator`
}

public enum DisposalReason: String, CaseIterable, Codable, Equatable, Sendable {
    case `operator`
    case hiddenBeforeLive = "hidden_before_live"
    case failure
    case retry
    case termination
}

public enum FailureOperation: String, CaseIterable, Codable, Equatable, Sendable {
    case startup
    case configure
    case load
    case render
    case suspend
    case resume
    case dispose
    case scheme
    case policy
}

public struct ConfigurePayload: Codable, Equatable, Sendable {
    public let profile: String
    public let reducedMotion: Bool
}

public struct LoadAssetPayload: Codable, Equatable, Sendable {
    public let assetToken: UUID
}

public struct ProjectPhasePayload: Codable, Equatable, Sendable {
    public let projectionSequence: UInt64
    public let generationID: UUID?
    public let phase: PresentationPhase
    public let playbackID: UUID?
}

public struct SetVisibilityPayload: Codable, Equatable, Sendable {
    public let visibility: PresentationVisibility
}

public struct SetPolicyPayload: Codable, Equatable, Sendable {
    public let reducedMotion: Bool
}

public struct SetMouthPayload: Codable, Equatable, Sendable {
    public let generationID: UUID
    public let playbackID: UUID
    public let cueIndex: UInt64
    public let playbackOffsetMilliseconds: UInt64
    public let scalar: Double
}

public struct ResetPayload: Codable, Equatable, Sendable {
    public let generationID: UUID?
    public let reason: ResetReason
}

public struct DisposePayload: Codable, Equatable, Sendable {
    public let reason: DisposalReason
}

public enum PresentationCommand: Equatable, Sendable {
    case configure(ConfigurePayload)
    case loadAsset(LoadAssetPayload)
    case projectPhase(ProjectPhasePayload)
    case setVisibility(SetVisibilityPayload)
    case setPolicy(SetPolicyPayload)
    case setMouth(SetMouthPayload)
    case reset(ResetPayload)
    case dispose(DisposePayload)
}

public struct WrapperReadyPayload: Codable, Equatable, Sendable {
    public let bridgeVersion: UInt64
}

public struct RendererReadyPayload: Codable, Equatable, Sendable {
    public let webgl: String
}

public struct AssetCapabilities: Codable, Equatable, Sendable {
    public let aa: Bool
    public let lookAt: Bool
    public let springBone: Bool
    public let mtoonMaterials: UInt64
}

public struct AssetLoadedPayload: Codable, Equatable, Sendable {
    public let assetToken: UUID
    public let capabilities: AssetCapabilities
}

public struct FirstFramePayload: Codable, Equatable, Sendable {
    public let assetToken: UUID
    public let viewportWidth: UInt64
    public let viewportHeight: UInt64
    public let visibleMeshes: UInt64
    public let decodedTextures: UInt64
    public let materialBindings: UInt64
    public let alphaProbePixels: UInt64
}

public struct SuspendedPayload: Codable, Equatable, Sendable {
    public let visibility: PresentationVisibility
    public let frames: UInt64
    public let updates: UInt64
    public let renders: UInt64
}

public struct ResumedPayload: Codable, Equatable, Sendable {
    public let frames: UInt64
    public let updates: UInt64
    public let renders: UInt64
}

public struct DisposedPayload: Codable, Equatable, Sendable {
    public let reason: DisposalReason
}

public struct FailedPayload: Codable, Equatable, Sendable {
    public let code: FailureCode
    public let operation: FailureOperation
}

public enum PresentationObservation: Equatable, Sendable {
    case wrapperReady(WrapperReadyPayload)
    case rendererReady(RendererReadyPayload)
    case assetLoaded(AssetLoadedPayload)
    case firstFrame(FirstFramePayload)
    case suspended(SuspendedPayload)
    case resumed(ResumedPayload)
    case disposed(DisposedPayload)
    case failed(FailedPayload)
}

public struct PresentationCommandEnvelope: Equatable, Sendable {
    public let sessionID: UUID
    public let sequence: UInt64
    public let command: PresentationCommand
}

public struct PresentationObservationEnvelope: Equatable, Sendable {
    public let sessionID: UUID
    public let sequence: UInt64
    public let causedBySequence: UInt64?
    public let observation: PresentationObservation
}

public final class PresentationCommandDecoder {
    private let sessionID: UUID
    private var nextSequence: UInt64 = 1
    private var lastProjectionSequence: UInt64?
    private var activeGenerationID: UUID?
    private var activePlaybackID: UUID?
    private var lastCueIndex: UInt64?
    private var lastPlaybackOffsetMilliseconds: UInt64?
    private var hasDisposed = false

    public init(sessionID: UUID) {
        self.sessionID = sessionID
    }

    public func decode(_ data: Data) throws -> PresentationCommandEnvelope {
        if hasDisposed {
            throw BridgeContractError.disposed
        }
        let object = try BridgeValue.decodeObject(data)
        try object.requireKeys(["schema", "session_id", "sequence", "type", "payload"])
        guard try object.string("schema") == BridgeContract.commandSchema else {
            throw BridgeContractError.invalidValue
        }
        let decodedSession = try object.uuid("session_id")
        guard decodedSession == sessionID else {
            throw BridgeContractError.staleSession
        }
        let sequence = try object.integer("sequence")
        guard sequence == nextSequence else {
            throw BridgeContractError.invalidSequence
        }
        let type = try object.string("type")
        let payload = try object.object("payload")
        let command = try PresentationCommand.decode(type: type, payload: payload)
        try accept(command)

        nextSequence += 1
        if case .dispose = command {
            hasDisposed = true
        }
        return PresentationCommandEnvelope(
            sessionID: decodedSession,
            sequence: sequence,
            command: command
        )
    }

    private func accept(_ command: PresentationCommand) throws {
        switch command {
        case let .projectPhase(projection):
            if let lastProjectionSequence,
               projection.projectionSequence <= lastProjectionSequence
            {
                throw BridgeContractError.invalidSequence
            }
            let replacesLease = projection.generationID != activeGenerationID
                || projection.playbackID != activePlaybackID
                || projection.phase != .speaking
            lastProjectionSequence = projection.projectionSequence
            activeGenerationID = projection.generationID
            activePlaybackID = projection.playbackID
            if replacesLease {
                lastCueIndex = nil
                lastPlaybackOffsetMilliseconds = nil
            }
        case let .setMouth(cue):
            guard cue.generationID == activeGenerationID,
                  cue.playbackID == activePlaybackID,
                  cue.cueIndex > (lastCueIndex ?? 0),
                  cue.playbackOffsetMilliseconds
                      >= (lastPlaybackOffsetMilliseconds ?? 0)
            else {
                throw BridgeContractError.invalidSequence
            }
            lastCueIndex = cue.cueIndex
            lastPlaybackOffsetMilliseconds = cue.playbackOffsetMilliseconds
        case let .reset(reset):
            if reset.generationID == nil || reset.generationID == activeGenerationID {
                activeGenerationID = nil
                activePlaybackID = nil
                lastCueIndex = nil
                lastPlaybackOffsetMilliseconds = nil
            }
        case let .setVisibility(visibility) where visibility.visibility == .hidden:
            activePlaybackID = nil
            lastCueIndex = nil
            lastPlaybackOffsetMilliseconds = nil
        case .dispose:
            activeGenerationID = nil
            activePlaybackID = nil
            lastCueIndex = nil
            lastPlaybackOffsetMilliseconds = nil
        default:
            break
        }
    }
}

public final class PresentationObservationDecoder {
    private let sessionID: UUID
    private var nextSequence: UInt64 = 1
    private var lastFrames: UInt64?
    private var lastUpdates: UInt64?
    private var lastRenders: UInt64?

    public init(sessionID: UUID) {
        self.sessionID = sessionID
    }

    public func decode(_ data: Data) throws -> PresentationObservationEnvelope {
        let object = try BridgeValue.decodeObject(data)
        try object.requireKeys([
            "schema", "session_id", "sequence", "caused_by_sequence", "type", "payload",
        ])
        guard try object.string("schema") == BridgeContract.observationSchema else {
            throw BridgeContractError.invalidValue
        }
        let decodedSession = try object.uuid("session_id")
        guard decodedSession == sessionID else {
            throw BridgeContractError.staleSession
        }
        let sequence = try object.integer("sequence")
        guard sequence == nextSequence else {
            throw BridgeContractError.invalidSequence
        }
        let causedBySequence = try object.optionalInteger(
            "caused_by_sequence",
            minimum: 1
        )
        let type = try object.string("type")
        let payload = try object.object("payload")
        let observation = try PresentationObservation.decode(type: type, payload: payload)
        switch observation {
        case let .suspended(payload):
            try acceptCounters(
                frames: payload.frames,
                updates: payload.updates,
                renders: payload.renders
            )
        case let .resumed(payload):
            try acceptCounters(
                frames: payload.frames,
                updates: payload.updates,
                renders: payload.renders
            )
        default:
            break
        }

        nextSequence += 1
        return PresentationObservationEnvelope(
            sessionID: decodedSession,
            sequence: sequence,
            causedBySequence: causedBySequence,
            observation: observation
        )
    }

    private func acceptCounters(
        frames: UInt64,
        updates: UInt64,
        renders: UInt64
    ) throws {
        if let lastFrames, frames < lastFrames {
            throw BridgeContractError.invalidSequence
        }
        if let lastUpdates, updates < lastUpdates {
            throw BridgeContractError.invalidSequence
        }
        if let lastRenders, renders < lastRenders {
            throw BridgeContractError.invalidSequence
        }
        lastFrames = frames
        lastUpdates = updates
        lastRenders = renders
    }
}

private extension PresentationCommand {
    static func decode(type: String, payload: BridgeObject) throws -> Self {
        switch type {
        case "configure":
            try payload.requireKeys(["profile", "reduced_motion"])
            guard try payload.string("profile") == "lightweight" else {
                throw BridgeContractError.invalidValue
            }
            return .configure(ConfigurePayload(
                profile: "lightweight",
                reducedMotion: try payload.boolean("reduced_motion")
            ))
        case "load_asset":
            try payload.requireKeys(["asset_token"])
            return .loadAsset(LoadAssetPayload(assetToken: try payload.uuid("asset_token")))
        case "project_phase":
            try payload.requireKeys([
                "projection_sequence", "generation_id", "phase", "playback_id",
            ])
            let projectionSequence = try payload.integer("projection_sequence", minimum: 1)
            let generationID = try payload.optionalUUID("generation_id")
            guard let phase = PresentationPhase(rawValue: try payload.string("phase")) else {
                throw BridgeContractError.invalidValue
            }
            let playbackID = try payload.optionalUUID("playback_id")
            switch phase {
            case .speaking:
                guard generationID != nil, playbackID != nil else {
                    throw BridgeContractError.invalidValue
                }
            case .thinking, .responding, .stopped, .failed:
                guard generationID != nil, playbackID == nil else {
                    throw BridgeContractError.invalidValue
                }
            case .idle, .listening, .transcribing:
                guard generationID == nil, playbackID == nil else {
                    throw BridgeContractError.invalidValue
                }
            }
            return .projectPhase(ProjectPhasePayload(
                projectionSequence: projectionSequence,
                generationID: generationID,
                phase: phase,
                playbackID: playbackID
            ))
        case "set_visibility":
            try payload.requireKeys(["visibility"])
            guard let visibility = PresentationVisibility(rawValue: try payload.string("visibility")) else {
                throw BridgeContractError.invalidValue
            }
            return .setVisibility(SetVisibilityPayload(visibility: visibility))
        case "set_policy":
            try payload.requireKeys(["reduced_motion"])
            return .setPolicy(SetPolicyPayload(
                reducedMotion: try payload.boolean("reduced_motion")
            ))
        case "set_mouth":
            try payload.requireKeys([
                "generation_id", "playback_id", "cue_index", "playback_offset_ms", "scalar",
            ])
            return .setMouth(SetMouthPayload(
                generationID: try payload.uuid("generation_id"),
                playbackID: try payload.uuid("playback_id"),
                cueIndex: try payload.integer("cue_index", minimum: 1),
                playbackOffsetMilliseconds: try payload.integer(
                    "playback_offset_ms",
                    maximum: 86_400_000
                ),
                scalar: try payload.number("scalar", minimum: 0, maximum: 1)
            ))
        case "reset":
            try payload.requireKeys(["generation_id", "reason"])
            guard let reason = ResetReason(rawValue: try payload.string("reason")) else {
                throw BridgeContractError.invalidValue
            }
            let generationID = try payload.optionalUUID("generation_id")
            if generationID == nil, reason != .operator {
                throw BridgeContractError.invalidValue
            }
            return .reset(ResetPayload(generationID: generationID, reason: reason))
        case "dispose":
            try payload.requireKeys(["reason"])
            guard let reason = DisposalReason(rawValue: try payload.string("reason")) else {
                throw BridgeContractError.invalidValue
            }
            return .dispose(DisposePayload(reason: reason))
        default:
            throw BridgeContractError.invalidValue
        }
    }
}

private extension PresentationObservation {
    static func decode(type: String, payload: BridgeObject) throws -> Self {
        switch type {
        case "wrapper_ready":
            try payload.requireKeys(["bridge_version"])
            let version = try payload.integer("bridge_version")
            guard version == 1 else {
                throw BridgeContractError.invalidValue
            }
            return .wrapperReady(WrapperReadyPayload(bridgeVersion: version))
        case "renderer_ready":
            try payload.requireKeys(["webgl"])
            guard try payload.string("webgl") == "webgl2" else {
                throw BridgeContractError.invalidValue
            }
            return .rendererReady(RendererReadyPayload(webgl: "webgl2"))
        case "asset_loaded":
            try payload.requireKeys(["asset_token", "capabilities"])
            let capabilities = try payload.object("capabilities")
            try capabilities.requireKeys(["aa", "look_at", "spring_bone", "mtoon_materials"])
            return .assetLoaded(AssetLoadedPayload(
                assetToken: try payload.uuid("asset_token"),
                capabilities: AssetCapabilities(
                    aa: try capabilities.boolean("aa"),
                    lookAt: try capabilities.boolean("look_at"),
                    springBone: try capabilities.boolean("spring_bone"),
                    mtoonMaterials: try capabilities.integer("mtoon_materials", maximum: 512)
                )
            ))
        case "first_frame":
            try payload.requireKeys([
                "asset_token", "viewport_width", "viewport_height", "visible_meshes",
                "decoded_textures", "material_bindings", "alpha_probe_pixels",
            ])
            return .firstFrame(FirstFramePayload(
                assetToken: try payload.uuid("asset_token"),
                viewportWidth: try payload.integer("viewport_width", minimum: 1, maximum: 8_192),
                viewportHeight: try payload.integer("viewport_height", minimum: 1, maximum: 8_192),
                visibleMeshes: try payload.integer("visible_meshes", minimum: 1, maximum: 2_048),
                decodedTextures: try payload.integer("decoded_textures", maximum: 64),
                materialBindings: try payload.integer("material_bindings", minimum: 1, maximum: 512),
                alphaProbePixels: try payload.integer("alpha_probe_pixels", minimum: 1, maximum: 4_096)
            ))
        case "suspended":
            try payload.requireKeys(["visibility", "frames", "updates", "renders"])
            guard let visibility = PresentationVisibility(rawValue: try payload.string("visibility")),
                  visibility != .visible
            else {
                throw BridgeContractError.invalidValue
            }
            return .suspended(SuspendedPayload(
                visibility: visibility,
                frames: try payload.integer("frames"),
                updates: try payload.integer("updates"),
                renders: try payload.integer("renders")
            ))
        case "resumed":
            try payload.requireKeys(["frames", "updates", "renders"])
            return .resumed(ResumedPayload(
                frames: try payload.integer("frames"),
                updates: try payload.integer("updates"),
                renders: try payload.integer("renders")
            ))
        case "disposed":
            try payload.requireKeys(["reason"])
            guard let reason = DisposalReason(rawValue: try payload.string("reason")) else {
                throw BridgeContractError.invalidValue
            }
            return .disposed(DisposedPayload(reason: reason))
        case "failed":
            try payload.requireKeys(["code", "operation"])
            guard let code = FailureCode(rawValue: try payload.string("code")),
                  let operation = FailureOperation(rawValue: try payload.string("operation"))
            else {
                throw BridgeContractError.invalidValue
            }
            return .failed(FailedPayload(code: code, operation: operation))
        default:
            throw BridgeContractError.invalidValue
        }
    }
}

private struct BridgeObject {
    let values: [String: Any]

    func requireKeys(_ keys: Set<String>) throws {
        guard Set(values.keys) == keys else {
            throw BridgeContractError.invalidKeys
        }
    }

    func string(_ key: String) throws -> String {
        guard let value = values[key] as? String else {
            throw BridgeContractError.invalidValue
        }
        return value
    }

    func boolean(_ key: String) throws -> Bool {
        guard let value = values[key], BridgeValue.isBoolean(value) else {
            throw BridgeContractError.invalidValue
        }
        return (value as! NSNumber).boolValue
    }

    func integer(
        _ key: String,
        minimum: UInt64 = 0,
        maximum: UInt64 = BridgeContract.maximumSafeInteger
    ) throws -> UInt64 {
        guard let value = values[key],
              let integer = BridgeValue.safeInteger(value),
              integer >= minimum,
              integer <= maximum
        else {
            throw BridgeContractError.invalidValue
        }
        return integer
    }

    func optionalInteger(_ key: String, minimum: UInt64 = 0) throws -> UInt64? {
        guard let value = values[key] else {
            throw BridgeContractError.invalidValue
        }
        if value is NSNull {
            return nil
        }
        guard let integer = BridgeValue.safeInteger(value), integer >= minimum else {
            throw BridgeContractError.invalidValue
        }
        return integer
    }

    func number(_ key: String, minimum: Double, maximum: Double) throws -> Double {
        guard let value = values[key],
              !BridgeValue.isBoolean(value),
              let number = value as? NSNumber
        else {
            throw BridgeContractError.invalidValue
        }
        let result = number.doubleValue
        guard result.isFinite, result >= minimum, result <= maximum else {
            throw BridgeContractError.invalidValue
        }
        return result
    }

    func uuid(_ key: String) throws -> UUID {
        try BridgeValue.uuid(string(key))
    }

    func optionalUUID(_ key: String) throws -> UUID? {
        guard let value = values[key] else {
            throw BridgeContractError.invalidValue
        }
        if value is NSNull {
            return nil
        }
        guard let string = value as? String else {
            throw BridgeContractError.invalidValue
        }
        return try BridgeValue.uuid(string)
    }

    func object(_ key: String) throws -> BridgeObject {
        guard let object = values[key] as? [String: Any] else {
            throw BridgeContractError.invalidValue
        }
        return BridgeObject(values: object)
    }
}

/// Checks JSON grammar that `JSONSerialization` normalizes away, notably
/// duplicate object keys. The contract rejects those messages rather than
/// allowing an implementation-defined last-key-wins decode.
private struct StrictBridgeJSONValidator {
    private let bytes: [UInt8]
    private var index = 0

    init(data: Data) {
        bytes = Array(data)
    }

    mutating func validate() throws {
        try parseValue(containerDepth: 0)
        skipWhitespace()
        guard index == bytes.count else {
            throw BridgeContractError.invalidJSON
        }
    }

    private mutating func parseValue(containerDepth: Int) throws {
        skipWhitespace()
        guard index < bytes.count else {
            throw BridgeContractError.invalidJSON
        }
        switch bytes[index] {
        case 0x7B:
            try parseObject(depth: containerDepth + 1)
        case 0x5B:
            try parseArray(depth: containerDepth + 1)
        case 0x22:
            _ = try parseString()
        case 0x74:
            try consume("true")
        case 0x66:
            try consume("false")
        case 0x6E:
            try consume("null")
        case 0x2D, 0x30...0x39:
            try parseNumber()
        default:
            throw BridgeContractError.invalidJSON
        }
    }

    private mutating func parseObject(depth: Int) throws {
        guard depth <= BridgeContract.maximumContainerDepth else {
            throw BridgeContractError.invalidShape
        }
        index += 1
        skipWhitespace()
        var keys = Set<String>()
        if consumeIf(0x7D) { return }
        while true {
            skipWhitespace()
            let key = try parseString()
            guard keys.insert(key).inserted else {
                throw BridgeContractError.invalidKeys
            }
            skipWhitespace()
            guard consumeIf(0x3A) else {
                throw BridgeContractError.invalidJSON
            }
            try parseValue(containerDepth: depth)
            skipWhitespace()
            if consumeIf(0x7D) { return }
            guard consumeIf(0x2C) else {
                throw BridgeContractError.invalidJSON
            }
        }
    }

    private mutating func parseArray(depth: Int) throws {
        guard depth <= BridgeContract.maximumContainerDepth else {
            throw BridgeContractError.invalidShape
        }
        index += 1
        skipWhitespace()
        if consumeIf(0x5D) { return }
        var count = 0
        while true {
            count += 1
            guard count <= BridgeContract.maximumArrayLength else {
                throw BridgeContractError.invalidShape
            }
            try parseValue(containerDepth: depth)
            skipWhitespace()
            if consumeIf(0x5D) { return }
            guard consumeIf(0x2C) else {
                throw BridgeContractError.invalidJSON
            }
        }
    }

    private mutating func parseString() throws -> String {
        guard consumeIf(0x22) else {
            throw BridgeContractError.invalidJSON
        }
        let start = index - 1
        while index < bytes.count {
            let byte = bytes[index]
            index += 1
            if byte == 0x22 {
                let encoded = Data(bytes[start..<index])
                guard let decoded = try JSONSerialization.jsonObject(
                    with: encoded,
                    options: [.fragmentsAllowed]
                ) as? String else {
                    throw BridgeContractError.invalidJSON
                }
                return decoded
            }
            guard byte >= 0x20 else {
                throw BridgeContractError.invalidJSON
            }
            if byte == 0x5C {
                guard index < bytes.count else {
                    throw BridgeContractError.invalidJSON
                }
                let escaped = bytes[index]
                index += 1
                if escaped == 0x75 {
                    guard index <= bytes.count - 4,
                          bytes[index..<(index + 4)].allSatisfy(Self.isHex)
                    else {
                        throw BridgeContractError.invalidJSON
                    }
                    index += 4
                } else if ![0x22, 0x5C, 0x2F, 0x62, 0x66, 0x6E, 0x72, 0x74].contains(escaped) {
                    throw BridgeContractError.invalidJSON
                }
            }
        }
        throw BridgeContractError.invalidJSON
    }

    private mutating func parseNumber() throws {
        let start = index
        _ = consumeIf(0x2D)
        if consumeIf(0x30) {
            guard index == bytes.count || !(0x30...0x39).contains(bytes[index]) else {
                throw BridgeContractError.invalidJSON
            }
        } else {
            try consumeDigits()
        }
        if consumeIf(0x2E) { try consumeDigits() }
        if index < bytes.count, bytes[index] == 0x65 || bytes[index] == 0x45 {
            index += 1
            if index < bytes.count, bytes[index] == 0x2B || bytes[index] == 0x2D {
                index += 1
            }
            try consumeDigits()
        }
        guard let string = String(bytes: bytes[start..<index], encoding: .utf8),
              let value = Double(string), value.isFinite
        else {
            throw BridgeContractError.invalidJSON
        }
    }

    private mutating func consumeDigits() throws {
        let start = index
        while index < bytes.count, (0x30...0x39).contains(bytes[index]) {
            index += 1
        }
        guard index > start else {
            throw BridgeContractError.invalidJSON
        }
    }

    private mutating func consume(_ text: StaticString) throws {
        let target = Array("\(text)".utf8)
        guard index <= bytes.count - target.count,
              Array(bytes[index..<(index + target.count)]) == target
        else {
            throw BridgeContractError.invalidJSON
        }
        index += target.count
    }

    private mutating func skipWhitespace() {
        while index < bytes.count, [0x20, 0x09, 0x0A, 0x0D].contains(bytes[index]) {
            index += 1
        }
    }

    private mutating func consumeIf(_ byte: UInt8) -> Bool {
        guard index < bytes.count, bytes[index] == byte else { return false }
        index += 1
        return true
    }

    private static func isHex(_ byte: UInt8) -> Bool {
        (0x30...0x39).contains(byte)
            || (0x41...0x46).contains(byte)
            || (0x61...0x66).contains(byte)
    }
}

private enum BridgeValue {
    static func decodeObject(_ data: Data) throws -> BridgeObject {
        guard data.count <= BridgeContract.maximumMessageBytes else {
            throw BridgeContractError.messageTooLarge
        }
        do {
            var validator = StrictBridgeJSONValidator(data: data)
            try validator.validate()
        } catch let error as BridgeContractError {
            throw error
        } catch {
            throw BridgeContractError.invalidJSON
        }
        let value: Any
        do {
            value = try JSONSerialization.jsonObject(with: data)
        } catch {
            throw BridgeContractError.invalidJSON
        }
        try validate(value, depth: 0)
        guard let object = value as? [String: Any] else {
            throw BridgeContractError.invalidShape
        }
        return BridgeObject(values: object)
    }

    static func validate(_ value: Any, depth: Int) throws {
        if let object = value as? [String: Any] {
            let nextDepth = depth + 1
            guard nextDepth <= BridgeContract.maximumContainerDepth else {
                throw BridgeContractError.invalidShape
            }
            for (key, child) in object {
                try validateString(key)
                try validate(child, depth: nextDepth)
            }
            return
        }
        if let array = value as? [Any] {
            let nextDepth = depth + 1
            guard nextDepth <= BridgeContract.maximumContainerDepth,
                  array.count <= BridgeContract.maximumArrayLength
            else {
                throw BridgeContractError.invalidShape
            }
            for child in array {
                try validate(child, depth: nextDepth)
            }
            return
        }
        if let string = value as? String {
            try validateString(string)
            return
        }
        if value is NSNull || isBoolean(value) {
            return
        }
        guard let number = value as? NSNumber, number.doubleValue.isFinite else {
            throw BridgeContractError.invalidValue
        }
    }

    static func validateString(_ value: String) throws {
        guard value.utf8.count <= 64,
              !value.unicodeScalars.contains(where: { scalar in
                  scalar.value <= 0x1F || scalar.value == 0x7F
              })
        else {
            throw BridgeContractError.invalidValue
        }
    }

    static func isBoolean(_ value: Any) -> Bool {
        guard let number = value as? NSNumber else {
            return false
        }
        return CFGetTypeID(number) == CFBooleanGetTypeID()
    }

    static func safeInteger(_ value: Any) -> UInt64? {
        guard !isBoolean(value), let number = value as? NSNumber else {
            return nil
        }
        let double = number.doubleValue
        guard double.isFinite,
              double.rounded(.towardZero) == double,
              double >= 0,
              double <= Double(BridgeContract.maximumSafeInteger)
        else {
            return nil
        }
        return UInt64(double)
    }

    static func uuid(_ value: String) throws -> UUID {
        guard value.utf8.count == 36,
              value == value.lowercased(),
              let uuid = UUID(uuidString: value),
              uuid.uuidString.lowercased() == value
        else {
            throw BridgeContractError.invalidValue
        }
        return uuid
    }
}
