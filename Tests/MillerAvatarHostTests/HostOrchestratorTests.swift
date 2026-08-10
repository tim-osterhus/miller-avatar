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
        driver.observeFirstFrame(session, assetToken: assetToken)
        #expect(host.snapshot.lifecycle == .live)
        #expect(!host.snapshot.fallbackVisible)
    }

    @Test
    func preLiveOcclusionSendsItsFirstVisibilityCommandWhenTheModelBecomesLive() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)

        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        host.setVisibility(.occluded)
        driver.observe(session, .rendererReady)
        host.load(assetToken: UUID())
        driver.observeFirstFrame(session, assetToken: try! #require(driver.installedTokens.last))

        #expect(driver.commands.filter {
            if case .setVisibility(.occluded) = $0 { return true }
            return false
        }.count == 1)
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

    @Test
    func reentrantChangeDuringSessionPublicationCannotStartTheOldRenderer() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.onChange = { snapshot in
            guard snapshot.lifecycle == .startingRenderer,
                  snapshot.sessionID != nil
            else { return }
            host.dispose()
        }

        host.startRenderer()

        #expect(driver.startedSessions.isEmpty)
        #expect(host.snapshot.lifecycle == .absent)
    }

    @Test
    func reentrantObservationReplacementCannotReceiveTheOldObservationEffect() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let first = try! #require(host.snapshot.sessionID)
        var replacement: UUID?
        host.onObservation = { observation in
            guard observation == .wrapperReady else { return }
            host.dispose()
            host.startRenderer()
            replacement = host.snapshot.sessionID
        }

        driver.observe(first, .wrapperReady)

        #expect(replacement != nil)
        #expect(replacement != first)
        #expect(driver.commands.isEmpty)
    }

    @Test
    func motionFailureIsProfileLocalAndDoesNotFailTheHost() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        let modelToken = UUID()
        let motionToken = UUID()
        var bindings: [AvatarMotionRole: LoadedMotionBinding] = [:]
        bindings[.idle] = .ready(
            motionID: motionToken,
            motion: AdmittedMotion(
                token: motionToken,
                bytes: Data([1]),
                summary: MotionAdmissionSummary(
                    nodeCount: 1,
                    channelCount: 1,
                    keyframeScalarValues: 4,
                    durationMilliseconds: 1,
                    hasExpressionTracks: false,
                    hasLookAtTrack: false
                )
            )
        )
        let prepared = LoadedAvatarProfile(
            profileRevision: 1,
            model: AdmittedAsset(
                token: modelToken,
                bytes: Data(),
                summary: AssetAdmissionSummary(
                    nodeCount: 0,
                    meshCount: 0,
                    materialCount: 0,
                    imageCount: 0,
                    decodedImagePixels: 0,
                    accessorReferencedBytes: 0,
                    capabilities: AssetAdmissionCapabilities(
                        lookAt: false,
                        springBone: false,
                        mtoonMaterials: 0
                    )
                )
            ),
            motionBindings: bindings
        )
        #expect(host.load(prepared) == .accepted)
        let profile = prepared.loadPayload
        driver.observe(session, .profileModelLoaded(.init(
            profileRevision: profile.profileRevision,
            modelToken: profile.modelToken,
            capabilities: .init(
                aa: true,
                lookAt: false,
                springBone: false,
                mtoonMaterials: 0
            )
        )))
        driver.observe(session, .firstFrame(
            profileRevision: profile.profileRevision,
            modelToken: profile.modelToken,
            counters: .zero
        ))

        driver.observe(session, .motionStatus(.init(
            profileRevision: profile.profileRevision,
            modelToken: modelToken,
            motionToken: motionToken,
            role: .idle,
            status: .runtimeFailed,
            motionCode: .motionRuntimeFailed
        )))

        #expect(host.snapshot.lifecycle == .live)
        #expect(host.snapshot.lastFailure == nil)
        #expect(!host.snapshot.fallbackVisible)
        #expect(driver.disposals.isEmpty)
    }

    @Test
    func motionFailureAccountingIsOncePerSessionAndMotionAndReadyResetsOnlyThatMotion() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        let motionID = UUID()
        let modelToken = UUID()
        let prepared = preparedProfile(
            modelToken: modelToken,
            motionID: motionID,
            roles: [.idle, .thinking]
        )
        var failures: [(UUID, MotionFailureCode)] = []
        var successes: [UUID] = []
        host.onMotionFailure = { failures.append(($0, $1)) }
        host.onMotionSuccess = { successes.append($0) }

        host.startRenderer()
        var session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        #expect(host.load(prepared) == .accepted)
        driver.observeFirstFrame(session, assetToken: modelToken)
        let payload = prepared.loadPayload
        let failed = MotionStatusPayload(
            profileRevision: payload.profileRevision,
            modelToken: payload.modelToken,
            motionToken: motionID,
            role: .idle,
            status: .runtimeFailed,
            motionCode: .motionRuntimeFailed
        )
        driver.observe(session, .motionStatus(failed))
        driver.observe(session, .motionStatus(failed))
        driver.observe(session, .motionStatus(.init(
            profileRevision: payload.profileRevision,
            modelToken: payload.modelToken,
            motionToken: motionID,
            role: .thinking,
            status: .runtimeFailed,
            motionCode: .motionRuntimeFailed
        )))

        #expect(host.motionFailureCounts[motionID] == 1)
        #expect(failures.map(\.0) == [motionID])
        #expect(host.snapshot.motionStatuses[.idle] == .runtimeFailed)
        #expect(host.snapshot.motionStatuses[.thinking] == .runtimeFailed)
        #expect(!host.snapshot.fallbackVisible)

        let beforeStale = host.snapshot
        driver.observe(session, .motionStatus(.init(
            profileRevision: payload.profileRevision + 1,
            modelToken: payload.modelToken,
            motionToken: motionID,
            role: .idle,
            status: .runtimeFailed,
            motionCode: .motionRuntimeFailed
        )))
        driver.observe(session, .motionActive(.init(
            profileRevision: payload.profileRevision,
            modelToken: UUID(),
            motionToken: motionID,
            role: .idle,
            mode: .loop
        )))
        driver.observe(session, .motionActive(.init(
            profileRevision: payload.profileRevision,
            modelToken: payload.modelToken,
            motionToken: motionID,
            role: .idle,
            mode: .loop
        )))
        #expect(host.snapshot == beforeStale)

        driver.observe(session, .motionStatus(.init(
            profileRevision: payload.profileRevision,
            modelToken: payload.modelToken,
            motionToken: motionID,
            role: .idle,
            status: .ready,
            motionCode: nil
        )))
        driver.observe(session, .motionStatus(.init(
            profileRevision: payload.profileRevision,
            modelToken: payload.modelToken,
            motionToken: motionID,
            role: .thinking,
            status: .ready,
            motionCode: nil
        )))
        #expect(host.motionFailureCounts[motionID] == 0)
        #expect(successes == [motionID])

        for _ in 0..<3 {
            host.dispose()
            host.startRenderer()
            session = try! #require(host.snapshot.sessionID)
            driver.observe(session, .wrapperReady)
            driver.observe(session, .rendererReady)
            #expect(host.load(prepared) == .accepted)
            driver.observeFirstFrame(session, assetToken: modelToken)
            driver.observe(session, .motionStatus(failed))
        }

        #expect(host.motionFailureCounts[motionID] == 3)
        #expect(host.quarantinedMotionIDs == Set([motionID]))
        #expect(failures.count == 4)
        #expect(host.snapshot.lifecycle == .live)
        #expect(!host.snapshot.fallbackVisible)

        host.dispose()
        host.startRenderer()
        session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        #expect(host.load(prepared) == .accepted)
        guard case .loadProfile(let quarantinedProfile) = driver.commands.last else {
            Issue.record("expected a quarantined load profile")
            return
        }
        #expect(quarantinedProfile.motionBindings[.idle]?.status == .rejected)
        #expect(quarantinedProfile.motionBindings[.thinking]?.status == .rejected)

        host.dispose()
        host.resetMotionQuarantine(motionID: motionID)
        host.startRenderer()
        session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        #expect(host.load(prepared) == .accepted)
        guard case .loadProfile(let resetProfile) = driver.commands.last else {
            Issue.record("expected a reset load profile")
            return
        }
        #expect(resetProfile.motionBindings[.idle]?.status == .ready)
    }

    @Test
    func motionAccountingIsReleasedAtSessionTerminationWhilePersistentStateSurvives() {
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        let motionID = UUID()
        let modelToken = UUID()
        let prepared = preparedProfile(
            modelToken: modelToken,
            motionID: motionID,
            roles: [.idle, .thinking]
        )
        let payload = prepared.loadPayload
        var failures: [(UUID, MotionFailureCode)] = []
        host.onMotionFailure = { failures.append(($0, $1)) }

        func startAndLoad(retrying: Bool = false) -> UUID {
            if retrying {
                host.retry()
            } else {
                host.startRenderer()
            }
            let session = try! #require(host.snapshot.sessionID)
            driver.observe(session, .wrapperReady)
            driver.observe(session, .rendererReady)
            #expect(host.load(prepared) == .accepted)
            driver.observeFirstFrame(session, assetToken: modelToken)
            return session
        }

        func observeFailure(in session: UUID) {
            driver.observe(session, .motionStatus(.init(
                profileRevision: payload.profileRevision,
                modelToken: payload.modelToken,
                motionToken: motionID,
                role: .idle,
                status: .runtimeFailed,
                motionCode: .motionRuntimeFailed
            )))
        }

        let first = startAndLoad()
        driver.observe(first, .motionStatus(.init(
            profileRevision: payload.profileRevision,
            modelToken: payload.modelToken,
            motionToken: motionID,
            role: .idle,
            status: .ready,
            motionCode: nil
        )))
        observeFailure(in: first)
        observeFailure(in: first)
        #expect(host.motionAccountingEntryCounts.failures == 1)
        #expect(host.motionAccountingEntryCounts.successes == 1)
        #expect(host.motionFailureCounts[motionID] == 1)
        #expect(host.quarantinedMotionIDs.isEmpty)
        #expect(failures.count == 1)

        host.dispose()
        #expect(host.motionAccountingEntryCounts.failures == 0)
        #expect(host.motionAccountingEntryCounts.successes == 0)
        #expect(host.motionFailureCounts[motionID] == 1)
        #expect(host.quarantinedMotionIDs.isEmpty)

        let second = startAndLoad()
        observeFailure(in: second)
        observeFailure(in: second)
        #expect(host.motionAccountingEntryCounts.failures == 1)
        #expect(host.motionAccountingEntryCounts.successes == 0)
        #expect(host.motionFailureCounts[motionID] == 2)
        #expect(failures.count == 2)

        host.dispose()
        #expect(host.motionAccountingEntryCounts.failures == 0)
        #expect(host.motionAccountingEntryCounts.successes == 0)
        #expect(host.motionFailureCounts[motionID] == 2)
        #expect(host.quarantinedMotionIDs.isEmpty)

        let third = startAndLoad()
        observeFailure(in: third)
        #expect(host.motionAccountingEntryCounts.failures == 1)
        #expect(host.motionAccountingEntryCounts.successes == 0)
        #expect(host.motionFailureCounts[motionID] == 3)
        #expect(host.quarantinedMotionIDs == Set([motionID]))
        #expect(failures.count == 3)

        host.simulateRendererFailure()
        #expect(host.snapshot.lifecycle == .failed(.renderFailed))
        #expect(host.motionAccountingEntryCounts.failures == 0)
        #expect(host.motionAccountingEntryCounts.successes == 0)
        #expect(host.motionFailureCounts[motionID] == 3)
        #expect(host.quarantinedMotionIDs == Set([motionID]))

        let replacement = startAndLoad(retrying: true)
        #expect(replacement != third)
        guard case .loadProfile(let quarantinedProfile) = driver.commands.last else {
            Issue.record("expected a quarantined load profile")
            return
        }
        #expect(quarantinedProfile.motionBindings[.idle]?.status == .rejected)
        #expect(quarantinedProfile.motionBindings[.thinking]?.status == .rejected)
        #expect(host.motionAccountingEntryCounts.failures == 0)
        #expect(host.motionAccountingEntryCounts.successes == 0)
    }

    @Test
    func succeededProjectionRemainsLiveAndRevokesPlaybackIdentity() {
        guard let succeeded = PresentationPhase(rawValue: "succeeded") else {
            Issue.record("succeeded is missing from the closed presentation vocabulary")
            return
        }
        let driver = RecordingHostDriver()
        let host = HostOrchestrator(driver: driver)
        host.startRenderer()
        let session = try! #require(host.snapshot.sessionID)
        driver.observe(session, .wrapperReady)
        driver.observe(session, .rendererReady)
        let modelToken = UUID()
        #expect(host.load(assetToken: modelToken) == .accepted)
        driver.observeFirstFrame(session, assetToken: modelToken)
        let generation = UUID()
        host.project(ProjectPhasePayload(
            projectionSequence: 1,
            generationID: generation,
            phase: succeeded,
            playbackID: nil
        ))

        #expect(host.snapshot.lifecycle == .live)
        #expect(host.snapshot.phase == succeeded)
        #expect(host.snapshot.fallbackVisible == false)
        #expect(driver.commands.contains(.projectPhase(
            sequence: 1,
            generationID: generation,
            phase: succeeded,
            playbackID: nil
        )))
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
        driver.observeFirstFrame(session, assetToken: assetToken)

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
        driver.observeFirstFrame(session, assetToken: assetToken)

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
        driver.observeFirstFrame(session, assetToken: token)

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
        driver.observeFirstFrame(session, assetToken: token)

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
        driver.observeFirstFrame(session, assetToken: token)

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

    private func preparedProfile(
        modelToken: UUID,
        motionID: UUID,
        roles: [AvatarMotionRole]
    ) -> LoadedAvatarProfile {
        let motion = AdmittedMotion(
            token: motionID,
            bytes: Data([1]),
            summary: MotionAdmissionSummary(
                nodeCount: 1,
                channelCount: 1,
                keyframeScalarValues: 4,
                durationMilliseconds: 1,
                hasExpressionTracks: false,
                hasLookAtTrack: false
            )
        )
        var bindings: [AvatarMotionRole: LoadedMotionBinding] = [:]
        for role in roles {
            bindings[role] = .ready(motionID: motionID, motion: motion)
        }
        return LoadedAvatarProfile(
            profileRevision: 1,
            model: AdmittedAsset(
                token: modelToken,
                bytes: Data(),
                summary: AssetAdmissionSummary(
                    nodeCount: 0,
                    meshCount: 0,
                    materialCount: 0,
                    imageCount: 0,
                    decodedImagePixels: 0,
                    accessorReferencedBytes: 0,
                    capabilities: AssetAdmissionCapabilities(
                        lookAt: false,
                        springBone: false,
                        mtoonMaterials: 0
                    )
                )
            ),
            motionBindings: bindings
        )
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

    func install(_ profile: LoadedAvatarProfile) -> Bool {
        installedTokens.append(profile.model.token)
        return true
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

    func observeFirstFrame(_ sessionID: UUID, assetToken: UUID) {
        observe(sessionID, .profileModelLoaded(.init(
            profileRevision: 1,
            modelToken: assetToken,
            capabilities: .init(
                aa: true,
                lookAt: false,
                springBone: false,
                mtoonMaterials: 0
            )
        )))
        observe(
            sessionID,
            .firstFrame(
                profileRevision: 1,
                modelToken: assetToken,
                counters: .zero
            )
        )
    }
}
