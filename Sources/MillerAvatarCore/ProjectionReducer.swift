import Foundation

public struct ProjectionState: Equatable, Sendable {
    public var lastProjectionSequence: UInt64?
    public var generationID: UUID?
    public var phase: PresentationPhase
    public var playbackID: UUID?
    public var lastCueIndex: UInt64?
    public var lastPlaybackOffsetMilliseconds: UInt64?
    public var mouthScalar: Double
    public var reducedMotion: Bool
    public var isSuspended: Bool
    public var isTerminated: Bool

    public init(
        lastProjectionSequence: UInt64? = nil,
        generationID: UUID? = nil,
        phase: PresentationPhase = .idle,
        playbackID: UUID? = nil,
        lastCueIndex: UInt64? = nil,
        lastPlaybackOffsetMilliseconds: UInt64? = nil,
        mouthScalar: Double = 0,
        reducedMotion: Bool = false,
        isSuspended: Bool = false,
        isTerminated: Bool = false
    ) {
        self.lastProjectionSequence = lastProjectionSequence
        self.generationID = generationID
        self.phase = phase
        self.playbackID = playbackID
        self.lastCueIndex = lastCueIndex
        self.lastPlaybackOffsetMilliseconds = lastPlaybackOffsetMilliseconds
        self.mouthScalar = mouthScalar
        self.reducedMotion = reducedMotion
        self.isSuspended = isSuspended
        self.isTerminated = isTerminated
    }
}

public enum ProjectionInput: Equatable, Sendable {
    case project(ProjectPhasePayload)
    case mouth(SetMouthPayload)
    case setReducedMotion(Bool)
    case suspend
    case resume
    case reset(generationID: UUID?, reason: ResetReason)
    case rendererFailed
    case dispose
}

public enum ProjectionEffect: Equatable, Sendable {
    case applyProjection(ProjectPhasePayload)
    case applyMouth(SetMouthPayload)
    case setReducedMotion(Bool)
    case stopContinuousMotion
    case reset(generationID: UUID?, reason: ResetReason)
    case clearMouth
    case reconcile
}

public enum ProjectionReducer {
    public static func reduce(
        state: ProjectionState,
        input: ProjectionInput
    ) -> ReducerResult<ProjectionState, ProjectionEffect> {
        guard !state.isTerminated else {
            return ReducerResult(state: state)
        }

        switch input {
        case .project(let projection):
            return project(state: state, projection: projection)
        case .mouth(let cue):
            return applyMouth(state: state, cue: cue)
        case .setReducedMotion(let enabled):
            return setReducedMotion(state: state, enabled: enabled)
        case .suspend:
            guard !state.isSuspended else {
                return ReducerResult(state: state)
            }
            var next = state
            next.isSuspended = true
            next.mouthScalar = 0
            return ReducerResult(state: next, effects: [.clearMouth])
        case .resume:
            guard state.isSuspended else {
                return ReducerResult(state: state)
            }
            var next = state
            next.isSuspended = false
            next.mouthScalar = 0
            return ReducerResult(state: next, effects: [.reconcile])
        case .reset(let generationID, let reason):
            return reset(
                state: state,
                generationID: generationID,
                reason: reason
            )
        case .rendererFailed, .dispose:
            var next = state
            revokePlayback(state: &next)
            next.isTerminated = true
            return ReducerResult(state: next, effects: [.clearMouth])
        }
    }

