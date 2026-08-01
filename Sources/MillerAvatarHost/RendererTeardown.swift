import Foundation
import MillerAvatarCore
@preconcurrency import WebKit

@MainActor
public protocol RendererTeardownActions: AnyObject {
    func beginDisposal(_ reason: DisposalReason)
    func leaseDidInvalidate()
    func stopNavigation()
    func cancelSchemeTasks()
    func removeScriptHandlers()
    func clearDelegates()
    func revokeAssetServing()
    func releaseAssetBytes()
    func removeWebView()
    func returnToFallback()
}

@MainActor
public final class RendererTeardown {
    public private(set) var hasRun = false

    private let lease: RendererSessionLease
    private let sessionController: RendererSessionController
    private let actions: any RendererTeardownActions
    private let isApplicationTerminating: () -> Bool

    public init(
        lease: RendererSessionLease,
        sessionController: RendererSessionController,
        actions: any RendererTeardownActions,
        isApplicationTerminating: @escaping () -> Bool = { false }
    ) {
        self.lease = lease
        self.sessionController = sessionController
        self.actions = actions
        self.isApplicationTerminating = isApplicationTerminating
    }

    public func run() {
        run(reason: .operator)
    }

    public func handle(_ failure: RendererPolicyFailure) {
        run(reason: failure.disposalReason)
    }

    private func run(reason: DisposalReason) {
        guard !hasRun else {
            return
        }
        hasRun = true

        sessionController.release(lease)
        actions.leaseDidInvalidate()
        actions.beginDisposal(reason)
        actions.stopNavigation()
        actions.cancelSchemeTasks()
        actions.removeScriptHandlers()
        actions.clearDelegates()
        actions.revokeAssetServing()
        actions.releaseAssetBytes()
        actions.removeWebView()
        if !isApplicationTerminating() {
            actions.returnToFallback()
        }
    }
}

@MainActor
public final class WebKitRendererTeardownActions: RendererTeardownActions {
    private weak var webView: WKWebView?
    private let schemeHandler: LocalSchemeHandler
    private let scriptHandlerNames: [String]
    private let onDisposing: (DisposalReason) -> Void
    private let onDelegatesCleared: () -> Void
    private let fallback: () -> Void

    public init(
        webView: WKWebView,
        schemeHandler: LocalSchemeHandler,
        scriptHandlerNames: [String],
        onDisposing: @escaping (DisposalReason) -> Void = { _ in },
        onDelegatesCleared: @escaping () -> Void = {},
        fallback: @escaping () -> Void
    ) {
        self.webView = webView
        self.schemeHandler = schemeHandler
        self.scriptHandlerNames = scriptHandlerNames
        self.onDisposing = onDisposing
        self.onDelegatesCleared = onDelegatesCleared
        self.fallback = fallback
    }

    public func beginDisposal(_ reason: DisposalReason) {
        onDisposing(reason)
    }

    public func leaseDidInvalidate() {}

    public func stopNavigation() {
        webView?.stopLoading()
    }

    public func cancelSchemeTasks() {
        schemeHandler.cancelAll()
    }

    public func removeScriptHandlers() {
        guard let controller = webView?.configuration.userContentController else {
            return
        }
        for name in scriptHandlerNames {
            controller.removeScriptMessageHandler(forName: name)
        }
    }

    public func clearDelegates() {
        webView?.navigationDelegate = nil
        webView?.uiDelegate = nil
        onDelegatesCleared()
    }

    public func revokeAssetServing() {
        schemeHandler.revokeAssetServing()
    }

    public func releaseAssetBytes() {
        schemeHandler.releaseAssetBytes()
    }

    public func removeWebView() {
        webView?.removeFromSuperview()
        webView = nil
    }

    public func returnToFallback() {
        fallback()
    }
}
