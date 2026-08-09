import AppKit
import Foundation
import MillerAvatarCore
@testable import MillerAvatarHost
import Testing
@testable import MillerAvatarApp
@preconcurrency import WebKit

@MainActor
@Suite
struct WindowControllerReplacementTests {
    @Test
    func replacementLoadsPreparedSelectionOnceAfterThatSurfaceIsReady() {
        let factory = SurfaceFactory()
        let controller = WindowController(surfaceFactory: factory.make)
        controller.showWindow(nil)
        let first = factory.records[0]
        first.surface.start()
        first.driver.emit(.wrapperReady)
        first.driver.emit(.rendererReady)
        first.surface.setVisibility(.occluded)
        first.surface.setReducedMotion(true)

        let selection = makeAsset()
        controller.prepareDiagnosticSelection(selection)

        #expect(factory.records.count == 2)
        #expect(factory.replacementCreationChecks == [true])
        let replacement = factory.records[1]
        #expect(controller.currentSurface === replacement.surface)
        #expect(first.driver.disposeReasons == [.operator])
        #expect(first.surface.view.superview == nil)
        #expect(replacement.surface.snapshot.visibility == .occluded)
        #expect(replacement.surface.snapshot.reducedMotion)
        #expect(replacement.driver.wasAttachedAtStart == true)
        #expect(replacement.driver.snapshotAtStart?.visibility == .occluded)
        #expect(replacement.driver.snapshotAtStart?.reducedMotion == true)
        #expect(replacement.timer.startCount == 1)
        #expect(replacement.driver.installedTokens.isEmpty)

        replacement.driver.emit(.wrapperReady)
        #expect(replacement.driver.installedTokens.isEmpty)
        replacement.driver.emit(.rendererReady)
        replacement.driver.emit(.rendererReady)

        #expect(replacement.driver.installedTokens == [selection.token])
        #expect(replacement.driver.commandNames.first == "configure")
        #expect(replacement.driver.commandNames.last == "load_profile")
    }

    @Test
    func callbacksRetainedFromAnOldSurfaceCannotCompleteTheNewLoad() {
        let factory = SurfaceFactory()
        let controller = WindowController(surfaceFactory: factory.make)
        let first = factory.records[0]
        let staleSnapshot = first.surface.onSnapshot
        let staleObservation = first.surface.onObservation

        controller.prepareDiagnosticSelection(makeAsset())

        let replacement = factory.records[1]
        staleSnapshot?(first.surface.snapshot)
        staleObservation?(.rendererReady)

        #expect(replacement.driver.installedTokens.isEmpty)
        replacement.driver.emit(.wrapperReady)
        replacement.driver.emit(.rendererReady)
        #expect(replacement.driver.installedTokens.count == 1)
    }

    @Test
    func failedDiagnosticPreparationLeavesTheCurrentSurfaceUntouched() async {
        let factory = SurfaceFactory()
        let controller = WindowController(surfaceFactory: factory.make)
        let first = factory.records[0]
        first.surface.start()
        first.driver.emit(.wrapperReady)
        first.driver.emit(.rendererReady)
        let before = first.surface.snapshot

        await controller.processDiagnosticCapture(.captured(Data()))

        #expect(factory.records.count == 1)
        #expect(controller.currentSurface === first.surface)
        #expect(first.driver.disposeReasons.isEmpty)
        #expect(first.surface.snapshot == before)
    }

