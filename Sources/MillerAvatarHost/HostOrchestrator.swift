import Foundation
import MillerAvatarCore

public struct HostCounters: Equatable, Sendable {
    public let frames: UInt64
    public let updates: UInt64
    public let renders: UInt64

    public init(frames: UInt64, updates: UInt64, renders: UInt64) {
        self.frames = frames
        self.updates = updates
        self.renders = renders
    }

    public static let zero = Self(frames: 0, updates: 0, renders: 0)
}

public enum HostObservation: Equatable, Sendable {
    case wrapperReady
    case rendererReady
    case firstFrame(assetToken: UUID, counters: HostCounters)
    case suspended(visibility: PresentationVisibility, counters: HostCounters)
    case resumed(counters: HostCounters)
    case failed(FailureCode)
    case disposed
}

@MainActor
public protocol HostRendererDriving: AnyObject {
    func start(sessionID: UUID, receive: @escaping (UUID, HostObservation) -> Void)
    func install(_ asset: AdmittedAsset)
    func send(_ command: BridgeCommand)
    func dispose(reason: DisposalReason)
}

@MainActor
internal protocol HostTestAssetLoading {
    func installForTesting(assetToken: UUID, bytes: Data)
}

public enum HostAdmissionStatus: Equatable, Sendable {
    case none
    case admitted
    case rejected(FailureCode)
}

public enum AssetLoadDisposition: Equatable, Sendable {
    case accepted
    case notReady
}

public struct HostSnapshot: Equatable, Sendable {
    public let lifecycle: RendererSessionState
    public let fallbackVisible: Bool
    public let sessionID: UUID?
    public let admission: HostAdmissionStatus
    public let phase: PresentationPhase
    public let visibility: EffectiveVisibility
    public let lastFailure: FailureCode?
    public let counters: HostCounters
    public let reducedMotion: Bool
    public let retryAvailable: Bool
}

@MainActor
public final class HostOrchestrator {
    public var onChange: ((HostSnapshot) -> Void)?
    public var onObservation: ((HostObservation) -> Void)?

    public private(set) var snapshot: HostSnapshot
    private let driver: any HostRendererDriving
    private let now: () -> TimeInterval
    private var deadline: Deadline?
    private var activeAssetToken: UUID?
    private var consecutiveFailures = 0
    private var projectionState = ProjectionState()
    private var visibilityState = VisibilityCoordinatorState(
        sessionID: nil,
        lifecycle: .absent
    )

    public init(
        driver: any HostRendererDriving,
        now: @escaping () -> TimeInterval = { ProcessInfo.processInfo.systemUptime }
    ) {
        self.driver = driver
        self.now = now
        snapshot = HostSnapshot(
            lifecycle: .absent,
            fallbackVisible: true,
            sessionID: nil,
            admission: .none,
            phase: .idle,
            visibility: .visible,
            lastFailure: nil,
            counters: .zero,
            reducedMotion: false,
            retryAvailable: false
        )
    }

    public func startRenderer() {
        guard snapshot.lifecycle == .absent,
              consecutiveFailures == 0
        else {
            return
        }
        beginRenderer(preservingFailureCount: false)
    }

    public func retry() {
        guard snapshot.retryAvailable else { return }
        beginRenderer(preservingFailureCount: true)
    }

    @discardableResult
    public func load(_ asset: AdmittedAsset) -> AssetLoadDisposition {
        guard snapshot.lifecycle == .rendererReady else { return .notReady }
        driver.install(asset)
        beginAssetLoad(assetToken: asset.token)
        return .accepted
    }

    @discardableResult
    internal func load(assetToken: UUID, bytes: Data = Data()) -> AssetLoadDisposition {
        guard snapshot.lifecycle == .rendererReady,
              let testDriver = driver as? any HostTestAssetLoading
        else { return .notReady }
        testDriver.installForTesting(assetToken: assetToken, bytes: bytes)
        beginAssetLoad(assetToken: assetToken)
        return .accepted
    }

    private func beginAssetLoad(assetToken: UUID) {
        activeAssetToken = assetToken
        applyLifecycle(.beginAssetLoad)
        update(admission: .admitted)
        driver.send(.loadAsset(token: assetToken))
        deadline = .init(kind: .load, instant: now() + 15)
    }

    public func rejectAsset(_ code: FailureCode) {
        update(admission: .rejected(code), lastFailure: .set(code))
    }

