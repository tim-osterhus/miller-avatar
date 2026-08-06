import Foundation
import MillerAvatarCore

public enum AvatarProfileStoreError: String, Error, Equatable, Sendable, CustomStringConvertible, LocalizedError {
    case invalidDisplayName = "invalid_display_name"
    case profileLimit = "profile_limit"
    case unknownProfile = "unknown_profile"
    case quarantined = "quarantined"
    case bookmarkCreationFailed = "bookmark_creation_failed"
    case bookmarkResolutionFailed = "bookmark_resolution_failed"
    case securityScopeDenied = "security_scope_denied"
    case assetRejected = "asset_rejected"
    case corruptStore = "corrupt_store"
    case persistenceFailed = "persistence_failed"

    public var description: String { rawValue }

    public var errorDescription: String? { rawValue }
}

public struct AvatarProfile: Codable, Equatable, Sendable {
    public static let schemaVersion = 1
    public static let currentSchemaVersion = schemaVersion
    public static let maximumDisplayNameScalars = 80
    public static let maximumBookmarkBytes = 64 * 1024
    public static let maximumConsecutiveLoadFailures = 3
    public static let rightsLabel = "local_user_supplied"
    public static let performanceProfile = "lightweight"

    public let schemaVersion: Int
    public let id: UUID
    public let displayName: String
    public let modelBookmark: Data
    public let modelSHA256: String
    public let capturedByteCount: UInt64
    public let rightsLabel: String
    public let performanceProfile: String
    public let consecutiveLoadFailures: Int

    public var isQuarantined: Bool {
        consecutiveLoadFailures == Self.maximumConsecutiveLoadFailures
    }

    public init(
        id: UUID,
        displayName: String,
        modelBookmark: Data,
        modelSHA256: String,
        capturedByteCount: UInt64,
        consecutiveLoadFailures: Int = 0
    ) {
        self.init(
            schemaVersion: Self.currentSchemaVersion,
            id: id,
            displayName: displayName,
            modelBookmark: modelBookmark,
            modelSHA256: modelSHA256,
            capturedByteCount: capturedByteCount,
            rightsLabel: Self.rightsLabel,
            performanceProfile: Self.performanceProfile,
            consecutiveLoadFailures: consecutiveLoadFailures
        )
    }

    public init(
        schemaVersion: Int,
        id: UUID,
        displayName: String,
        modelBookmark: Data,
        modelSHA256: String,
        capturedByteCount: UInt64,
        rightsLabel: String,
        performanceProfile: String,
        consecutiveLoadFailures: Int
    ) {
        self.schemaVersion = schemaVersion
        self.id = id
        self.displayName = displayName
        self.modelBookmark = modelBookmark
        self.modelSHA256 = modelSHA256
        self.capturedByteCount = capturedByteCount
        self.rightsLabel = rightsLabel
        self.performanceProfile = performanceProfile
        self.consecutiveLoadFailures = consecutiveLoadFailures
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(schemaVersion, forKey: .schemaVersion)
        try container.encode(id, forKey: .id)
        try container.encode(displayName, forKey: .displayName)
        try container.encode(modelBookmark, forKey: .modelBookmark)
        try container.encode(modelSHA256, forKey: .modelSHA256)
        try container.encode(capturedByteCount, forKey: .capturedByteCount)
        try container.encode(rightsLabel, forKey: .rightsLabel)
        try container.encode(performanceProfile, forKey: .performanceProfile)
        try container.encode(consecutiveLoadFailures, forKey: .consecutiveLoadFailures)
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: DynamicCodingKey.self)
        let expected = Set(CodingKeys.allCases.map(\.rawValue))
        let actual = Set(container.allKeys.map(\.stringValue))
        guard actual == expected else {
            throw AvatarProfileStoreError.corruptStore
        }

        func key(_ value: CodingKeys) -> DynamicCodingKey {
            DynamicCodingKey(value.rawValue)
        }

        let schemaVersion = try container.decode(Int.self, forKey: key(.schemaVersion))
        let id = try container.decode(UUID.self, forKey: key(.id))
        let displayName = try container.decode(String.self, forKey: key(.displayName))
        let modelBookmark = try container.decode(Data.self, forKey: key(.modelBookmark))
        let modelSHA256 = try container.decode(String.self, forKey: key(.modelSHA256))
        let capturedByteCount = try container.decode(UInt64.self, forKey: key(.capturedByteCount))
        let rightsLabel = try container.decode(String.self, forKey: key(.rightsLabel))
        let performanceProfile = try container.decode(String.self, forKey: key(.performanceProfile))
        let consecutiveLoadFailures = try container.decode(
            Int.self,
            forKey: key(.consecutiveLoadFailures)
        )

        guard schemaVersion == Self.currentSchemaVersion,
              Self.isValidDisplayName(displayName),
              modelBookmark.count <= Self.maximumBookmarkBytes,
              Self.isValidSHA256(modelSHA256),
              capturedByteCount <= AssetBudget.alpha.capturedBytes,
              rightsLabel == Self.rightsLabel,
              performanceProfile == Self.performanceProfile,
              (0...Self.maximumConsecutiveLoadFailures).contains(consecutiveLoadFailures)
        else {
            throw AvatarProfileStoreError.corruptStore
        }

        self.init(
            schemaVersion: schemaVersion,
            id: id,
            displayName: displayName,
            modelBookmark: modelBookmark,
            modelSHA256: modelSHA256,
            capturedByteCount: capturedByteCount,
            rightsLabel: rightsLabel,
            performanceProfile: performanceProfile,
            consecutiveLoadFailures: consecutiveLoadFailures
        )
    }

    package static func isValidDisplayName(_ value: String) -> Bool {
        guard !value.isEmpty,
              value.unicodeScalars.count <= maximumDisplayNameScalars
        else {
            return false
        }
        return value.unicodeScalars.allSatisfy { scalar in
            let value = scalar.value
            return value > 0x1F && !(0x7F...0x9F).contains(value)
        }
    }

    package static func isValidSHA256(_ value: String) -> Bool {
        guard value.count == 64 else { return false }
        return value.utf8.allSatisfy { byte in
            (byte >= 48 && byte <= 57)
                || (byte >= 97 && byte <= 102)
        }
    }

    private enum CodingKeys: String, CodingKey, CaseIterable {
        case schemaVersion
        case id
        case displayName
        case modelBookmark
        case modelSHA256
        case capturedByteCount
        case rightsLabel
        case performanceProfile
        case consecutiveLoadFailures
    }
}

public struct LoadedAvatarProfile: Equatable, Sendable {
    public let profile: AvatarProfile
    public let asset: AdmittedAsset

    public var admittedAsset: AdmittedAsset { asset }

    public init(profile: AvatarProfile, asset: AdmittedAsset) {
        self.profile = profile
        self.asset = asset
    }
}

private struct DynamicCodingKey: CodingKey, Hashable {
    let stringValue: String
    let intValue: Int?

    init(_ string: String) {
        stringValue = string
        intValue = nil
    }

    init?(stringValue: String) {
        self.init(stringValue)
    }

    init?(intValue: Int) {
        stringValue = String(intValue)
        self.intValue = intValue
    }
}
