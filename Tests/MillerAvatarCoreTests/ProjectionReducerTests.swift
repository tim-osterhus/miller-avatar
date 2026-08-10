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

    @Test func succeededIsAPlaybackRevokingTerminalPhase() {
        guard let succeeded = PresentationPhase(rawValue: "succeeded") else {
            Issue.record("succeeded is missing from the closed presentation vocabulary")
            return
        }
        var state = reduce(
            ProjectionState(),
            .project(speaking(sequence: 1, playback: playbackP))
        ).state
        state = reduce(state, .mouth(cue(playback: playbackP, index: 1))).state

        let result = reduce(
            state,
            .project(ProjectPhasePayload(
                projectionSequence: 2,
                generationID: generationA,
                phase: succeeded,
                playbackID: nil
            ))
        )

        #expect(result.state.phase == succeeded)
        #expect(result.state.mouthScalar == 0)
        #expect(result.effects.contains(.clearMouth))
        #expect(result.effects.contains(.applyProjection(.init(
            projectionSequence: 2,
            generationID: generationA,
            phase: succeeded,
            playbackID: nil
        ))))
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

    @Test func typedPayloadsRejectUnsafeProjectionAndCueIntegers() {
        let unsafeProjection = ProjectPhasePayload(
            projectionSequence: BridgeContract.maximumSafeInteger + 1,
            generationID: nil,
            phase: .idle,
            playbackID: nil
        )
        #expect(reduce(ProjectionState(), .project(unsafeProjection)).state == ProjectionState())

        let speakingState = reduce(
            ProjectionState(),
            .project(speaking(sequence: 1, playback: playbackP))
        ).state
        let unsafeCueIndex = SetMouthPayload(
            generationID: generationA,
            playbackID: playbackP,
            cueIndex: BridgeContract.maximumSafeInteger + 1,
            playbackOffsetMilliseconds: 100,
            scalar: 0.5
        )
        let unsafeOffset = SetMouthPayload(
            generationID: generationA,
            playbackID: playbackP,
            cueIndex: 1,
            playbackOffsetMilliseconds: BridgeContract.maximumSafeInteger + 1,
            scalar: 0.5
        )

        #expect(reduce(speakingState, .mouth(unsafeCueIndex)).state == speakingState)
        #expect(reduce(speakingState, .mouth(unsafeOffset)).state == speakingState)
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

    @Test func validNeutralFixtureFeedsEveryOperationThroughTheReducer() throws {
        let raw = try fixtureRaw(
            at: "Tests/IntegrationFixtures/valid/miller-owned-presentation.json"
        )
        #expect(!raw.contains("MillerAvatar"))
        #expect(!raw.contains("Sources/"))
        #expect(!raw.contains("/Users/"))
        let root = try fixtureObject(
            at: "Tests/IntegrationFixtures/valid/miller-owned-presentation.json"
        )
        #expect(root["schema"] as? String == "miller-avatar.integration-fixture/v1")
        let operations = try arrayOfObjects(root["operations"])
        #expect(operations.count == 18)

        var state = ProjectionState()
        for operation in operations {
            let input = try fixtureInput(operation["input"])
            let result = reduce(state, input)
            try expectFixtureState(result.state, effects: result.effects, from: operation["expected"])
            state = result.state
        }
    }

    @Test func invalidNeutralFixtureCasesAreIndependentAndLeaveStateUntouched() throws {
        let raw = try fixtureRaw(
            at: "Tests/IntegrationFixtures/invalid/stale-miller-owned-presentation.json"
        )
        #expect(!raw.contains("MillerAvatar"))
        #expect(!raw.contains("Sources/"))
        #expect(!raw.contains("/Users/"))
        let root = try fixtureObject(
            at: "Tests/IntegrationFixtures/invalid/stale-miller-owned-presentation.json"
        )
        #expect(root["schema"] as? String == "miller-avatar.integration-fixture/v1")
        let cases = try arrayOfObjects(root["cases"])
        #expect(cases.count == 8)

        for testCase in cases {
            var state = ProjectionState()
            for prelude in try arrayOfObjects(testCase["prelude"]) {
                state = reduce(state, try fixtureInput(prelude)).state
            }
            let before = state
            let result: ReducerResult<ProjectionState, ProjectionEffect>
            do {
                result = reduce(state, try fixtureInput(testCase["input"]))
            } catch {
                #expect(testCase["name"] as? String == "nonfinite-equivalent-scalar-type")
                try expectFixtureState(before, effects: [], from: testCase["expected"])
                continue
            }
            #expect(result.state == before)
            #expect(result.effects.isEmpty)
            try expectFixtureState(result.state, effects: result.effects, from: testCase["expected"])
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

    private func fixtureObject(at path: String) throws -> [String: Any] {
        let data = try fixtureRaw(at: path).data(using: .utf8)!
        guard let object = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw FixtureError.invalid
        }
        return object
    }

    private func fixtureRaw(at path: String) throws -> String {
        let root = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
        let data = try Data(contentsOf: root.appendingPathComponent(path))
        guard let raw = String(data: data, encoding: .utf8) else { throw FixtureError.invalid }
        return raw
    }

    private func arrayOfObjects(_ value: Any?) throws -> [[String: Any]] {
        guard let values = value as? [Any] else { throw FixtureError.invalid }
        return try values.map {
            guard let object = $0 as? [String: Any] else { throw FixtureError.invalid }
            return object
        }
    }

    private func fixtureInput(_ value: Any?) throws -> ProjectionInput {
        guard let input = value as? [String: Any],
              let type = input["type"] as? String
        else { throw FixtureError.invalid }

        switch type {
        case "project":
            guard let sequence = safeUInt(input["projection_sequence"]),
                  let phaseString = input["phase"] as? String,
                  let phase = PresentationPhase(rawValue: phaseString)
            else { throw FixtureError.invalid }
            return .project(ProjectPhasePayload(
                projectionSequence: sequence,
                generationID: try optionalUUID(input["generation_id"]),
                phase: phase,
                playbackID: try optionalUUID(input["playback_id"])
            ))
        case "mouth":
            guard let cueIndex = safeUInt(input["cue_index"]),
                  let offset = safeUInt(input["playback_offset_ms"]),
                  let scalar = input["scalar"] as? NSNumber,
                  let generationID = try optionalUUID(input["generation_id"]),
                  let playbackID = try optionalUUID(input["playback_id"])
            else { throw FixtureError.invalid }
            return .mouth(SetMouthPayload(
                generationID: generationID,
                playbackID: playbackID,
                cueIndex: cueIndex,
                playbackOffsetMilliseconds: offset,
                scalar: scalar.doubleValue
            ))
        case "set_reduced_motion":
            guard let enabled = input["enabled"] as? Bool else { throw FixtureError.invalid }
            return .setReducedMotion(enabled)
        case "suspend":
            guard let visibility = input["visibility"] as? String,
                  visibility == "occluded" || visibility == "hidden"
            else { throw FixtureError.invalid }
            return .suspend
        case "resume":
            guard input["visibility"] as? String == "visible" else { throw FixtureError.invalid }
            return .resume
        case "reset":
            guard let reasonString = input["reason"] as? String,
                  let reason = ResetReason(rawValue: reasonString)
            else { throw FixtureError.invalid }
            return .reset(
                generationID: try optionalUUID(input["generation_id"]),
                reason: reason
            )
        default:
            throw FixtureError.invalid
        }
    }

    private func optionalUUID(_ value: Any?) throws -> UUID? {
        if value is NSNull { return nil }
        guard let string = value as? String, let uuid = UUID(uuidString: string) else {
            throw FixtureError.invalid
        }
        return uuid
    }

    private func safeUInt(_ value: Any?) -> UInt64? {
        guard let number = value as? NSNumber,
              number.doubleValue.isFinite,
              number.doubleValue.rounded(.towardZero) == number.doubleValue,
              number.doubleValue >= 0,
              number.doubleValue <= Double(UInt64.max)
        else { return nil }
        return number.uint64Value
    }

    private func expectFixtureState(
        _ state: ProjectionState,
        effects: [ProjectionEffect],
        from value: Any?
    ) throws {
        guard let expected = value as? [String: Any] else { throw FixtureError.invalid }
        #expect(state.lastProjectionSequence == optionalUInt(expected["last_projection_sequence"]))
        #expect(state.generationID == (try optionalUUID(expected["generation_id"])))
        #expect(state.phase.rawValue == expected["phase"] as? String)
        #expect(state.playbackID == (try optionalUUID(expected["playback_id"])))
        #expect(state.lastCueIndex == optionalUInt(expected["last_cue_index"]))
        #expect(state.lastPlaybackOffsetMilliseconds == optionalUInt(expected["last_playback_offset_ms"]))
        #expect(state.mouthScalar == (expected["mouth_scalar"] as? NSNumber)?.doubleValue)
        #expect(state.reducedMotion == (expected["reduced_motion"] as? Bool))
        #expect(state.isSuspended == (expected["is_suspended"] as? Bool))
        #expect(state.isTerminated == (expected["is_terminated"] as? Bool))
        guard let names = expected["effects"] as? [String] else { throw FixtureError.invalid }
        #expect(names == effects.map(effectName))
    }

    private func optionalUInt(_ value: Any?) -> UInt64? {
        if value is NSNull || value == nil { return nil }
        return safeUInt(value)
    }

    private func effectName(_ effect: ProjectionEffect) -> String {
        switch effect {
        case .applyProjection: "apply_projection"
        case .applyMouth: "apply_mouth"
        case .setReducedMotion: "set_reduced_motion"
        case .stopContinuousMotion: "stop_continuous_motion"
        case .reset: "reset"
        case .clearMouth: "clear_mouth"
        case .reconcile: "reconcile"
        }
    }
}

private enum FixtureError: Error {
    case invalid
}
