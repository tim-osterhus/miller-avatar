import Foundation
import Testing
import MillerAvatarCore
@testable import MillerAvatarHost

@MainActor
@Suite struct BridgeControllerTests {
    @Test func sendsEveryCommandThroughOneFixedStructuredReceiver() async throws {
        let caller = RecordingJavaScriptCaller()
        let sessionID = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
        let bridge = BridgeController(sessionID: sessionID, caller: caller)

        try await bridge.send(.configure(reducedMotion: true))
        try await bridge.send(.loadProfile(profilePayload()))

        #expect(caller.calls.count == 2)
        #expect(caller.calls.allSatisfy { $0.source == BridgeController.receiverSource })
        let first = try #require(caller.calls.first)
        let object = try #require(
            JSONSerialization.jsonObject(with: Data(first.commandJSON.utf8))
                as? [String: Any]
        )
        #expect(object["schema"] as? String == BridgeContract.commandSchema)
        #expect(object["session_id"] as? String == sessionID.uuidString.lowercased())
        #expect(object["sequence"] as? Int == 1)
        #expect(object["type"] as? String == "configure")
        let payload = try #require(object["payload"] as? [String: Any])
        #expect(payload["profile"] as? String == "lightweight")
        #expect(payload["reduced_motion"] as? Bool == true)
    }

    @Test func serializesSuspendedSendsInSequenceOrder() async throws {
        let caller = SuspendedJavaScriptCaller()
        let sessionID = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
        let bridge = BridgeController(sessionID: sessionID, caller: caller)

        let first = Task { try await bridge.send(.configure(reducedMotion: false)) }
        await caller.waitForFirstCall()
        let second = Task {
            try await bridge.send(.loadProfile(profilePayload()))
        }
        await Task.yield()

        #expect(caller.calls.count == 1)
        caller.resumeFirstCall()
        try await first.value
        try await second.value

        let sequences = try caller.calls.map { call -> Int in
            let object = try #require(
                JSONSerialization.jsonObject(with: Data(call.commandJSON.utf8))
                    as? [String: Any]
            )
            return try #require(object["sequence"] as? Int)
        }
        #expect(sequences == [1, 2])
    }

    @Test func serializesResumeReconciliationWithoutMintingAProjectionSequence() async throws {
        let caller = RecordingJavaScriptCaller()
        let sessionID = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
        let bridge = BridgeController(sessionID: sessionID, caller: caller)

        try await bridge.send(.reconcilePresentation(.init(
            lastProjectionSequence: 17,
            generationID: UUID(uuidString: "33333333-3333-4333-8333-333333333333"),
            phase: .speaking,
            playbackID: UUID(uuidString: "44444444-4444-4444-8444-444444444444"),
            reducedMotion: true
        )))

        let call = try #require(caller.calls.last)
        let object = try #require(
            JSONSerialization.jsonObject(with: Data(call.commandJSON.utf8))
                as? [String: Any]
        )
        #expect(object["sequence"] as? Int == 1)
        #expect(object["type"] as? String == "reconcile_presentation")
        let payload = try #require(object["payload"] as? [String: Any])
        #expect(payload["last_projection_sequence"] as? Int == 17)
        #expect(payload["generation_id"] as? String == "33333333-3333-4333-8333-333333333333")
        #expect(payload["phase"] as? String == "speaking")
        #expect(payload["playback_id"] as? String == "44444444-4444-4444-8444-444444444444")
        #expect(payload["reduced_motion"] as? Bool == true)
    }

    @Test
    func reservesEachSequenceAndPreparesExpectationBeforeDispatch() async throws {
        let caller = RecordingJavaScriptCaller()
        let sessionID = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
        let bridge = BridgeController(sessionID: sessionID, caller: caller)
        var prepared: [UInt64] = []
        var dispatchCountAtPreparation: [Int] = []

        try await bridge.send(.loadProfile(profilePayload())) { sequence in
            prepared.append(sequence)
            dispatchCountAtPreparation.append(caller.calls.count)
        }
        try await bridge.send(.configure(reducedMotion: false)) { sequence in
            prepared.append(sequence)
            dispatchCountAtPreparation.append(caller.calls.count)
        }

        #expect(prepared == [1, 2])
        #expect(dispatchCountAtPreparation == [0, 1])
    }

}

private func profilePayload() -> LoadProfilePayload {
    LoadProfilePayload(
        profileRevision: 1,
        modelToken: UUID(uuidString: "22222222-2222-4222-8222-222222222222")!,
        motionBindings: Dictionary(uniqueKeysWithValues: AvatarMotionRole.allCases.map {
            ($0, MotionBindingPayload.missing)
        })
    )
}

@MainActor
private final class RecordingJavaScriptCaller: JavaScriptCommandCalling {
    struct Call {
        let source: String
        let commandJSON: String
    }
    private(set) var calls: [Call] = []

    func call(source: String, commandJSON: String) async throws {
        calls.append(Call(source: source, commandJSON: commandJSON))
    }
}

@MainActor
private final class SuspendedJavaScriptCaller: JavaScriptCommandCalling {
    struct Call {
        let source: String
        let commandJSON: String
    }

    private(set) var calls: [Call] = []
    private var firstCallStarted: CheckedContinuation<Void, Never>?
    private var firstCallContinuation: CheckedContinuation<Void, Never>?

    func call(source: String, commandJSON: String) async throws {
        calls.append(Call(source: source, commandJSON: commandJSON))
        guard calls.count == 1 else { return }
        firstCallStarted?.resume()
        firstCallStarted = nil
        await withCheckedContinuation { continuation in
            firstCallContinuation = continuation
        }
    }

    func waitForFirstCall() async {
        guard calls.isEmpty else { return }
        await withCheckedContinuation { continuation in
            firstCallStarted = continuation
        }
    }

    func resumeFirstCall() {
        firstCallContinuation?.resume()
        firstCallContinuation = nil
    }
}
