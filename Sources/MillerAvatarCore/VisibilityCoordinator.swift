import Foundation

public enum EffectiveVisibility: String, Codable, Equatable, Sendable {
    case visible
    case occluded
    case hidden
}

public struct VisibilityCoordinatorState: Equatable, Sendable {
    public var sessionID: UUID?
    public var lifecycle: RendererSessionState
    public var desired: EffectiveVisibility
    public var acknowledged: EffectiveVisibility
    public var inFlight: EffectiveVisibility?
    public var disposalRequested: Bool
    /// Visibility is not permission to create a renderer; that intent is
    /// retained independently across session replacement.
    public var operatorIntentToRun: Bool

    public init(
        sessionID: UUID?,
        lifecycle: RendererSessionState,
        desired: EffectiveVisibility = .visible,
        acknowledged: EffectiveVisibility = .visible,
        inFlight: EffectiveVisibility? = nil,
        disposalRequested: Bool = false,
        operatorIntentToRun: Bool = false
    ) {
        self.sessionID = sessionID
        self.lifecycle = lifecycle
        self.desired = desired
        self.acknowledged = acknowledged
        self.inFlight = inFlight
        self.disposalRequested = disposalRequested
        self.operatorIntentToRun = operatorIntentToRun
    }
}

public enum VisibilityInput: Equatable, Sendable {
    case replaceSession(sessionID: UUID?, lifecycle: RendererSessionState)
    case lifecycle(RendererSessionState)
    case operatorIntentToRun(Bool)
    case desired(EffectiveVisibility)
    case observed(sessionID: UUID, visibility: EffectiveVisibility)
}

public enum VisibilityEffect: Equatable, Sendable {
    case sendVisibility(UUID, EffectiveVisibility)
    case requestDisposal(UUID, DisposalReason)
}

public enum VisibilityCoordinator {
    public static func reduce(
        state: VisibilityCoordinatorState,
        input: VisibilityInput
    ) -> ReducerResult<VisibilityCoordinatorState, VisibilityEffect> {
        var next = state

        switch input {
        case .replaceSession(let sessionID, let lifecycle):
            next.sessionID = lifecycle == .absent ? nil : sessionID
            next.lifecycle = lifecycle
            next.acknowledged = .visible
            next.inFlight = nil
            next.disposalRequested = false
        case .lifecycle(let lifecycle):
            next.lifecycle = lifecycle
            switch lifecycle {
            case .absent:
                next.sessionID = nil
                next.inFlight = nil
                next.disposalRequested = false
            case .failed, .disposing:
                next.inFlight = nil
            default:
                break
            }
        case .operatorIntentToRun(let enabled):
            next.operatorIntentToRun = enabled
        case .desired(let visibility):
            next.desired = visibility
        case .observed(let sessionID, let visibility):
            guard sessionID == state.sessionID,
                  isLive(state.lifecycle),
                  visibility == state.inFlight
            else {
                return ReducerResult(state: state)
            }
            next.acknowledged = visibility
            next.inFlight = nil
            next.lifecycle = visibility == .visible ? .live : .liveSuspended
        }

        return drive(state: next)
    }

    private static func drive(
        state: VisibilityCoordinatorState
    ) -> ReducerResult<VisibilityCoordinatorState, VisibilityEffect> {
        guard let sessionID = state.sessionID else {
            return ReducerResult(state: state)
        }

        if isPreLive(state.lifecycle), state.desired == .hidden {
            guard !state.disposalRequested else {
                return ReducerResult(state: state)
            }
            var next = state
            next.disposalRequested = true
            return ReducerResult(
                state: next,
                effects: [
                    .requestDisposal(sessionID, .hiddenBeforeLive),
                ]
            )
        }

        guard isLive(state.lifecycle),
              state.inFlight == nil,
              state.desired != state.acknowledged
        else {
            return ReducerResult(state: state)
        }

        var next = state
        next.inFlight = state.desired
        return ReducerResult(
            state: next,
            effects: [.sendVisibility(sessionID, state.desired)]
        )
    }

    private static func isPreLive(_ state: RendererSessionState) -> Bool {
        switch state {
        case .startingRenderer, .rendererReady, .loadingAsset:
            true
        default:
            false
        }
    }

    private static func isLive(_ state: RendererSessionState) -> Bool {
        state == .live || state == .liveSuspended
    }
}
