import AppKit
import MillerAvatarHost

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    private var windowController: WindowController?
    private var signedBoundaryProbeFinished = false

    func applicationDidFinishLaunching(_ notification: Notification) {
        if ProcessInfo.processInfo.environment["MILLER_AVATAR_SIGNED_BOUNDARY_PROBE"] == "1" {
            startSignedBoundaryProbe()
            return
        }
        showWindow()
        NSApplication.shared.activate(ignoringOtherApps: true)
    }

    func applicationShouldHandleReopen(
        _ sender: NSApplication,
        hasVisibleWindows flag: Bool
    ) -> Bool {
        showWindow()
        return true
    }

    func applicationShouldTerminateAfterLastWindowClosed(
        _ sender: NSApplication
    ) -> Bool {
        false
    }

    func applicationWillTerminate(_ notification: Notification) {
        windowController?.disposeForTermination()
    }

    private func showWindow() {
        if let windowController {
            windowController.showWindow(nil)
            windowController.window?.makeKeyAndOrderFront(nil)
            return
        }
        let controller = WindowController()
        windowController = controller
        controller.showWindow(nil)
    }

    private func startSignedBoundaryProbe() {
        let controller = WindowController()
        windowController = controller
        controller.showWindow(nil)
        controller.window?.makeKeyAndOrderFront(nil)
        NSApplication.shared.activate(ignoringOtherApps: true)
        controller.startSignedBoundaryProbe { [weak self] observation in
            self?.recordSignedBoundaryProbe(observation)
        }
    }

    private func recordSignedBoundaryProbe(_ observation: HostObservation) {
        guard !signedBoundaryProbeFinished else { return }
        switch observation {
        case .wrapperReady:
            emitSignedBoundaryProbe("wrapper_ready")
        case .rendererReady:
            signedBoundaryProbeFinished = true
            emitSignedBoundaryProbe("renderer_ready")
            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        case .failed(let code):
            signedBoundaryProbeFinished = true
            emitSignedBoundaryProbe("failed \(code.rawValue)")
            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        default:
            break
        }
    }

    private func emitSignedBoundaryProbe(_ result: String) {
        FileHandle.standardOutput.write(
            Data(("MILLER_AVATAR_SIGNED_BOUNDARY \(result)\n").utf8)
        )
    }
}
