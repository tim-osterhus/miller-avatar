import AppKit
import MillerAvatarCore
import MillerAvatarHost

private final class FocusableButton: NSButton {
    override var acceptsFirstResponder: Bool { isEnabled && !isHidden }
}

private final class FocusablePopUpButton: NSPopUpButton {
    override var acceptsFirstResponder: Bool { isEnabled && !isHidden }
}

private final class FocusableSlider: NSSlider {
    override var acceptsFirstResponder: Bool { isEnabled && !isHidden }
}

private struct SyntheticProjectionState {
    private static let offsetStepMilliseconds: UInt64 = 100

    var projectionSequence: UInt64 = 0
    var phase: PresentationPhase = .idle
    var generationID: UUID?
    var playbackID: UUID?
    var cueIndex: UInt64 = 0
    var playbackOffsetMilliseconds: UInt64 = 0

    mutating func project(phase: PresentationPhase) -> ProjectPhasePayload? {
        guard projectionSequence < BridgeContract.maximumSafeInteger else { return nil }
        projectionSequence += 1
        resetLease()
        self.phase = phase

        switch phase {
        case .idle, .listening, .transcribing:
            break
        case .speaking:
            generationID = UUID()
            playbackID = UUID()
        case .thinking, .responding, .stopped, .failed:
            generationID = UUID()
        }

        return ProjectPhasePayload(
            projectionSequence: projectionSequence,
            generationID: generationID,
            phase: phase,
            playbackID: playbackID
        )
    }

    mutating func mouth(scalar: Double) -> SetMouthPayload? {
        guard phase == .speaking,
              scalar.isFinite,
              (0...1).contains(scalar),
              let generationID,
              let playbackID,
              cueIndex < BridgeContract.maximumSafeInteger,
              playbackOffsetMilliseconds
                  <= 86_400_000 - Self.offsetStepMilliseconds
        else { return nil }

        cueIndex += 1
        playbackOffsetMilliseconds += Self.offsetStepMilliseconds
        return SetMouthPayload(
            generationID: generationID,
            playbackID: playbackID,
            cueIndex: cueIndex,
            playbackOffsetMilliseconds: playbackOffsetMilliseconds,
            scalar: scalar
        )
    }

    mutating func reset() {
        resetLease()
        phase = .idle
    }

    private mutating func resetLease() {
        generationID = nil
        playbackID = nil
        cueIndex = 0
        playbackOffsetMilliseconds = 0
    }
}

@MainActor
final class DiagnosticsViewController: NSViewController {
    var onSnapshotChange: ((HostSnapshot) -> Void)?
    package var onSelectionIntent: ((AdmittedAsset?) -> Void)?
    package var diagnosticSelection: AdmittedAsset? { latestDiagnosticSelection }
    var initialFocusView: NSView { startButton }

    private var surfaceController: AvatarSurfaceController
    private var latestDiagnosticSelection: AdmittedAsset?
    private let selector = AssetSelectionController()
    private let statusLabel = NSTextField(labelWithString: "")
    private let fallbackView = NSView()
    private let liveView = NSView()
    private let phaseBadgeLabel = NSTextField(labelWithString: "IDLE")
    private let startButton = FocusableButton(title: "Start Renderer", target: nil, action: nil)
    private let selectButton = FocusableButton(title: "Select VRM…", target: nil, action: nil)
    private let phasePopup = FocusablePopUpButton()
    private let mouthSlider = FocusableSlider(value: 0, minValue: 0, maxValue: 1, target: nil, action: nil)
    private let reducedMotion = FocusableButton(
        checkboxWithTitle: "Reduced Motion",
        target: nil,
        action: nil
    )
    private let disposeButton = FocusableButton(title: "Dispose", target: nil, action: nil)
    private var nativeFocusViews: [NSView] = []
    private var surfaceConstraints: [NSLayoutConstraint] = []
    private var syntheticProjection = SyntheticProjectionState()

    init(surface: AvatarSurfaceController) {
        surfaceController = surface
        super.init(nibName: nil, bundle: nil)
        bindSurfaceCallbacks()
    }

    required init?(coder: NSCoder) {
        nil
    }

    package func detachSurface() {
        surfaceController.onSnapshot = nil
        surfaceController.onObservation = nil
        NSLayoutConstraint.deactivate(surfaceConstraints)
        surfaceConstraints.removeAll()
        surfaceController.view.removeFromSuperview()
    }