    private static func project(
        state: ProjectionState,
        projection: ProjectPhasePayload
    ) -> ReducerResult<ProjectionState, ProjectionEffect> {
        guard isValid(projection),
              projection.projectionSequence > (state.lastProjectionSequence ?? 0)
        else {
            return ReducerResult(state: state)
        }

        var next = state
        let replacesLease = projection.generationID != state.generationID
            || projection.playbackID != state.playbackID
            || projection.phase == .stopped
            || projection.phase == .failed

        next.lastProjectionSequence = projection.projectionSequence
        next.generationID = projection.generationID
        next.phase = projection.phase
        next.playbackID = projection.playbackID
        if replacesLease {
            next.lastCueIndex = nil
            next.lastPlaybackOffsetMilliseconds = nil
            next.mouthScalar = 0
        }

        guard !state.isSuspended else {
            return ReducerResult(state: next)
        }

        var effects: [ProjectionEffect] = []
        if replacesLease {
            effects.append(.clearMouth)
        }
        effects.append(.applyProjection(projection))
        return ReducerResult(state: next, effects: effects)
    }

    private static func applyMouth(
        state: ProjectionState,
        cue: SetMouthPayload
    ) -> ReducerResult<ProjectionState, ProjectionEffect> {
        guard state.phase == .speaking,
              cue.generationID == state.generationID,
              cue.playbackID == state.playbackID,
              cue.cueIndex > (state.lastCueIndex ?? 0),
              cue.cueIndex <= BridgeContract.maximumSafeInteger,
              cue.playbackOffsetMilliseconds
                  >= (state.lastPlaybackOffsetMilliseconds ?? 0),
              cue.playbackOffsetMilliseconds <= BridgeContract.maximumSafeInteger,
              cue.playbackOffsetMilliseconds <= 86_400_000,
              cue.scalar.isFinite,
              (0...1).contains(cue.scalar)
        else {
            return ReducerResult(state: state)
        }

        var next = state
        next.lastCueIndex = cue.cueIndex
        next.lastPlaybackOffsetMilliseconds = cue.playbackOffsetMilliseconds
        guard !state.isSuspended, !state.reducedMotion else {
            next.mouthScalar = 0
            return ReducerResult(state: next)
        }

        next.mouthScalar = cue.scalar
        return ReducerResult(state: next, effects: [.applyMouth(cue)])
    }

    private static func setReducedMotion(
        state: ProjectionState,
        enabled: Bool
    ) -> ReducerResult<ProjectionState, ProjectionEffect> {
        guard enabled != state.reducedMotion else {
            return ReducerResult(state: state)
        }

        var next = state
        next.reducedMotion = enabled
        if enabled {
            next.mouthScalar = 0
        }
        guard !state.isSuspended else {
            return ReducerResult(state: next)
        }

        var effects: [ProjectionEffect] = [.setReducedMotion(enabled)]
        if enabled {
            effects.append(.stopContinuousMotion)
            effects.append(.clearMouth)
        }
        return ReducerResult(state: next, effects: effects)
    }

    private static func reset(
        state: ProjectionState,
        generationID: UUID?,
        reason: ResetReason
    ) -> ReducerResult<ProjectionState, ProjectionEffect> {
        let clearsAll = generationID == nil && reason == .operator
        guard clearsAll || generationID == state.generationID else {
            return ReducerResult(state: state)
        }

        var next = state
        next.generationID = nil
        next.phase = .idle
        revokePlayback(state: &next)
        guard !state.isSuspended else {
            return ReducerResult(state: next)
        }
        return ReducerResult(
            state: next,
            effects: [
                .clearMouth,
                .reset(generationID: generationID, reason: reason),
            ]
        )
    }

    private static func revokePlayback(state: inout ProjectionState) {
        state.playbackID = nil
        state.lastCueIndex = nil
        state.lastPlaybackOffsetMilliseconds = nil
        state.mouthScalar = 0
    }

    private static func isValid(_ projection: ProjectPhasePayload) -> Bool {
        guard projection.projectionSequence > 0,
              projection.projectionSequence <= BridgeContract.maximumSafeInteger
        else { return false }

        return switch projection.phase {
        case .speaking:
            projection.generationID != nil && projection.playbackID != nil
        case .thinking, .responding, .stopped, .failed:
            projection.generationID != nil && projection.playbackID == nil
        case .idle, .listening, .transcribing:
            projection.generationID == nil && projection.playbackID == nil
        }
    }
}
