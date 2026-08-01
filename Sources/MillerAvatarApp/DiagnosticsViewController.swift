import AppKit
import MillerAvatarCore
import MillerAvatarHost
@preconcurrency import WebKit

@MainActor
final class DiagnosticsViewController: NSViewController {
    var onSnapshotChange: ((HostSnapshot) -> Void)?

    private let host: HostOrchestrator
    private let selector = AssetSelectionController()
    private let statusLabel = NSTextField(labelWithString: "")
    private let fallbackView = NSView()
    private let liveView = NSView()
    private let startButton = NSButton(title: "Start Renderer", target: nil, action: nil)
    private let selectButton = NSButton(title: "Select VRM…", target: nil, action: nil)
    private let phasePopup = NSPopUpButton()
    private let mouthSlider = NSSlider(value: 0, minValue: 0, maxValue: 1, target: nil, action: nil)
    private let reducedMotion = NSButton(checkboxWithTitle: "Reduced Motion", target: nil, action: nil)
    private weak var rendererView: WKWebView?

    init(host: HostOrchestrator) {
        self.host = host
        super.init(nibName: nil, bundle: nil)
        host.onChange = { [weak self] snapshot in
            self?.render(snapshot)
            self?.onSnapshotChange?(snapshot)
        }
    }

    required init?(coder: NSCoder) {
        nil
    }