    @Test
    func repeatedReplacementDisposesTimersViewsAndCallbacksExactlyOnce() {
        let factory = SurfaceFactory()
        let controller = WindowController(surfaceFactory: factory.make)
        controller.showWindow(nil)

        controller.prepareDiagnosticSelection(makeAsset())
        let firstReplacement = factory.records[1]
        let staleSnapshot = firstReplacement.surface.onSnapshot
        let staleObservation = firstReplacement.surface.onObservation
        firstReplacement.driver.emit(.wrapperReady)
        firstReplacement.driver.emit(.rendererReady)

        controller.prepareDiagnosticSelection(makeAsset())
        let secondReplacement = factory.records[2]
        staleSnapshot?(firstReplacement.surface.snapshot)
        staleObservation?(.rendererReady)

        #expect(firstReplacement.driver.disposeReasons == [.operator])
        #expect(firstReplacement.timer.invalidateCount == 1)
        #expect(firstReplacement.timer.startCount == 1)
        #expect(firstReplacement.surface.view.superview == nil)
        #expect(secondReplacement.surface.view.superview != nil)
        #expect(secondReplacement.timer.startCount == 1)
        #expect(secondReplacement.driver.installedTokens.isEmpty)

        secondReplacement.driver.emit(.wrapperReady)
        secondReplacement.driver.emit(.rendererReady)
        #expect(secondReplacement.driver.installedTokens.count == 1)
    }

    @Test
    func retryReplacesTheFailedSurfaceAndReloadsTheLatestSelection() {
        let factory = SurfaceFactory()
        let controller = WindowController(surfaceFactory: factory.make)
        let selection = makeAsset()

        controller.prepareDiagnosticSelection(selection)
        let firstReplacement = factory.records[1]
        firstReplacement.driver.emit(.wrapperReady)
        firstReplacement.driver.emit(.rendererReady)
        #expect(firstReplacement.driver.installedTokens == [selection.token])

        firstReplacement.driver.emit(.failed(.renderFailed))
        controller.retryDiagnosticSelection()

        #expect(factory.records.count == 3)
        #expect(firstReplacement.driver.disposeReasons == [.failure])
        let retry = factory.records[2]
        retry.driver.emit(.wrapperReady)
        retry.driver.emit(.rendererReady)

        #expect(retry.driver.installedTokens == [selection.token])
    }

    @Test
    func windowAndTerminationEventsTargetOnlyTheCurrentSurface() {
        let factory = SurfaceFactory()
        let controller = WindowController(surfaceFactory: factory.make)
        let first = factory.records[0]

        controller.prepareDiagnosticSelection(makeAsset())
        let replacement = factory.records[1]

        controller.windowDidMiniaturize(Notification(name: NSWindow.didMiniaturizeNotification))
        #expect(replacement.surface.snapshot.visibility == .hidden)
        #expect(first.driver.disposeReasons.isEmpty)

        controller.windowWillClose(Notification(name: NSWindow.willCloseNotification))
        #expect(replacement.driver.disposeReasons == [.hiddenBeforeLive])
        controller.disposeForTermination()
        #expect(replacement.driver.disposeReasons == [.hiddenBeforeLive])
        #expect(first.driver.disposeReasons.isEmpty)

        let closeFactory = SurfaceFactory()
        let closeController = WindowController(surfaceFactory: closeFactory.make)
        closeController.prepareDiagnosticSelection(makeAsset())
        let closeSurface = closeFactory.records[1]
        closeController.windowWillClose(Notification(name: NSWindow.willCloseNotification))
        #expect(closeSurface.driver.disposeReasons == [.operator])
        #expect(closeFactory.records[0].driver.disposeReasons.isEmpty)

        let terminationFactory = SurfaceFactory()
        let terminationController = WindowController(surfaceFactory: terminationFactory.make)
        terminationController.prepareDiagnosticSelection(makeAsset())
        let terminationSurface = terminationFactory.records[1]
        terminationController.disposeForTermination()
        #expect(terminationSurface.driver.disposeReasons == [.termination])
        #expect(terminationFactory.records[0].driver.disposeReasons.isEmpty)
    }

