import AppKit
import Foundation
import MillerAvatarCore
import MillerAvatarHost

private final class KeyboardNavigationWindow: NSWindow {
    var tabTraversal: ((Bool) -> Bool)?

    override func performKeyEquivalent(with event: NSEvent) -> Bool {
        if moveFocusIfTab(event) { return true }
        return super.performKeyEquivalent(with: event)
    }

    override func sendEvent(_ event: NSEvent) {
        if moveFocusIfTab(event) { return }
        super.sendEvent(event)
    }

    private func moveFocusIfTab(_ event: NSEvent) -> Bool {
        guard event.type == .keyDown,
              event.keyCode == 48,
              event.modifierFlags.intersection([.command, .control, .option]).isEmpty
        else { return false }
        return tabTraversal?(event.modifierFlags.contains(.shift)) ?? false
    }
}

@MainActor
final class WindowController: NSWindowController, NSWindowDelegate {
    private(set) var currentSurface: AvatarSurfaceController?
    private let diagnostics: DiagnosticsViewController
    private let surfaceFactory: () -> AvatarSurfaceController
    private var pendingDiagnosticLoad: PendingDiagnosticLoad?
    private var signedBoundaryProbeReceiver: ((HostObservation) -> Void)?

    convenience init() {
        self.init(surfaceFactory: { AvatarSurfaceController() })
    }

    package init(surfaceFactory: @escaping () -> AvatarSurfaceController) {
        self.surfaceFactory = surfaceFactory
        let surface = surfaceFactory()
        currentSurface = surface
        diagnostics = DiagnosticsViewController(surface: surface)
        let window = KeyboardNavigationWindow(
            contentRect: NSRect(x: 0, y: 0, width: 980, height: 700),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = MillerAvatarBuild.productName
        window.minSize = NSSize(width: 760, height: 560)
        window.contentViewController = diagnostics
        window.initialFirstResponder = diagnostics.initialFocusView
        window.tabTraversal = { [weak diagnostics] backward in
            diagnostics?.moveFocus(backward: backward) ?? false
        }
        window.isReleasedWhenClosed = false
        super.init(window: window)
        window.delegate = self
        window.center()
        bindObservation(to: surface)
        diagnostics.onSnapshotChange = { [weak self] snapshot in
            self?.surfaceSnapshotDidChange(snapshot)
        }
        diagnostics.onSelectionIntent = { [weak self] selection in
            self?.replaceSurface(for: selection)
        }
    }

    required init?(coder: NSCoder) {
        nil
    }

    func windowDidBecomeKey(_ notification: Notification) {
        currentSurface?.setVisibility(.visible)
        diagnostics.restoreFocusAfterActivation()
    }

    func windowDidMiniaturize(_ notification: Notification) {
        currentSurface?.setVisibility(.hidden)
    }

    func windowDidDeminiaturize(_ notification: Notification) {
        currentSurface?.setVisibility(.visible)
    }

    func windowDidChangeOcclusionState(_ notification: Notification) {
        guard let window else { return }
        currentSurface?.setVisibility(
            window.occlusionState.contains(.visible) ? .visible : .occluded
        )
    }

    func windowWillClose(_ notification: Notification) {
        pendingDiagnosticLoad = nil
        currentSurface?.dispose()
    }

    func disposeForTermination() {
        pendingDiagnosticLoad = nil
        currentSurface?.dispose(reason: .termination)
    }

    package func replaceSurface(_ replacement: AvatarSurfaceController) {
        replaceSurface(using: replacement, selection: diagnostics.diagnosticSelection)
    }

    package func replaceSurface(for selection: AdmittedAsset?) {
        replaceSurface(using: nil, selection: selection)
    }

    package func prepareDiagnosticSelection(_ selection: AdmittedAsset) {
        diagnostics.prepareDiagnosticSelection(selection)
    }

    package func retryDiagnosticSelection() {
        diagnostics.retryDiagnosticSelection()
    }

    package func processDiagnosticCapture(_ result: AssetCaptureResult) async {
        await diagnostics.processDiagnosticCapture(result)
    }

    private func replaceSurface(
        using replacement: AvatarSurfaceController?,
        selection: AdmittedAsset?
    ) {
        let oldSurface = currentSurface
        let visibility = oldSurface?.snapshot.visibility ?? .visible
        let reducedMotion = oldSurface?.snapshot.reducedMotion ?? false
        pendingDiagnosticLoad = nil
        oldSurface?.onSnapshot = nil
        oldSurface?.onObservation = nil
        oldSurface?.dispose()
        diagnostics.detachSurface()
        let replacement = replacement ?? surfaceFactory()
        currentSurface = replacement
        diagnostics.attachSurface(replacement)
        bindObservation(to: replacement)
        pendingDiagnosticLoad = selection.map {
            PendingDiagnosticLoad(surface: replacement, asset: $0)
        }
        replacement.setReducedMotion(reducedMotion)
        replacement.setVisibility(visibility)
        replacement.start()
        diagnostics.restoreFocusAfterActivation()
    }

    func startSignedBoundaryProbe(
        receive: @escaping (HostObservation) -> Void
    ) {
        signedBoundaryProbeReceiver = receive
        currentSurface?.start()
    }

    private func bindObservation(to surface: AvatarSurfaceController) {
        surface.onObservation = { [weak self, weak surface] observation in
            guard let self, let surface, self.currentSurface === surface else { return }
            self.receive(observation, from: surface)
        }
    }

    private func receive(_ observation: HostObservation, from surface: AvatarSurfaceController) {
        switch observation {
        case .wrapperReady, .failed:
            signedBoundaryProbeReceiver?(observation)
        case .rendererReady:
            signedBoundaryProbeReceiver?(observation)
            surfaceSnapshotDidChange(surface.snapshot)
        default:
            break
        }

        if case .failed = observation,
           pendingDiagnosticLoad?.surface === surface {
            pendingDiagnosticLoad = nil
        }
    }

    private func surfaceSnapshotDidChange(_ snapshot: HostSnapshot) {
        guard snapshot.lifecycle == .rendererReady,
              let pendingDiagnosticLoad,
              currentSurface === pendingDiagnosticLoad.surface,
              pendingDiagnosticLoad.surface.snapshot.lifecycle == .rendererReady
        else { return }
        self.pendingDiagnosticLoad = nil
        _ = pendingDiagnosticLoad.surface.loadForDiagnostics(pendingDiagnosticLoad.asset)
    }

    private struct PendingDiagnosticLoad {
        let surface: AvatarSurfaceController
        let asset: AdmittedAsset
    }
}
