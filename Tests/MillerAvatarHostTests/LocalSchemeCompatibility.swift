import Foundation
import MillerAvatarCore
@testable import MillerAvatarHost

extension LocalSchemeHandler {
    convenience init(
        lease: RendererSessionLease,
        sessionController: RendererSessionController,
        bundledResources: [String: Data],
        resourceRecords: [LocalSchemeResourceRecord],
        profile: LoadedAvatarProfile,
        scheduleDelivery: @escaping (@escaping () -> Void) -> Void = { $0() }
    ) throws {
        try self.init(
            lease: lease,
            sessionController: sessionController,
            bundledResources: bundledResources,
            resourceRecords: resourceRecords,
            scheduleDelivery: scheduleDelivery
        )
        guard install(profile) else {
            throw LocalSchemeError.rejected
        }
    }

    convenience init(
        lease: RendererSessionLease,
        sessionController: RendererSessionController,
        bundledResources: [String: Data],
        resourceRecords: [LocalSchemeResourceRecord],
        assetToken: UUID,
        assetData: Data,
        scheduleDelivery: @escaping (@escaping () -> Void) -> Void = { $0() }
    ) throws {
        try self.init(
            lease: lease,
            sessionController: sessionController,
            bundledResources: bundledResources,
            resourceRecords: resourceRecords,
            profile: .localSchemeFixture(
                modelToken: assetToken,
                modelData: assetData
            ),
            scheduleDelivery: scheduleDelivery
        )
    }

}

extension LoadedAvatarProfile {
    static func localSchemeFixture(
        profileRevision: UInt64 = 1,
        modelToken: UUID,
        modelData: Data,
        motions: [(AvatarMotionRole, UUID, Data)] = []
    ) -> Self {
        var bindings: [AvatarMotionRole: LoadedMotionBinding] = [:]
        for (role, token, data) in motions {
            bindings[role] = .ready(
                motionID: token,
                motion: AdmittedMotion(
                    token: token,
                    bytes: data,
                    summary: .placeholder
                )
            )
        }
        return Self(
            profileRevision: profileRevision,
            model: AdmittedAsset(
                token: modelToken,
                bytes: modelData,
                summary: .placeholder
            ),
            motionBindings: bindings
        )
    }
}

private extension AssetAdmissionSummary {
    static let placeholder = Self(
        nodeCount: 0,
        meshCount: 0,
        materialCount: 0,
        imageCount: 0,
        decodedImagePixels: 0,
        accessorReferencedBytes: 0,
        capabilities: AssetAdmissionCapabilities(
            lookAt: false,
            springBone: false,
            mtoonMaterials: 0
        )
    )
}

private extension MotionAdmissionSummary {
    static let placeholder = Self(
        nodeCount: 0,
        channelCount: 0,
        keyframeScalarValues: 0,
        durationMilliseconds: 0,
        hasExpressionTracks: false,
        hasLookAtTrack: false
    )
}
