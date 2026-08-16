import AppKit
import Foundation
import MillerAvatarCore
@preconcurrency import WebKit

@MainActor
package protocol AvatarSurfaceRendererDriving: HostRendererDriving {
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
    private var nextProfileLoadID: UInt64 = 0
    private var activeProfileLoad: PendingProfileLoad?
    private var nextProfilePersistenceID: UInt64 = 0
    private var acceptedProfilePersistence: AcceptedProfilePersistence?
    private var motionPersistenceTask: Task<Void, Never>?
    private var rendererPersistenceTask: Task<Void, Never>?

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
            self?.observe(snapshot)
            self?.onSnapshot?(snapshot)
        }
        host.onObservation = { [weak self] observation in
            self?.observe(observation)
            self?.onObservation?(observation)
        }
        host.onMotionSuccess = { [weak self] motionID in
            self?.enqueueMotionPersistence(.success(motionID: motionID))
        }
        host.onMotionFailure = { [weak self] motionID, code in
            self?.enqueueMotionPersistence(
                .failure(motionID: motionID, code: code)
            )
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

    public func load(
        profileID: UUID,
        from store: AvatarProfileStore
    ) async -> ProfileLoadDisposition {
        guard !isDisposed else { return .disposed }
        guard host.snapshot.lifecycle == .rendererReady,
              let sessionID = host.snapshot.sessionID
        else {
            return .notReady
        }

        invalidateActiveProfileLoad()
        nextProfileLoadID &+= 1
        let request = PendingProfileLoad(
            id: nextProfileLoadID,
            sessionID: sessionID,
            lease: ProfileMaterializationLease()
        )
        activeProfileLoad = request
        defer {
            request.lease.invalidate()
            if activeProfileLoad?.id == request.id {
                activeProfileLoad = nil
            }
        }

        do {
            try await store.materializeForRendering(
                id: profileID,
                lease: request.lease
            )
        } catch is CancellationError {
            return .superseded
        } catch let error as AvatarProfileStoreError {
            guard isCurrentProfileLoad(request) else { return .superseded }
            if error == .cancelled {
                return .superseded
            }
            return .rejected(profileLoadFailure(for: error))
        } catch {
            guard isCurrentProfileLoad(request) else { return .superseded }
            return .rejected(.persistenceFailed)
        }

        guard isCurrentProfileLoad(request),
              request.lease.isActive,
              let prepared = request.lease.takePreparedProfile()
        else {
            return .superseded
        }

        installingProfile = true
        defer { installingProfile = false }
        guard isCurrentProfileLoad(request),
              host.snapshot.lifecycle == .rendererReady,
              host.snapshot.sessionID == request.sessionID,
              host.load(prepared) == .accepted
        else {
            return .superseded
        }
        clearAcceptedProfilePersistence()
        nextProfilePersistenceID &+= 1
        acceptedProfilePersistence = AcceptedProfilePersistence(
            id: nextProfilePersistenceID,
            sessionID: request.sessionID,
            profileID: profileID,
            store: store,
            owner: MotionPersistenceOwner()
        )
        return .accepted
    }

    @discardableResult
    package func load(_ profile: LoadedAvatarProfile) -> AssetLoadDisposition {
        guard !isDisposed else { return .notReady }
        let disposition = host.load(profile)
        if disposition == .accepted {
            clearAcceptedProfilePersistence()
        }
        return disposition
    }

    @discardableResult
    package func loadForDiagnostics(_ asset: AdmittedAsset) -> AssetLoadDisposition {
        load(LoadedAvatarProfile(profileRevision: 1, model: asset))
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
        invalidateActiveProfileLoad()
        clearAcceptedProfilePersistence()
        isDisposed = true
        invalidateTimer()
        driver.onWebViewChange = nil
        detachRenderer()
        host.dispose(reason: reason)
    }

    private func install(_ webView: WKWebView?) {
        guard !isDisposed else { return }
        if rendererView !== webView {
            invalidateActiveProfileLoad()
            clearAcceptedProfilePersistence()
        }
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

    private var installingProfile = false

    private func observe(_ snapshot: HostSnapshot) {
        if let target = acceptedProfilePersistence {
            switch snapshot.lifecycle {
            case .failed:
                if snapshot.sessionID == target.sessionID || snapshot.sessionID == nil {
                    enqueueRendererPersistenceIfNeeded(
                        .failure,
                        target: target
                    )
                }
                clearAcceptedProfilePersistence()
            case .live:
                guard snapshot.sessionID == target.sessionID else {
                    clearAcceptedProfilePersistence()
                    break
                }
                enqueueRendererPersistenceIfNeeded(
                    .success,
                    target: target
                )
            case .disposing, .absent:
                clearAcceptedProfilePersistence()
            case .startingRenderer, .rendererReady, .loadingAsset, .liveSuspended:
                if target.sessionID != snapshot.sessionID {
                    clearAcceptedProfilePersistence()
                }
            }
        }

        guard let activeProfileLoad else { return }
        guard snapshot.sessionID == activeProfileLoad.sessionID else {
            invalidateActiveProfileLoad()
            return
        }
        switch snapshot.lifecycle {
        case .failed, .disposing, .absent:
            invalidateActiveProfileLoad()
        case .rendererReady, .loadingAsset, .live, .liveSuspended:
            if !installingProfile && snapshot.lifecycle != .rendererReady {
                invalidateActiveProfileLoad()
            }
        case .startingRenderer:
            invalidateActiveProfileLoad()
        }
    }

    private func observe(_ observation: HostObservation) {
        switch observation {
        case .failed, .disposed:
            invalidateActiveProfileLoad()
        default:
            break
        }
    }

    private func invalidateActiveProfileLoad() {
        activeProfileLoad?.lease.invalidate()
        activeProfileLoad = nil
    }

    private func clearAcceptedProfilePersistence() {
        acceptedProfilePersistence?.owner.invalidate()
        nextProfilePersistenceID &+= 1
        acceptedProfilePersistence = nil
        motionPersistenceTask?.cancel()
        motionPersistenceTask = nil
    }

    private func enqueueRendererPersistenceIfNeeded(
        _ event: RendererPersistenceEvent,
        target: AcceptedProfilePersistence
    ) {
        var target = target
        switch event {
        case .success:
            guard !target.rendererSuccessEnqueued else { return }
            target.rendererSuccessEnqueued = true
        case .failure:
            guard !target.rendererFailureEnqueued else { return }
            target.rendererFailureEnqueued = true
        }
        acceptedProfilePersistence = target

        let previous = rendererPersistenceTask
        let store = target.store
        let profileID = target.profileID
        rendererPersistenceTask = Task { [previous] in
            await previous?.value
            do {
                switch event {
                case .success:
                    try await store.recordRendererSuccess(id: profileID)
                case .failure:
                    try await store.recordRendererFailure(id: profileID)
                }
            } catch {
                // Host accounting is nonterminal; persistence errors do not alter it.
            }
        }
    }

    private func enqueueMotionPersistence(_ event: MotionPersistenceEvent) {
        guard !isDisposed,
              let target = acceptedProfilePersistence
        else { return }

        let previous = motionPersistenceTask
        motionPersistenceTask = Task { @MainActor [weak self] in
            await previous?.value
            guard let self,
                  !Task.isCancelled,
                  !self.isDisposed,
                  self.acceptedProfilePersistence?.id == target.id,
                  self.host.snapshot.sessionID == target.sessionID
            else { return }

            do {
                switch event {
                case .success(let motionID):
                    try await target.store.recordMotionRendererSuccess(
                        profileID: target.profileID,
                        motionID: motionID,
                        owner: target.owner
                    )
                case .failure(let motionID, let code):
                    try await target.store.recordMotionRendererFailure(
                        profileID: target.profileID,
                        motionID: motionID,
                        code: code,
                        owner: target.owner
                    )
                }
            } catch {
                // Host accounting is nonterminal; persistence errors do not alter it.
            }
        }
    }

    private func isCurrentProfileLoad(_ request: PendingProfileLoad) -> Bool {
        guard !isDisposed,
              let activeProfileLoad,
              activeProfileLoad.id == request.id,
              activeProfileLoad.sessionID == request.sessionID,
              activeProfileLoad.lease === request.lease
        else {
            return false
        }
        return host.snapshot.sessionID == request.sessionID
            && host.snapshot.lifecycle == .rendererReady
    }

    private func profileLoadFailure(
        for error: AvatarProfileStoreError
    ) -> ProfileLoadFailure {
        switch error {
        case .unknownProfile:
            .unknownProfile
        case .corruptStore, .invalidDisplayName, .profileLimit,
             .motionLimit, .unknownMotion, .motionQuarantined:
            .corruptStore
        case .persistenceFailed:
            .persistenceFailed
        case .bookmarkCreationFailed, .bookmarkResolutionFailed,
             .securityScopeDenied:
            .modelUnavailable
        case .assetRejected, .resourceLimit, .motionRejected:
            .modelRejected
        case .quarantined:
            .modelQuarantined
        case .cancelled:
            .persistenceFailed
        }
    }

    private final class PendingProfileLoad {
        let id: UInt64
        let sessionID: UUID
        let lease: ProfileMaterializationLease

        init(
            id: UInt64,
            sessionID: UUID,
            lease: ProfileMaterializationLease
        ) {
            self.id = id
            self.sessionID = sessionID
            self.lease = lease
        }
    }

    private struct AcceptedProfilePersistence {
        let id: UInt64
        let sessionID: UUID
        let profileID: UUID
        let store: AvatarProfileStore
        let owner: MotionPersistenceOwner
        var rendererSuccessEnqueued = false
        var rendererFailureEnqueued = false
    }

    private enum RendererPersistenceEvent: Sendable {
        case success
        case failure
    }

    private enum MotionPersistenceEvent: Sendable {
        case success(motionID: UUID)
        case failure(motionID: UUID, code: MotionFailureCode)
    }
}
