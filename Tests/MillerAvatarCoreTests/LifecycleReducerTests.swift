import Testing
@testable import MillerAvatarCore

@Suite struct LifecycleReducerTests {
    @Test func everyDeclaredLifecycleEdgeIsAccepted() {
        let failure = FailureCode.renderFailed
        let cases: [(RendererSessionState, LifecycleInput, RendererSessionState)] = [
            (.absent, .startRenderer, .startingRenderer),
            (.startingRenderer, .wrapperReady, .startingRenderer),
            (.startingRenderer, .rendererReady, .rendererReady),
            (.rendererReady, .beginAssetLoad, .loadingAsset),
            (.loadingAsset, .firstFrame, .live),
            (.live, .suspend, .liveSuspended),
            (.liveSuspended, .resume, .live),
            (.startingRenderer, .fail(failure), .failed(failure)),
            (.rendererReady, .fail(failure), .failed(failure)),
            (.loadingAsset, .fail(failure), .failed(failure)),
            (.live, .fail(failure), .failed(failure)),
            (.liveSuspended, .fail(failure), .failed(failure)),
            (
                .startingRenderer,
                .dispose(.operator),
                .disposing
            ),
            (
                .rendererReady,
                .dispose(.operator),
                .disposing
            ),
            (
                .loadingAsset,
                .dispose(.operator),
                .disposing
            ),
            (.live, .dispose(.operator), .disposing),
            (
                .liveSuspended,
                .dispose(.operator),
                .disposing
            ),
            (
                .failed(failure),
                .dispose(.failure),
                .disposing
            ),
            (.disposing, .disposalFinished, .absent),
        ]

        for (state, input, expected) in cases {
            let result = LifecycleReducer.reduce(state: state, input: input)
            #expect(result.state == expected)
            #expect(!result.effects.contains(.reportClosedIllegalTransitionToDiagnostics))
        }
    }

    @Test func everyUndeclaredLifecycleEdgeIsRejectedWithoutMutation() {
        let failure = FailureCode.renderFailed
        let states: [RendererSessionState] = [
            .absent,
            .startingRenderer,
            .rendererReady,
            .loadingAsset,
            .live,
            .liveSuspended,
            .failed(failure),
            .disposing,
        ]
        let inputs: [LifecycleInput] = [
            .startRenderer,
            .wrapperReady,
            .rendererReady,
            .beginAssetLoad,
            .firstFrame,
            .suspend,
            .resume,
            .fail(failure),
            .dispose(.operator),
            .disposalFinished,
            .applicationTerminationRequested,
        ]

        for state in states {
            for input in inputs where expectedState(from: state, input: input) == nil {
                let result = LifecycleReducer.reduce(state: state, input: input)
                #expect(result.state == state)
                #expect(result.effects == [.reportClosedIllegalTransitionToDiagnostics])
            }
        }
    }

    @Test func repeatedDisposalIsIdempotent() {
        let first = LifecycleReducer.reduce(
            state: .live,
            input: .dispose(.operator)
        )
        #expect(first.state == .disposing)
        #expect(first.effects == [.beginUnifiedTeardown(.operator)])

        let repeated = LifecycleReducer.reduce(
            state: first.state,
            input: .dispose(.operator)
        )
        #expect(repeated.state == .disposing)
        #expect(repeated.effects.isEmpty)

        let alreadyAbsent = LifecycleReducer.reduce(
            state: .absent,
            input: .dispose(.operator)
        )
        #expect(alreadyAbsent.state == .absent)
        #expect(alreadyAbsent.effects.isEmpty)
    }

    @Test func lifecycleEdgesEmitTheRequiredOwnershipEffects() {
        let started = LifecycleReducer.reduce(state: .absent, input: .startRenderer)
        #expect(started.effects == [.createRendererSession, .retainNativeFallback])

        let configured = LifecycleReducer.reduce(
            state: .startingRenderer,
            input: .wrapperReady
        )
        #expect(configured.effects == [.sendConfigure])

        let loading = LifecycleReducer.reduce(
            state: .rendererReady,
            input: .beginAssetLoad
        )
        #expect(loading.effects == [.beginAdmittedAssetLoad])

        let live = LifecycleReducer.reduce(state: .loadingAsset, input: .firstFrame)
        #expect(live.effects == [.showLiveSurface])

        let failed = LifecycleReducer.reduce(
            state: .live,
            input: .fail(.renderFailed)
        )
        #expect(failed.effects == [.retainNativeFallback])

        let removed = LifecycleReducer.reduce(
            state: .disposing,
            input: .disposalFinished
        )
        #expect(removed.effects == [.removeRendererSession])
    }

    private func expectedState(
        from state: RendererSessionState,
        input: LifecycleInput
    ) -> RendererSessionState? {
        switch (state, input) {
        case (.absent, .startRenderer):
            .startingRenderer
        case (.startingRenderer, .wrapperReady):
            .startingRenderer
        case (.startingRenderer, .rendererReady):
            .rendererReady
        case (.rendererReady, .beginAssetLoad):
            .loadingAsset
        case (.loadingAsset, .firstFrame):
            .live
        case (.live, .suspend):
            .liveSuspended
        case (.liveSuspended, .resume):
            .live
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
            .failed(code)
        case (
            .startingRenderer,
            .dispose
        ), (
            .rendererReady,
            .dispose
        ), (
            .loadingAsset,
            .dispose
        ), (
            .live,
            .dispose
        ), (
            .liveSuspended,
            .dispose
        ), (
            .failed,
            .dispose
        ):
            .disposing
        case (.disposing, .disposalFinished):
            .absent
        case (.disposing, .applicationTerminationRequested),
             (.absent, .applicationTerminationRequested):
            state
        case (.startingRenderer, .applicationTerminationRequested),
             (.rendererReady, .applicationTerminationRequested),
             (.loadingAsset, .applicationTerminationRequested),
             (.live, .applicationTerminationRequested),
             (.liveSuspended, .applicationTerminationRequested),
             (.failed, .applicationTerminationRequested):
            .disposing
        case (.disposing, .dispose), (.absent, .dispose):
            state
        default:
            nil
        }
    }
}
