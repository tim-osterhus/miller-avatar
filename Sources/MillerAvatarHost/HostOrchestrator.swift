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
    case profileModelLoaded(ProfileModelLoadedPayload)
    case firstFrame(
        profileRevision: UInt64,
        modelToken: UUID,
        counters: HostCounters
    )
    case motionStatus(MotionStatusPayload)
    case motionActive(MotionActivePayload)
    case suspended(visibility: PresentationVisibility, counters: HostCounters)
    case resumed(counters: HostCounters)
    case failed(FailureCode)
    case disposed
}

@MainActor
package protocol HostRendererDriving: AnyObject {
    func start(sessionID: UUID, receive: @escaping (UUID, HostObservation) -> Void)
    @discardableResult
    func install(_ profile: LoadedAvatarProfile) -> Bool
    func send(_ command: BridgeCommand)
    func dispose(reason: DisposalReason)
}

@MainActor
package protocol HostTestAssetLoading {
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
    public let profileRevision: UInt64?
    public let modelToken: UUID?
    public let motionStatuses: [AvatarMotionRole: MotionStatus]
}

@MainActor
package final class HostOrchestrator {
    package var onChange: ((HostSnapshot) -> Void)?
    package var onObservation: ((HostObservation) -> Void)?
    package var onMotionFailure: ((UUID, MotionFailureCode) -> Void)?
    package var onMotionSuccess: ((UUID) -> Void)?
    package private(set) var motionFailureCounts: [UUID: Int] = [:]
    package private(set) var quarantinedMotionIDs: Set<UUID> = []

    package private(set) var snapshot: HostSnapshot
    private let driver: any HostRendererDriving
    private let now: () -> TimeInterval
    private var deadline: Deadline?
    private var activeAssetToken: UUID?
    private var activeProfilePayload: LoadProfilePayload?
    private var activeMotionIDs: [UUID: UUID] = [:]
    private var unavailableMotionTokens: Set<UUID> = []
    private var hasProfileModelLoaded = false
    private var motionStatuses: [AvatarMotionRole: MotionStatus] = [:]
    private var accountedMotionFailures: Set<MotionAccountingKey> = []
    private var accountedMotionSuccesses: Set<MotionAccountingKey> = []
    private var consecutiveFailures = 0
    private var projectionState = ProjectionState()
    private var visibilityState = VisibilityCoordinatorState(
        sessionID: nil,
        lifecycle: .absent
    )
    private var mutationEpoch: UInt64 = 0

    package init(
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
            retryAvailable: false,
            profileRevision: nil,
            modelToken: nil,
            motionStatuses: [:]
        )
    }

    package func startRenderer() {
        let mutation = beginMutation()
        guard snapshot.lifecycle == .absent,
              consecutiveFailures == 0
        else {
            return
        }
        beginRenderer(preservingFailureCount: false, mutation: mutation)
    }

    package func retry() {
        let mutation = beginMutation()
        guard snapshot.retryAvailable else { return }
        beginRenderer(preservingFailureCount: true, mutation: mutation)
    }

    @discardableResult
    package func load(_ profile: LoadedAvatarProfile) -> AssetLoadDisposition {
        let mutation = beginMutation()
        guard snapshot.lifecycle == .rendererReady else { return .notReady }
        let sessionID = snapshot.sessionID
        let effectiveProfile = profileWithQuarantinedMotionsRejected(profile)
        guard driver.install(effectiveProfile) else { return .notReady }
        for binding in effectiveProfile.motionBindings.values {
            guard case .ready(let motionID, let motion) = binding else { continue }
            activeMotionIDs[motion.token] = motionID
        }
        guard isCurrentMutation(mutation),
              snapshot.lifecycle == .rendererReady,
              snapshot.sessionID == sessionID,
              beginAssetLoad(effectiveProfile.loadPayload)
        else {
            activeMotionIDs = [:]
            return .notReady
        }
        return .accepted
    }

    package func resetMotionQuarantine(motionID: UUID) {
        motionFailureCounts[motionID] = 0
        quarantinedMotionIDs.remove(motionID)
        accountedMotionFailures = accountedMotionFailures.filter { $0.motionID != motionID }
        accountedMotionSuccesses = accountedMotionSuccesses.filter { $0.motionID != motionID }
    }

    @discardableResult
    package func load(assetToken: UUID, bytes: Data = Data()) -> AssetLoadDisposition {
        let mutation = beginMutation()
        guard snapshot.lifecycle == .rendererReady,
              let testDriver = driver as? any HostTestAssetLoading
        else { return .notReady }
        let sessionID = snapshot.sessionID
        testDriver.installForTesting(assetToken: assetToken, bytes: bytes)
        activeMotionIDs = [:]
        unavailableMotionTokens = []
        var bindings: [AvatarMotionRole: MotionBindingPayload] = [:]
        for role in AvatarMotionRole.allCases { bindings[role] = .missing }
        guard isCurrentMutation(mutation),
              snapshot.lifecycle == .rendererReady,
              snapshot.sessionID == sessionID,
              beginAssetLoad(LoadProfilePayload(
            profileRevision: 1,
            modelToken: assetToken,
            motionBindings: bindings
        ))
        else { return .notReady }
        return .accepted
    }

    @discardableResult
    private func beginAssetLoad(_ profile: LoadProfilePayload) -> Bool {
        let mutation = mutationEpoch
        let sessionID = snapshot.sessionID
        activeAssetToken = profile.modelToken
        activeProfilePayload = profile
        hasProfileModelLoaded = false
        motionStatuses = [:]
        unavailableMotionTokens = []
        guard applyLifecycle(.beginAssetLoad),
              isCurrentMutation(mutation),
              snapshot.sessionID == sessionID,
              snapshot.lifecycle == .loadingAsset
        else { return false }
        update(
            admission: .admitted,
            profileRevision: .set(profile.profileRevision),
            modelToken: .set(profile.modelToken),
            motionStatuses: [:]
        )
        guard isCurrentMutation(mutation),
              snapshot.sessionID == sessionID,
              snapshot.lifecycle == .loadingAsset
        else { return false }
        driver.send(.loadProfile(profile))
        guard isCurrentMutation(mutation),
              snapshot.sessionID == sessionID,
              snapshot.lifecycle == .loadingAsset
        else { return false }
        deadline = .init(kind: .load, instant: now() + 15)
        return true
    }

    package func rejectAsset(_ code: FailureCode) {
        _ = beginMutation()
        update(admission: .rejected(code), lastFailure: .set(code))
    }

    package func setReducedMotion(_ enabled: Bool) {
        let mutation = beginMutation()
        let sessionID = snapshot.sessionID
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .setReducedMotion(enabled)
        )
        projectionState = result.state
        update(reducedMotion: result.state.reducedMotion)
        guard isCurrentMutation(mutation), snapshot.sessionID == sessionID else { return }
        execute(result.effects)
    }

    package func project(_ payload: ProjectPhasePayload) {
        let mutation = beginMutation()
        let sessionID = snapshot.sessionID
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .project(payload)
        )
        projectionState = result.state
        update()
        guard isCurrentMutation(mutation), snapshot.sessionID == sessionID else { return }
        execute(result.effects)
    }

    package func setMouth(_ payload: SetMouthPayload) {
        let mutation = beginMutation()
        let sessionID = snapshot.sessionID
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .mouth(payload)
        )
        projectionState = result.state
        update()
        guard isCurrentMutation(mutation), snapshot.sessionID == sessionID else { return }
        execute(result.effects)
    }

    package func reset(generationID: UUID?, reason: ResetReason) {
        let mutation = beginMutation()
        let sessionID = snapshot.sessionID
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .reset(generationID: generationID, reason: reason)
        )
        projectionState = result.state
        update()
        guard isCurrentMutation(mutation), snapshot.sessionID == sessionID else { return }
        execute(result.effects)
    }

    package func simulateRendererFailure() {
        fail(.renderFailed)
    }

    package func setVisibility(_ visibility: EffectiveVisibility) {
        driveVisibility(.desired(visibility))
    }

    package func dispose(reason: DisposalReason = .operator) {
        let mutation = beginMutation()
        guard snapshot.sessionID != nil else { return }
        let sessionID = snapshot.sessionID
        deadline = nil
        let result = ProjectionReducer.reduce(state: projectionState, input: .dispose)
        projectionState = result.state
        execute(result.effects)
        guard isCurrentMutation(mutation), snapshot.sessionID == sessionID else { return }
        guard applyLifecycle(.dispose(reason)),
              isCurrentMutation(mutation),
              snapshot.sessionID == sessionID
        else { return }
        driver.dispose(reason: reason)
        guard isCurrentMutation(mutation), snapshot.sessionID == sessionID else { return }
        finishDisposal()
    }

    package func checkDeadlines() {
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

    private func beginRenderer(
        preservingFailureCount: Bool,
        mutation: UInt64
    ) {
        if snapshot.sessionID != nil {
            driver.dispose(reason: .retry)
            guard isCurrentMutation(mutation) else { return }
        }
        if !preservingFailureCount {
            consecutiveFailures = 0
        }
        let sessionID = UUID()
        activeAssetToken = nil
        activeProfilePayload = nil
        activeMotionIDs = [:]
        unavailableMotionTokens = []
        hasProfileModelLoaded = false
        motionStatuses = [:]
        projectionState = ProjectionState(reducedMotion: snapshot.reducedMotion)
        applyLifecycleFromAbsent(.startRenderer)
        guard isCurrentMutation(mutation),
              snapshot.lifecycle == .startingRenderer
        else { return }
        update(
            sessionID: .set(sessionID),
            admission: HostAdmissionStatus.none,
            lastFailure: .set(nil),
            retryAvailable: false,
            profileRevision: .set(nil),
            modelToken: .set(nil),
            motionStatuses: [:]
        )
        guard isCurrentMutation(mutation),
              snapshot.sessionID == sessionID,
              snapshot.lifecycle == .startingRenderer
        else { return }
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
        let mutation = beginMutation()
        onObservation?(observation)
        guard isCurrentMutation(mutation),
              sessionID == snapshot.sessionID
        else { return }
        switch observation {
        case .wrapperReady:
            guard snapshot.lifecycle == .startingRenderer,
                  deadline?.kind == .wrapper
            else { return }
            driver.send(.configure(reducedMotion: snapshot.reducedMotion))
            guard isCurrentMutation(mutation),
                  sessionID == snapshot.sessionID,
                  snapshot.lifecycle == .startingRenderer
            else { return }
            deadline = .init(kind: .renderer, instant: now() + 5)
        case .rendererReady:
            guard snapshot.lifecycle == .startingRenderer else { return }
            deadline = nil
            guard applyLifecycle(.rendererReady),
                  isCurrentMutation(mutation),
                  sessionID == snapshot.sessionID
            else { return }
        case .profileModelLoaded(let payload):
            guard snapshot.lifecycle == .loadingAsset,
                  isCurrentProfileIdentity(
                      profileRevision: payload.profileRevision,
                      modelToken: payload.modelToken
                  )
            else { return }
            hasProfileModelLoaded = true
        case .firstFrame(
            profileRevision: let profileRevision,
            modelToken: let modelToken,
            counters: let counters
        ):
            guard snapshot.lifecycle == .loadingAsset,
                  hasProfileModelLoaded,
                  isCurrentProfileIdentity(
                      profileRevision: profileRevision,
                      modelToken: modelToken
                  )
            else { return }
            deadline = nil
            consecutiveFailures = 0
            guard applyLifecycle(.firstFrame),
                  isCurrentMutation(mutation),
                  sessionID == snapshot.sessionID
            else { return }
            update(counters: counters, retryAvailable: false)
        case .motionStatus(let payload):
            guard isCurrentMotionIdentity(payload),
                  snapshot.lifecycle == .loadingAsset
                      || snapshot.lifecycle == .live
                      || snapshot.lifecycle == .liveSuspended
            else { return }
            motionStatuses[payload.role] = payload.status
            if let motionToken = payload.motionToken {
                switch payload.status {
                case .loadFailed, .timedOut, .runtimeFailed:
                    unavailableMotionTokens.insert(motionToken)
                case .ready:
                    unavailableMotionTokens.remove(motionToken)
                case .missing, .rejected:
                    break
                }
            }
            update(motionStatuses: motionStatuses)
            accountMotionStatus(payload, sessionID: sessionID)
        case .motionActive(let payload):
            guard isCurrentMotionIdentity(payload),
                  snapshot.lifecycle == .loadingAsset
                      || snapshot.lifecycle == .live
                      || snapshot.lifecycle == .liveSuspended
            else { return }
        case .suspended(let visibility, let counters):
            driveVisibility(.observed(
                sessionID: sessionID,
                visibility: effective(visibility)
            ))
            guard isCurrentMutation(mutation),
                  sessionID == snapshot.sessionID
            else { return }
            let result = ProjectionReducer.reduce(
                state: projectionState,
                input: .suspend
            )
            projectionState = result.state
            update(counters: counters)
            guard isCurrentMutation(mutation),
                  sessionID == snapshot.sessionID
            else { return }
            execute(result.effects)
        case .resumed(let counters):
            driveVisibility(.observed(sessionID: sessionID, visibility: .visible))
            guard isCurrentMutation(mutation),
                  sessionID == snapshot.sessionID
            else { return }
            let result = ProjectionReducer.reduce(
                state: projectionState,
                input: .resume
            )
            projectionState = result.state
            update(counters: counters)
            guard isCurrentMutation(mutation),
                  sessionID == snapshot.sessionID
            else { return }
            execute(result.effects)
        case .failed(let code):
            fail(code)
        case .disposed:
            finishDisposal()
        }
    }

    private func fail(_ code: FailureCode) {
        let mutation = beginMutation()
        guard snapshot.sessionID != nil else { return }
        let sessionID = snapshot.sessionID
        deadline = nil
        consecutiveFailures += 1
        let result = ProjectionReducer.reduce(
            state: projectionState,
            input: .rendererFailed
        )
        projectionState = result.state
        execute(result.effects)
        guard isCurrentMutation(mutation), snapshot.sessionID == sessionID else { return }
        guard applyLifecycle(.fail(code)),
              isCurrentMutation(mutation),
              snapshot.sessionID == sessionID
        else { return }
        driver.dispose(reason: .failure)
        guard isCurrentMutation(mutation), snapshot.sessionID == sessionID else { return }
        activeAssetToken = nil
        activeProfilePayload = nil
        activeMotionIDs = [:]
        unavailableMotionTokens = []
        hasProfileModelLoaded = false
        motionStatuses = [:]
        update(
            sessionID: .set(nil),
            lastFailure: .set(code),
            retryAvailable: consecutiveFailures == 1,
            profileRevision: .set(nil),
            modelToken: .set(nil),
            motionStatuses: [:]
        )
    }

    private func finishDisposal() {
        let mutation = mutationEpoch
        deadline = nil
        activeAssetToken = nil
        activeProfilePayload = nil
        activeMotionIDs = [:]
        unavailableMotionTokens = []
        hasProfileModelLoaded = false
        motionStatuses = [:]
        if snapshot.lifecycle != .disposing {
            guard applyLifecycle(.dispose(.operator)),
                  isCurrentMutation(mutation)
            else { return }
        }
        guard applyLifecycle(.disposalFinished),
              isCurrentMutation(mutation),
              snapshot.lifecycle == .absent
        else { return }
        update(
            sessionID: .set(nil),
            profileRevision: .set(nil),
            modelToken: .set(nil),
            motionStatuses: [:]
        )
    }

    private func applyLifecycleFromAbsent(_ input: LifecycleInput) {
        let result = LifecycleReducer.reduce(state: .absent, input: input)
        update(lifecycle: result.state)
    }

    @discardableResult
    private func applyLifecycle(_ input: LifecycleInput) -> Bool {
        let mutation = mutationEpoch
        let sessionID = snapshot.sessionID
        let lifecycle = LifecycleReducer.reduce(state: snapshot.lifecycle, input: input).state
        let result = VisibilityCoordinator.reduce(
            state: visibilityState,
            input: .lifecycle(lifecycle)
        )
        visibilityState = result.state
        update(
            lifecycle: result.state.lifecycle,
            visibility: result.state.desired
        )
        return executeVisibilityEffects(
            result.effects,
            mutation: mutation,
            sessionID: sessionID
        )
    }

    private func driveVisibility(_ input: VisibilityInput) {
        let mutation = mutationEpoch
        let sessionID = snapshot.sessionID
        let result = VisibilityCoordinator.reduce(state: visibilityState, input: input)
        visibilityState = result.state
        update(lifecycle: result.state.lifecycle, visibility: result.state.desired)
        _ = executeVisibilityEffects(
            result.effects,
            mutation: mutation,
            sessionID: sessionID
        )
    }

    @discardableResult
    private func executeVisibilityEffects(
        _ effects: [VisibilityEffect],
        mutation: UInt64,
        sessionID: UUID?
    ) -> Bool {
        guard isCurrentMutation(mutation),
              snapshot.sessionID == sessionID
        else { return false }
        for effect in effects {
            guard isCurrentMutation(mutation),
                  snapshot.sessionID == sessionID
            else { return false }
            switch effect {
            case .sendVisibility(_, let visibility):
                driver.send(.setVisibility(presentation(visibility)))
            case .requestDisposal(_, let reason):
                dispose(reason: reason)
                return false
            }
        }
        return true
    }

    private func execute(_ effects: [ProjectionEffect]) {
        let mutation = mutationEpoch
        let sessionID = snapshot.sessionID
        guard isBridgeReady,
              isCurrentMutation(mutation)
        else { return }
        for effect in effects {
            guard isCurrentMutation(mutation),
                  snapshot.sessionID == sessionID,
                  isBridgeReady
            else { return }
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
        retryAvailable: Bool? = nil,
        profileRevision: OptionalUpdate<UInt64> = .unchanged,
        modelToken: OptionalUpdate<UUID> = .unchanged,
        motionStatuses: [AvatarMotionRole: MotionStatus]? = nil
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
            retryAvailable: retryAvailable ?? snapshot.retryAvailable,
            profileRevision: profileRevision.value(or: snapshot.profileRevision),
            modelToken: modelToken.value(or: snapshot.modelToken),
            motionStatuses: motionStatuses ?? snapshot.motionStatuses
        )
        onChange?(snapshot)
    }

    private func beginMutation() -> UInt64 {
        mutationEpoch &+= 1
        return mutationEpoch
    }

    private func isCurrentMutation(_ mutation: UInt64) -> Bool {
        mutationEpoch == mutation
    }

    private func isCurrentProfileIdentity(
        profileRevision: UInt64,
        modelToken: UUID
    ) -> Bool {
        guard let activeProfilePayload else { return false }
        return activeProfilePayload.profileRevision == profileRevision
            && activeProfilePayload.modelToken == modelToken
    }

    private func isCurrentMotionIdentity(_ payload: MotionStatusPayload) -> Bool {
        guard isCurrentProfileIdentity(
            profileRevision: payload.profileRevision,
            modelToken: payload.modelToken
        ) else {
            return false
        }
        guard let profile = activeProfilePayload,
              let binding = profile.motionBindings[payload.role]
        else { return false }
        switch binding.status {
        case .ready:
            guard let token = binding.token else { return false }
            return payload.motionToken == token
                && (payload.status == .ready
                    || payload.status == .loadFailed
                    || payload.status == .timedOut
                    || payload.status == .runtimeFailed)
        case .missing:
            return payload.motionToken == nil && payload.status == .missing
        case .rejected:
            return payload.motionToken == nil && payload.status == .rejected
        }
    }

    private func isCurrentMotionIdentity(_ payload: MotionActivePayload) -> Bool {
        guard isCurrentProfileIdentity(
            profileRevision: payload.profileRevision,
            modelToken: payload.modelToken
        ) else {
            return false
        }
        switch payload.mode {
        case .rest:
            return payload.role == nil && payload.motionToken == nil
        case .loop, .oneShot:
            guard let role = payload.role,
                  let token = payload.motionToken,
                  let profile = activeProfilePayload,
                  let binding = profile.motionBindings[role]
            else { return false }
            let validRole = payload.mode == .loop
                ? role.isSteady
                : (role == .success || role == .failure)
            return validRole
                && binding.status == .ready
                && binding.token == token
                && !unavailableMotionTokens.contains(token)
        }
    }

    private func accountMotionStatus(
        _ payload: MotionStatusPayload,
        sessionID: UUID
    ) {
        guard let motionToken = payload.motionToken else { return }
        let motionID = activeMotionIDs[motionToken] ?? motionToken
        let key = MotionAccountingKey(sessionID: sessionID, motionID: motionID)
        switch payload.status {
        case .ready:
            guard accountedMotionSuccesses.insert(key).inserted else { return }
            let hadFailures = (motionFailureCounts[motionID] ?? 0) > 0
                || quarantinedMotionIDs.contains(motionID)
            motionFailureCounts[motionID] = 0
            quarantinedMotionIDs.remove(motionID)
            if hadFailures { onMotionSuccess?(motionID) }
        case .loadFailed, .timedOut, .runtimeFailed:
            guard accountedMotionFailures.insert(key).inserted else { return }
            let next = min(3, (motionFailureCounts[motionID] ?? 0) + 1)
            motionFailureCounts[motionID] = next
            if next == 3 { quarantinedMotionIDs.insert(motionID) }
            if let code = payload.motionCode {
                onMotionFailure?(motionID, code)
            }
        case .missing, .rejected:
            break
        }
    }

    private func profileWithQuarantinedMotionsRejected(
        _ profile: LoadedAvatarProfile
    ) -> LoadedAvatarProfile {
        let bindings = profile.motionBindings.mapValues { binding in
            guard case .ready(let motionID, _) = binding,
                  quarantinedMotionIDs.contains(motionID)
            else { return binding }
            return .rejected(motionID: motionID, reason: .quarantined)
        }
        return LoadedAvatarProfile(
            profileRevision: profile.profileRevision,
            model: profile.model,
            motionBindings: bindings
        )
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

    private struct MotionAccountingKey: Hashable {
        let sessionID: UUID
        let motionID: UUID
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
