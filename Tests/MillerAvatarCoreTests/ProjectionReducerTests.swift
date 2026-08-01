import Foundation
import Testing
@testable import MillerAvatarCore

@Suite struct ProjectionReducerTests {
    private let generationA = UUID(uuidString: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")!
    private let generationB = UUID(uuidString: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb")!
    private let playbackP = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
    private let playbackQ = UUID(uuidString: "22222222-2222-4222-8222-222222222222")!

    @Test func semanticProjectionOrderIsIndependentFromBridgeOrder() {
        var state = ProjectionState()
        state = reduce(state, .project(speaking(sequence: 10, playback: playbackP))).state
        state = reduce(state, .project(speaking(sequence: 12, playback: playbackQ))).state

        let delayed = reduce(
            state,
            .project(speaking(sequence: 11, playback: playbackP))
        )

        #expect(delayed.state == state)
        #expect(delayed.effects.isEmpty)
        #expect(delayed.state.playbackID == playbackQ)
    }

    @Test func supersededPlaybackCueCannotRestoreMouthOutput() {
        var state = reduce(
            ProjectionState(),
            .project(speaking(sequence: 1, playback: playbackP))
        ).state
        state = reduce(state, .mouth(cue(playback: playbackP, index: 1))).state
        state = reduce(
            state,
            .project(speaking(sequence: 2, playback: playbackQ))
        ).state

        let delayed = reduce(
            state,
            .mouth(cue(playback: playbackP, index: 2))
        )

        #expect(delayed.state == state)
        #expect(delayed.state.mouthScalar == 0)
        #expect(delayed.effects.isEmpty)
    }

    @Test func terminalPhasePermanentlyRevokesPlayback() {
        var state = reduce(
            ProjectionState(),
            .project(speaking(sequence: 1, playback: playbackP))
        ).state
        state = reduce(state, .mouth(cue(playback: playbackP, index: 1))).state
        let stopped = reduce(
            state,
            .project(ProjectPhasePayload(
                projectionSequence: 2,
                generationID: generationA,
                phase: .stopped,
                playbackID: nil
            ))
        )
        #expect(stopped.state.mouthScalar == 0)
        #expect(stopped.effects.contains(.clearMouth))

        let delayed = reduce(
            stopped.state,
            .mouth(cue(playback: playbackP, index: 2))
        )
        #expect(delayed.state == stopped.state)
        #expect(delayed.effects.isEmpty)
    }

    @Test func suspensionSkipsCuesAndResumeRequiresOneReconciliation() {
        var state = reduce(
            ProjectionState(),
            .project(speaking(sequence: 1, playback: playbackP))
        ).state
        state = reduce(state, .mouth(cue(playback: playbackP, index: 1))).state

        let suspended = reduce(state, .suspend)
        #expect(suspended.state.isSuspended)
        #expect(suspended.state.mouthScalar == 0)
        #expect(suspended.effects == [.clearMouth])

        let skipped = reduce(
            suspended.state,
            .mouth(cue(playback: playbackP, index: 4))
        )
        #expect(skipped.state.lastCueIndex == 4)
        #expect(skipped.state.mouthScalar == 0)
        #expect(skipped.effects.isEmpty)

        let resumed = reduce(skipped.state, .resume)
        #expect(!resumed.state.isSuspended)
        #expect(resumed.state.mouthScalar == 0)
        #expect(resumed.effects == [.reconcile])

        let fresh = reduce(
            resumed.state,
            .mouth(cue(playback: playbackP, index: 5))
        )
        #expect(fresh.state.mouthScalar == 0.5)
        #expect(fresh.effects.count == 1)
    }

    @Test func suspendedPhaseAndPolicyChangesScheduleNoRendererWork() {
        var state = reduce(
            ProjectionState(),
            .project(speaking(sequence: 1, playback: playbackP))
        ).state
        state = reduce(state, .suspend).state

        let phase = reduce(
            state,
            .project(ProjectPhasePayload(
                projectionSequence: 2,
                generationID: generationA,
                phase: .thinking,
                playbackID: nil
            ))
        )
        #expect(phase.effects.isEmpty)

        let policy = reduce(phase.state, .setReducedMotion(true))
        #expect(policy.state.reducedMotion)
        #expect(policy.effects.isEmpty)
    }

    @Test func reducedMotionDoesNotRestoreAnOldCueWhenDisabled() {
        var state = reduce(
            ProjectionState(),
            .project(speaking(sequence: 1, playback: playbackP))
        ).state
        state = reduce(state, .mouth(cue(playback: playbackP, index: 1))).state

        let enabled = reduce(state, .setReducedMotion(true))
        #expect(enabled.state.mouthScalar == 0)
        #expect(enabled.effects == [
            .setReducedMotion(true), .stopContinuousMotion, .clearMouth,
        ])

        let disabled = reduce(enabled.state, .setReducedMotion(false))
        #expect(disabled.state.mouthScalar == 0)
        #expect(disabled.effects == [.setReducedMotion(false)])

        let oldCue = reduce(
            disabled.state,
            .mouth(cue(playback: playbackP, index: 1))
        )
        #expect(oldCue.state == disabled.state)
        #expect(oldCue.effects.isEmpty)
    }