    package func attachSurface(_ surface: AvatarSurfaceController) {
        surfaceController = surface
        bindSurfaceCallbacks()
        if isViewLoaded {
            attachSurfaceView()
            render(surface.snapshot)
        }
    }

    package func prepareDiagnosticSelection(_ selection: AdmittedAsset) {
        latestDiagnosticSelection = selection
        onSelectionIntent?(selection)
    }

    package func retryDiagnosticSelection() {
        onSelectionIntent?(latestDiagnosticSelection)
    }

    package func processDiagnosticCapture(_ result: AssetCaptureResult) async {
        switch result {
        case .cancelled, .rejected:
            return
        case .captured(let bytes):
            switch await AssetAdmission().admit(bytes) {
            case .admitted(let asset):
                prepareDiagnosticSelection(asset)
            case .rejected:
                return
            }
        }
    }

    override func loadView() {
        view = NSView()
        buildInterface()
        render(surfaceController.snapshot)
    }

    override func viewDidAppear() {
        super.viewDidAppear()
        view.window?.recalculateKeyViewLoop()
        restoreUsableFocus()
    }

    func restoreFocusAfterActivation() {
        view.window?.recalculateKeyViewLoop()
        restoreUsableFocus()
    }

    func moveFocus(backward: Bool) -> Bool {
        guard let window = view.window else { return false }
        let candidates = nativeFocusViews
        let enabled = candidates.map(focusEligible)
        let current = candidates.firstIndex {
            responder(window.firstResponder, belongsTo: $0)
        }
        guard let next = WindowPolicy.nextResponderIndex(
            after: current,
            enabled: enabled,
            backward: backward
        ) else {
            return false
        }
        let target = candidates[next]
        guard window.makeFirstResponder(target) else { return false }
        target.needsDisplay = true
        return true
    }

    private func bindSurfaceCallbacks() {
        let surface = surfaceController
        surface.onSnapshot = { [weak self, weak surface] snapshot in
            guard let self, let surface, self.surfaceController === surface else { return }
            self.render(snapshot)
            self.onSnapshotChange?(snapshot)
        }
    }

