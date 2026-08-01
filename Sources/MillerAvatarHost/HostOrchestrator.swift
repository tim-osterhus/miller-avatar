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
    func install(assetToken: UUID, bytes: Data)
    func send(_ command: BridgeCommand)
    func dispose(reason: DisposalReason)
}

public extension HostRendererDriving {
    func install(assetToken: UUID, bytes: Data) {}
}

public enum HostAdmissionStatus: Equatable, Sendable {
    case none
    case admitted
    case rejected(FailureCode)
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

    public private(set) var snapshot: HostSnapshot
    private let driver: any HostRendererDriving
    private let now: () -> TimeInterval
    private var deadline: Deadline?
    private var activeAssetToken: UUID?
    private var consecutiveFailures = 0
    private var projectionSequence: UInt64 = 0
    private var mouthCueIndex: UInt64 = 0
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

    public func load(_ asset: AdmittedAsset) {
        load(assetToken: asset.token, bytes: asset.bytes)
    }

    public func load(assetToken: UUID, bytes: Data = Data()) {
        guard snapshot.lifecycle == .rendererReady else { return }
        activeAssetToken = assetToken
        driver.install(assetToken: assetToken, bytes: bytes)
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
        if isBridgeReady {
            driver.send(.setPolicy(reducedMotion: result.state.reducedMotion))
        }
    }

    public func setPhase(_ phase: PresentationPhase) {
        guard isBridgeReady,
              projectionSequence < BridgeContract.maximumSafeInteger
        else { return }
        projectionSequence += 1
        let generationID: UUID?
        let playbackID: UUID?
        switch phase {
        case .idle, .listening, .transcribing:
            generationID = nil
            playbackID = nil
        case .speaking:
            generationID = UUID()
            playbackID = UUID()
        case .thinking, .responding, .stopped, .failed:
            generationID = UUID()
            playbackID = nil
        }
        projectionState.lastProjectionSequence = projectionSequence
        projectionState.generationID = generationID
        projectionState.phase = phase
        projectionState.playbackID = playbackID
        projectionState.lastCueIndex = nil
        projectionState.lastPlaybackOffsetMilliseconds = nil
        projectionState.mouthScalar = 0
        mouthCueIndex = 0
        driver.send(.projectPhase(
            sequence: projectionSequence,
            generationID: generationID,
            phase: phase,
            playbackID: playbackID
        ))
        update()
    }

    public func setMouthScalar(_ scalar: Double) {
        guard snapshot.lifecycle == .live,
              projectionState.phase == .speaking,
              !projectionState.reducedMotion,
              scalar.isFinite,
              (0...1).contains(scalar),
              let generationID = projectionState.generationID,
              let playbackID = projectionState.playbackID,
              mouthCueIndex < BridgeContract.maximumSafeInteger
        else { return }
        mouthCueIndex += 1
        projectionState.mouthScalar = scalar
        projectionState.lastCueIndex = mouthCueIndex
        projectionState.lastPlaybackOffsetMilliseconds = 0
        driver.send(.setMouth(
            generationID: generationID,
            playbackID: playbackID,
            cueIndex: mouthCueIndex,
            playbackOffsetMilliseconds: 0,
            scalar: scalar
        ))
        update()
    }

    public func resetPresentation() {
        guard isBridgeReady else { return }
        projectionState.generationID = nil
        projectionState.phase = .idle
        projectionState.playbackID = nil
        projectionState.lastCueIndex = nil
        projectionState.lastPlaybackOffsetMilliseconds = nil
        projectionState.mouthScalar = 0
        mouthCueIndex = 0
        driver.send(.reset(generationID: nil, reason: .operator))
        update()
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
        projectionSequence = 0
        mouthCueIndex = 0
        projectionState = ProjectionState(reducedMotion: snapshot.reducedMotion)
        applyLifecycleFromAbsent(.startRenderer)
        update(
            sessionID: .set(sessionID),
            admission: HostAdmissionStatus.none,
            lastFailure: .set(nil)
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
            projectionState = ProjectionReducer.reduce(
                state: projectionState,
                input: .suspend
            ).state
            update(counters: counters)
        case .resumed(let counters):
            driveVisibility(.observed(sessionID: sessionID, visibility: .visible))
            projectionState = ProjectionReducer.reduce(
                state: projectionState,
                input: .resume
            ).state
            update(counters: counters)
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
        projectionState = ProjectionReducer.reduce(
            state: projectionState,
            input: .rendererFailed
        ).state
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
}
