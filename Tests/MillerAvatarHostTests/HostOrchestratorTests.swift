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

        host.setPhase(.speaking)
        host.setMouthScalar(0.75)
        host.resetPresentation()

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
}

@MainActor
private final class RecordingHostDriver: HostRendererDriving {
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

    func install(assetToken: UUID, bytes: Data) {
        installedTokens.append(assetToken)
    }

    func dispose(reason: DisposalReason) {
        disposals.append(reason)
    }

    func observe(_ sessionID: UUID, _ observation: HostObservation) {
        receive?(sessionID, observation)
    }
}
