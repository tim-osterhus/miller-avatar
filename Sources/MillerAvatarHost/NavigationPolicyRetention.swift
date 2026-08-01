import Foundation

/// Holds WebKit's weak navigation and UI delegates for one renderer session.
@MainActor
public final class NavigationPolicyRetention {
    private var policy: NavigationPolicy?

    public init(_ policy: NavigationPolicy) {
        self.policy = policy
    }

    public func releaseAfterDelegatesCleared() {
        policy = nil
    }
}
