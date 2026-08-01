import Foundation
import Dispatch
import Testing
@testable import MillerAvatarHost

@Suite struct RendererSessionTests {
    @Test func beginningAReplacementInvalidatesTheOldLease() {
        let controller = RendererSessionController()
        let old = controller.begin()
        let replacement = controller.begin()

        #expect(old.isValid == false)
        #expect(replacement.isValid)
    }

    @Test func oldCallbacksCannotMutateAReplacementSession() {
        let controller = RendererSessionController()
        let old = controller.begin()
        let replacement = controller.begin()
        var state = "replacement"

        #expect(controller.perform(for: old) { state = "stale" } == false)
        #expect(state == "replacement")
        #expect(controller.perform(for: replacement) { state = "current" })
        #expect(state == "current")
    }

    @Test func invalidationFencesEveryLaterCallback() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        var callbacks = 0

        controller.invalidateActive()

        #expect(controller.perform(for: lease) { callbacks += 1 } == false)
        #expect(callbacks == 0)
        #expect(lease.isValid == false)
    }

    @Test func replacementUsesAUniqueMonotonicLeaseIdentity() {
        let controller = RendererSessionController()
        let id = UUID(uuidString: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")!
        let first = controller.begin(id: id)
        let replacement = controller.begin(id: id)

        #expect(first.id == replacement.id)
        #expect(first.identity != replacement.identity)
        #expect(first.identity.generation < replacement.identity.generation)
        #expect(!controller.isCurrent(first))
        #expect(controller.isCurrent(replacement))
        #expect(controller.isCurrent(replacement.identity))
    }

    @Test func validationChecksDoNotHoldLocksAcrossReentrantWork() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        var callbackRan = false

        #expect(lease.performIfValid {
            callbackRan = true
            lease.invalidate()
        })
        #expect(callbackRan)
        #expect(!lease.isValid)
        #expect(!controller.isCurrent(lease))
    }

    @Test func staleReleaseCannotInvalidateAReplacementWithTheSameID() {
        let controller = RendererSessionController()
        let id = UUID(uuidString: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")!
        let old = controller.begin(id: id)
        let replacement = controller.begin(id: id)

        controller.release(old)

        #expect(controller.isCurrent(replacement))
        #expect(replacement.isValid)
    }

    @Test func invalidationCannotPassAnAdmittedCallback() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let callbackStarted = DispatchSemaphore(value: 0)
        let allowCallbackToFinish = DispatchSemaphore(value: 0)
        let callbackFinished = DispatchSemaphore(value: 0)
        let invalidationStarted = DispatchSemaphore(value: 0)
        let invalidationFinished = DispatchSemaphore(value: 0)

        DispatchQueue.global().async {
            _ = controller.perform(for: lease) {
                callbackStarted.signal()
                _ = allowCallbackToFinish.wait(timeout: .now() + 1)
            }
            callbackFinished.signal()
        }
        #expect(callbackStarted.wait(timeout: .now() + 1) == .success)

        DispatchQueue.global().async {
            invalidationStarted.signal()
            controller.invalidateActive()
            invalidationFinished.signal()
        }
        #expect(invalidationStarted.wait(timeout: .now() + 1) == .success)
        #expect(invalidationFinished.wait(timeout: .now() + 0.1) == .timedOut)

        allowCallbackToFinish.signal()
        #expect(callbackFinished.wait(timeout: .now() + 1) == .success)
        #expect(invalidationFinished.wait(timeout: .now() + 1) == .success)
    }
}
