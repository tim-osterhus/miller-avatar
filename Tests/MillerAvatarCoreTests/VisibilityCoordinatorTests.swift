import Foundation
import Testing
@testable import MillerAvatarCore

@Suite struct VisibilityCoordinatorTests {
    private let sessionA = UUID(uuidString: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")!
    private let sessionB = UUID(uuidString: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb")!

    @Test func rapidVisibilityChangesMaintainOneCommandAndConverge() {
        var state = VisibilityCoordinatorState(
            sessionID: sessionA,
            lifecycle: .live
        )

        let hide = reduce(state, .desired(.hidden))
        state = hide.state
        #expect(hide.effects == [.sendVisibility(sessionA, .hidden)])
        #expect(state.inFlight == .hidden)

        let show = reduce(state, .desired(.visible))
        state = show.state
        #expect(show.effects.isEmpty)
        #expect(state.inFlight == .hidden)

        let suspended = reduce(
            state,
            .observed(sessionID: sessionA, visibility: .hidden)
        )
        state = suspended.state
        #expect(suspended.effects == [.sendVisibility(sessionA, .visible)])
        #expect(state.inFlight == .visible)

        let resumed = reduce(
            state,
            .observed(sessionID: sessionA, visibility: .visible)
        )
        #expect(resumed.effects.isEmpty)
        #expect(resumed.state.inFlight == nil)
        #expect(resumed.state.acknowledged == .visible)
        #expect(resumed.state.desired == .visible)
    }

    @Test func nonVisibleChangesCoalesceToLatestDesiredState() {
        var state = VisibilityCoordinatorState(
            sessionID: sessionA,
            lifecycle: .live
        )
        state = reduce(state, .desired(.occluded)).state

        let hidden = reduce(state, .desired(.hidden))
        state = hidden.state
        #expect(hidden.effects.isEmpty)
        #expect(state.inFlight == .occluded)

        let occluded = reduce(
            state,
            .observed(sessionID: sessionA, visibility: .occluded)
        )
        #expect(occluded.effects == [.sendVisibility(sessionA, .hidden)])
        #expect(occluded.state.inFlight == .hidden)
    }

    @Test func suspendedNonVisibleChangeDoesNotRequestResume() {
        let state = VisibilityCoordinatorState(
            sessionID: sessionA,
            lifecycle: .liveSuspended,
            desired: .hidden,
            acknowledged: .hidden
        )

        let result = reduce(state, .desired(.occluded))
        #expect(result.effects == [.sendVisibility(sessionA, .occluded)])
        #expect(result.state.inFlight == .occluded)
        #expect(!result.effects.contains(.sendVisibility(sessionA, .visible)))
    }

    @Test func hiddenDuringStartupOrLoadRequestsDisposalOnce() {
        for lifecycle in [
            RendererSessionState.startingRenderer,
            .rendererReady,
            .loadingAsset,
        ] {
            var state = VisibilityCoordinatorState(
                sessionID: sessionA,
                lifecycle: lifecycle
            )
            let hidden = reduce(state, .desired(.hidden))
            state = hidden.state
            #expect(
                hidden.effects
                    == [.requestDisposal(sessionA, .hiddenBeforeLive)]
            )

            let repeated = reduce(state, .desired(.hidden))
            #expect(repeated.effects.isEmpty)
        }
    }

    @Test func transientOcclusionBeforeFirstFrameDoesNotDisposeTheSession() {
        for lifecycle in [
            RendererSessionState.startingRenderer,
            .rendererReady,
            .loadingAsset,
        ] {
            let state = VisibilityCoordinatorState(
                sessionID: sessionA,
                lifecycle: lifecycle
            )
            let result = reduce(state, .desired(.occluded))
            #expect(result.effects.isEmpty)
            #expect(result.state.desired == .occluded)
            #expect(!result.state.disposalRequested)
        }
    }

    @Test func oldSessionObservationsAreNoOps() {
        let state = VisibilityCoordinatorState(
            sessionID: sessionB,
            lifecycle: .live,
            desired: .hidden,
            acknowledged: .visible,
            inFlight: .hidden
        )

        let result = reduce(
            state,
            .observed(sessionID: sessionA, visibility: .hidden)
        )
        #expect(result.state == state)
        #expect(result.effects.isEmpty)
    }

    @Test func lifecycleChangesDriveTheLatestVisibility() {
        var state = VisibilityCoordinatorState(
            sessionID: sessionA,
            lifecycle: .rendererReady,
            desired: .visible,
            acknowledged: .visible
        )
        state = reduce(state, .lifecycle(.loadingAsset)).state
        state = reduce(state, .lifecycle(.live)).state

        let result = reduce(state, .desired(.hidden))
        #expect(result.effects == [.sendVisibility(sessionA, .hidden)])
    }

    private func reduce(
        _ state: VisibilityCoordinatorState,
        _ input: VisibilityInput
    ) -> ReducerResult<VisibilityCoordinatorState, VisibilityEffect> {
        VisibilityCoordinator.reduce(state: state, input: input)
    }

    @Test func terminalAcknowledgementsCannotResurrectTheSession() {
        let state = VisibilityCoordinatorState(
            sessionID: sessionA,
            lifecycle: .live,
            desired: .hidden,
            acknowledged: .visible,
            inFlight: .hidden
        )
        let failed = reduce(state, .lifecycle(.failed(.renderFailed)))
        #expect(failed.state.inFlight == nil)

        let delayedAck = reduce(
            failed.state,
            .observed(sessionID: sessionA, visibility: .hidden)
        )
        #expect(delayedAck.state == failed.state)
        #expect(delayedAck.effects.isEmpty)
    }

    @Test func desiredVisibilityAndOperatorIntentSurviveSessionReplacement() {
        var state = VisibilityCoordinatorState(
            sessionID: nil,
            lifecycle: .absent,
            desired: .hidden
        )
        state = reduce(state, .operatorIntentToRun(true)).state
        state = reduce(
            state,
            .replaceSession(sessionID: sessionA, lifecycle: .startingRenderer)
        ).state

        #expect(state.desired == .hidden)
        #expect(state.operatorIntentToRun)
        #expect(state.sessionID == sessionA)
    }
}
