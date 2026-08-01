import Testing
@testable import MillerAvatarHost

@Suite struct WindowPolicyTests {
    @Test func nativeControlsPrecedeRendererInResponderOrder() {
        #expect(WindowPolicy.responderOrder.first == .startOrRetry)
        #expect(WindowPolicy.responderOrder.last == .renderer)
        #expect(Set(WindowPolicy.responderOrder).count == WindowPolicy.responderOrder.count)
    }

    @Test func reopeningReusesOneWindowAndDoesNotRequestAnotherSession() {
        #expect(WindowPolicy.action(hasWindow: true, hasSession: true) == .revealExisting)
        #expect(WindowPolicy.action(hasWindow: false, hasSession: false) == .createFallbackWindow)
    }

    @Test func failureMovesFocusToRetryControl() {
        #expect(WindowPolicy.focusTarget(after: .rendererFailed) == .startOrRetry)
        #expect(WindowPolicy.fallbackIsInitiallyVisible)
    }
}
