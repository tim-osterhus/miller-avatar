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
    private let surface: AvatarSurfaceController
    private let diagnostics: DiagnosticsViewController

    init() {
        let surface = AvatarSurfaceController()
        self.surface = surface
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
    }

    required init?(coder: NSCoder) {
        nil
    }

    func windowDidBecomeKey(_ notification: Notification) {
        surface.setVisibility(.visible)
        diagnostics.restoreFocusAfterActivation()
    }

    func windowDidMiniaturize(_ notification: Notification) {
        surface.setVisibility(.hidden)
    }

    func windowDidDeminiaturize(_ notification: Notification) {
        surface.setVisibility(.visible)
    }

    func windowDidChangeOcclusionState(_ notification: Notification) {
        guard let window else { return }
        surface.setVisibility(window.occlusionState.contains(.visible) ? .visible : .occluded)
    }

    func windowWillClose(_ notification: Notification) {
        surface.dispose()
    }

    func disposeForTermination() {
        surface.dispose(reason: .termination)
    }

    func startSignedBoundaryProbe(
        receive: @escaping (HostObservation) -> Void
    ) {
        surface.onObservation = { observation in
            switch observation {
            case .wrapperReady, .rendererReady, .failed:
                receive(observation)
            default:
                break
            }
        }
        surface.start()
    }
}
