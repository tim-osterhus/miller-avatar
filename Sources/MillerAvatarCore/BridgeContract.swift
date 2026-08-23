import CoreFoundation
import Foundation

public enum BridgeContract {
    public static let commandSchema = "miller-avatar.presentation-command/v2"
    public static let observationSchema = "miller-avatar.presentation-observation/v2"
    public static let maximumMessageBytes = 16_384
    public static let maximumContainerDepth = 8
    public static let maximumArrayLength = 64
    public static let maximumSafeInteger: UInt64 = 9_007_199_254_740_991
}

public enum AvatarMotionRole: String, Codable, CaseIterable, Sendable {
    case idle
    case listening
    case thinking
    case speaking
    case success
    case failure

    public var isSteady: Bool {
        switch self {
        case .idle, .listening, .thinking, .speaking:
            true
        case .success, .failure:
            false
        }
    }
}

public enum MotionBindingStatus: String, Codable, Equatable, Sendable {
    case ready
    case missing
    case rejected
}

public struct MotionBindingPayload: Codable, Equatable, Sendable {
    public let status: MotionBindingStatus
    public let token: UUID?

    public init(status: MotionBindingStatus, token: UUID?) {
        self.status = status
        self.token = token
    }

    public static func ready(token: UUID) -> Self {
        Self(status: .ready, token: token)
    }

    public static var missing: Self {
        Self(status: .missing, token: nil)
    }

    public static var rejected: Self {
        Self(status: .rejected, token: nil)
    }

    package var isValid: Bool {
        switch status {
        case .ready:
            token != nil
        case .missing, .rejected:
            token == nil
        }
    }
}

public struct LoadProfilePayload: Codable, Equatable, Sendable {
    public let profileRevision: UInt64
    public let modelToken: UUID
    public let motionBindings: [AvatarMotionRole: MotionBindingPayload]

    public init(
        profileRevision: UInt64,
        modelToken: UUID,
        motionBindings: [AvatarMotionRole: MotionBindingPayload]
    ) {
        self.profileRevision = profileRevision
        self.modelToken = modelToken
        self.motionBindings = motionBindings
    }
}

public enum MotionStatus: String, Codable, CaseIterable, Equatable, Sendable {
    case ready
    case missing
    case rejected
    case loadFailed = "load_failed"
    case timedOut = "timed_out"
    case runtimeFailed = "runtime_failed"
}

public typealias MotionObservationStatus = MotionStatus

public enum MotionActiveMode: String, Codable, CaseIterable, Equatable, Sendable {
    case loop
    case oneShot = "one_shot"
    case rest
}

public struct MotionStatusPayload: Codable, Equatable, Sendable {
    public let profileRevision: UInt64
    public let modelToken: UUID
    public let motionToken: UUID?
    public let role: AvatarMotionRole
    public let status: MotionStatus
    public let motionCode: MotionFailureCode?

    public init(
        profileRevision: UInt64,
        modelToken: UUID,
        motionToken: UUID?,
        role: AvatarMotionRole,
        status: MotionStatus,
        motionCode: MotionFailureCode?
    ) {
        self.profileRevision = profileRevision
        self.modelToken = modelToken
        self.motionToken = motionToken
        self.role = role
        self.status = status
        self.motionCode = motionCode
    }
}

public struct MotionActivePayload: Codable, Equatable, Sendable {
    public let profileRevision: UInt64
    public let modelToken: UUID
    public let motionToken: UUID?
    public let role: AvatarMotionRole?
    public let mode: MotionActiveMode

    public init(
        profileRevision: UInt64,
        modelToken: UUID,
        motionToken: UUID?,
        role: AvatarMotionRole?,
        mode: MotionActiveMode
    ) {
        self.profileRevision = profileRevision
        self.modelToken = modelToken
        self.motionToken = motionToken
        self.role = role
        self.mode = mode
    }
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
    case succeeded
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
    public let mouthCuesEnabled: Bool

    public init(
        profile: String = "lightweight",
        reducedMotion: Bool,
        mouthCuesEnabled: Bool = true
    ) {
        self.profile = profile
        self.reducedMotion = reducedMotion
        self.mouthCuesEnabled = mouthCuesEnabled
    }
}

public struct ProjectPhasePayload: Codable, Equatable, Sendable {
    public let projectionSequence: UInt64
    public let generationID: UUID?
    public let phase: PresentationPhase
    public let playbackID: UUID?

    public init(
        projectionSequence: UInt64,
        generationID: UUID?,
        phase: PresentationPhase,
        playbackID: UUID?
    ) {
        self.projectionSequence = projectionSequence
        self.generationID = generationID
        self.phase = phase
        self.playbackID = playbackID
    }
}

public struct SetVisibilityPayload: Codable, Equatable, Sendable {
    public let visibility: PresentationVisibility

    public init(visibility: PresentationVisibility) {
        self.visibility = visibility
    }
}

public struct SetPolicyPayload: Codable, Equatable, Sendable {
    public let reducedMotion: Bool

    public let mouthCuesEnabled: Bool

    public init(reducedMotion: Bool, mouthCuesEnabled: Bool = true) {
        self.reducedMotion = reducedMotion
        self.mouthCuesEnabled = mouthCuesEnabled
    }
}

public struct MouthVowelWeights: Codable, Equatable, Sendable {
    public let aa: Double
    public let ih: Double
    public let ou: Double
    public let ee: Double
    public let oh: Double

