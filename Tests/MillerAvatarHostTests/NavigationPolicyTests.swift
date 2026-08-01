import Foundation
import Dispatch
import Testing
@testable import MillerAvatarHost

@MainActor
@Suite struct NavigationPolicyTests {
    @Test func allowsTheExactInitialMainFrameEntrypointOnce() {
        let fixture = makePolicy()
        let initial = NavigationRequest(
            url: fixture.entrypoint,
            isMainFrame: true,
            navigationType: .other
        )

        #expect(fixture.policy.decide(initial) == .allow)
        #expect(fixture.policy.decide(initial) == .cancel)
    }

    @Test func everyEscapeAndNavigationPathFailsClosed() {
        let fixture = makePolicy()
        let policy = fixture.policy
        let entry = fixture.entrypoint
        let rejected = [
            NavigationRequest(
                url: URL(string: "http://example.com")!,
                isMainFrame: true,
                navigationType: .other
            ),
            NavigationRequest(
                url: URL(string: "https://example.com")!,
                isMainFrame: true,
                navigationType: .other
            ),
            NavigationRequest(
                url: URL(fileURLWithPath: "/tmp/asset.vrm"),
                isMainFrame: true,
                navigationType: .other
            ),
            NavigationRequest(
                url: URL(string: "data:text/html,hello")!,
                isMainFrame: true,
                navigationType: .other
            ),
            NavigationRequest(
                url: URL(string: "blob:https://example.com/id")!,
                isMainFrame: true,
                navigationType: .other
            ),
            NavigationRequest(
                url: entry,
                isMainFrame: false,
                navigationType: .other
            ),
            NavigationRequest(
                url: entry,
                isMainFrame: true,
                navigationType: .formSubmitted
            ),
            NavigationRequest(
                url: entry,
                isMainFrame: true,
                navigationType: .other,
                hasTargetFrame: false
            ),
            NavigationRequest(
                url: entry,
                isMainFrame: true,
                navigationType: .other,
                isRedirect: true
            ),
            NavigationRequest(
                url: entry,
                isMainFrame: true,
                navigationType: .other,
                shouldPerformDownload: true
            ),
        ]

        for request in rejected {
            #expect(policy.decide(request) == .cancel)
        }
        #expect(policy.allowsNewWindow == false)
        #expect(policy.allowsClose == false)
        #expect(policy.authenticationDisposition == .cancelAuthenticationChallenge)
    }

