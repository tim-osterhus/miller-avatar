import Foundation
import MillerAvatarCore
@preconcurrency import WebKit

public enum ClosedNavigationType: Equatable, Sendable {
    case linkActivated
    case formSubmitted
    case backForward
    case reload
    case formResubmitted
    case other
}

public struct NavigationRequest: Equatable, Sendable {
    public let url: URL?
    public let isMainFrame: Bool
    public let navigationType: ClosedNavigationType
    public let hasTargetFrame: Bool
    public let isRedirect: Bool
    public let shouldPerformDownload: Bool

    public init(
        url: URL?,
        isMainFrame: Bool,
        navigationType: ClosedNavigationType,
        hasTargetFrame: Bool = true,
        isRedirect: Bool = false,
        shouldPerformDownload: Bool = false
    ) {
        self.url = url
        self.isMainFrame = isMainFrame
        self.navigationType = navigationType
        self.hasTargetFrame = hasTargetFrame
        self.isRedirect = isRedirect
        self.shouldPerformDownload = shouldPerformDownload
    }
}

public enum ClosedNavigationDecision: Equatable, Sendable {
    case allow
    case cancel
}

public enum ClosedAuthenticationDisposition: Equatable, Sendable {
    case cancelAuthenticationChallenge
}

public struct RendererPolicyFailure: Equatable, Sendable {
    public let code: FailureCode
    public let operation: FailureOperation
    public let disposalReason: DisposalReason

    public init(
        code: FailureCode,
        operation: FailureOperation,
        disposalReason: DisposalReason
    ) {
        self.code = code
        self.operation = operation
        self.disposalReason = disposalReason
    }

    public static let policyViolation = Self(
        code: .policyViolation,
        operation: .policy,
        disposalReason: .failure
    )
}

public final class NavigationPolicy: NSObject, WKNavigationDelegate, WKUIDelegate {
    private let lease: RendererSessionLease
    private let onPolicyFailure: (RendererPolicyFailure) -> Void
    private let violation: () -> Void
    private var admittedInitialNavigation = false
    private var awaitingInitialResponse = false

    public init(
        lease: RendererSessionLease,
        violation: @escaping () -> Void = {}
    ) {
        self.lease = lease
        self.onPolicyFailure = { _ in }
        self.violation = violation
    }

    public init(
        lease: RendererSessionLease,
        onPolicyFailure: @escaping (RendererPolicyFailure) -> Void
    ) {
        self.lease = lease
        self.onPolicyFailure = onPolicyFailure
        self.violation = {}
    }

    public var allowsNewWindow: Bool { false }
    public var allowsClose: Bool { false }
    public var authenticationDisposition: ClosedAuthenticationDisposition {
        .cancelAuthenticationChallenge
    }

    public func decide(_ request: NavigationRequest) -> ClosedNavigationDecision {
        var admitted = false
        let current = lease.performIfValid {
            guard !admittedInitialNavigation,
                  request.url == LocalSchemeHandler.entrypointURL,
                  request.isMainFrame,
                  request.hasTargetFrame,
                  request.navigationType == .other,
                  !request.isRedirect,
                  !request.shouldPerformDownload
            else {
                return
            }
            admittedInitialNavigation = true
            awaitingInitialResponse = true
            admitted = true
        }
        guard current, admitted else {
            reportViolationIfValid()
            return .cancel
        }
        return .allow
    }

    public func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping @MainActor (WKNavigationActionPolicy) -> Void
    ) {
        let request = NavigationRequest(
            url: navigationAction.request.url,
            isMainFrame: navigationAction.targetFrame?.isMainFrame == true,
            navigationType: Self.closedType(navigationAction.navigationType),
            hasTargetFrame: navigationAction.targetFrame != nil,
            shouldPerformDownload: navigationAction.shouldPerformDownload
        )
        decisionHandler(decide(request) == .allow ? .allow : .cancel)
    }

    public func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationResponse: WKNavigationResponse,
        decisionHandler: @escaping @MainActor (WKNavigationResponsePolicy) -> Void
    ) {
        var admitted = false
        let current = lease.performIfValid {
            guard awaitingInitialResponse,
                  navigationResponse.isForMainFrame,
                  navigationResponse.response.url == LocalSchemeHandler.entrypointURL,
                  navigationResponse.canShowMIMEType
            else {
                return
            }
            awaitingInitialResponse = false
            admitted = true
        }
        guard current, admitted else {
            reportViolationIfValid()
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    public func webView(
        _ webView: WKWebView,
        didReceive challenge: URLAuthenticationChallenge,
        completionHandler: @escaping @MainActor (
            URLSession.AuthChallengeDisposition,
            URLCredential?
        ) -> Void
    ) {
        reportViolationIfValid()
        completionHandler(.cancelAuthenticationChallenge, nil)
    }

    public func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        reportViolationIfValid()
        return nil
    }

    public func webViewDidClose(_ webView: WKWebView) {
        reportViolationIfValid()
    }

    private func reportViolationIfValid() {
        lease.performIfValid { [onPolicyFailure, violation] in
            onPolicyFailure(.policyViolation)
            violation()
        }
    }

    private static func closedType(
        _ type: WKNavigationType
    ) -> ClosedNavigationType {
        switch type {
        case .linkActivated:
            .linkActivated
        case .formSubmitted:
            .formSubmitted
        case .backForward:
            .backForward
        case .reload:
            .reload
        case .formResubmitted:
            .formResubmitted
        case .other:
            .other
        @unknown default:
            .other
        }
    }
}
