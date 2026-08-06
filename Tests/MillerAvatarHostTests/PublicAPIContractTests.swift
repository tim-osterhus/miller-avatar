import Foundation
import Testing
import MillerAvatarCore
import MillerAvatarHost

@Suite struct PublicAPIContractTests {
    @Test func callerOwnedPayloadsAreConstructibleWithoutTestableImports() {
        let generationID = UUID(uuidString: "33333333-3333-4333-8333-333333333333")!
        let playbackID = UUID(uuidString: "44444444-4444-4444-8444-444444444444")!
        let projection = ProjectPhasePayload(
            projectionSequence: 1,
            generationID: generationID,
            phase: .speaking,
            playbackID: playbackID
        )
        let mouth = SetMouthPayload(
            generationID: generationID,
            playbackID: playbackID,
            cueIndex: 1,
            playbackOffsetMilliseconds: 100,
            scalar: 0.5
        )

        #expect(projection.generationID == generationID)
        #expect(mouth.playbackID == playbackID)
    }

    @Test func hostLoadSurfaceIsAdmittedOnlyAndReportsReadiness() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/HostOrchestrator.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)

        #expect(source.contains("public func load(_ asset: AdmittedAsset) -> AssetLoadDisposition"))
        #expect(!source.contains("public func load(assetToken:"))
    }

    @Test func localSchemeAssetIngressIsNotPublic() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/LocalSchemeHandler.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)
        let compactSource = source.filter { !$0.isWhitespace }

        #expect(!compactSource.contains(
            "publicinit(lease:RendererSessionLease,sessionController:RendererSessionController,bundledResources:[String:Data],resourceRecords:[LocalSchemeResourceRecord],assetToken:UUID,assetData:Data"
        ))
        #expect(!compactSource.contains(
            "publicfuncinstallAsset(token:UUID,data:Data)"
        ))
    }
}
