import AppKit
import Darwin
import Foundation
import MillerAvatarCore
import UniformTypeIdentifiers

package enum AssetCaptureResult: Equatable, Sendable {
    case cancelled
    case captured(Data)
    case rejected(FailureCode)
}

package protocol SecurityScopedAccess: AnyObject, Sendable {
    func startAccessing(_ url: URL) -> Bool
    func stopAccessing(_ url: URL)
}

package final class SystemSecurityScopedAccess: SecurityScopedAccess, @unchecked Sendable {
    package func startAccessing(_ url: URL) -> Bool {
        url.startAccessingSecurityScopedResource()
    }

    package func stopAccessing(_ url: URL) {
        url.stopAccessingSecurityScopedResource()
    }
}

@MainActor
package final class AssetSelectionController {
    package init() {}

    package func selectAndCapture() async -> AssetCaptureResult {
        await selectAndCapture(qualityMode: .lightweight)
    }

    package func selectAndCapture(
        qualityMode: AvatarAssetQualityMode
    ) async -> AssetCaptureResult {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false
        panel.canChooseFiles = true
        panel.canCreateDirectories = false
        panel.resolvesAliases = false
        panel.allowedContentTypes = [UTType(filenameExtension: "vrm") ?? .data]
        guard await panel.begin() == .OK, let url = panel.url else {
            return .cancelled
        }
        return Self.capture(url: url, qualityMode: qualityMode)
    }

    package nonisolated static func capture(
        url: URL,
        maximumBytes: UInt64 = AssetBudget.alpha.capturedBytes,
        securityScope: (any SecurityScopedAccess)? = nil
    ) -> AssetCaptureResult {
        let securityScope = securityScope ?? SystemSecurityScopedAccess()
        guard securityScope.startAccessing(url) else {
            return .rejected(.assetRejected)
        }
        defer { securityScope.stopAccessing(url) }

        return captureScoped(url: url, maximumBytes: maximumBytes)
    }

    package nonisolated static func capture(
        url: URL,
        qualityMode: AvatarAssetQualityMode,
        securityScope: (any SecurityScopedAccess)? = nil
    ) -> AssetCaptureResult {
        capture(
            url: url,
            maximumBytes: AssetBudget.budget(for: qualityMode).capturedBytes,
            securityScope: securityScope
        )
    }

    package nonisolated static func capture(
        url: URL,
        mode: AvatarAssetQualityMode,
        securityScope: (any SecurityScopedAccess)? = nil
    ) -> AssetCaptureResult {
        capture(url: url, qualityMode: mode, securityScope: securityScope)
    }

    package nonisolated static func captureScoped(
        url: URL,
        maximumBytes: UInt64 = AssetBudget.alpha.capturedBytes
    ) -> AssetCaptureResult {

        let descriptor = open(url.path, O_RDONLY | O_NONBLOCK | O_NOFOLLOW | O_CLOEXEC)
        guard descriptor >= 0 else {
            return .rejected(.assetRejected)
        }
        defer { close(descriptor) }

        var before = stat()
        guard fstat(descriptor, &before) == 0,
              (before.st_mode & S_IFMT) == S_IFREG,
              before.st_size >= 0
        else {
            return .rejected(.assetRejected)
        }
        let byteCount = UInt64(before.st_size)
        guard byteCount <= maximumBytes, byteCount <= UInt64(Int.max) else {
            return .rejected(.resourceLimit)
        }

        var bytes = Data(count: Int(byteCount))
        let completed = bytes.withUnsafeMutableBytes { buffer -> Bool in
            guard var destination = buffer.baseAddress else {
                return byteCount == 0
            }
            var remaining = buffer.count
            while remaining > 0 {
                let count = read(descriptor, destination, remaining)
                if count < 0, errno == EINTR { continue }
                guard count > 0 else { return false }
                remaining -= count
                destination = destination.advanced(by: count)
            }
            var probe: UInt8 = 0
            return read(descriptor, &probe, 1) == 0
        }
        guard completed else {
            return .rejected(.assetRejected)
        }

        var after = stat()
        guard fstat(descriptor, &after) == 0,
              sameIdentity(before, after)
        else {
            return .rejected(.assetRejected)
        }
        return .captured(bytes)
    }

    package nonisolated static func captureScoped(
        url: URL,
        qualityMode: AvatarAssetQualityMode
    ) -> AssetCaptureResult {
        captureScoped(
            url: url,
            maximumBytes: AssetBudget.budget(for: qualityMode).capturedBytes
        )
    }

    package nonisolated static func captureScoped(
        url: URL,
        mode: AvatarAssetQualityMode
    ) -> AssetCaptureResult {
        captureScoped(url: url, qualityMode: mode)
    }

    private nonisolated static func sameIdentity(_ lhs: stat, _ rhs: stat) -> Bool {
        lhs.st_dev == rhs.st_dev
            && lhs.st_ino == rhs.st_ino
            && lhs.st_size == rhs.st_size
            && lhs.st_mtimespec.tv_sec == rhs.st_mtimespec.tv_sec
            && lhs.st_mtimespec.tv_nsec == rhs.st_mtimespec.tv_nsec
    }
}
