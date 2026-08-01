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
        try await bridge.send(.loadAsset(token: UUID(
            uuidString: "22222222-2222-4222-8222-222222222222"
        )!))

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
            try await bridge.send(.loadAsset(token: UUID(
                uuidString: "22222222-2222-4222-8222-222222222222"
            )!))
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