    public init(aa: Double, ih: Double, ou: Double, ee: Double, oh: Double) {
        self.aa = aa
        self.ih = ih
        self.ou = ou
        self.ee = ee
        self.oh = oh
    }

    package var isValid: Bool {
        [aa, ih, ou, ee, oh].allSatisfy { $0.isFinite && $0 >= 0 && $0 <= 1 }
    }
}

public struct SetMouthPayload: Codable, Equatable, Sendable {
    public let generationID: UUID
    public let playbackID: UUID
    public let cueIndex: UInt64
    public let playbackOffsetMilliseconds: UInt64
    public let scalar: Double
    public let vowels: MouthVowelWeights?

    public init(
        generationID: UUID,
        playbackID: UUID,
        cueIndex: UInt64,
        playbackOffsetMilliseconds: UInt64,
        scalar: Double,
        vowels: MouthVowelWeights? = nil
    ) {
        self.generationID = generationID
        self.playbackID = playbackID
        self.cueIndex = cueIndex
        self.playbackOffsetMilliseconds = playbackOffsetMilliseconds
        self.scalar = scalar
        self.vowels = vowels
    }
}

public struct ReconcilePresentationPayload: Codable, Equatable, Sendable {
    public let lastProjectionSequence: UInt64?
    public let generationID: UUID?
    public let phase: PresentationPhase
    public let playbackID: UUID?
    public let reducedMotion: Bool
    public let mouthCuesEnabled: Bool

    public init(
        lastProjectionSequence: UInt64?,
        generationID: UUID?,
        phase: PresentationPhase,
        playbackID: UUID?,
        reducedMotion: Bool,
        mouthCuesEnabled: Bool = true
    ) {
        self.lastProjectionSequence = lastProjectionSequence
        self.generationID = generationID
        self.phase = phase
        self.playbackID = playbackID
        self.reducedMotion = reducedMotion
        self.mouthCuesEnabled = mouthCuesEnabled
    }
}

public struct ResetPayload: Codable, Equatable, Sendable {
    public let generationID: UUID?
    public let reason: ResetReason

    public init(generationID: UUID?, reason: ResetReason) {
        self.generationID = generationID
        self.reason = reason
    }
}

public struct DisposePayload: Codable, Equatable, Sendable {
    public let reason: DisposalReason

    public init(reason: DisposalReason) {
        self.reason = reason
    }
}

public enum PresentationCommand: Equatable, Sendable {
    case configure(ConfigurePayload)
    case loadProfile(LoadProfilePayload)
    case projectPhase(ProjectPhasePayload)
    case reconcilePresentation(ReconcilePresentationPayload)
    case setVisibility(SetVisibilityPayload)
    case setPolicy(SetPolicyPayload)
    case setMouth(SetMouthPayload)
    case reset(ResetPayload)
    case dispose(DisposePayload)
}

public struct WrapperReadyPayload: Codable, Equatable, Sendable {
    public let bridgeVersion: UInt64
    public init(bridgeVersion: UInt64) { self.bridgeVersion = bridgeVersion }
}

public struct RendererReadyPayload: Codable, Equatable, Sendable {
    public let webgl: String
    public init(webgl: String) { self.webgl = webgl }
}

public struct AssetCapabilities: Codable, Equatable, Sendable {
    public let aa: Bool
    public let lookAt: Bool
    public let springBone: Bool
    public let mtoonMaterials: UInt64
    public let vowels: MouthVowelCapabilities?

    public init(
        aa: Bool,
        lookAt: Bool,
        springBone: Bool,
        mtoonMaterials: UInt64,
        vowels: MouthVowelCapabilities? = nil
    ) {
        self.aa = aa
        self.lookAt = lookAt
        self.springBone = springBone
        self.mtoonMaterials = mtoonMaterials
        self.vowels = vowels
    }
}

public struct MouthVowelCapabilities: Codable, Equatable, Sendable {
    public let aa: Bool
    public let ih: Bool
    public let ou: Bool
    public let ee: Bool
    public let oh: Bool

    public init(aa: Bool, ih: Bool, ou: Bool, ee: Bool, oh: Bool) {
        self.aa = aa
        self.ih = ih
        self.ou = ou
        self.ee = ee
        self.oh = oh
    }
}

public struct ProfileModelLoadedPayload: Codable, Equatable, Sendable {
    public let profileRevision: UInt64
    public let modelToken: UUID
    public let capabilities: AssetCapabilities

    public init(
        profileRevision: UInt64,
        modelToken: UUID,
        capabilities: AssetCapabilities
    ) {
        self.profileRevision = profileRevision
        self.modelToken = modelToken
        self.capabilities = capabilities
    }
}

public struct FirstFramePayload: Codable, Equatable, Sendable {
    public let profileRevision: UInt64
    public let modelToken: UUID
    public let viewportWidth: UInt64
    public let viewportHeight: UInt64
    public let visibleMeshes: UInt64
    public let decodedTextures: UInt64
    public let materialBindings: UInt64
    public let alphaProbePixels: UInt64

