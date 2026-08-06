import AppKit
import Foundation
import Testing
@testable import MillerAvatarHost
@preconcurrency import WebKit

@MainActor
@Suite struct WebViewFactoryTests {
    @Test func installedWebViewIsExcludedFromInteractionAndFocus() throws {
        let sessionController = RendererSessionController()
        let lease = sessionController.begin()
        let resources = bundleResources()
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
        let observationHandler = RendererObservationHandler(
            lease: lease,
            sessionController: sessionController
        )
        let policy = NavigationPolicy(lease: lease)
        let webView = WebViewFactory.make(
            schemeHandler: handler,
            navigationPolicy: policy,
            observationHandler: observationHandler
        ).webView

        #expect(!webView.acceptsFirstResponder)
        #expect(webView.hitTest(NSPoint(x: 1, y: 1)) == nil)
        #expect(!webView.isAccessibilityElement())
        #expect(webView.accessibilityChildren()?.isEmpty == true)
        #expect(webView.registeredDraggedTypes.isEmpty)
        #expect(webView.nextKeyView == nil)
        #expect(webView.previousKeyView == nil)
    }

    private func bundleResources() -> [String: Data] {
        [
            "/bundle/index.html": Data("html".utf8),
            "/bundle/app.js": Data("js".utf8),
            "/bundle/styles.css": Data("css".utf8),
            "/bundle/bundle-manifest.json": Data("manifest".utf8),
            "/bundle/bundle-metafile.json": Data("metafile".utf8),
        ]
    }
}