    @Test func invalidatedLeaseRejectsEvenTheEntrypoint() {
        let lease = RendererSessionLease()
        let policy = NavigationPolicy(lease: lease)
        lease.invalidate()

        #expect(
            policy.decide(
                NavigationRequest(
                    url: LocalSchemeHandler.entrypointURL(for: lease.id),
                    isMainFrame: true,
                    navigationType: .other
                )
            ) == .cancel
        )
    }

    @Test func stalePolicyCannotMutateAReplacementSession() {
        let controller = RendererSessionController()
        let oldLease = controller.begin()
        var replacementState = "replacement"
        var violations = 0
        let stalePolicy = NavigationPolicy(lease: oldLease) {
            violations += 1
            replacementState = "corrupted"
        }
        let replacementLease = controller.begin()

        #expect(
            stalePolicy.decide(
                NavigationRequest(
                    url: LocalSchemeHandler.entrypointURL(for: oldLease.id),
                    isMainFrame: true,
                    navigationType: .other
                )
            ) == .cancel
        )
        #expect(violations == 0)
        #expect(replacementState == "replacement")
        #expect(
            controller.perform(for: replacementLease) {
                replacementState = "current"
            }
        )
        #expect(replacementState == "current")
    }

    @Test func livePolicyReportsOneViolationForAProhibitedNavigation() {
        var violations = 0
        let policy = NavigationPolicy(lease: RendererSessionLease()) {
            violations += 1
        }

        #expect(
            policy.decide(
                NavigationRequest(
                    url: URL(string: "https://example.com")!,
                    isMainFrame: true,
                    navigationType: .other
                )
            ) == .cancel
        )
        #expect(violations == 1)
    }

    @Test func policyViolationReportsClosedFailureMetadata() {
        var reported: RendererPolicyFailure?
        let policy = NavigationPolicy(
            lease: RendererSessionLease(),
            onPolicyFailure: { reported = $0 }
        )

        #expect(
            policy.decide(
                NavigationRequest(
                    url: URL(string: "https://example.com")!,
                    isMainFrame: true,
                    navigationType: .other
                )
            ) == .cancel
        )
        #expect(reported == .policyViolation)
    }

    @Test func invalidationCannotPassAnAdmittedPolicyCallback() async {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let callbackStarted = DispatchSemaphore(value: 0)
        let allowCallbackToFinish = DispatchSemaphore(value: 0)
        let decisionFinished = DispatchSemaphore(value: 0)
        let invalidationStarted = DispatchSemaphore(value: 0)
        let invalidationFinished = DispatchSemaphore(value: 0)
        let verificationFinished = DispatchSemaphore(value: 0)
        let outcome = PolicyRaceOutcome()
        let policy = NavigationPolicy(lease: lease) {
            callbackStarted.signal()
            _ = allowCallbackToFinish.wait(timeout: .now() + 5)
        }

        DispatchQueue.global().async {
            guard callbackStarted.wait(timeout: .now() + 5) == .success else {
                return
            }
            invalidationStarted.signal()
            controller.invalidateActive()
            invalidationFinished.signal()
        }

        DispatchQueue.global().async {
            guard invalidationStarted.wait(timeout: .now() + 1) == .success else {
                outcome.record(
                    invalidationStayedBlocked: false,
                    invalidationFinished: false,
                    decisionFinished: false
                )
                verificationFinished.signal()
                return
            }
            let invalidationStayedBlocked = invalidationFinished.wait(
                timeout: .now() + 0.2
            ) == .timedOut
            allowCallbackToFinish.signal()
            let didInvalidate = invalidationFinished.wait(
                timeout: .now() + 5
            ) == .success
            let didFinishDecision = decisionFinished.wait(
                timeout: .now() + 5
            ) == .success
            outcome.record(
                invalidationStayedBlocked: invalidationStayedBlocked,
                invalidationFinished: didInvalidate,
                decisionFinished: didFinishDecision
            )
            verificationFinished.signal()
        }

        Task { @MainActor in
            _ = policy.decide(
                NavigationRequest(
                    url: URL(string: "https://example.com")!,
                    isMainFrame: true,
                    navigationType: .other
                )
            )
            decisionFinished.signal()
        }

        let verification = await waitForPolicySignal(
            verificationFinished,
            timeout: 5
        )
        #expect(verification == .success)
        #expect(outcome.invalidationStayedBlocked)
        #expect(outcome.invalidationFinished)
        #expect(outcome.decisionFinished)
    }

    private func makePolicy() -> (policy: NavigationPolicy, entrypoint: URL) {
        let lease = RendererSessionLease()
        return (
            NavigationPolicy(lease: lease),
            LocalSchemeHandler.entrypointURL(for: lease.id)
        )
    }
}

private func waitForPolicySignal(
    _ semaphore: DispatchSemaphore,
    timeout: TimeInterval = 1
) async -> DispatchTimeoutResult {
    await withCheckedContinuation { continuation in
        DispatchQueue.global().async {
            continuation.resume(
                returning: semaphore.wait(timeout: .now() + timeout)
            )
        }
    }
}

private final class PolicyRaceOutcome: @unchecked Sendable {
    private let lock = NSLock()
    private var storedInvalidationStayedBlocked = false
    private var storedInvalidationFinished = false
    private var storedDecisionFinished = false

    var invalidationStayedBlocked: Bool {
        lock.withLock { storedInvalidationStayedBlocked }
    }

    var invalidationFinished: Bool {
        lock.withLock { storedInvalidationFinished }
    }

    var decisionFinished: Bool {
        lock.withLock { storedDecisionFinished }
    }

    func record(
        invalidationStayedBlocked: Bool,
        invalidationFinished: Bool,
        decisionFinished: Bool
    ) {
        lock.withLock {
            storedInvalidationStayedBlocked = invalidationStayedBlocked
            storedInvalidationFinished = invalidationFinished
            storedDecisionFinished = decisionFinished
        }
    }
}