    public func setReducedMotion(_ enabled: Bool) {
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .setReducedMotion(enabled)
        )
        projectionState = result.state
        update(reducedMotion: result.state.reducedMotion)
        execute(result.effects)
    }

    public func project(_ payload: ProjectPhasePayload) {
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .project(payload)
        )
        projectionState = result.state
        update()
        execute(result.effects)
    }

    public func setMouth(_ payload: SetMouthPayload) {
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .mouth(payload)
        )
        projectionState = result.state
        update()
        execute(result.effects)
    }

    public func reset(generationID: UUID?, reason: ResetReason) {
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .reset(generationID: generationID, reason: reason)
        )
        projectionState = result.state
        update()
        execute(result.effects)
    }

    public func simulateRendererFailure() {
        fail(.renderFailed)
    }

    public func setVisibility(_ visibility: EffectiveVisibility) {
        driveVisibility(.desired(visibility))
    }

    public func dispose(reason: DisposalReason = .operator) {
        guard snapshot.sessionID != nil else { return }
        deadline = nil
        let result = ProjectionReducer.reduce(state: projectionState, input: .dispose)
        projectionState = result.state
        execute(result.effects)
        applyLifecycle(.dispose(reason))
        driver.dispose(reason: reason)
        finishDisposal()
    }

    public func checkDeadlines() {
        guard let deadline, now() >= deadline.instant else { return }
        switch deadline.kind {
        case .wrapper:
            fail(.wrapperTimeout)
        case .renderer:
            fail(.rendererUnavailable)
        case .load:
            fail(.assetLoadTimeout)
        }
    }

    private func beginRenderer(preservingFailureCount: Bool) {
        if snapshot.sessionID != nil {
            driver.dispose(reason: .retry)
        }
        if !preservingFailureCount {
            consecutiveFailures = 0
        }
        let sessionID = UUID()
        activeAssetToken = nil
        projectionState = ProjectionState(reducedMotion: snapshot.reducedMotion)
        applyLifecycleFromAbsent(.startRenderer)
        update(
            sessionID: .set(sessionID),
            admission: HostAdmissionStatus.none,
            lastFailure: .set(nil),
            retryAvailable: false
        )
        visibilityState = VisibilityCoordinator.reduce(
            state: visibilityState,
            input: .replaceSession(sessionID: sessionID, lifecycle: .startingRenderer)
        ).state
        deadline = .init(kind: .wrapper, instant: now() + 5)
        driver.start(sessionID: sessionID) { [weak self] sessionID, observation in
            MainActor.assumeIsolated {
                self?.receive(sessionID: sessionID, observation: observation)
            }
        }
    }

    private func receive(sessionID: UUID, observation: HostObservation) {
        guard sessionID == snapshot.sessionID else { return }
        onObservation?(observation)
        switch observation {
        case .wrapperReady:
            guard snapshot.lifecycle == .startingRenderer,
                  deadline?.kind == .wrapper
            else { return }
            driver.send(.configure(reducedMotion: snapshot.reducedMotion))
            deadline = .init(kind: .renderer, instant: now() + 5)
        case .rendererReady:
            guard snapshot.lifecycle == .startingRenderer else { return }
            deadline = nil
            applyLifecycle(.rendererReady)
        case .firstFrame(let token, let counters):
            guard snapshot.lifecycle == .loadingAsset,
                  token == activeAssetToken
            else { return }
            deadline = nil
            consecutiveFailures = 0
            applyLifecycle(.firstFrame)
            update(counters: counters, retryAvailable: false)
        case .suspended(let visibility, let counters):
            driveVisibility(.observed(
                sessionID: sessionID,
                visibility: effective(visibility)
            ))
            let result = ProjectionReducer.reduce(
                state: projectionState,
                input: .suspend
            )
            projectionState = result.state
            update(counters: counters)
            execute(result.effects)
        case .resumed(let counters):
            driveVisibility(.observed(sessionID: sessionID, visibility: .visible))
            let result = ProjectionReducer.reduce(
                state: projectionState,
                input: .resume
            )
            projectionState = result.state
            update(counters: counters)
            execute(result.effects)
        case .failed(let code):
            fail(code)
        case .disposed:
            finishDisposal()
        }
    }

    private func fail(_ code: FailureCode) {
        guard snapshot.sessionID != nil else { return }
        deadline = nil
        consecutiveFailures += 1
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .rendererFailed
        )
        projectionState = result.state
        execute(result.effects)
        applyLifecycle(.fail(code))
        driver.dispose(reason: .failure)
        update(
            sessionID: .set(nil),
            lastFailure: .set(code),
            retryAvailable: consecutiveFailures == 1
        )
    }

    private func finishDisposal() {
        deadline = nil
        activeAssetToken = nil
        if snapshot.lifecycle != .disposing {
            applyLifecycle(.dispose(.operator))
        }
        applyLifecycle(.disposalFinished)
        update(sessionID: .set(nil))
    }

    private func applyLifecycleFromAbsent(_ input: LifecycleInput) {
        let result = LifecycleReducer.reduce(state: .absent, input: input)
        update(lifecycle: result.state)
    }

    private func applyLifecycle(_ input: LifecycleInput) {
        let result = LifecycleReducer.reduce(state: snapshot.lifecycle, input: input)
        update(lifecycle: result.state)
        visibilityState = VisibilityCoordinator.reduce(
            state: visibilityState,
            input: .lifecycle(result.state)
        ).state
    }

    private func driveVisibility(_ input: VisibilityInput) {
        let result = VisibilityCoordinator.reduce(state: visibilityState, input: input)
        visibilityState = result.state
        update(lifecycle: result.state.lifecycle, visibility: result.state.desired)
        for effect in result.effects {
            switch effect {
            case .sendVisibility(_, let visibility):
                driver.send(.setVisibility(presentation(visibility)))
            case .requestDisposal(_, let reason):
                dispose(reason: reason)
            }
        }
    }

    private func execute(_ effects: [ProjectionEffect]) {
        guard isBridgeReady else { return }
        for effect in effects {
            switch effect {
            case .applyProjection(let payload):
                driver.send(.projectPhase(
                    sequence: payload.projectionSequence,
                    generationID: payload.generationID,
                    phase: payload.phase,
                    playbackID: payload.playbackID
                ))
            case .applyMouth(let payload):
                driver.send(.setMouth(
                    generationID: payload.generationID,
                    playbackID: payload.playbackID,
                    cueIndex: payload.cueIndex,
                    playbackOffsetMilliseconds: payload.playbackOffsetMilliseconds,
                    scalar: payload.scalar
                ))
            case .setReducedMotion(let enabled):
                driver.send(.setPolicy(reducedMotion: enabled))
            case .reset(let generationID, let reason):
                driver.send(.reset(generationID: generationID, reason: reason))
            case .reconcile:
                driver.send(.reconcilePresentation(ReconcilePresentationPayload(
                    lastProjectionSequence: projectionState.lastProjectionSequence,
                    generationID: projectionState.generationID,
                    phase: projectionState.phase,
                    playbackID: projectionState.playbackID,
                    reducedMotion: projectionState.reducedMotion
                )))
            case .clearMouth, .stopContinuousMotion:
                break
            }
        }
    }

    private var isBridgeReady: Bool {
        switch snapshot.lifecycle {
        case .rendererReady, .loadingAsset, .live, .liveSuspended:
            true
        default:
            false
        }
    }

    private func update(
        lifecycle: RendererSessionState? = nil,
        sessionID: OptionalUpdate<UUID> = .unchanged,
        admission: HostAdmissionStatus? = nil,
        visibility: EffectiveVisibility? = nil,
        lastFailure: OptionalUpdate<FailureCode> = .unchanged,
        counters: HostCounters? = nil,
        reducedMotion: Bool? = nil,
        retryAvailable: Bool? = nil
    ) {
        let nextLifecycle = lifecycle ?? snapshot.lifecycle
        snapshot = HostSnapshot(
            lifecycle: nextLifecycle,
            fallbackVisible: nextLifecycle != .live && nextLifecycle != .liveSuspended,
            sessionID: sessionID.value(or: snapshot.sessionID),
            admission: admission ?? snapshot.admission,
            phase: projectionState.phase,
            visibility: visibility ?? snapshot.visibility,
            lastFailure: lastFailure.value(or: snapshot.lastFailure),
            counters: counters ?? snapshot.counters,
            reducedMotion: reducedMotion ?? snapshot.reducedMotion,
            retryAvailable: retryAvailable ?? snapshot.retryAvailable
        )
        onChange?(snapshot)
    }

    private func presentation(_ visibility: EffectiveVisibility) -> PresentationVisibility {
        switch visibility {
        case .visible: .visible
        case .occluded: .occluded
        case .hidden: .hidden
        }
    }

    private func effective(_ visibility: PresentationVisibility) -> EffectiveVisibility {
        switch visibility {
        case .visible: .visible
        case .occluded: .occluded
        case .hidden: .hidden
        }
    }

    private struct Deadline {
        enum Kind { case wrapper, renderer, load }
        let kind: Kind
        let instant: TimeInterval
    }

    private enum OptionalUpdate<Value> {
        case unchanged
        case set(Value?)

        func value(or current: Value?) -> Value? {
            switch self {
            case .unchanged: current
            case .set(let value): value
            }
        }
    }
}