    @Test func oldGenerationResetIsANoOp() {
        let state = reduce(
            ProjectionState(),
            .project(speaking(sequence: 1, playback: playbackP))
        ).state

        let result = reduce(
            state,
            .reset(generationID: generationB, reason: .replaced)
        )
        #expect(result.state == state)
        #expect(result.effects.isEmpty)
    }

    @Test func idleAndListeningCannotCarryAGenerationIdentity() {
        let invalidIdle = ProjectPhasePayload(
            projectionSequence: 1,
            generationID: generationA,
            phase: .idle,
            playbackID: nil
        )
        let invalidListening = ProjectPhasePayload(
            projectionSequence: 2,
            generationID: generationA,
            phase: .listening,
            playbackID: nil
        )

        #expect(reduce(ProjectionState(), .project(invalidIdle)).state == ProjectionState())
        #expect(reduce(ProjectionState(), .project(invalidListening)).state == ProjectionState())
    }

    @Test func everyRevocationPathClearsMouthOutput() {
        let revocations: [ProjectionInput] = [
            .project(speaking(
                sequence: 2,
                generation: generationB,
                playback: playbackQ
            )),
            .project(ProjectPhasePayload(
                projectionSequence: 2,
                generationID: generationA,
                phase: .failed,
                playbackID: nil
            )),
            .suspend,
            .setReducedMotion(true),
            .reset(generationID: generationA, reason: .cancelled),
            .rendererFailed,
            .dispose,
        ]

        for revocation in revocations {
            var state = reduce(
                ProjectionState(),
                .project(speaking(sequence: 1, playback: playbackP))
            ).state
            state = reduce(state, .mouth(cue(playback: playbackP, index: 1))).state

            let result = reduce(state, revocation)
            #expect(result.state.mouthScalar == 0)
            #expect(result.effects.contains(.clearMouth))
        }
    }

    private func reduce(
        _ state: ProjectionState,
        _ input: ProjectionInput
    ) -> ReducerResult<ProjectionState, ProjectionEffect> {
        ProjectionReducer.reduce(state: state, input: input)
    }

    private func speaking(
        sequence: UInt64,
        generation: UUID? = nil,
        playback: UUID
    ) -> ProjectPhasePayload {
        ProjectPhasePayload(
            projectionSequence: sequence,
            generationID: generation ?? generationA,
            phase: .speaking,
            playbackID: playback
        )
    }

    private func cue(playback: UUID, index: UInt64) -> SetMouthPayload {
        SetMouthPayload(
            generationID: generationA,
            playbackID: playback,
            cueIndex: index,
            playbackOffsetMilliseconds: index * 100,
            scalar: 0.5
        )
    }
}