    private func attachSurfaceView() {
        guard surfaceController.view.superview !== liveView else { return }
        surfaceController.view.translatesAutoresizingMaskIntoConstraints = false
        liveView.addSubview(surfaceController.view)
        surfaceConstraints = [
            surfaceController.view.leadingAnchor.constraint(equalTo: liveView.leadingAnchor),
            surfaceController.view.trailingAnchor.constraint(equalTo: liveView.trailingAnchor),
            surfaceController.view.topAnchor.constraint(equalTo: liveView.topAnchor),
            surfaceController.view.bottomAnchor.constraint(equalTo: liveView.bottomAnchor),
        ]
        NSLayoutConstraint.activate(surfaceConstraints)
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
        disposeButton.target = self
        disposeButton.action = #selector(disposeRenderer)
        disposeButton.bezelStyle = .rounded

        let controls = NSGridView(views: [
            [startButton, selectButton, phasePopup],
            [reducedMotion, mouthSlider, resetButton],
            [hideButton, occludeButton, resumeButton],
            [disposeButton, NSView(), NSView()],
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
        attachSurfaceView()

        phaseBadgeLabel.wantsLayer = true
        phaseBadgeLabel.drawsBackground = true
        phaseBadgeLabel.backgroundColor = NSColor.black.withAlphaComponent(0.72)
        phaseBadgeLabel.layer?.borderColor = NSColor.white.withAlphaComponent(0.45).cgColor
        phaseBadgeLabel.layer?.borderWidth = 1
        phaseBadgeLabel.layer?.cornerRadius = 8
        phaseBadgeLabel.font = .monospacedSystemFont(ofSize: 11, weight: .semibold)
        phaseBadgeLabel.textColor = .white
        phaseBadgeLabel.alignment = .center
        phaseBadgeLabel.setAccessibilityLabel("Avatar phase")

        let surface = NSView()
        surface.addSubview(fallbackView)
        surface.addSubview(liveView)
        surface.addSubview(phaseBadgeLabel)
        fallbackView.translatesAutoresizingMaskIntoConstraints = false
        liveView.translatesAutoresizingMaskIntoConstraints = false
        phaseBadgeLabel.translatesAutoresizingMaskIntoConstraints = false
        for child in [fallbackView, liveView] {
            NSLayoutConstraint.activate([
                child.leadingAnchor.constraint(equalTo: surface.leadingAnchor),
                child.trailingAnchor.constraint(equalTo: surface.trailingAnchor),
                child.topAnchor.constraint(equalTo: surface.topAnchor),
                child.bottomAnchor.constraint(equalTo: surface.bottomAnchor),
            ])
        }
        NSLayoutConstraint.activate([
            phaseBadgeLabel.topAnchor.constraint(equalTo: surface.topAnchor, constant: 12),
            phaseBadgeLabel.trailingAnchor.constraint(equalTo: surface.trailingAnchor, constant: -12),
            phaseBadgeLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 80),
            phaseBadgeLabel.heightAnchor.constraint(equalToConstant: 26),
        ])

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
        resetButton.nextKeyView = disposeButton
        disposeButton.nextKeyView = startButton
        nativeFocusViews = [
            startButton, selectButton, phasePopup, mouthSlider, reducedMotion,
            hideButton, occludeButton, resumeButton, resetButton, disposeButton,
        ]
    }

    private func focusEligible(_ candidate: NSView) -> Bool {
        guard viewIsVisible(candidate) else { return false }
        if let control = candidate as? NSControl, !control.isEnabled {
            return false
        }
        return candidate.acceptsFirstResponder
    }

    private func viewIsVisible(_ candidate: NSView) -> Bool {
        var current: NSView? = candidate
        while let view = current {
            if view.isHidden { return false }
            current = view.superview
        }
        return true
    }

    private func responder(_ responder: NSResponder?, belongsTo candidate: NSView) -> Bool {
        guard let responderView = responder as? NSView else {
            return responder === candidate
        }
        return responderView === candidate || responderView.isDescendant(of: candidate)
    }

    private func button(_ title: String, _ action: Selector) -> FocusableButton {
        let button = FocusableButton(title: title, target: self, action: action)
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
        phasePopup.selectItem(withTitle: snapshot.phase.rawValue)
        let badgePhase: String
        if case .failed = snapshot.lifecycle {
            badgePhase = PresentationPhase.failed.rawValue
        } else {
            badgePhase = snapshot.phase.rawValue
        }
        phaseBadgeLabel.stringValue = badgePhase.uppercased()
        phaseBadgeLabel.setAccessibilityValue(badgePhase)
        reducedMotion.state = snapshot.reducedMotion ? .on : .off
        if snapshot.lifecycle != .live || snapshot.phase != .speaking || snapshot.reducedMotion {
            mouthSlider.doubleValue = 0
        }
        if case .failed = snapshot.lifecycle {
            view.window?.makeFirstResponder(startButton)
        } else {
            restoreUsableFocus()
        }
    }

    private func restoreUsableFocus() {
        guard let window = view.window else { return }
        if let current = nativeFocusViews.first(where: {
            responder(window.firstResponder, belongsTo: $0)
        }), focusEligible(current) {
            return
        }
        let target = nativeFocusViews.first(where: focusEligible)
        if let target {
            window.makeFirstResponder(target)
        }
    }

    @objc private func startRenderer() {
        if surfaceController.snapshot.retryAvailable {
            retryDiagnosticSelection()
        } else {
            surfaceController.start()
        }
    }

    @objc private func selectAsset() {
        Task { @MainActor in
            await processDiagnosticCapture(await selector.selectAndCapture())
        }
    }

    @objc private func changeReducedMotion() {
        surfaceController.setReducedMotion(reducedMotion.state == .on)
    }

    @objc private func simulateHidden() { surfaceController.setVisibility(.hidden) }
    @objc private func simulateOccluded() { surfaceController.setVisibility(.occluded) }
    @objc private func resumeVisible() { surfaceController.setVisibility(.visible) }
    @objc private func resetRenderer() {
        syntheticProjection.reset()
        surfaceController.reset(generationID: nil, reason: .operator)
    }
    @objc private func changePhase() {
        guard let phase = PresentationPhase(rawValue: phasePopup.titleOfSelectedItem ?? "") else {
            return
        }
        guard let payload = syntheticProjection.project(phase: phase) else { return }
        surfaceController.project(payload)
    }

    @objc private func changeMouth() {
        guard let payload = syntheticProjection.mouth(scalar: mouthSlider.doubleValue) else {
            return
        }
        surfaceController.setMouth(payload)
    }
    @objc private func disposeRenderer() { surfaceController.dispose() }

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