public enum WindowControl: Hashable, Sendable {
    case startOrRetry
    case selectAsset
    case phase
    case mouth
    case reducedMotion
    case visibility
    case reset
    case failure
    case dispose
    case renderer
}

public enum WindowOpenAction: Equatable, Sendable {
    case revealExisting
    case createFallbackWindow
}

public enum WindowEvent: Equatable, Sendable {
    case rendererFailed
    case normal
}

public enum WindowPolicy {
    public static let fallbackIsInitiallyVisible = true
    public static let responderOrder: [WindowControl] = [
        .startOrRetry, .selectAsset, .phase, .mouth, .reducedMotion,
        .visibility, .reset, .failure, .dispose, .renderer,
    ]

    public static func action(hasWindow: Bool, hasSession: Bool) -> WindowOpenAction {
        hasWindow ? .revealExisting : .createFallbackWindow
    }

    public static func focusTarget(after event: WindowEvent) -> WindowControl? {
        event == .rendererFailed ? .startOrRetry : nil
    }

    public static func nextResponderIndex(
        after current: Int?,
        enabled: [Bool],
        backward: Bool
    ) -> Int? {
        guard !enabled.isEmpty else { return nil }
        let current = current.flatMap { enabled.indices.contains($0) ? $0 : nil }
        let direction = backward ? -1 : 1
        let start = current ?? (backward ? 0 : enabled.count - 1)
        for distance in 1...enabled.count {
            let index = (start + direction * distance + enabled.count) % enabled.count
            if enabled[index] { return index }
        }
        return nil
    }
}
