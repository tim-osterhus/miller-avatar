import Foundation
import Testing
import MillerAvatarCore
@testable import MillerAvatarHost

@MainActor
@Suite struct RendererTeardownTests {
    @Test func unifiedTeardownUsesTheRequiredOrder() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let actions = RecordingTeardownActions(lease: lease)
        let teardown = RendererTeardown(
            lease: lease,
            sessionController: controller,
            actions: actions
        )

        teardown.run()

        #expect(actions.events == [
            "invalidate lease",
            "begin disposal operator",
            "stop navigation",
            "cancel scheme tasks",
            "remove script handlers",
            "clear delegates",
            "revoke asset serving",
            "release asset bytes",
            "remove web view",
            "return to fallback",
        ])
    }

    @Test func repeatedTeardownIsIdempotent() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let actions = RecordingTeardownActions(lease: lease)
        let teardown = RendererTeardown(
            lease: lease,
            sessionController: controller,
            actions: actions
        )

        teardown.run()
        teardown.run()

        #expect(actions.events.count == 10)
        #expect(teardown.hasRun)
    }

    @Test func policyFailureRunsTheUnifiedTeardownPath() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let actions = RecordingTeardownActions(lease: lease)
        let teardown = RendererTeardown(
            lease: lease,
            sessionController: controller,
            actions: actions
        )
        let policy = NavigationPolicy(
            lease: lease,
            onPolicyFailure: teardown.handle
        )

        #expect(
            policy.decide(
                NavigationRequest(
                    url: URL(string: "https://example.com")!,
                    isMainFrame: true,
                    navigationType: .other
                )
            ) == .cancel
        )

        #expect(teardown.hasRun)
        #expect(actions.events.contains("return to fallback"))
    }

    @Test func staleTeardownCannotReleaseAReplacementWithTheSameID() {
        let controller = RendererSessionController()
        let id = UUID()
        let oldLease = controller.begin(id: id)
        let actions = RecordingTeardownActions(lease: oldLease)
        let teardown = RendererTeardown(
            lease: oldLease,
            sessionController: controller,
            actions: actions
        )
        let replacement = controller.begin(id: id)

        teardown.run()

        #expect(controller.isCurrent(replacement))
    }

    @Test func applicationTerminationSuppressesOnlyTheFallback() {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let actions = RecordingTeardownActions(lease: lease)
        let teardown = RendererTeardown(
            lease: lease,
            sessionController: controller,
            actions: actions,
            isApplicationTerminating: { true }
        )

        teardown.run()

        #expect(actions.events.contains("remove web view"))
        #expect(actions.events.contains("return to fallback") == false)
    }

    @Test func webViewConfigurationIsNonpersistentAndClosed() throws {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let resources = closedBundleResources()
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: resources,
            resourceRecords: resources.keys.sorted().map {
                LocalSchemeResourceRecord.make(path: $0, data: resources[$0]!)
            },
            assetToken: UUID(),
            assetData: Data()
        )
        let observationHandler = RendererObservationHandler(
            lease: lease,
            sessionController: controller
        )
        let configuration = WebViewFactory.makeConfiguration(
            schemeHandler: handler,
            observationHandler: observationHandler
        )

        #expect(configuration.websiteDataStore.isPersistent == false)
        #expect(
            configuration.preferences.javaScriptCanOpenWindowsAutomatically
                == false
        )
        #expect(
            configuration.urlSchemeHandler(
                forURLScheme: LocalSchemeHandler.scheme
            ) === handler
        )
        #expect(WebViewFactory.entryRequest.url == LocalSchemeHandler.entrypointURL)
        #expect(WebViewFactory.entryRequest.url?.isFileURL == false)
    }

    private func closedBundleResources() -> [String: Data] {
        [
            "/bundle/index.html": Data("html".utf8),
            "/bundle/app.js": Data("js".utf8),
            "/bundle/styles.css": Data("css".utf8),
            "/bundle/bundle-manifest.json": Data("manifest".utf8),
            "/bundle/bundle-metafile.json": Data("metafile".utf8),
        ]
    }
}

@MainActor
private final class RecordingTeardownActions: RendererTeardownActions {
    private let lease: RendererSessionLease
    private(set) var events: [String] = []

    init(lease: RendererSessionLease) {
        self.lease = lease
    }

    func leaseDidInvalidate() {
        #expect(lease.isValid == false)
        events.append("invalidate lease")
    }

    func beginDisposal(_ reason: DisposalReason) {
        events.append("begin disposal \(reason.rawValue)")
    }

    func stopNavigation() {
        events.append("stop navigation")
    }

    func cancelSchemeTasks() {
        #expect(lease.isValid == false)
        events.append("cancel scheme tasks")
    }

    func removeScriptHandlers() {
        events.append("remove script handlers")
    }

    func clearDelegates() {
        events.append("clear delegates")
    }

    func revokeAssetServing() {
        events.append("revoke asset serving")
    }

    func releaseAssetBytes() {
        events.append("release asset bytes")
    }

    func removeWebView() {
        events.append("remove web view")
    }

    func returnToFallback() {
        events.append("return to fallback")
    }
}
