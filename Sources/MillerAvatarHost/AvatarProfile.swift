import Foundation
import MillerAvatarCore

public enum AvatarProfileStoreError: String, Error, Equatable, Sendable, CustomStringConvertible, LocalizedError {
    case invalidDisplayName = "invalid_display_name"
    case profileLimit = "profile_limit"
    case motionLimit = "motion_limit"
    case unknownProfile = "unknown_profile"
    case unknownMotion = "unknown_motion"
    case quarantined = "quarantined"
    case motionQuarantined = "motion_quarantined"
    case bookmarkCreationFailed = "bookmark_creation_failed"
    case bookmarkResolutionFailed = "bookmark_resolution_failed"
    case securityScopeDenied = "security_scope_denied"
    case assetRejected = "asset_rejected"
    case resourceLimit = "resource_limit"
    case motionRejected = "motion_rejected"
    case corruptStore = "corrupt_store"
    case persistenceFailed = "persistence_failed"
    case cancelled = "cancelled"

    public var description: String { rawValue }

    public var errorDescription: String? { rawValue }
}

package struct AvatarProfile: Codable, Equatable, Sendable {
    package static let schemaVersion = 2
    package static let currentSchemaVersion = schemaVersion
    package static let maximumDisplayNameScalars = 80
    package static let maximumBookmarkBytes = 64 * 1024
    package static let maximumConsecutiveLoadFailures = 3
    package static let rightsLabel = "local_user_supplied"
    package static let performanceProfile = "lightweight"

    package let schemaVersion: Int
    package let id: UUID
    package let displayName: String
    package let modelBookmark: Data
    package let modelSHA256: String
    package let capturedByteCount: UInt64
    package let rightsLabel: String
    package let performanceProfile: String
    package let consecutiveLoadFailures: Int

    package var isQuarantined: Bool {
        consecutiveLoadFailures == Self.maximumConsecutiveLoadFailures
    }

    package init(
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

    package init(
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

    package func encode(to encoder: Encoder) throws {
        guard isValid else { throw AvatarProfileStoreError.corruptStore }
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

    package init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        guard Set(container.allKeys.map(\.stringValue))
                == Set(CodingKeys.allCases.map(\.rawValue))
        else {
            throw AvatarProfileStoreError.corruptStore
        }
        self.init(
            schemaVersion: try container.decode(Int.self, forKey: .schemaVersion),
            id: try container.decode(UUID.self, forKey: .id),
            displayName: try container.decode(String.self, forKey: .displayName),
            modelBookmark: try container.decode(Data.self, forKey: .modelBookmark),
            modelSHA256: try container.decode(String.self, forKey: .modelSHA256),
            capturedByteCount: try container.decode(UInt64.self, forKey: .capturedByteCount),
            rightsLabel: try container.decode(String.self, forKey: .rightsLabel),
            performanceProfile: try container.decode(String.self, forKey: .performanceProfile),
            consecutiveLoadFailures: try container.decode(
                Int.self,
                forKey: .consecutiveLoadFailures
            )
        )
        guard isValid else { throw AvatarProfileStoreError.corruptStore }
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

    private var isValid: Bool {
        schemaVersion == Self.currentSchemaVersion
            && Self.isValidDisplayName(displayName)
            && modelBookmark.count <= Self.maximumBookmarkBytes
            && Self.isValidSHA256(modelSHA256)
            && capturedByteCount <= AssetBudget.alpha.capturedBytes
            && rightsLabel == Self.rightsLabel
            && performanceProfile == Self.performanceProfile
            && (0...Self.maximumConsecutiveLoadFailures)
                .contains(consecutiveLoadFailures)
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

public struct AvatarMotionSummary: Equatable, Sendable {
    public let id: UUID
    public let displayName: String
    public let capturedByteCount: UInt64
    public let consecutiveLoadFailures: Int
    public let isQuarantined: Bool
    public let lastFailure: MotionFailureCode?

    public init(
        id: UUID,
        displayName: String,
        capturedByteCount: UInt64,
        consecutiveLoadFailures: Int,
        lastFailure: MotionFailureCode?
    ) {
        self.id = id
        self.displayName = displayName
        self.capturedByteCount = capturedByteCount
        self.consecutiveLoadFailures = consecutiveLoadFailures
        isQuarantined = consecutiveLoadFailures == AvatarProfile.maximumConsecutiveLoadFailures
        self.lastFailure = lastFailure
    }
}

public enum AvatarModelStatus: String, Equatable, Sendable {
    case available
    case quarantined
}

public struct AvatarProfileSummary: Equatable, Sendable {
    public let id: UUID
    public let displayName: String
    public let profileRevision: UInt64
    public let modelCapturedByteCount: UInt64
    public let modelConsecutiveLoadFailures: Int
    public let modelStatus: AvatarModelStatus
    public let motions: [AvatarMotionSummary]
    public let motionBindings: [AvatarMotionRole: UUID]

    public init(
        id: UUID,
        displayName: String,
        profileRevision: UInt64,
        modelCapturedByteCount: UInt64,
        modelConsecutiveLoadFailures: Int,
        modelStatus: AvatarModelStatus,
        motions: [AvatarMotionSummary],
        motionBindings: [AvatarMotionRole: UUID]
    ) {
        self.id = id
        self.displayName = displayName
        self.profileRevision = profileRevision
        self.modelCapturedByteCount = modelCapturedByteCount
        self.modelConsecutiveLoadFailures = modelConsecutiveLoadFailures
        self.modelStatus = modelStatus
        self.motions = motions
        self.motionBindings = motionBindings
    }
}

public enum ProfileLoadFailure: String, Equatable, Sendable {
    case unknownProfile = "unknown_profile"
    case corruptStore = "corrupt_store"
    case persistenceFailed = "persistence_failed"
    case modelUnavailable = "model_unavailable"
    case modelRejected = "model_rejected"
    case modelQuarantined = "model_quarantined"
}

public enum ProfileLoadDisposition: Equatable, Sendable {
    case accepted
    case notReady
    case disposed
    case superseded
    case rejected(ProfileLoadFailure)
}

package struct StoredAvatarMotionReference: Codable, Equatable, Sendable {
    package let id: UUID
    package let displayName: String
    package let bookmark: Data
    package let sha256: String
    package let capturedByteCount: UInt64
    package let consecutiveLoadFailures: Int
    package let lastFailure: MotionFailureCode?

    package init(
        id: UUID,
        displayName: String,
        bookmark: Data,
        sha256: String,
        capturedByteCount: UInt64,
        consecutiveLoadFailures: Int,
        lastFailure: MotionFailureCode?
    ) {
        self.id = id
        self.displayName = displayName
        self.bookmark = bookmark
        self.sha256 = sha256
        self.capturedByteCount = capturedByteCount
        self.consecutiveLoadFailures = consecutiveLoadFailures
        self.lastFailure = lastFailure
    }

    package var summary: AvatarMotionSummary {
        AvatarMotionSummary(
            id: id,
            displayName: displayName,
            capturedByteCount: capturedByteCount,
            consecutiveLoadFailures: consecutiveLoadFailures,
            lastFailure: lastFailure
        )
    }

    package var isQuarantined: Bool {
        consecutiveLoadFailures == AvatarProfile.maximumConsecutiveLoadFailures
    }

    package func encode(to encoder: Encoder) throws {
        guard isValid else { throw AvatarProfileStoreError.corruptStore }
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(displayName, forKey: .displayName)
        try container.encode(bookmark, forKey: .bookmark)
        try container.encode(sha256, forKey: .sha256)
        try container.encode(capturedByteCount, forKey: .capturedByteCount)
        try container.encode(consecutiveLoadFailures, forKey: .consecutiveLoadFailures)
        try container.encode(lastFailure, forKey: .lastFailure)
    }

    package init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        guard Set(container.allKeys.map(\.stringValue))
                == Set(CodingKeys.allCases.map(\.rawValue))
        else {
            throw AvatarProfileStoreError.corruptStore
        }
        self.init(
            id: try container.decode(UUID.self, forKey: .id),
            displayName: try container.decode(String.self, forKey: .displayName),
            bookmark: try container.decode(Data.self, forKey: .bookmark),
            sha256: try container.decode(String.self, forKey: .sha256),
            capturedByteCount: try container.decode(UInt64.self, forKey: .capturedByteCount),
            consecutiveLoadFailures: try container.decode(
                Int.self,
                forKey: .consecutiveLoadFailures
            ),
            lastFailure: try container.decodeIfPresent(MotionFailureCode.self, forKey: .lastFailure)
        )
        guard isValid else { throw AvatarProfileStoreError.corruptStore }
    }

    private var isValid: Bool {
        AvatarProfile.isValidDisplayName(displayName)
            && bookmark.count <= AvatarProfile.maximumBookmarkBytes
            && AvatarProfile.isValidSHA256(sha256)
            && capturedByteCount <= MotionBudget.lightweight.capturedBytes
            && (0...AvatarProfile.maximumConsecutiveLoadFailures)
                .contains(consecutiveLoadFailures)
            && (consecutiveLoadFailures == 0
                ? lastFailure == nil
                : lastFailure != nil && lastFailure != .cancelled)
    }

    private enum CodingKeys: String, CodingKey, CaseIterable {
        case id
        case displayName
        case bookmark
        case sha256
        case capturedByteCount
        case consecutiveLoadFailures
        case lastFailure
    }
}

package struct StoredAvatarProfile: Codable, Equatable, Sendable {
    package static let currentSchemaVersion = 2
    package static let maximumMotionLibraryEntries = 32

    package let schemaVersion: Int
    package let id: UUID
    package let displayName: String
    package let modelBookmark: Data
    package let modelSHA256: String
    package let capturedByteCount: UInt64
    package let rightsLabel: String
    package let performanceProfile: String
    package let consecutiveLoadFailures: Int
    package let profileRevision: UInt64
    package let motionLibrary: [UUID: StoredAvatarMotionReference]
    package let motionBindings: [AvatarMotionRole: UUID]

    package init(
        id: UUID,
        displayName: String,
        modelBookmark: Data,
        modelSHA256: String,
        capturedByteCount: UInt64,
        profileRevision: UInt64,
        motionLibrary: [UUID: StoredAvatarMotionReference],
        motionBindings: [AvatarMotionRole: UUID],
        consecutiveLoadFailures: Int = 0
    ) {
        self.init(
            schemaVersion: Self.currentSchemaVersion,
            id: id,
            displayName: displayName,
            modelBookmark: modelBookmark,
            modelSHA256: modelSHA256,
            capturedByteCount: capturedByteCount,
            rightsLabel: AvatarProfile.rightsLabel,
            performanceProfile: AvatarProfile.performanceProfile,
            consecutiveLoadFailures: consecutiveLoadFailures,
            profileRevision: profileRevision,
            motionLibrary: motionLibrary,
            motionBindings: motionBindings
        )
    }

    package init(
        schemaVersion: Int,
        id: UUID,
        displayName: String,
        modelBookmark: Data,
        modelSHA256: String,
        capturedByteCount: UInt64,
        rightsLabel: String,
        performanceProfile: String,
        consecutiveLoadFailures: Int,
        profileRevision: UInt64,
        motionLibrary: [UUID: StoredAvatarMotionReference],
        motionBindings: [AvatarMotionRole: UUID]
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
        self.profileRevision = profileRevision
        self.motionLibrary = motionLibrary
        self.motionBindings = motionBindings
    }

    package var summary: AvatarProfileSummary {
        AvatarProfileSummary(
            id: id,
            displayName: displayName,
            profileRevision: profileRevision,
            modelCapturedByteCount: capturedByteCount,
            modelConsecutiveLoadFailures: consecutiveLoadFailures,
            modelStatus: consecutiveLoadFailures == AvatarProfile.maximumConsecutiveLoadFailures
                ? .quarantined
                : .available,
            motions: motionLibrary.values.sorted(by: motionSort).map(\.summary),
            motionBindings: motionBindings
        )
    }

    package var isQuarantined: Bool {
        consecutiveLoadFailures == AvatarProfile.maximumConsecutiveLoadFailures
    }

    package func encode(to encoder: Encoder) throws {
        guard isValid else { throw AvatarProfileStoreError.corruptStore }
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
        try container.encode(profileRevision, forKey: .profileRevision)

        var library = container.nestedContainer(
            keyedBy: DynamicCodingKey.self,
            forKey: .motionLibrary
        )
        for id in motionLibrary.keys.sorted(by: uuidSort) {
            try library.encode(
                motionLibrary[id],
                forKey: DynamicCodingKey(id.uuidString.lowercased())
            )
        }

        var bindings = container.nestedContainer(
            keyedBy: DynamicCodingKey.self,
            forKey: .motionBindings
        )
        for role in AvatarMotionRole.allCases where motionBindings[role] != nil {
            try bindings.encode(
                motionBindings[role]!.uuidString.lowercased(),
                forKey: DynamicCodingKey(role.rawValue)
            )
        }
    }

    package init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        guard Set(container.allKeys.map(\.stringValue))
                == Set(CodingKeys.allCases.map(\.rawValue))
        else {
            throw AvatarProfileStoreError.corruptStore
        }

        let libraryContainer = try container.nestedContainer(
            keyedBy: DynamicCodingKey.self,
            forKey: .motionLibrary
        )
        var motionLibrary: [UUID: StoredAvatarMotionReference] = [:]
        for key in libraryContainer.allKeys {
            guard let motionID = canonicalUUID(key.stringValue),
                  motionLibrary[motionID] == nil
            else { throw AvatarProfileStoreError.corruptStore }
            let reference = try libraryContainer.decode(
                StoredAvatarMotionReference.self,
                forKey: key
            )
            guard reference.id == motionID else {
                throw AvatarProfileStoreError.corruptStore
            }
            motionLibrary[motionID] = reference
        }

        let bindingContainer = try container.nestedContainer(
            keyedBy: DynamicCodingKey.self,
            forKey: .motionBindings
        )
        var motionBindings: [AvatarMotionRole: UUID] = [:]
        for key in bindingContainer.allKeys {
            guard let role = AvatarMotionRole(rawValue: key.stringValue),
                  motionBindings[role] == nil
            else { throw AvatarProfileStoreError.corruptStore }
            let motionID = try decodeCanonicalUUID(
                from: bindingContainer,
                forKey: key
            )
            motionBindings[role] = motionID
        }

        self.init(
            schemaVersion: try container.decode(Int.self, forKey: .schemaVersion),
            id: try container.decode(UUID.self, forKey: .id),
            displayName: try container.decode(String.self, forKey: .displayName),
            modelBookmark: try container.decode(Data.self, forKey: .modelBookmark),
            modelSHA256: try container.decode(String.self, forKey: .modelSHA256),
            capturedByteCount: try container.decode(UInt64.self, forKey: .capturedByteCount),
            rightsLabel: try container.decode(String.self, forKey: .rightsLabel),
            performanceProfile: try container.decode(String.self, forKey: .performanceProfile),
            consecutiveLoadFailures: try container.decode(
                Int.self,
                forKey: .consecutiveLoadFailures
            ),
            profileRevision: try container.decode(UInt64.self, forKey: .profileRevision),
            motionLibrary: motionLibrary,
            motionBindings: motionBindings
        )
        guard isValid else { throw AvatarProfileStoreError.corruptStore }
    }

    private var isValid: Bool {
        schemaVersion == Self.currentSchemaVersion
            && AvatarProfile.isValidDisplayName(displayName)
            && modelBookmark.count <= AvatarProfile.maximumBookmarkBytes
            && AvatarProfile.isValidSHA256(modelSHA256)
            && capturedByteCount <= AssetBudget.alpha.capturedBytes
            && rightsLabel == AvatarProfile.rightsLabel
            && performanceProfile == AvatarProfile.performanceProfile
            && (0...AvatarProfile.maximumConsecutiveLoadFailures)
                .contains(consecutiveLoadFailures)
            && profileRevision > 0
            && profileRevision <= BridgeContract.maximumSafeInteger
            && motionLibrary.count <= Self.maximumMotionLibraryEntries
            && motionLibrary.allSatisfy { id, reference in
                id == reference.id
                    && reference.lastFailure != .cancelled
            }
            && motionBindings.keys.allSatisfy { AvatarMotionRole.allCases.contains($0) }
            && motionBindings.values.allSatisfy { motionLibrary[$0] != nil }
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
        case profileRevision
        case motionLibrary
        case motionBindings
    }
}

package enum LoadedMotionBinding: Equatable, Sendable {
    case ready(motionID: UUID, motion: AdmittedMotion)
    case rejected(motionID: UUID, reason: MotionFailureCode)
}

package struct LoadedAvatarProfile: Equatable, Sendable {
    package let profileRevision: UInt64
    package let model: AdmittedAsset
    package let motionBindings: [AvatarMotionRole: LoadedMotionBinding]

    package init(
        profileRevision: UInt64,
        model: AdmittedAsset,
        motionBindings: [AvatarMotionRole: LoadedMotionBinding] = [:]
    ) {
        self.profileRevision = profileRevision
        self.model = model
        self.motionBindings = motionBindings
    }

    package var loadPayload: LoadProfilePayload {
        var bindings: [AvatarMotionRole: MotionBindingPayload] = [:]
        for role in AvatarMotionRole.allCases {
            switch motionBindings[role] {
            case .ready(_, let motion):
                bindings[role] = .ready(token: motion.token)
            case .rejected:
                bindings[role] = .rejected
            case nil:
                bindings[role] = .missing
            }
        }
        return LoadProfilePayload(
            profileRevision: profileRevision,
            modelToken: model.token,
            motionBindings: bindings
        )
    }

    package var readyMotions: [UUID: AdmittedMotion] {
        var result: [UUID: AdmittedMotion] = [:]
        for binding in motionBindings.values {
            guard case .ready(_, let motion) = binding else { continue }
            result[motion.token] = motion
        }
        return result
    }
}

package final class ProfileMaterializationLease: @unchecked Sendable {
    private let lock = NSLock()
    private let beforeLockHook: @Sendable () -> Void
    private var active = true
    private var value: LoadedAvatarProfile?

    package init(
        beforeLock: @escaping @Sendable () -> Void = {}
    ) {
        beforeLockHook = beforeLock
    }

    package var isActive: Bool {
        lock.lock()
        defer { lock.unlock() }
        return active
    }

    package var preparedProfile: LoadedAvatarProfile? {
        lock.lock()
        defer { lock.unlock() }
        return value
    }

    package func invalidate() {
        lock.lock()
        active = false
        value = nil
        lock.unlock()
    }

    @discardableResult
    package func performIfActive<Value>(
        _ operation: () throws -> Value
    ) rethrows -> Value? {
        beforeLockHook()
        lock.lock()
        defer { lock.unlock() }
        guard active, !Task.isCancelled else { return nil }
        return try operation()
    }

    @discardableResult
    package func performIfActiveAndPublish(
        _ operation: () throws -> LoadedAvatarProfile
    ) rethrows -> Bool {
        beforeLockHook()
        lock.lock()
        defer { lock.unlock() }
        guard active, !Task.isCancelled else { return false }
        value = try operation()
        return true
    }

    package func takePreparedProfile() -> LoadedAvatarProfile? {
        lock.lock()
        defer { lock.unlock() }
        let result = value
        value = nil
        return result
    }

    package func release() {
        invalidate()
    }

    deinit { release() }
}

private struct DynamicCodingKey: CodingKey, Hashable {
    let stringValue: String
    let intValue: Int?

    init(_ string: String) {
        stringValue = string
        intValue = nil
    }

    init?(stringValue: String) { self.init(stringValue) }

    init?(intValue: Int) {
        stringValue = String(intValue)
        self.intValue = intValue
    }
}

private func uuidSort(_ lhs: UUID, _ rhs: UUID) -> Bool {
    lhs.uuidString.lowercased() < rhs.uuidString.lowercased()
}

private func motionSort(
    _ lhs: StoredAvatarMotionReference,
    _ rhs: StoredAvatarMotionReference
) -> Bool {
    uuidSort(lhs.id, rhs.id)
}

private func canonicalUUID(_ value: String) -> UUID? {
    guard let uuid = UUID(uuidString: value),
          uuid.uuidString.lowercased() == value
    else { return nil }
    return uuid
}

private func decodeCanonicalUUID(
    from container: KeyedDecodingContainer<DynamicCodingKey>,
    forKey key: DynamicCodingKey
) throws -> UUID {
    let value = try container.decode(String.self, forKey: key)
    guard let uuid = canonicalUUID(value) else {
        throw AvatarProfileStoreError.corruptStore
    }
    return uuid
}
