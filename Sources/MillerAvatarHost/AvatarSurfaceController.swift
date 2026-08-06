import AppKit
import Foundation
import MillerAvatarCore
@preconcurrency import WebKit

@MainActor
internal protocol AvatarSurfaceRendererDriving: HostRendererDriving {
    var onWebViewChange: ((WKWebView?) -> Void)? { get set }
}

@MainActor
internal protocol AvatarSurfaceTimer: AnyObject, Sendable {
    func start(
        interval: TimeInterval,
        handler: @escaping @MainActor @Sendable () -> Void
    )
    nonisolated func invalidate()
}

@MainActor
private final class FoundationAvatarSurfaceTimer: AvatarSurfaceTimer {
    private nonisolated let state = AvatarSurfaceTimerState()

    func start(
        interval: TimeInterval,
        handler: @escaping @MainActor @Sendable () -> Void
    ) {
        guard !state.hasTimer else { return }
        let timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { _ in
            MainActor.assumeIsolated {
                handler()
            }
        }
        state.install(timer)
    }

    nonisolated func invalidate() {
        state.invalidate()
    }
}

internal final class AvatarSurfaceTimerState: @unchecked Sendable {
    private let lock = NSLock()
    private var timer: Timer?
    private var hasBeenInvalidated = false

    internal var hasTimer: Bool {
        lock.lock()
        defer { lock.unlock() }
        return timer != nil
    }

    internal func install(_ timer: Timer) {
        lock.lock()
        let shouldInvalidate = hasBeenInvalidated
        if !shouldInvalidate {
            self.timer = timer
        }
        lock.unlock()

        if shouldInvalidate {
            timer.invalidate()
        }
    }

    internal func invalidate() {
        lock.lock()
        hasBeenInvalidated = true
        let timer = self.timer
        self.timer = nil
        lock.unlock()
        timer?.invalidate()
    }
}

@MainActor
private final class AvatarContainerView: NSView {
    override var acceptsFirstResponder: Bool { false }

    override func hitTest(_ point: NSPoint) -> NSView? { nil }

    override func accessibilityIsIgnored() -> Bool { true }

    override func accessibilityChildren() -> [Any]? { [] }

    override func registerForDraggedTypes(_ types: [NSPasteboard.PasteboardType]) {}
}

@MainActor
public final class AvatarSurfaceController {
    public let view: NSView
    public var onSnapshot: ((HostSnapshot) -> Void)?
    public var onObservation: ((HostObservation) -> Void)?
    public var snapshot: HostSnapshot { host.snapshot }

    private static let deadlineInterval: TimeInterval = 0.25
    private let container: AvatarContainerView
    private let driver: any AvatarSurfaceRendererDriving
    private let host: HostOrchestrator
    private let timer: any AvatarSurfaceTimer
    private var rendererView: WKWebView?
    private var hasStarted = false
    private var isDisposed = false
    private var timerWasInvalidated = false

    public convenience init() {
        self.init(
            driver: WebKitAvatarRendererDriver(),
            timer: FoundationAvatarSurfaceTimer()
        )
    }

    internal init(
        driver: any AvatarSurfaceRendererDriving,
        timer: any AvatarSurfaceTimer
    ) {
        let container = AvatarContainerView(frame: .zero)
        self.container = container
        view = container
        self.driver = driver
        self.timer = timer
        host = HostOrchestrator(driver: driver)

        host.onChange = { [weak self] snapshot in
            self?.onSnapshot?(snapshot)
        }
        host.onObservation = { [weak self] observation in
            self?.onObservation?(observation)
        }
        driver.onWebViewChange = { [weak self] webView in
            self?.install(webView)
        }
        container.nextKeyView = nil
    }

    deinit {
        timer.invalidate()
    }

    public func start() {
        guard !isDisposed else { return }
        if !hasStarted {
            hasStarted = true
            timer.start(interval: Self.deadlineInterval) { [weak self] in
                self?.host.checkDeadlines()
            }
        }
        host.startRenderer()
    }

    @discardableResult
    public func load(_ asset: AdmittedAsset) -> AssetLoadDisposition {
        guard !isDisposed else { return .notReady }
        return host.load(asset)
    }

    public func rejectAsset(_ code: FailureCode) {
        guard !isDisposed else { return }
        host.rejectAsset(code)
    }

    public func project(_ payload: ProjectPhasePayload) {
        guard !isDisposed else { return }
        host.project(payload)
    }

    public func setMouth(_ payload: SetMouthPayload) {
        guard !isDisposed else { return }
        host.setMouth(payload)
    }

    public func reset(generationID: UUID?, reason: ResetReason) {
        guard !isDisposed else { return }
        host.reset(generationID: generationID, reason: reason)
    }

    public func setVisibility(_ visibility: EffectiveVisibility) {
        guard !isDisposed else { return }
        host.setVisibility(visibility)
    }

    public func setReducedMotion(_ enabled: Bool) {
        guard !isDisposed else { return }
        host.setReducedMotion(enabled)
    }

    public func retry() {
        guard !isDisposed else { return }
        host.retry()
    }

    public func dispose(reason: DisposalReason = .operator) {
        guard !isDisposed else { return }
        isDisposed = true
        invalidateTimer()
        driver.onWebViewChange = nil
        detachRenderer()
        host.dispose(reason: reason)
    }

    private func install(_ webView: WKWebView?) {
        guard !isDisposed else { return }
        detachRenderer()

        guard let webView else { return }
        webView.translatesAutoresizingMaskIntoConstraints = false
        webView.nextKeyView = nil
        container.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            webView.topAnchor.constraint(equalTo: container.topAnchor),
            webView.bottomAnchor.constraint(equalTo: container.bottomAnchor),
        ])
        rendererView = webView
    }

    private func detachRenderer() {
        rendererView?.removeFromSuperview()
        rendererView = nil
    }

    private func invalidateTimer() {
        guard !timerWasInvalidated else { return }
        timerWasInvalidated = true
        timer.invalidate()
    }
}
