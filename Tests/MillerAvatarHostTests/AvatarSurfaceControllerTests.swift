import AppKit
import Foundation
import MillerAvatarCore
import Testing
@testable import MillerAvatarHost
@preconcurrency import WebKit

@MainActor
@Suite struct AvatarSurfaceControllerTests {
    @Test func timerStateInvalidationRejectsLaterInstallation() {
        let state = AvatarSurfaceTimerState()
        state.invalidate()
        let timer = Timer(timeInterval: 1, repeats: false) { _ in }

        state.install(timer)

        #expect(!timer.isValid)
        #expect(!state.hasTimer)
    }

    @Test func repeatedStartCreatesOneRendererAndOneDeadlineTimer() {
        let driver = RecordingSurfaceDriver()
        let timer = RecordingSurfaceTimer()
        let surface = AvatarSurfaceController(driver: driver, timer: timer)

        surface.start()
        surface.start()

        #expect(driver.startCount == 1)
        #expect(timer.startCount == 1)
        #expect(timer.interval == 0.25)
    }

    @Test func emptySurfaceHasNoSnapshotTransitionUntilOrchestratorChanges() {
        let driver = RecordingSurfaceDriver()
        let timer = RecordingSurfaceTimer()
        let surface = AvatarSurfaceController(driver: driver, timer: timer)
        var snapshots: [HostSnapshot] = []

        #expect(surface.view.subviews.isEmpty)
        surface.onSnapshot = { snapshots.append($0) }
        #expect(snapshots.isEmpty)

        surface.start()

        #expect(!snapshots.isEmpty)
        #expect(surface.snapshot.lifecycle == .startingRenderer)
        #expect(surface.view.subviews.isEmpty)
    }

    @Test func rendererViewsReplaceWithFourEdgeConstraints() {
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        let first = WKWebView()
        let replacement = WKWebView()

        driver.emitView(first)
        #expect(surface.view.subviews.count == 1)
        #expect(surface.view.subviews.first === first)
        #expect(surface.view.constraints.count == 4)

        driver.emitView(replacement)
        #expect(first.superview == nil)
        #expect(surface.view.subviews == [replacement])
        #expect(surface.view.constraints.count == 4)
        #expect(surface.view.constraints.allSatisfy { constraint in
            constraint.firstItem as AnyObject === replacement
                || constraint.secondItem as AnyObject === replacement
        })
    }

    @Test func disposeDetachesTheRendererAndInvalidatesTheTimerOnce() {
        let driver = RecordingSurfaceDriver()
        let timer = RecordingSurfaceTimer()
        let surface = AvatarSurfaceController(driver: driver, timer: timer)
        surface.start()
        driver.emitView(WKWebView())

        surface.dispose()
        surface.dispose(reason: .termination)

        #expect(surface.view.subviews.isEmpty)
        #expect(driver.disposeReasons == [.operator])
        #expect(timer.invalidateCount == 1)
    }

    @Test func lateWebViewChangesAfterDisposeCannotReattachRenderer() throws {
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        driver.emitView(WKWebView())
        let lateCallback = try #require(driver.onWebViewChange)

        surface.dispose()
        #expect(surface.view.subviews.isEmpty)

        lateCallback(WKWebView())

        #expect(surface.view.subviews.isEmpty)
    }

    @Test func deinitializationBestEffortInvalidatesDeadlineTimer() {
        let timer = RecordingSurfaceTimer()
        var surface: AvatarSurfaceController? = AvatarSurfaceController(
            driver: RecordingSurfaceDriver(),
            timer: timer
        )
        surface?.start()

        surface = nil

        #expect(timer.invalidateCount == 1)
    }

    @Test func callbacksAreForwardedOnTheMainActorAfterSessionValidation() {
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        var observations: [HostObservation] = []
        var callbackWasOnMainThread = false
        surface.onObservation = { observation in
            observations.append(observation)
            callbackWasOnMainThread = Thread.isMainThread
        }

        surface.start()
        let sessionID = try! #require(driver.sessionID)
        driver.emitObservation(.wrapperReady, for: sessionID)
        driver.emitObservation(.wrapperReady, for: UUID())

        #expect(observations == [.wrapperReady])
        #expect(callbackWasOnMainThread)
    }

    @Test func surfaceAndInstalledRendererDoNotEnterInteractionPaths() {
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        let webView = NoninteractiveTestWebView()
        driver.emitView(webView)

        for view in [surface.view, webView] {
            #expect(!view.acceptsFirstResponder)
            #expect(view.hitTest(NSPoint(x: 1, y: 1)) == nil)
            #expect(!view.isAccessibilityElement())
            #expect(view.accessibilityChildren()?.isEmpty == true)
            #expect(view.registeredDraggedTypes.isEmpty)
            #expect(view.nextKeyView == nil)
            #expect(view.previousKeyView == nil)
        }
    }
}

