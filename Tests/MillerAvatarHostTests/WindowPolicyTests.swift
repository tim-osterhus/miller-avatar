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

    @Test func explicitTraversalSkipsDisabledControlsAndWraps() {
        let enabled = [true, false, true, true]

        #expect(WindowPolicy.nextResponderIndex(
            after: 0,
            enabled: enabled,
            backward: false
        ) == 2)
        #expect(WindowPolicy.nextResponderIndex(
            after: 3,
            enabled: enabled,
            backward: false
        ) == 0)
        #expect(WindowPolicy.nextResponderIndex(
            after: 0,
            enabled: enabled,
            backward: true
        ) == 3)
        #expect(WindowPolicy.nextResponderIndex(
            after: nil,
            enabled: enabled,
            backward: false
        ) == 0)
        #expect(WindowPolicy.nextResponderIndex(
            after: nil,
            enabled: enabled,
            backward: true
        ) == 3)
        #expect(WindowPolicy.nextResponderIndex(
            after: 0,
            enabled: [false, false],
            backward: false
        ) == nil)
    }
}
