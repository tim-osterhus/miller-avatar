import AppKit
import Foundation
import MillerAvatarCore
import MillerAvatarHost
@preconcurrency import WebKit

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
    private let rendererDriver = StandaloneRendererDriver()
    private let host: HostOrchestrator
    private let diagnostics: DiagnosticsViewController
    private var deadlineTimer: Timer?

    init() {
        host = HostOrchestrator(driver: rendererDriver)
        diagnostics = DiagnosticsViewController(host: host)
        rendererDriver.onWebView = { [weak diagnostics] webView in
            diagnostics?.installRendererView(webView)
        }
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
        deadlineTimer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) {
            [weak host] _ in
            MainActor.assumeIsolated {
                host?.checkDeadlines()
            }
        }
    }

    required init?(coder: NSCoder) {
        nil
    }

    func windowDidBecomeKey(_ notification: Notification) {
        host.setVisibility(.visible)
        diagnostics.restoreFocusAfterActivation()
    }

    func windowDidMiniaturize(_ notification: Notification) {
        host.setVisibility(.hidden)
    }

    func windowDidDeminiaturize(_ notification: Notification) {
        host.setVisibility(.visible)
    }

    func windowDidChangeOcclusionState(_ notification: Notification) {
        guard let window else { return }
        host.setVisibility(window.occlusionState.contains(.visible) ? .visible : .occluded)
    }

    func windowWillClose(_ notification: Notification) {
        host.dispose()
    }

    func disposeForTermination() {
        deadlineTimer?.invalidate()
        host.dispose(reason: .termination)
    }

    func startSignedBoundaryProbe(
        receive: @escaping (HostObservation) -> Void
    ) {
        rendererDriver.onStartupObservation = receive
        diagnostics.onSnapshotChange = { snapshot in
            if case .failed(let code) = snapshot.lifecycle {
                receive(.failed(code))
            }
        }
        host.startRenderer()
    }
}

@MainActor
private final class StandaloneRendererDriver: HostRendererDriving {
    var onWebView: ((WKWebView?) -> Void)?
    var onStartupObservation: ((HostObservation) -> Void)?

    private let sessionController = RendererSessionController()
    private var receive: ((UUID, HostObservation) -> Void)?
    private var lease: RendererSessionLease?
    private var schemeHandler: LocalSchemeHandler?
    private var bridge: BridgeController?
    private var teardown: RendererTeardown?
    private var navigationPolicyRetention: NavigationPolicyRetention?
    private var webView: WKWebView?

    func start(
        sessionID: UUID,
        receive: @escaping (UUID, HostObservation) -> Void
    ) {
        teardown?.run()
        self.receive = receive
        let lease = sessionController.begin(id: sessionID)
        self.lease = lease

        do {
            let resources = try loadWebResources()
            let handler = try LocalSchemeHandler(
                lease: lease,
                sessionController: sessionController,
                bundledResources: resources,
                resourceRecords: resources.keys.sorted().map {
                    LocalSchemeResourceRecord.make(path: $0, data: resources[$0]!)
                },
                assetToken: UUID(),
                assetData: Data()
            )
            schemeHandler = handler

            let observationHandler = RendererObservationHandler(
                lease: lease,
                sessionController: sessionController,
                receive: { [weak self] envelope in
                    Task { @MainActor in
                        self?.accept(envelope)
                    }
                },
                onInvalidObservation: { [weak self] in
                    Task { @MainActor in
                        self?.fail(.bridgeInvalid)
                    }
                }
            )
            let navigationPolicy = NavigationPolicy(
                lease: lease,
                onPolicyFailure: { [weak self] failure in
                    Task { @MainActor in
                        self?.fail(failure.code)
                    }
                }
            )
            navigationPolicyRetention = NavigationPolicyRetention(
                navigationPolicy
            )
            let assembly = WebViewFactory.make(
                schemeHandler: handler,
                navigationPolicy: navigationPolicy,
                observationHandler: observationHandler
            )
            webView = assembly.webView
            bridge = BridgeController(
                sessionID: sessionID,
                caller: WebViewJavaScriptCaller(webView: assembly.webView)
            )
            let actions = WebKitRendererTeardownActions(
                webView: assembly.webView,
                schemeHandler: handler,
                scriptHandlerNames: WebViewFactory.scriptMessageHandlerNames,
                onDelegatesCleared: { [weak self] in
                    self?.navigationPolicyRetention?.releaseAfterDelegatesCleared()
                },
                fallback: { [weak self] in
                    self?.onWebView?(nil)
                }
            )
            teardown = RendererTeardown(
                lease: lease,
                sessionController: sessionController,
                actions: actions
            )
            onWebView?(assembly.webView)
        } catch {
            sessionController.release(lease)
            self.lease = nil
            receive(sessionID, .failed(.rendererUnavailable))
        }
    }

