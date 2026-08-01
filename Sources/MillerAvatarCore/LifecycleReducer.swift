public struct ReducerResult<
    State: Equatable & Sendable,
    Effect: Equatable & Sendable
>: Equatable, Sendable {
    public let state: State
    public let effects: [Effect]

    public init(state: State, effects: [Effect] = []) {
        self.state = state
        self.effects = effects
    }
}

public enum RendererSessionState: Equatable, Sendable {
    case absent
    case startingRenderer
    case rendererReady
    case loadingAsset
    case live
    case liveSuspended
    case failed(FailureCode)
    case disposing
}

public enum LifecycleInput: Equatable, Sendable {
    case startRenderer
    case wrapperReady
    case rendererReady
    case beginAssetLoad
    case firstFrame
    case suspend
    case resume
    case fail(FailureCode)
    case dispose(DisposalReason)
    case disposalFinished
    case applicationTerminationRequested
}

public enum LifecycleEffect: Equatable, Sendable {
    case createRendererSession
    case sendConfigure
    case beginAdmittedAssetLoad
    case showLiveSurface
    case retainNativeFallback
    case beginUnifiedTeardown(DisposalReason)
    case removeRendererSession
    case reportClosedIllegalTransitionToDiagnostics
}

public enum LifecycleReducer {
    public static func reduce(
        state: RendererSessionState,
        input: LifecycleInput
    ) -> ReducerResult<RendererSessionState, LifecycleEffect> {
        switch (state, input) {
        case (.absent, .startRenderer):
            return ReducerResult(
                state: .startingRenderer,
                effects: [.createRendererSession, .retainNativeFallback]
            )
        case (.startingRenderer, .wrapperReady):
            return ReducerResult(state: .startingRenderer, effects: [.sendConfigure])
        case (.startingRenderer, .rendererReady):
            return ReducerResult(state: .rendererReady)
        case (.rendererReady, .beginAssetLoad):
            return ReducerResult(state: .loadingAsset, effects: [.beginAdmittedAssetLoad])
        case (.loadingAsset, .firstFrame):
            return ReducerResult(state: .live, effects: [.showLiveSurface])
        case (.live, .suspend):
            return ReducerResult(state: .liveSuspended)
        case (.liveSuspended, .resume):
            return ReducerResult(state: .live)
        case (
            .startingRenderer,
            .fail(let code)
        ), (
            .rendererReady,
            .fail(let code)
        ), (
            .loadingAsset,
            .fail(let code)
        ), (
            .live,
            .fail(let code)
        ), (
            .liveSuspended,
            .fail(let code)
        ):
            return ReducerResult(state: .failed(code), effects: [.retainNativeFallback])
        case (
            .startingRenderer,
            .dispose(let reason)
        ), (
            .rendererReady,
            .dispose(let reason)
        ), (
            .loadingAsset,
            .dispose(let reason)
        ), (
            .live,
            .dispose(let reason)
        ), (
            .liveSuspended,
            .dispose(let reason)
        ), (
            .failed,
            .dispose(let reason)
        ):
            return ReducerResult(
                state: .disposing,
                effects: [.beginUnifiedTeardown(reason)]
            )
        case (.disposing, .disposalFinished):
            return ReducerResult(state: .absent, effects: [.removeRendererSession])
        case (.startingRenderer, .applicationTerminationRequested),
             (.rendererReady, .applicationTerminationRequested),
             (.loadingAsset, .applicationTerminationRequested),
             (.live, .applicationTerminationRequested),
             (.liveSuspended, .applicationTerminationRequested),
             (.failed, .applicationTerminationRequested):
            return ReducerResult(
                state: .disposing,
                effects: [.beginUnifiedTeardown(.termination)]
            )
        case (.disposing, .dispose), (.absent, .dispose),
             (.disposing, .applicationTerminationRequested),
             (.absent, .applicationTerminationRequested):
            return ReducerResult(state: state)
        default:
            return ReducerResult(
                state: state,
                effects: [.reportClosedIllegalTransitionToDiagnostics]
            )
        }
    }
}