    public init(
        profileRevision: UInt64,
        modelToken: UUID,
        viewportWidth: UInt64,
        viewportHeight: UInt64,
        visibleMeshes: UInt64,
        decodedTextures: UInt64,
        materialBindings: UInt64,
        alphaProbePixels: UInt64
    ) {
        self.profileRevision = profileRevision
        self.modelToken = modelToken
        self.viewportWidth = viewportWidth
        self.viewportHeight = viewportHeight
        self.visibleMeshes = visibleMeshes
        self.decodedTextures = decodedTextures
        self.materialBindings = materialBindings
        self.alphaProbePixels = alphaProbePixels
    }
}

public struct SuspendedPayload: Codable, Equatable, Sendable {
    public let visibility: PresentationVisibility
    public let frames: UInt64
    public let updates: UInt64
    public let renders: UInt64

    public init(
        visibility: PresentationVisibility,
        frames: UInt64,
        updates: UInt64,
        renders: UInt64
    ) {
        self.visibility = visibility
        self.frames = frames
        self.updates = updates
        self.renders = renders
    }
}

public struct ResumedPayload: Codable, Equatable, Sendable {
    public let frames: UInt64
    public let updates: UInt64
    public let renders: UInt64

    public init(frames: UInt64, updates: UInt64, renders: UInt64) {
        self.frames = frames
        self.updates = updates
        self.renders = renders
    }
}

public struct DisposedPayload: Codable, Equatable, Sendable {
    public let reason: DisposalReason
    public init(reason: DisposalReason) { self.reason = reason }
}

public struct FailedPayload: Codable, Equatable, Sendable {
    public let code: FailureCode
    public let operation: FailureOperation

    public init(code: FailureCode, operation: FailureOperation) {
        self.code = code
        self.operation = operation
    }
}

public enum PresentationObservation: Equatable, Sendable {
    case wrapperReady(WrapperReadyPayload)
    case rendererReady(RendererReadyPayload)
    case profileModelLoaded(ProfileModelLoadedPayload)
    case firstFrame(FirstFramePayload)
    case motionStatus(MotionStatusPayload)
    case motionActive(MotionActivePayload)
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
    private var hasLoadedProfile = false

    public init(sessionID: UUID) {
        self.sessionID = sessionID
    }

    public func decode(_ data: Data) throws -> PresentationCommandEnvelope {
        if hasDisposed { throw BridgeContractError.disposed }
        let object = try BridgeValue.decodeObject(data)
        try object.requireKeys(["schema", "session_id", "sequence", "type", "payload"])
        guard try object.string("schema") == BridgeContract.commandSchema else {
            throw BridgeContractError.invalidValue
        }
        let decodedSession = try object.uuid("session_id")
        guard decodedSession == sessionID else { throw BridgeContractError.staleSession }
        let sequence = try object.integer("sequence", minimum: 1)
        guard sequence == nextSequence else { throw BridgeContractError.invalidSequence }
        let command = try PresentationCommand.decode(
            type: object.string("type"),
            payload: object.object("payload")
        )
        try accept(command)
        nextSequence += 1
        if case .dispose = command { hasDisposed = true }
        return PresentationCommandEnvelope(
            sessionID: decodedSession,
            sequence: sequence,
            command: command
        )
    }