    func install(assetToken: UUID, bytes: Data) {
        guard schemeHandler?.installAsset(token: assetToken, data: bytes) == true else {
            fail(.schemeRejected)
            return
        }
    }

    func send(_ command: BridgeCommand) {
        guard let bridge else {
            fail(.bridgeInvalid)
            return
        }
        Task { @MainActor [weak self] in
            do {
                try await bridge.send(command)
            } catch {
                self?.fail(.bridgeInvalid)
            }
        }
    }

    func dispose(reason: DisposalReason) {
        if let bridge {
            Task { @MainActor in
                try? await bridge.send(.dispose(reason))
            }
        }
        teardown?.run()
        clear()
    }

    private func accept(_ envelope: PresentationObservationEnvelope) {
        guard envelope.sessionID == lease?.id else { return }
        switch envelope.observation {
        case .wrapperReady(let payload):
            if payload.bridgeVersion == 1 {
                let observation = HostObservation.wrapperReady
                onStartupObservation?(observation)
                receive?(envelope.sessionID, observation)
            } else {
                fail(.bridgeInvalid)
            }
        case .rendererReady(let payload):
            if payload.webgl == "webgl2" {
                let observation = HostObservation.rendererReady
                onStartupObservation?(observation)
                receive?(envelope.sessionID, observation)
            } else {
                fail(.webglUnavailable)
            }
        case .assetLoaded:
            break
        case .firstFrame(let payload):
            receive?(envelope.sessionID, .firstFrame(
                assetToken: payload.assetToken,
                counters: HostCounters(frames: 1, updates: 0, renders: 1)
            ))
        case .suspended(let payload):
            receive?(envelope.sessionID, .suspended(
                visibility: payload.visibility,
                counters: HostCounters(
                    frames: payload.frames,
                    updates: payload.updates,
                    renders: payload.renders
                )
            ))
        case .resumed(let payload):
            receive?(envelope.sessionID, .resumed(counters: HostCounters(
                frames: payload.frames,
                updates: payload.updates,
                renders: payload.renders
            )))
        case .disposed:
            receive?(envelope.sessionID, .disposed)
            teardown?.run()
            clear()
        case .failed(let payload):
            fail(payload.code)
        }
    }

    private func fail(_ code: FailureCode) {
        guard let sessionID = lease?.id else { return }
        receive?(sessionID, .failed(code))
        teardown?.run()
        clear()
    }

    private func clear() {
        onWebView?(nil)
        bridge = nil
        schemeHandler = nil
        webView = nil
        teardown = nil
        navigationPolicyRetention = nil
        lease = nil
    }

    private func loadWebResources() throws -> [String: Data] {
        guard let resourceRoot = Bundle.main.resourceURL?.appendingPathComponent("Web") else {
            throw RendererResourceError.missing
        }
        let names = [
            "index.html", "app.js", "styles.css",
            "bundle-manifest.json", "bundle-metafile.json",
        ]
        return try Dictionary(uniqueKeysWithValues: names.map { name in
            let data = try Data(contentsOf: resourceRoot.appendingPathComponent(name))
            return ("/bundle/\(name)", data)
        })
    }

    private enum RendererResourceError: Error {
        case missing
    }
}
