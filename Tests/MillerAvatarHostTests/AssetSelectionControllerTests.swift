import Foundation
import Testing
import MillerAvatarCore
@testable import MillerAvatarHost

@Suite struct AssetSelectionControllerTests {
    @Test func capturesOneRegularFileWithoutReturningItsPath() throws {
        let directory = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: directory) }
        let file = directory.appendingPathComponent("avatar.vrm")
        let bytes = Data([0x67, 0x6c, 0x54, 0x46])
        try bytes.write(to: file)
        let scope = RecordingSecurityScope()

        let result = AssetSelectionController.capture(url: file, securityScope: scope)

        #expect(result == .captured(bytes))
        #expect(scope.started == 1)
        #expect(scope.stopped == 1)
        #expect(!String(describing: result).contains(file.path))
    }

    @Test func rejectsASymlinkWithoutReadingItsTarget() throws {
        let directory = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: directory) }
        let target = directory.appendingPathComponent("target.vrm")
        let link = directory.appendingPathComponent("link.vrm")
        try Data("secret".utf8).write(to: target)
        try FileManager.default.createSymbolicLink(at: link, withDestinationURL: target)

        #expect(AssetSelectionController.capture(url: link) == .rejected(.assetRejected))
    }

    @Test func rejectsAFileLargerThanTheInclusiveCaptureCeiling() throws {
        let directory = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: directory) }
        let file = directory.appendingPathComponent("avatar.vrm")
        try Data(repeating: 0, count: 5).write(to: file)

        let result = AssetSelectionController.capture(url: file, maximumBytes: 4)

        #expect(result == .rejected(.resourceLimit))
    }
}

private final class RecordingSecurityScope: SecurityScopedAccess, @unchecked Sendable {
    private(set) var started = 0
    private(set) var stopped = 0

    func startAccessing(_ url: URL) -> Bool {
        started += 1
        return true
    }

    func stopAccessing(_ url: URL) {
        stopped += 1
    }
}
