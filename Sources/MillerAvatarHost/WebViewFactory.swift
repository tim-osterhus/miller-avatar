import Foundation
@preconcurrency import WebKit

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

    public static var entryRequest: URLRequest {
        URLRequest(url: LocalSchemeHandler.entrypointURL)
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
        let webView = WKWebView(
            frame: .zero,
            configuration: makeConfiguration(
                schemeHandler: schemeHandler,
                observationHandler: observationHandler
            )
        )
        webView.navigationDelegate = navigationPolicy
        webView.uiDelegate = navigationPolicy
        webView.load(entryRequest)
        return RendererWebViewAssembly(
            webView: webView,
            schemeHandler: schemeHandler,
            navigationPolicy: navigationPolicy,
            observationHandler: observationHandler
        )
    }
}
