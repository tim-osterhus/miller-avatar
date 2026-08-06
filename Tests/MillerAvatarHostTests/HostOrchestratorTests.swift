import Foundation
import Testing
import MillerAvatarCore
@testable import MillerAvatarHost

@MainActor
@Suite struct HostOrchestratorTests {
    @Test func startupKeepsFallbackUntilAValidFirstFrame() {
        let driver = RecordingHostDriver()
        let now = 0.0
        let host = HostOrchestrator(driver: driver, now: { now })

        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        #expect(host.snapshot.lifecycle == .startingRenderer)
        #expect(host.snapshot.fallbackVisible)
        driver.observe(session, .wrapperReady)
        #expect(driver.commands == [.configure(reducedMotion: false)])
        driver.observe(session, .rendererReady)
        #expect(host.snapshot.lifecycle == .rendererReady)
        let assetToken = UUID()
        host.load(assetToken: assetToken)
        #expect(driver.installedTokens == [assetToken])
        #expect(host.snapshot.lifecycle == .loadingAsset)
        #expect(host.snapshot.fallbackVisible)
        driver.observe(session, .firstFrame(assetToken: assetToken, counters: .zero))
        #expect(host.snapshot.lifecycle == .live)
        #expect(!host.snapshot.fallbackVisible)
    }

    @Test func startupAndLoadDeadlinesFailClosed() {
        let driver = RecordingHostDriver()
        var now = 0.0
        let host = HostOrchestrator(driver: driver, now: { now })

        host.startRenderer()
        now = 5.01
        host.checkDeadlines()
        #expect(host.snapshot.lifecycle == .failed(.wrapperTimeout))
        #expect(host.snapshot.fallbackVisible)

        host.retry()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        host.load(assetToken: UUID())
        now = 20.02
        host.checkDeadlines()
        #expect(host.snapshot.lifecycle == .failed(.assetLoadTimeout))
        #expect(host.snapshot.fallbackVisible)
    }