    @Test
    func replacementKeepsFocusOnAnEnabledNativeControl() {
        let factory = SurfaceFactory()
        let controller = WindowController(surfaceFactory: factory.make)
        controller.showWindow(nil)
        controller.window?.makeFirstResponder(controller.window?.initialFirstResponder)

        controller.prepareDiagnosticSelection(makeAsset())

        let responder = controller.window?.firstResponder as? NSControl
        #expect(responder?.isEnabled == true)
        #expect(responder?.acceptsFirstResponder == true)
        #expect(controller.currentSurface?.view.acceptsFirstResponder == false)
    }
}

@MainActor
private final class SurfaceFactory {
    final class Record {
        let surface: AvatarSurfaceController
        let driver: RecordingSurfaceDriver
        let timer: RecordingSurfaceTimer

        init(
            surface: AvatarSurfaceController,
            driver: RecordingSurfaceDriver,
            timer: RecordingSurfaceTimer
        ) {
            self.surface = surface
            self.driver = driver
            self.timer = timer
        }
    }

    private(set) var records: [Record] = []
    private(set) var replacementCreationChecks: [Bool] = []

    func make() -> AvatarSurfaceController {
        let driver = RecordingSurfaceDriver()
        let timer = RecordingSurfaceTimer()
        let surface = AvatarSurfaceController(driver: driver, timer: timer)
        driver.surface = surface
        if let previous = records.last {
            replacementCreationChecks.append(
                !previous.driver.disposeReasons.isEmpty
                    && previous.surface.view.superview == nil
            )
        }
        records.append(Record(surface: surface, driver: driver, timer: timer))
        return surface
    }
}

@MainActor
private final class RecordingSurfaceDriver: AvatarSurfaceRendererDriving {
    var onWebViewChange: ((WKWebView?) -> Void)?
    weak var surface: AvatarSurfaceController?
    private(set) var installedTokens: [UUID] = []
    private(set) var disposeReasons: [DisposalReason] = []
    private(set) var commandNames: [String] = []
    private(set) var wasAttachedAtStart: Bool?
    private(set) var snapshotAtStart: HostSnapshot?
    private var sessionID: UUID?
    private var receive: ((UUID, HostObservation) -> Void)?

    func start(
        sessionID: UUID,
        receive: @escaping (UUID, HostObservation) -> Void
    ) {
        self.sessionID = sessionID
        self.receive = receive
        wasAttachedAtStart = surface?.view.superview != nil
        snapshotAtStart = surface?.snapshot
    }

    func install(_ profile: LoadedAvatarProfile) -> Bool {
        installedTokens.append(profile.model.token)
        return true
    }

    func send(_ command: BridgeCommand) {
        switch command {
        case .configure:
            commandNames.append("configure")
        case .loadProfile:
            commandNames.append("load_profile")
        case .projectPhase:
            commandNames.append("project_phase")
        case .reconcilePresentation:
            commandNames.append("reconcile_presentation")
        case .setVisibility:
            commandNames.append("set_visibility")
        case .setPolicy:
            commandNames.append("set_policy")
        case .setMouth:
            commandNames.append("set_mouth")
        case .reset:
            commandNames.append("reset")
        case .dispose:
            commandNames.append("dispose")
        }
    }

    func dispose(reason: DisposalReason) {
        disposeReasons.append(reason)
        onWebViewChange?(nil)
    }

    func emit(_ observation: HostObservation) {
        guard let sessionID else { return }
        receive?(sessionID, observation)
    }
}

@MainActor
private final class RecordingSurfaceTimer: AvatarSurfaceTimer {
    private(set) var startCount = 0
    private(set) var invalidateCount = 0

    func start(
        interval: TimeInterval,
        handler: @escaping @MainActor @Sendable () -> Void
    ) {
        startCount += 1
    }

    nonisolated func invalidate() {
        MainActor.assumeIsolated {
            invalidateCount += 1
        }
    }
}

private func makeAsset(token: UUID = UUID()) -> AdmittedAsset {
    AdmittedAsset(
        token: token,
        bytes: Data([0x01]),
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
    )
}
