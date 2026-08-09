import Foundation
import Testing
@testable import MillerAvatarHost

@MainActor
@Suite struct RendererObservationHandlerTests {
    @Test func decodesAndDeliversAValidSerializedObservation() {
        let controller = RendererSessionController()
        let sessionID = UUID()
        let lease = controller.begin(id: sessionID)
        var receivedSequences: [UInt64] = []
        var invalidObservations = 0
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller,
            receive: { receivedSequences.append($0.sequence) },
            onInvalidObservation: { invalidObservations += 1 }
        )

        handler.accept(observation(sessionID: sessionID, sequence: 1))

        #expect(receivedSequences == [1])
        #expect(invalidObservations == 0)
    }

    @Test func malformedStringTearsDownTheCurrentObservationSession() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        var invalidObservations = 0
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller,
            onInvalidObservation: { invalidObservations += 1 }
        )

        handler.accept("{not-json")

        #expect(invalidObservations == 1)
        #expect(lease.isValid == false)
    }

    @Test func nonStringBodyTearsDownTheCurrentObservationSession() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        var invalidObservations = 0
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller,
            onInvalidObservation: { invalidObservations += 1 }
        )

        handler.accept(42)

        #expect(invalidObservations == 1)
        #expect(lease.isValid == false)
    }

    @Test func oversizedObservationTearsDownTheCurrentObservationSession() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        var invalidObservations = 0
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller,
            onInvalidObservation: { invalidObservations += 1 }
        )

        handler.accept(String(repeating: " ", count: 16_385))

        #expect(invalidObservations == 1)
        #expect(lease.isValid == false)
    }

    @Test func staleObservationSessionIsFilteredWithoutCallingConsumers() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        var invalidObservations = 0
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller,
            onInvalidObservation: { invalidObservations += 1 }
        )

        handler.accept(observation(sessionID: UUID(), sequence: 1))

        #expect(invalidObservations == 0)
        #expect(lease.isValid)
    }

    @Test func outOfSequenceObservationTearsDownTheCurrentObservationSession() {
        let controller = RendererSessionController()
        let sessionID = UUID()
        let lease = controller.begin(id: sessionID)
        var invalidObservations = 0
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller,
            onInvalidObservation: { invalidObservations += 1 }
        )

        handler.accept(observation(sessionID: sessionID, sequence: 2))

        #expect(invalidObservations == 1)
        #expect(lease.isValid == false)
    }

    @Test func defaultInvalidObservationContainmentInvalidatesTheLease() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller
        )

        handler.accept("{not-json")

        #expect(lease.isValid == false)
        #expect(controller.isCurrent(lease) == false)
    }

    @Test func replacementFencesAnOldObservationHandlerWithoutTeardown() {
        let controller = RendererSessionController()
        let sessionID = UUID()
        let lease = controller.begin(id: sessionID)
        var delivered = 0
        var invalidObservations = 0
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller,
            receive: { _ in delivered += 1 },
            onInvalidObservation: { invalidObservations += 1 }
        )

        _ = controller.begin(id: sessionID)
        handler.accept(observation(sessionID: sessionID, sequence: 1))

        #expect(delivered == 0)
        #expect(invalidObservations == 0)
    }

    @Test func invalidObservationTeardownMayReleaseTheLeaseReentrantly() {
        let controller = RendererSessionController()
        let sessionID = UUID()
        let lease = controller.begin(id: sessionID)
        var invalidObservations = 0
        var delivered = 0
        let handler = RendererObservationHandler(
            lease: lease,
            sessionController: controller,
            receive: { _ in delivered += 1 },
            onInvalidObservation: {
                invalidObservations += 1
                controller.release(lease)
            }
        )

        handler.accept("{not-json")
        handler.accept(observation(sessionID: sessionID, sequence: 1))

        #expect(invalidObservations == 1)
        #expect(delivered == 0)
        #expect(lease.isValid == false)
    }

    @Test func exposesOnlyTheFixedObservationChannelName() {
        #expect(RendererObservationHandler.channelName == "millerAvatarObservation")
        #expect(
            WebViewFactory.scriptMessageHandlerNames
                == [RendererObservationHandler.channelName]
        )
    }
}

private func observation(sessionID: UUID, sequence: UInt64) -> String {
    let object: [String: Any] = [
        "schema": "miller-avatar.presentation-observation/v2",
        "session_id": sessionID.uuidString.lowercased(),
        "sequence": sequence,
        "caused_by_sequence": NSNull(),
        "type": "wrapper_ready",
        "payload": ["bridge_version": 2],
    ]
    let data = try! JSONSerialization.data(withJSONObject: object)
    return String(decoding: data, as: UTF8.self)
}