    @Test func oneExplicitRetryIsAllowedAndThereIsNoAutomaticRestart() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)

        host.startRenderer()
        let first = try! #require(host.snapshot.sessionID)
        driver.observe(first, .failed(.rendererUnavailable))
        #expect(driver.startedSessions.count == 1)
        #expect(host.snapshot.retryAvailable)
        host.retry()
        let second = try! #require(host.snapshot.sessionID)
        #expect(second != first)
        #expect(!host.snapshot.retryAvailable)
        host.retry()
        #expect(driver.startedSessions.count == 2)
        driver.observe(second, .failed(.rendererUnavailable))
        #expect(driver.startedSessions.count == 2)
        #expect(!host.snapshot.retryAvailable)
        host.retry()
        #expect(driver.startedSessions.count == 2)
    }

    @Test func initialStartCannotResetAnExhaustedRetryBudget() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)

        host.startRenderer()
        let first = try! #require(host.snapshot.sessionID)
        driver.observe(first, .failed(.rendererUnavailable))
        host.retry()
        let second = try! #require(host.snapshot.sessionID)
        driver.observe(second, .failed(.rendererUnavailable))

        #expect(!host.snapshot.retryAvailable)
        host.startRenderer()
        #expect(driver.startedSessions.count == 2)
    }

    @Test func staleCallbacksCannotChangeAReplacementSession() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let stale = try! #require(host.snapshot.sessionID)
        host.dispose()
        host.startRenderer()
        let current = try! #require(host.snapshot.sessionID)

        driver.observe(stale, .wrapperReady)

        #expect(host.snapshot.sessionID == current)
        #expect(driver.commands.isEmpty)
    }

    @Test func sessionValidatedObservationsForwardBeforeLifecycleFiltering() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        var observations: [HostObservation] = []
        host.onObservation = { observations.append($0) }

        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(UUID(), .wrapperReady)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .wrapperReady)

        #expect(observations == [.wrapperReady, .wrapperReady])
    }

    @Test func reducedMotionAndVisibilityFlowThroughPureReducerCommands() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        let assetToken = UUID()
        host.load(assetToken: assetToken)
        driver.observe(session, .firstFrame(assetToken: assetToken, counters: .zero))

        host.setReducedMotion(true)
        host.setVisibility(.hidden)

        #expect(driver.commands.contains(.setPolicy(reducedMotion: true)))
        #expect(driver.commands.contains(.setVisibility(.hidden)))
        driver.observe(session, .suspended(visibility: .hidden, counters: .zero))
        #expect(host.snapshot.lifecycle == .liveSuspended)
    }

    @Test func diagnosticPhaseMouthResetAndFailureUseClosedCommands() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        let assetToken = UUID()
        host.load(assetToken: assetToken)
        driver.observe(session, .firstFrame(assetToken: assetToken, counters: .zero))

        let generation = UUID(uuidString: "33333333-3333-4333-8333-333333333333")!
        let playback = UUID(uuidString: "44444444-4444-4444-8444-444444444444")!
        host.project(.init(
            projectionSequence: 1,
            generationID: generation,
            phase: .speaking,
            playbackID: playback
        ))
        host.setMouth(.init(
            generationID: generation,
            playbackID: playback,
            cueIndex: 1,
            playbackOffsetMilliseconds: 0,
            scalar: 0.75
        ))
        host.reset(generationID: nil, reason: .operator)

        #expect(driver.commands.contains { command in
            if case .projectPhase(_, let generation, .speaking, let playback) = command {
                generation != nil && playback != nil
            } else {
                false
            }
        })
        #expect(driver.commands.contains { command in
            if case .setMouth(_, _, 1, 0, 0.75) = command { true } else { false }
        })
        #expect(driver.commands.contains(.reset(generationID: nil, reason: .operator)))
        host.simulateRendererFailure()
        #expect(host.snapshot.lifecycle == .failed(.renderFailed))
        #expect(host.snapshot.retryAvailable)
    }

    @Test func callerOwnedProjectionReconcilesAuthoritativeStateAfterResume() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        host.load(assetToken: UUID())
        let token = try! #require(driver.installedTokens.last)
        driver.observe(session, .firstFrame(assetToken: token, counters: .zero))

        let generation = UUID(uuidString: "33333333-3333-4333-8333-333333333333")!
        let playback = UUID(uuidString: "44444444-4444-4444-8444-444444444444")!
        host.project(.init(
            projectionSequence: 1,
            generationID: generation,
            phase: .speaking,
            playbackID: playback
        ))
        driver.observe(session, .suspended(visibility: .occluded, counters: .zero))
        host.reset(generationID: generation, reason: .cancelled)
        host.setReducedMotion(true)
        driver.observe(session, .resumed(counters: .zero))

        #expect(driver.commands.last == .reconcilePresentation(.init(
            lastProjectionSequence: 1,
            generationID: nil,
            phase: .idle,
            playbackID: nil,
            reducedMotion: true
        )))
        #expect(host.snapshot.phase == .idle)
    }

    @Test func suspendedCallerOwnedProjectionAndCueReconcileWithoutReplayingMouth() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        host.load(assetToken: UUID())
        let token = try! #require(driver.installedTokens.last)
        driver.observe(session, .firstFrame(assetToken: token, counters: .zero))

        let generation = UUID(uuidString: "33333333-3333-4333-8333-333333333333")!
        let playback = UUID(uuidString: "44444444-4444-4444-8444-444444444444")!
        host.project(.init(
            projectionSequence: 1,
            generationID: generation,
            phase: .speaking,
            playbackID: playback
        ))
        driver.observe(session, .suspended(visibility: .occluded, counters: .zero))
        host.project(.init(
            projectionSequence: 2,
            generationID: generation,
            phase: .speaking,
            playbackID: playback
        ))
        host.setMouth(.init(
            generationID: generation,
            playbackID: playback,
            cueIndex: 4,
            playbackOffsetMilliseconds: 400,
            scalar: 0.8
        ))
        driver.observe(session, .resumed(counters: .zero))

        #expect(driver.commands.last == .reconcilePresentation(.init(
            lastProjectionSequence: 2,
            generationID: generation,
            phase: .speaking,
            playbackID: playback,
            reducedMotion: false
        )))
        #expect(driver.commands.filter {
            if case .setMouth = $0 { return true }
            return false
        }.isEmpty)
    }

    @Test func unchangedPolicyAndSemanticEffectsDoNotEmitDuplicateCommands() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        host.load(assetToken: UUID())
        let token = try! #require(driver.installedTokens.last)
        driver.observe(session, .firstFrame(assetToken: token, counters: .zero))

        host.setReducedMotion(false)
        host.project(.init(
            projectionSequence: 1,
            generationID: nil,
            phase: .idle,
            playbackID: nil
        ))
        host.reset(generationID: nil, reason: .operator)

        #expect(driver.commands.filter {
            if case .setPolicy = $0 { return true }
            return false
        }.isEmpty)
        #expect(driver.commands.filter {
            if case .reset = $0 { return true }
            return false
        }.count == 1)
    }
}

@MainActor
private final class RecordingHostDriver: HostRendererDriving, HostTestAssetLoading {
    private var receive: ((UUID, HostObservation) -> Void)?
    private(set) var startedSessions: [UUID] = []
    private(set) var commands: [BridgeCommand] = []
    private(set) var disposals: [DisposalReason] = []
    private(set) var installedTokens: [UUID] = []

    func start(sessionID: UUID, receive: @escaping (UUID, HostObservation) -> Void) {
        startedSessions.append(sessionID)
        self.receive = receive
    }

    func send(_ command: BridgeCommand) {
        commands.append(command)
    }

    func install(_ asset: AdmittedAsset) {
        installedTokens.append(asset.token)
    }

    func installForTesting(assetToken: UUID, bytes: Data) {
        installedTokens.append(assetToken)
    }

    func dispose(reason: DisposalReason) {
        disposals.append(reason)
    }

    func observe(_ sessionID: UUID, _ observation: HostObservation) {
        receive?(sessionID, observation)
    }
}