    func installRendererView(_ webView: WKWebView?) {
        rendererView?.removeFromSuperview()
        rendererView = webView
        guard let webView else { return }
        webView.translatesAutoresizingMaskIntoConstraints = false
        liveView.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: liveView.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: liveView.trailingAnchor),
            webView.topAnchor.constraint(equalTo: liveView.topAnchor),
            webView.bottomAnchor.constraint(equalTo: liveView.bottomAnchor),
        ])
        webView.nextKeyView = startButton
    }

    override func loadView() {
        view = NSView()
        buildInterface()
        render(host.snapshot)
    }

    private func buildInterface() {
        let title = NSTextField(labelWithString: "Miller Avatar Diagnostic")
        title.font = .systemFont(ofSize: 22, weight: .semibold)
        statusLabel.font = .monospacedSystemFont(ofSize: 12, weight: .regular)
        statusLabel.maximumNumberOfLines = 8
        statusLabel.lineBreakMode = .byWordWrapping

        startButton.target = self
        startButton.action = #selector(startRenderer)
        selectButton.target = self
        selectButton.action = #selector(selectAsset)
        phasePopup.addItems(withTitles: PresentationPhase.allCases.map(\.rawValue))
        phasePopup.target = self
        phasePopup.action = #selector(changePhase)
        mouthSlider.numberOfTickMarks = 5
        mouthSlider.target = self
        mouthSlider.action = #selector(changeMouth)
        reducedMotion.target = self
        reducedMotion.action = #selector(changeReducedMotion)

        let hideButton = button("Simulate Hidden", #selector(simulateHidden))
        let occludeButton = button("Simulate Occluded", #selector(simulateOccluded))
        let resumeButton = button("Resume Visible", #selector(resumeVisible))
        let resetButton = button("Reset", #selector(resetRenderer))
        let failButton = button("Simulate Render Failure", #selector(simulateFailure))
        let disposeButton = button("Dispose", #selector(disposeRenderer))

        let controls = NSGridView(views: [
            [startButton, selectButton, phasePopup],
            [reducedMotion, mouthSlider, resetButton],
            [hideButton, occludeButton, resumeButton],
            [failButton, disposeButton, NSView()],
        ])
        controls.rowSpacing = 8
        controls.columnSpacing = 8
        controls.column(at: 0).xPlacement = .fill
        controls.column(at: 1).xPlacement = .fill
        controls.column(at: 2).xPlacement = .fill

        fallbackView.wantsLayer = true
        fallbackView.layer?.backgroundColor = NSColor.windowBackgroundColor.cgColor
        fallbackView.layer?.borderColor = NSColor.separatorColor.cgColor
        fallbackView.layer?.borderWidth = 1
        let fallbackLabel = NSTextField(labelWithString: "Miller Avatar\nNative fallback")
        fallbackLabel.alignment = .center
        fallbackLabel.font = .systemFont(ofSize: 28, weight: .medium)
        fallbackLabel.textColor = .secondaryLabelColor
        fallbackLabel.translatesAutoresizingMaskIntoConstraints = false
        fallbackView.addSubview(fallbackLabel)
        NSLayoutConstraint.activate([
            fallbackLabel.centerXAnchor.constraint(equalTo: fallbackView.centerXAnchor),
            fallbackLabel.centerYAnchor.constraint(equalTo: fallbackView.centerYAnchor),
        ])

        liveView.wantsLayer = true
        liveView.layer?.backgroundColor = NSColor.black.cgColor
        liveView.isHidden = true

        let surface = NSView()
        surface.addSubview(fallbackView)
        surface.addSubview(liveView)
        fallbackView.translatesAutoresizingMaskIntoConstraints = false
        liveView.translatesAutoresizingMaskIntoConstraints = false
        for child in [fallbackView, liveView] {
            NSLayoutConstraint.activate([
                child.leadingAnchor.constraint(equalTo: surface.leadingAnchor),
                child.trailingAnchor.constraint(equalTo: surface.trailingAnchor),
                child.topAnchor.constraint(equalTo: surface.topAnchor),
                child.bottomAnchor.constraint(equalTo: surface.bottomAnchor),
            ])
        }

        let stack = NSStackView(views: [title, statusLabel, controls, surface])
        stack.orientation = .vertical
        stack.alignment = .leading
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false
        surface.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            stack.topAnchor.constraint(equalTo: view.topAnchor, constant: 20),
            stack.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -20),
            surface.widthAnchor.constraint(equalTo: stack.widthAnchor),
            surface.heightAnchor.constraint(greaterThanOrEqualToConstant: 320),
        ])

        startButton.nextKeyView = selectButton
        selectButton.nextKeyView = phasePopup
        phasePopup.nextKeyView = mouthSlider
        mouthSlider.nextKeyView = reducedMotion
        reducedMotion.nextKeyView = hideButton
        hideButton.nextKeyView = occludeButton
        occludeButton.nextKeyView = resumeButton
        resumeButton.nextKeyView = resetButton
        resetButton.nextKeyView = failButton
        failButton.nextKeyView = disposeButton
    }

    private func button(_ title: String, _ action: Selector) -> NSButton {
        let button = NSButton(title: title, target: self, action: action)
        button.bezelStyle = .rounded
        return button
    }

    private func render(_ snapshot: HostSnapshot) {
        let session = snapshot.sessionID == nil ? "none" : "active"
        let failure = snapshot.lastFailure?.rawValue ?? "none"
        statusLabel.stringValue = """
        lifecycle: \(describe(snapshot.lifecycle))    renderer: \(rendererStatus(snapshot.lifecycle))
        admission: \(describe(snapshot.admission))    phase: \(snapshot.phase.rawValue)
        visibility: \(snapshot.visibility.rawValue)    session: \(session)
        failure: \(failure)
        counters: frames \(snapshot.counters.frames), updates \(snapshot.counters.updates), renders \(snapshot.counters.renders)
        """
        fallbackView.isHidden = !snapshot.fallbackVisible
        liveView.isHidden = snapshot.fallbackVisible
        selectButton.isEnabled = snapshot.lifecycle == .rendererReady
        startButton.isEnabled = snapshot.retryAvailable || (
            snapshot.lifecycle == .absent && snapshot.lastFailure == nil
        )
        startButton.title = snapshot.retryAvailable ? "Retry Once" : "Start Renderer"
        reducedMotion.state = snapshot.reducedMotion ? .on : .off
        if case .failed = snapshot.lifecycle {
            view.window?.makeFirstResponder(startButton)
        }
    }

    @objc private func startRenderer() {
        if host.snapshot.retryAvailable {
            host.retry()
        } else {
            host.startRenderer()
        }
    }

    @objc private func selectAsset() {
        Task { @MainActor in
            switch await selector.selectAndCapture() {
            case .cancelled:
                return
            case .rejected(let code):
                host.rejectAsset(code)
            case .captured(let bytes):
                switch await AssetAdmission().admit(bytes) {
                case .admitted(let asset):
                    host.load(asset)
                case .rejected(let code):
                    host.rejectAsset(code)
                }
            }
        }
    }

    @objc private func changeReducedMotion() {
        host.setReducedMotion(reducedMotion.state == .on)
    }

    @objc private func simulateHidden() { host.setVisibility(.hidden) }
    @objc private func simulateOccluded() { host.setVisibility(.occluded) }
    @objc private func resumeVisible() { host.setVisibility(.visible) }
    @objc private func resetRenderer() { host.resetPresentation() }
    @objc private func changePhase() {
        guard let phase = PresentationPhase(rawValue: phasePopup.titleOfSelectedItem ?? "") else {
            return
        }
        host.setPhase(phase)
    }

    @objc private func changeMouth() { host.setMouthScalar(mouthSlider.doubleValue) }
    @objc private func simulateFailure() { host.simulateRendererFailure() }
    @objc private func disposeRenderer() { host.dispose() }

    private func describe(_ state: RendererSessionState) -> String {
        switch state {
        case .absent: "absent"
        case .startingRenderer: "starting_renderer"
        case .rendererReady: "renderer_ready"
        case .loadingAsset: "loading_asset"
        case .live: "live"
        case .liveSuspended: "live_suspended"
        case .failed(let code): "failed(\(code.rawValue))"
        case .disposing: "disposing"
        }
    }

    private func rendererStatus(_ state: RendererSessionState) -> String {
        switch state {
        case .rendererReady, .loadingAsset, .live, .liveSuspended: "ready"
        default: "not_ready"
        }
    }

    private func describe(_ admission: HostAdmissionStatus) -> String {
        switch admission {
        case .none: "none"
        case .admitted: "admitted"
        case .rejected(let code): "rejected(\(code.rawValue))"
        }
    }
}
