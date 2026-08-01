import Foundation
import Testing
@testable import MillerAvatarCore

@Test func buildIdentity() {
    #expect(MillerAvatarBuild.productName == "Miller Avatar Alpha")
    #expect(
        MillerAvatarBuild.bundleIdentifier == "ai.millrace.miller-avatar.alpha"
    )
    #expect(MillerAvatarBuild.minimumMacOSMajor == 15)
}

@Test func buildVersionIdentityIsPackageOwned() {
    #expect(MillerAvatarBuild.shortVersion == "0.0.1")
    #expect(MillerAvatarBuild.bundleVersion == "1")
}

@Test func reviewedBundleMetadataAndFallbackArePresent() throws {
    let repositoryRoot = URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
    let plistData = try Data(contentsOf: repositoryRoot.appendingPathComponent("Config/Info.plist"))
    let plist = try #require(
        PropertyListSerialization.propertyList(from: plistData, format: nil) as? [String: Any]
    )

    #expect(plist["LSArchitecturePriority"] as? [String] == ["arm64"])
    #expect(
        FileManager.default.fileExists(
            atPath: repositoryRoot
                .appendingPathComponent("Resources/Static/MillerAvatarFallback.svg")
                .path
        )
    )
}
