import AppKit
import Foundation
@preconcurrency import WebKit

@MainActor
internal final class NoninteractiveAvatarWebView: WKWebView {
    override var acceptsFirstResponder: Bool { false }

    override func hitTest(_ point: NSPoint) -> NSView? { nil }

    override func accessibilityIsIgnored() -> Bool { true }

    override func accessibilityChildren() -> [Any]? { [] }

    override var registeredDraggedTypes: [NSPasteboard.PasteboardType] { [] }

    override func registerForDraggedTypes(_ types: [NSPasteboard.PasteboardType]) {}
}

@MainActor
public struct RendererWebViewAssembly {
    public let webView: WKWebView
    public let schemeHandler: LocalSchemeHandler
    public let navigationPolicy: NavigationPolicy
    public let observationHandler: RendererObservationHandler
}

@MainActor
public enum WebViewFactory {
    public static let scriptMessageHandlerNames = [
        RendererObservationHandler.channelName,
    ]

    public static func entryRequest(for sessionID: UUID) -> URLRequest {
        URLRequest(url: LocalSchemeHandler.entrypointURL(for: sessionID))
    }

    public static func makeConfiguration(
        schemeHandler: LocalSchemeHandler,
        observationHandler: RendererObservationHandler
    ) -> WKWebViewConfiguration {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .nonPersistent()
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = false
        configuration.setURLSchemeHandler(
            schemeHandler,
            forURLScheme: LocalSchemeHandler.scheme
        )
        configuration.userContentController.add(
            observationHandler,
            name: RendererObservationHandler.channelName
        )
        return configuration
    }

    public static func make(
        schemeHandler: LocalSchemeHandler,
        navigationPolicy: NavigationPolicy,
        observationHandler: RendererObservationHandler
    ) -> RendererWebViewAssembly {
        let webView = NoninteractiveAvatarWebView(
            frame: .zero,
            configuration: makeConfiguration(
                schemeHandler: schemeHandler,
                observationHandler: observationHandler
            )
        )
        webView.navigationDelegate = navigationPolicy
        webView.uiDelegate = navigationPolicy
        webView.load(URLRequest(url: schemeHandler.entrypointURL))
        return RendererWebViewAssembly(
            webView: webView,
            schemeHandler: schemeHandler,
            navigationPolicy: navigationPolicy,
            observationHandler: observationHandler
        )
    }
}