    private func accept(_ command: PresentationCommand) throws {
        switch command {
        case .loadProfile:
            guard !hasLoadedProfile else { throw BridgeContractError.invalidSequence }
            hasLoadedProfile = true
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
        case let .reconcilePresentation(reconciliation):
            if let lastProjectionSequence,
               let incoming = reconciliation.lastProjectionSequence,
               incoming < lastProjectionSequence
            {
                throw BridgeContractError.invalidSequence
            }
            if lastProjectionSequence != nil,
               reconciliation.lastProjectionSequence == nil
            {
                throw BridgeContractError.invalidSequence
            }
            lastProjectionSequence = reconciliation.lastProjectionSequence
            activeGenerationID = reconciliation.generationID
            activePlaybackID = reconciliation.playbackID
            lastCueIndex = nil
            lastPlaybackOffsetMilliseconds = nil
        case let .setMouth(cue):
            guard cue.generationID == activeGenerationID,
                  cue.playbackID == activePlaybackID,
                  cue.cueIndex > (lastCueIndex ?? 0),
                  cue.playbackOffsetMilliseconds
                      >= (lastPlaybackOffsetMilliseconds ?? 0)
            else { throw BridgeContractError.invalidSequence }
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
    private var activeProfileRevision: UInt64?
    private var activeModelToken: UUID?
    private var activeProfileLoadCauseSequence: UInt64?
    private var expectedProfile: LoadProfilePayload?
    private var expectedProfileLoadSequence: UInt64?
    private var expectedPhaseCauseSequence: UInt64?
    private var hasDisposed = false
    private var expectedMotionBindings: [AvatarMotionRole: MotionBindingPayload] = [:]

    public init(sessionID: UUID) {
        self.sessionID = sessionID
    }

    public convenience init(
        sessionID: UUID,
        expectedProfile: LoadProfilePayload,
        expectedProfileLoadSequence: UInt64? = nil
    ) {
        self.init(sessionID: sessionID)
        self.expectedProfile = expectedProfile
        self.expectedProfileLoadSequence = expectedProfileLoadSequence
        expectedMotionBindings = expectedProfile.motionBindings
    }

    public func setExpectedProfile(
        _ profile: LoadProfilePayload?,
        causedBySequence: UInt64? = nil
    ) {
        expectedProfile = profile
        expectedProfileLoadSequence = causedBySequence
        if activeProfileRevision == nil {
            activeProfileLoadCauseSequence = nil
        }
        expectedMotionBindings = profile?.motionBindings ?? [:]
    }

    public func setExpectedProfileLoadSequence(_ sequence: UInt64?) {
        expectedProfileLoadSequence = sequence
    }

    public func setExpectedPhaseCauseSequence(_ sequence: UInt64?) {
        expectedPhaseCauseSequence = sequence
    }

    public func decode(_ data: Data) throws -> PresentationObservationEnvelope {
        if hasDisposed { throw BridgeContractError.disposed }
        let object = try BridgeValue.decodeObject(data)
        try object.requireKeys([
            "schema", "session_id", "sequence", "caused_by_sequence", "type", "payload",
        ])
        guard try object.string("schema") == BridgeContract.observationSchema else {
            throw BridgeContractError.invalidValue
        }
        let decodedSession = try object.uuid("session_id")
        guard decodedSession == sessionID else { throw BridgeContractError.staleSession }
        let sequence = try object.integer("sequence", minimum: 1)
        guard sequence == nextSequence else { throw BridgeContractError.invalidSequence }
        let causedBySequence = try object.optionalInteger("caused_by_sequence", minimum: 1)
        let observation = try PresentationObservation.decode(
            type: object.string("type"),
            payload: object.object("payload")
        )
        try accept(
            observation,
            causedBySequence: causedBySequence
        )
        nextSequence += 1
        if case .disposed = observation { hasDisposed = true }
        return PresentationObservationEnvelope(
            sessionID: decodedSession,
            sequence: sequence,
            causedBySequence: causedBySequence,
            observation: observation
        )
    }

    private func accept(
        _ observation: PresentationObservation,
        causedBySequence: UInt64?
    ) throws {
        switch observation {
        case .profileModelLoaded(let payload):
            guard initialProfileLoadCauseMatches(causedBySequence),
                  activeProfileRevision == nil,
                  payload.profileRevision > 0,
                  payload.profileRevision <= BridgeContract.maximumSafeInteger
            else { throw BridgeContractError.invalidSequence }
            if let expectedProfile {
                guard expectedProfile.profileRevision == payload.profileRevision,
                      expectedProfile.modelToken == payload.modelToken
                else { throw BridgeContractError.staleSession }
            }
            activeProfileRevision = payload.profileRevision
            activeModelToken = payload.modelToken
            activeProfileLoadCauseSequence = causedBySequence
        case .firstFrame(let payload):
            try requireIdentity(
                profileRevision: payload.profileRevision,
                modelToken: payload.modelToken,
                causedBySequence: causedBySequence
            )
        case .motionStatus(let payload):
            try requireIdentity(
                profileRevision: payload.profileRevision,
                modelToken: payload.modelToken,
                causedBySequence: causedBySequence,
                requiresProfileLoadCause: payload.status != .runtimeFailed
            )
            try requireMotionIdentity(
                role: payload.role,
                token: payload.motionToken,
                status: payload.status
            )
        case .motionActive(let payload):
            try requireIdentity(
                profileRevision: payload.profileRevision,
                modelToken: payload.modelToken,
                causedBySequence: causedBySequence,
                requiresProfileLoadCause: false
            )
            guard expectedPhaseCauseSequence == nil
                    || causedBySequence == expectedPhaseCauseSequence
            else { throw BridgeContractError.invalidSequence }
            try requireActiveMotionIdentity(payload)
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
    }

    private func requireIdentity(
        profileRevision: UInt64,
        modelToken: UUID,
        causedBySequence: UInt64?,
        requiresProfileLoadCause: Bool = true
    ) throws {
        guard !requiresProfileLoadCause || profileLoadCauseMatches(causedBySequence) else {
            throw BridgeContractError.invalidSequence
        }
        guard causedBySequence != nil else { throw BridgeContractError.staleSession }
        guard activeProfileRevision == profileRevision,
              activeModelToken == modelToken
        else { throw BridgeContractError.staleSession }
    }

    private func profileLoadCauseMatches(_ causedBySequence: UInt64?) -> Bool {
        guard let causedBySequence else { return false }
        if let expectedProfileLoadSequence {
            return causedBySequence == expectedProfileLoadSequence
        }
        guard let activeProfileLoadCauseSequence else { return false }
        return causedBySequence == activeProfileLoadCauseSequence
    }

    private func initialProfileLoadCauseMatches(_ causedBySequence: UInt64?) -> Bool {
        guard let causedBySequence else { return false }
        return expectedProfileLoadSequence == nil
            || causedBySequence == expectedProfileLoadSequence
    }

    private func requireMotionIdentity(
        role: AvatarMotionRole,
        token: UUID?,
        status: MotionStatus
    ) throws {
        guard let expected = expectedMotionBindings[role] else {
            if expectedMotionBindings.isEmpty { return }
            throw BridgeContractError.invalidValue
        }

        switch expected.status {
        case .ready:
            guard let expectedToken = expected.token,
                  token == expectedToken,
                  status == .ready
                      || status == .loadFailed
                      || status == .timedOut
                      || status == .runtimeFailed
            else { throw BridgeContractError.invalidValue }
        case .missing:
            guard status == .missing, token == nil else {
                throw BridgeContractError.invalidValue
            }
        case .rejected:
            guard status == .rejected, token == nil else {
                throw BridgeContractError.invalidValue
            }
        }
    }

    private func requireActiveMotionIdentity(
        _ payload: MotionActivePayload
    ) throws {
        switch payload.mode {
        case .rest:
            return
        case .loop, .oneShot:
            guard let role = payload.role,
                  let token = payload.motionToken,
                  let expected = expectedMotionBindings[role],
                  expected.status == .ready,
                  expected.token == token
            else {
                if expectedMotionBindings.isEmpty { return }
                throw BridgeContractError.invalidValue
            }
        }
    }

    private func acceptCounters(
        frames: UInt64,
        updates: UInt64,
        renders: UInt64
    ) throws {
        if let lastFrames, frames < lastFrames { throw BridgeContractError.invalidSequence }
        if let lastUpdates, updates < lastUpdates { throw BridgeContractError.invalidSequence }
        if let lastRenders, renders < lastRenders { throw BridgeContractError.invalidSequence }
        lastFrames = frames
        lastUpdates = updates
        lastRenders = renders
    }
}

private extension PresentationCommand {
    static func decode(type: String, payload: BridgeObject) throws -> Self {
        switch type {
        case "configure":
            try payload.requireKeys(["profile", "reduced_motion", "mouth_cues_enabled"])
            guard try payload.string("profile") == "lightweight" else {
                throw BridgeContractError.invalidValue
            }
            return .configure(ConfigurePayload(
                reducedMotion: try payload.boolean("reduced_motion"),
                mouthCuesEnabled: try payload.boolean("mouth_cues_enabled")
            ))
        case "load_profile":
            try payload.requireKeys(["profile_revision", "model_token", "motion_bindings"])
            let profileRevision = try payload.integer("profile_revision", minimum: 1)
            let modelToken = try payload.uuid("model_token")
            let bindings = try payload.object("motion_bindings")
            let expectedRoles = Set(AvatarMotionRole.allCases.map(\.rawValue))
            guard Set(bindings.values.keys) == expectedRoles else {
                throw BridgeContractError.invalidKeys
            }
            var decoded: [AvatarMotionRole: MotionBindingPayload] = [:]
            for role in AvatarMotionRole.allCases {
                let descriptor = try bindings.object(role.rawValue)
                try descriptor.requireKeys(["status", "token"])
                guard let status = MotionBindingStatus(rawValue: try descriptor.string("status")) else {
                    throw BridgeContractError.invalidValue
                }
                let token = try descriptor.optionalUUID("token")
                switch status {
                case .ready:
                    guard token != nil else { throw BridgeContractError.invalidValue }
                case .missing, .rejected:
                    guard token == nil else { throw BridgeContractError.invalidValue }
                }
                decoded[role] = MotionBindingPayload(status: status, token: token)
            }
            return .loadProfile(LoadProfilePayload(
                profileRevision: profileRevision,
                modelToken: modelToken,
                motionBindings: decoded
            ))
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
            guard validPhaseIdentities(
                phase: phase,
                generationID: generationID,
                playbackID: playbackID
            ) else { throw BridgeContractError.invalidValue }
            return .projectPhase(ProjectPhasePayload(
                projectionSequence: projectionSequence,
                generationID: generationID,
                phase: phase,
                playbackID: playbackID
            ))
        case "reconcile_presentation":
            try payload.requireKeys([
                "last_projection_sequence", "generation_id", "phase", "playback_id",
                "reduced_motion", "mouth_cues_enabled",
            ])
            let lastProjectionSequence = try payload.optionalInteger(
                "last_projection_sequence", minimum: 1
            )
            let generationID = try payload.optionalUUID("generation_id")
            guard let phase = PresentationPhase(rawValue: try payload.string("phase")) else {
                throw BridgeContractError.invalidValue
            }
            let playbackID = try payload.optionalUUID("playback_id")
            guard validPhaseIdentities(
                phase: phase,
                generationID: generationID,
                playbackID: playbackID
            ) else { throw BridgeContractError.invalidValue }
            return .reconcilePresentation(ReconcilePresentationPayload(
                lastProjectionSequence: lastProjectionSequence,
                generationID: generationID,
                phase: phase,
                playbackID: playbackID,
                reducedMotion: try payload.boolean("reduced_motion"),
                mouthCuesEnabled: try payload.boolean("mouth_cues_enabled")
            ))
        case "set_visibility":
            try payload.requireKeys(["visibility"])
            guard let visibility = PresentationVisibility(rawValue: try payload.string("visibility")) else {
                throw BridgeContractError.invalidValue
            }
            return .setVisibility(SetVisibilityPayload(visibility: visibility))
        case "set_policy":
            try payload.requireKeys(["reduced_motion", "mouth_cues_enabled"])
            return .setPolicy(SetPolicyPayload(
                reducedMotion: try payload.boolean("reduced_motion"),
                mouthCuesEnabled: try payload.boolean("mouth_cues_enabled")
            ))
        case "set_mouth":
            let baseKeys: Set<String> = [
                "generation_id", "playback_id", "cue_index", "playback_offset_ms", "scalar",
            ]
            guard Set(payload.values.keys) == baseKeys
                || Set(payload.values.keys) == baseKeys.union(["vowels"])
            else { throw BridgeContractError.invalidKeys }
            let vowels = try payload.optionalMouthVowelWeights("vowels")
            return .setMouth(SetMouthPayload(
                generationID: try payload.uuid("generation_id"),
                playbackID: try payload.uuid("playback_id"),
                cueIndex: try payload.integer("cue_index", minimum: 1),
                playbackOffsetMilliseconds: try payload.integer(
                    "playback_offset_ms", maximum: 86_400_000
                ),
                scalar: try payload.number("scalar", minimum: 0, maximum: 1),
                vowels: vowels
            ))
        case "reset":
            try payload.requireKeys(["generation_id", "reason"])
            guard let reason = ResetReason(rawValue: try payload.string("reason")) else {
                throw BridgeContractError.invalidValue
            }
            let generationID = try payload.optionalUUID("generation_id")
            guard generationID != nil || reason == .operator else {
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

    private static func validPhaseIdentities(
        phase: PresentationPhase,
        generationID: UUID?,
        playbackID: UUID?
    ) -> Bool {
        switch phase {
        case .speaking:
            generationID != nil && playbackID != nil
        case .thinking, .responding, .succeeded, .stopped, .failed:
            generationID != nil && playbackID == nil
        case .idle, .listening, .transcribing:
            generationID == nil && playbackID == nil
        }
    }
}

private extension PresentationObservation {
    static func decode(type: String, payload: BridgeObject) throws -> Self {
        switch type {
        case "wrapper_ready":
            try payload.requireKeys(["bridge_version"])
            let version = try payload.integer("bridge_version")
            guard version == 2 else { throw BridgeContractError.invalidValue }
            return .wrapperReady(WrapperReadyPayload(bridgeVersion: version))
        case "renderer_ready":
            try payload.requireKeys(["webgl"])
            guard try payload.string("webgl") == "webgl2" else {
                throw BridgeContractError.invalidValue
            }
            return .rendererReady(RendererReadyPayload(webgl: "webgl2"))
        case "profile_model_loaded":
            try payload.requireKeys(["profile_revision", "model_token", "capabilities"])
            let capabilities = try payload.object("capabilities")
            let baseCapabilityKeys: Set<String> = [
                "aa", "look_at", "spring_bone", "mtoon_materials",
            ]
            guard Set(capabilities.values.keys) == baseCapabilityKeys
                || Set(capabilities.values.keys) == baseCapabilityKeys.union(["vowels"])
            else { throw BridgeContractError.invalidKeys }
            let vowelCapabilities = try capabilities.mouthVowelCapabilities("vowels")
            return .profileModelLoaded(ProfileModelLoadedPayload(
                profileRevision: try payload.integer("profile_revision", minimum: 1),
                modelToken: try payload.uuid("model_token"),
                capabilities: AssetCapabilities(
                    aa: try capabilities.boolean("aa"),
                    lookAt: try capabilities.boolean("look_at"),
                    springBone: try capabilities.boolean("spring_bone"),
                    mtoonMaterials: try capabilities.integer("mtoon_materials", maximum: 10_240),
                    vowels: vowelCapabilities
                )
            ))
        case "first_frame":
            try payload.requireKeys([
                "profile_revision", "model_token", "viewport_width", "viewport_height",
                "visible_meshes", "decoded_textures", "material_bindings", "alpha_probe_pixels",
            ])
            return .firstFrame(FirstFramePayload(
                profileRevision: try payload.integer("profile_revision", minimum: 1),
                modelToken: try payload.uuid("model_token"),
                viewportWidth: try payload.integer("viewport_width", minimum: 1, maximum: 8_192),
                viewportHeight: try payload.integer("viewport_height", minimum: 1, maximum: 8_192),
                visibleMeshes: try payload.integer("visible_meshes", minimum: 1, maximum: 40_960),
                decodedTextures: try payload.integer("decoded_textures", maximum: 1_280),
                materialBindings: try payload.integer("material_bindings", minimum: 1, maximum: 10_240),
                alphaProbePixels: try payload.integer("alpha_probe_pixels", minimum: 1, maximum: 4_096)
            ))
        case "motion_status":
            try payload.requireKeys([
                "profile_revision", "model_token", "motion_token", "role", "status", "motion_code",
            ])
            guard let role = AvatarMotionRole(rawValue: try payload.string("role")),
                  let status = MotionStatus(rawValue: try payload.string("status"))
            else { throw BridgeContractError.invalidValue }
            let token = try payload.optionalUUID("motion_token")
            let code = try payload.optionalMotionFailureCode("motion_code")
            switch status {
            case .ready, .missing, .rejected:
                guard (status == .ready) == (token != nil), code == nil else {
                    throw BridgeContractError.invalidValue
                }
            case .loadFailed:
                guard token != nil, code == .motionLoadFailed else {
                    throw BridgeContractError.invalidValue
                }
            case .timedOut:
                guard token != nil, code == .motionLoadTimeout else {
                    throw BridgeContractError.invalidValue
                }
            case .runtimeFailed:
                guard token != nil, code == .motionRuntimeFailed else {
                    throw BridgeContractError.invalidValue
                }
            }
            return .motionStatus(MotionStatusPayload(
                profileRevision: try payload.integer("profile_revision", minimum: 1),
                modelToken: try payload.uuid("model_token"),
                motionToken: token,
                role: role,
                status: status,
                motionCode: code
            ))
        case "motion_active":
            try payload.requireKeys([
                "profile_revision", "model_token", "motion_token", "role", "mode",
            ])
            guard let mode = MotionActiveMode(rawValue: try payload.string("mode")) else {
                throw BridgeContractError.invalidValue
            }
            let token = try payload.optionalUUID("motion_token")
            let role: AvatarMotionRole?
            if payload.values["role"] is NSNull {
                role = nil
            } else if let rawRole = payload.values["role"] as? String {
                guard let decodedRole = AvatarMotionRole(rawValue: rawRole) else {
                    throw BridgeContractError.invalidValue
                }
                role = decodedRole
            } else {
                throw BridgeContractError.invalidValue
            }
            switch mode {
            case .rest:
                guard token == nil, role == nil else { throw BridgeContractError.invalidValue }
            case .loop:
                guard token != nil, role?.isSteady == true else {
                    throw BridgeContractError.invalidValue
                }
            case .oneShot:
                guard token != nil, role == .success || role == .failure else {
                    throw BridgeContractError.invalidValue
                }
            }
            return .motionActive(MotionActivePayload(
                profileRevision: try payload.integer("profile_revision", minimum: 1),
                modelToken: try payload.uuid("model_token"),
                motionToken: token,
                role: role,
                mode: mode
            ))
        case "suspended":
            try payload.requireKeys(["visibility", "frames", "updates", "renders"])
            guard let visibility = PresentationVisibility(rawValue: try payload.string("visibility")),
                  visibility != .visible
            else { throw BridgeContractError.invalidValue }
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
            else { throw BridgeContractError.invalidValue }
            return .failed(FailedPayload(code: code, operation: operation))
        default:
            throw BridgeContractError.invalidValue
        }
    }
}

private struct BridgeObject {
    let values: [String: Any]

    func requireKeys(_ keys: Set<String>) throws {
        guard Set(values.keys) == keys else { throw BridgeContractError.invalidKeys }
    }

    func string(_ key: String) throws -> String {
        guard let value = values[key] as? String else { throw BridgeContractError.invalidValue }
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
        else { throw BridgeContractError.invalidValue }
        return integer
    }

    func optionalInteger(_ key: String, minimum: UInt64 = 0) throws -> UInt64? {
        guard let value = values[key] else { throw BridgeContractError.invalidValue }
        if value is NSNull { return nil }
        guard let integer = BridgeValue.safeInteger(value), integer >= minimum else {
            throw BridgeContractError.invalidValue
        }
        return integer
    }

    func number(_ key: String, minimum: Double, maximum: Double) throws -> Double {
        guard let value = values[key],
              !BridgeValue.isBoolean(value),
              let number = value as? NSNumber
        else { throw BridgeContractError.invalidValue }
        let result = number.doubleValue
        guard result.isFinite, result >= minimum, result <= maximum else {
            throw BridgeContractError.invalidValue
        }
        return result
    }

    func optionalMouthVowelWeights(_ key: String) throws -> MouthVowelWeights? {
        guard values[key] != nil else { return nil }
        guard !(values[key] is NSNull), let object = values[key] as? [String: Any] else {
            throw BridgeContractError.invalidValue
        }
        let vowelObject = BridgeObject(values: object)
        try vowelObject.requireKeys(["aa", "ih", "ou", "ee", "oh"])
        let weights = MouthVowelWeights(
            aa: try vowelObject.number("aa", minimum: 0, maximum: 1),
            ih: try vowelObject.number("ih", minimum: 0, maximum: 1),
            ou: try vowelObject.number("ou", minimum: 0, maximum: 1),
            ee: try vowelObject.number("ee", minimum: 0, maximum: 1),
            oh: try vowelObject.number("oh", minimum: 0, maximum: 1)
        )
        guard weights.isValid else { throw BridgeContractError.invalidValue }
        return weights
    }

    func mouthVowelCapabilities(_ key: String) throws -> MouthVowelCapabilities? {
        guard values[key] != nil else { return nil }
        guard !(values[key] is NSNull), let object = values[key] as? [String: Any] else {
            throw BridgeContractError.invalidValue
        }
        let vowelObject = BridgeObject(values: object)
        try vowelObject.requireKeys(["aa", "ih", "ou", "ee", "oh"])
        let capabilities = MouthVowelCapabilities(
            aa: try vowelObject.boolean("aa"),
            ih: try vowelObject.boolean("ih"),
            ou: try vowelObject.boolean("ou"),
            ee: try vowelObject.boolean("ee"),
            oh: try vowelObject.boolean("oh")
        )
        guard (try boolean("aa")) == capabilities.aa else {
            throw BridgeContractError.invalidValue
        }
        return capabilities
    }

    func uuid(_ key: String) throws -> UUID {
        try BridgeValue.uuid(try string(key))
    }

    func optionalUUID(_ key: String) throws -> UUID? {
        guard let value = values[key] else { throw BridgeContractError.invalidValue }
        if value is NSNull { return nil }
        guard let string = value as? String else { throw BridgeContractError.invalidValue }
        return try BridgeValue.uuid(string)
    }

    func optionalMotionFailureCode(_ key: String) throws -> MotionFailureCode? {
        guard let value = values[key] else { throw BridgeContractError.invalidValue }
        if value is NSNull { return nil }
        guard let string = value as? String,
              let code = MotionFailureCode(rawValue: string)
        else { throw BridgeContractError.invalidValue }
        guard code != .cancelled else { throw BridgeContractError.invalidValue }
        return code
    }

    func object(_ key: String) throws -> BridgeObject {
        guard let object = values[key] as? [String: Any] else {
            throw BridgeContractError.invalidValue
        }
        return BridgeObject(values: object)
    }
}

/// Checks JSON grammar that JSONSerialization otherwise normalizes away,
/// notably duplicate object keys.
private struct StrictBridgeJSONValidator {
    private let bytes: [UInt8]
    private var index = 0

    init(data: Data) { bytes = Array(data) }

    mutating func validate() throws {
        try parseValue(containerDepth: 0)
        skipWhitespace()
        guard index == bytes.count else { throw BridgeContractError.invalidJSON }
    }

    private mutating func parseValue(containerDepth: Int) throws {
        skipWhitespace()
        guard index < bytes.count else { throw BridgeContractError.invalidJSON }
        switch bytes[index] {
        case 0x7B: try parseObject(depth: containerDepth + 1)
        case 0x5B: try parseArray(depth: containerDepth + 1)
        case 0x22: _ = try parseString()
        case 0x74: try consume("true")
        case 0x66: try consume("false")
        case 0x6E: try consume("null")
        case 0x2D, 0x30...0x39: try parseNumber()
        default: throw BridgeContractError.invalidJSON
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
            guard keys.insert(key).inserted else { throw BridgeContractError.invalidKeys }
            skipWhitespace()
            guard consumeIf(0x3A) else { throw BridgeContractError.invalidJSON }
            try parseValue(containerDepth: depth)
            skipWhitespace()
            if consumeIf(0x7D) { return }
            guard consumeIf(0x2C) else { throw BridgeContractError.invalidJSON }
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
            guard consumeIf(0x2C) else { throw BridgeContractError.invalidJSON }
        }
    }

    private mutating func parseString() throws -> String {
        guard consumeIf(0x22) else { throw BridgeContractError.invalidJSON }
        let start = index - 1
        while index < bytes.count {
            let byte = bytes[index]
            index += 1
            if byte == 0x22 {
                let encoded = Data(bytes[start..<index])
                guard let decoded = try JSONSerialization.jsonObject(
                    with: encoded,
                    options: [.fragmentsAllowed]
                ) as? String else { throw BridgeContractError.invalidJSON }
                return decoded
            }
            guard byte >= 0x20 else { throw BridgeContractError.invalidJSON }
            if byte == 0x5C {
                guard index < bytes.count else { throw BridgeContractError.invalidJSON }
                let escaped = bytes[index]
                index += 1
                if escaped == 0x75 {
                    guard index <= bytes.count - 4,
                          bytes[index..<(index + 4)].allSatisfy(Self.isHex)
                    else { throw BridgeContractError.invalidJSON }
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
            if index < bytes.count, bytes[index] == 0x2B || bytes[index] == 0x2D { index += 1 }
            try consumeDigits()
        }
        guard let string = String(bytes: bytes[start..<index], encoding: .utf8),
              let value = Double(string), value.isFinite
        else { throw BridgeContractError.invalidJSON }
    }

    private mutating func consumeDigits() throws {
        let start = index
        while index < bytes.count, (0x30...0x39).contains(bytes[index]) { index += 1 }
        guard index > start else { throw BridgeContractError.invalidJSON }
    }

    private mutating func consume(_ text: StaticString) throws {
        let target = Array("\(text)".utf8)
        guard index <= bytes.count - target.count,
              Array(bytes[index..<(index + target.count)]) == target
        else { throw BridgeContractError.invalidJSON }
        index += target.count
    }

    private mutating func skipWhitespace() {
        while index < bytes.count, [0x20, 0x09, 0x0A, 0x0D].contains(bytes[index]) { index += 1 }
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
        var validator = StrictBridgeJSONValidator(data: data)
        try validator.validate()
        let value: Any
        do {
            value = try JSONSerialization.jsonObject(with: data)
        } catch { throw BridgeContractError.invalidJSON }
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
            else { throw BridgeContractError.invalidShape }
            for child in array { try validate(child, depth: nextDepth) }
            return
        }
        if let string = value as? String {
            try validateString(string)
            return
        }
        if value is NSNull || isBoolean(value) { return }
        guard let number = value as? NSNumber, number.doubleValue.isFinite else {
            throw BridgeContractError.invalidValue
        }
    }

    static func validateString(_ value: String) throws {
        guard value.utf8.count <= 64,
              !value.unicodeScalars.contains(where: { scalar in
                  scalar.value <= 0x1F || scalar.value == 0x7F
              })
        else { throw BridgeContractError.invalidValue }
    }

    static func isBoolean(_ value: Any) -> Bool {
        guard let number = value as? NSNumber else { return false }
        return CFGetTypeID(number) == CFBooleanGetTypeID()
    }

    static func safeInteger(_ value: Any) -> UInt64? {
        guard !isBoolean(value), let number = value as? NSNumber else { return nil }
        let double = number.doubleValue
        guard double.isFinite,
              double.rounded(.towardZero) == double,
              double >= 0,
              double <= Double(BridgeContract.maximumSafeInteger)
        else { return nil }
        return UInt64(double)
    }

    static func uuid(_ value: String) throws -> UUID {
        guard value.utf8.count == 36,
              value == value.lowercased(),
              let uuid = UUID(uuidString: value),
              uuid.uuidString.lowercased() == value
        else { throw BridgeContractError.invalidValue }
        return uuid
    }
}
