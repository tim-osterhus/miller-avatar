import Foundation
import Testing
import MillerAvatarCore
import MillerAvatarHost

@Suite struct PublicAPIContractTests {
    @Test
    func surfaceExposesOnlyTheProfileLoadTransaction() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/AvatarSurfaceController.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)
        let compactSource = source.filter { !$0.isWhitespace }

        #expect(compactSource.contains(
            "publicfuncload(profileID:UUID,fromstore:AvatarProfileStore)async->ProfileLoadDisposition"
        ))
        #expect(!compactSource.contains("publicfuncload(_asset:"))
    }

    @Test
    func bridgeDispatchDoesNotReadAnUnreservedSequenceExternally() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/WebKitAvatarRendererDriver.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)

        #expect(!source.contains("nextCommandSequence"))
    }

    @Test
    func rawWebKitDriverIsPackageOnly() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/WebKitAvatarRendererDriver.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)

        #expect(!source.contains("public final class WebKitAvatarRendererDriver"))
        #expect(!source.contains("public init()"))
    }

    @Test
    func profileStoreExposesSummariesButNotRawProfileShells() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/AvatarProfile.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)

        #expect(source.contains("public struct AvatarProfileSummary"))
        #expect(source.contains("public struct AvatarMotionSummary"))
        #expect(!source.contains("public struct AvatarProfile:"))
        #expect(source.contains("package struct LoadedAvatarProfile"))
        #expect(!source.contains("public let modelBookmark"))
        #expect(!source.contains("public let modelSHA256"))
        #expect(!source.contains("public let bytes: Data"))
    }

    @Test
    func storeUsesV2PersistenceAndReturnsSanitizedSummaries() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/AvatarProfileStore.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)

        #expect(source.contains("profiles-v2.json"))
        #expect(source.contains("func list() throws -> [AvatarProfileSummary]"))
        #expect(source.contains("func importModel(at url: URL, displayName: String) throws -> AvatarProfileSummary"))
        #expect(source.contains("ProfileMaterializationLease"))
        #expect(source.contains("materializeForRendering"))
    }

    @Test
    func storeUsesTheFrozenV21MutationAndLeaseSignatures() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/AvatarProfileStore.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)
        let compactSource = source.filter { !$0.isWhitespace }

        #expect(compactSource.contains(
            "publicfuncprofile(id:UUID)throws->AvatarProfileSummary"
        ))
        #expect(compactSource.contains(
            "publicfuncrename(id:UUID,displayName:String)throws"
        ))
        #expect(compactSource.contains(
            "publicfuncbindMotion("
        ))
        #expect(compactSource.contains(
            "publicfuncretryMotion(profileID:UUID,motionID:UUID)throws"
        ))
        #expect(compactSource.contains(
            "packagefuncrecordMotionRendererSuccess(profileID:UUID,motionID:UUID)throws"
        ))
        #expect(compactSource.contains(
            "packagefuncrecordMotionRendererFailure(profileID:UUID,motionID:UUID)throws"
        ))
        #expect(compactSource.contains("lease:ProfileMaterializationLease"))
        #expect(compactSource.contains(
            "packagefuncmaterializeForRendering(id:UUID,lease:ProfileMaterializationLease)asyncthrows"
        ))
        #expect(!compactSource.contains("materializeForRendering(profileID:UUID"))
    }

    @Test
    func rawAssetSelectionSurfaceIsPackageOnly() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarHost/AssetSelectionController.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)

        #expect(!source.contains("public enum AssetCaptureResult"))
        #expect(!source.contains("public protocol SecurityScopedAccess"))
        #expect(!source.contains("public final class AssetSelectionController"))
        #expect(!source.contains("public nonisolated static func capture"))
    }

    @Test
    func rawAssetAdmissionSurfaceIsPackageOnly() throws {
        let sourceURL = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .appendingPathComponent("Sources/MillerAvatarCore/AssetAdmission.swift")
        let source = try String(contentsOf: sourceURL, encoding: .utf8)

        #expect(source.contains("package struct AdmittedAsset"))
        #expect(!source.contains("public struct AdmittedAsset"))
        #expect(source.contains("package enum AssetAdmissionResult"))
        #expect(source.contains("package struct AssetAdmission"))
        #expect(!source.contains("public enum AssetAdmissionResult"))
    }

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

        #expect(source.contains("package func load(_ profile: LoadedAvatarProfile) -> AssetLoadDisposition"))
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