@MainActor
private final class RecordingSurfaceDriver: AvatarSurfaceRendererDriving {
    var onWebViewChange: ((WKWebView?) -> Void)?
    private(set) var startCount = 0
    private(set) var disposeReasons: [DisposalReason] = []
    private(set) var sessionID: UUID?
    private var receive: ((UUID, HostObservation) -> Void)?

    func start(
        sessionID: UUID,
        receive: @escaping (UUID, HostObservation) -> Void
    ) {
        startCount += 1
        self.sessionID = sessionID
        self.receive = receive
    }

    func install(_ asset: AdmittedAsset) {}

    func send(_ command: BridgeCommand) {}

    func dispose(reason: DisposalReason) {
        disposeReasons.append(reason)
        onWebViewChange?(nil)
    }

    func emitView(_ webView: WKWebView?) {
        onWebViewChange?(webView)
    }

    func emitObservation(_ observation: HostObservation, for sessionID: UUID) {
        receive?(sessionID, observation)
    }
}

private final class RecordingSurfaceTimer: AvatarSurfaceTimer {
    private nonisolated let state = RecordingSurfaceTimerState()

    var startCount: Int { state.startCount }
    var invalidateCount: Int { state.invalidateCount }
    var interval: TimeInterval? { state.interval }

    func start(
        interval: TimeInterval,
        handler: @escaping @MainActor @Sendable () -> Void
    ) {
        state.start(interval: interval, handler: handler)
    }

    nonisolated func invalidate() {
        state.invalidate()
    }
}

private final class RecordingSurfaceTimerState: @unchecked Sendable {
    private let lock = NSLock()
    private var storedStartCount = 0
    private var storedInvalidateCount = 0
    private var storedInterval: TimeInterval?
    private var handler: (@MainActor @Sendable () -> Void)?

    var startCount: Int {
        lock.lock()
        defer { lock.unlock() }
        return storedStartCount
    }

    var invalidateCount: Int {
        lock.lock()
        defer { lock.unlock() }
        return storedInvalidateCount
    }

    var interval: TimeInterval? {
        lock.lock()
        defer { lock.unlock() }
        return storedInterval
    }

    func start(
        interval: TimeInterval,
        handler: @escaping @MainActor @Sendable () -> Void
    ) {
        lock.lock()
        storedStartCount += 1
        storedInterval = interval
        self.handler = handler
        lock.unlock()
    }

    func invalidate() {
        lock.lock()
        storedInvalidateCount += 1
        handler = nil
        lock.unlock()
    }
}

@MainActor
private final class NoninteractiveTestWebView: WKWebView {
    override var acceptsFirstResponder: Bool { false }

    override func hitTest(_ point: NSPoint) -> NSView? { nil }

    override func accessibilityIsIgnored() -> Bool { true }

    override func accessibilityChildren() -> [Any]? { [] }

    override var registeredDraggedTypes: [NSPasteboard.PasteboardType] { [] }

    override func registerForDraggedTypes(_ types: [NSPasteboard.PasteboardType]) {}
}
