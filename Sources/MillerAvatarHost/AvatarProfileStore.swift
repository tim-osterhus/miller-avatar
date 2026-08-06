import CryptoKit
import Darwin
import Foundation
import MillerAvatarCore

package struct AvatarResolvedBookmark: Equatable, Sendable {
    package let url: URL
    package let isStale: Bool

    package init(url: URL, isStale: Bool) {
        self.url = url
        self.isStale = isStale
    }
}

package struct AvatarProfileStoreDependencies: Sendable {
    package let admission: @Sendable (Data) -> AssetAdmissionResult
    package let bookmarkCreator: @Sendable (URL) throws -> Data
    package let bookmarkResolver: @Sendable (Data) throws -> AvatarResolvedBookmark
    package let securityScope: any SecurityScopedAccess
    package let capture: @Sendable (URL, UInt64) throws -> Data

    package init(
        admission: @escaping @Sendable (Data) -> AssetAdmissionResult,
        bookmarkCreator: @escaping @Sendable (URL) throws -> Data,
        bookmarkResolver: @escaping @Sendable (Data) throws -> AvatarResolvedBookmark,
        securityScope: any SecurityScopedAccess,
        capture: @escaping @Sendable (URL, UInt64) throws -> Data
    ) {
        self.admission = admission
        self.bookmarkCreator = bookmarkCreator
        self.bookmarkResolver = bookmarkResolver
        self.securityScope = securityScope
        self.capture = capture
    }

    package static func production() -> Self {
        Self(
            admission: { bytes in
                AssetAdmission().admitSynchronously(bytes)
            },
            bookmarkCreator: { url in
                try url.bookmarkData(
                    options: .withSecurityScope,
                    includingResourceValuesForKeys: nil,
                    relativeTo: nil
                )
            },
            bookmarkResolver: { bookmark in
                var isStale = false
                let url = try URL(
                    resolvingBookmarkData: bookmark,
                    options: .withSecurityScope,
                    relativeTo: nil,
                    bookmarkDataIsStale: &isStale
                )
                return AvatarResolvedBookmark(url: url, isStale: isStale)
            },
            securityScope: SystemSecurityScopedAccess(),
            capture: { url, maximumBytes in
                switch AssetSelectionController.captureScoped(
                    url: url,
                    maximumBytes: maximumBytes
                ) {
                case .captured(let bytes):
                    return bytes
                case .cancelled, .rejected:
                    throw AvatarProfileStoreError.assetRejected
                }
            }
        )
    }
}

public actor AvatarProfileStore {
    private static let fileName = "profiles-v1.json"
    private static let maximumProfiles = 32
    private static let maximumJSONBytes = 2 * 1024 * 1024

    private let root: URL
    private let dependencies: AvatarProfileStoreDependencies

    public init(root: URL) {
        self.root = root
        dependencies = .production()
    }

    package init(root: URL, dependencies: AvatarProfileStoreDependencies) {
        self.root = root
        self.dependencies = dependencies
    }

    package init(
        root: URL,
        admission: @escaping @Sendable (Data) -> AssetAdmissionResult,
        bookmarkCreator: @escaping @Sendable (URL) throws -> Data,
        bookmarkResolver: @escaping @Sendable (Data) throws -> AvatarResolvedBookmark,
        securityScope: any SecurityScopedAccess,
        capture: @escaping @Sendable (URL, UInt64) throws -> Data
    ) {
        self.init(
            root: root,
            dependencies: AvatarProfileStoreDependencies(
                admission: admission,
                bookmarkCreator: bookmarkCreator,
                bookmarkResolver: bookmarkResolver,
                securityScope: securityScope,
                capture: capture
            )
        )
    }

    public func list() throws -> [AvatarProfile] {
        try readProfiles()
    }

    public func profile(id: UUID) throws -> AvatarProfile? {
        try readProfiles().first { $0.id == id }
    }

    public func importModel(at url: URL, displayName: String) throws -> LoadedAvatarProfile {
        guard AvatarProfile.isValidDisplayName(displayName) else {
            throw AvatarProfileStoreError.invalidDisplayName
        }

        var profiles = try readProfiles()
        guard profiles.count < Self.maximumProfiles else {
            throw AvatarProfileStoreError.profileLimit
        }

        let imported: ImportedAsset
        do {
            imported = try withSecurityScope(url) {
                let bytes = try capture(url: url)
                let asset = try admit(bytes)
                let digest = digest(asset.bytes)
                let bookmark: Data
                do {
                    bookmark = try dependencies.bookmarkCreator(url)
                } catch {
                    throw AvatarProfileStoreError.bookmarkCreationFailed
                }
                guard bookmark.count <= AvatarProfile.maximumBookmarkBytes else {
                    throw AvatarProfileStoreError.bookmarkCreationFailed
                }
                return ImportedAsset(asset: asset, bookmark: bookmark, digest: digest)
            }
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch {
            throw AvatarProfileStoreError.assetRejected
        }

        let profile = AvatarProfile(
            id: UUID(),
            displayName: displayName,
            modelBookmark: imported.bookmark,
            modelSHA256: imported.digest,
            capturedByteCount: UInt64(imported.asset.bytes.count)
        )
        profiles.append(profile)
        try commit(profiles)
        return LoadedAvatarProfile(profile: profile, asset: imported.asset)
    }

    public func load(id: UUID) throws -> LoadedAvatarProfile {
        var profiles = try readProfiles()
        guard let index = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        let current = profiles[index]
        guard !current.isQuarantined else {
            throw AvatarProfileStoreError.quarantined
        }

        let resolved: AvatarResolvedBookmark
        do {
            resolved = try dependencies.bookmarkResolver(current.modelBookmark)
        } catch {
            return try failLoad(
                id: id,
                profiles: profiles,
                error: .bookmarkResolutionFailed
            )
        }

        let loaded: LoadedAsset
        do {
            loaded = try withSecurityScope(resolved.url) {
                let bytes = try capture(url: resolved.url)
                let asset = try admit(bytes)
                let digest = digest(asset.bytes)
                var refreshedBookmark: Data?
                if resolved.isStale {
                    do {
                        let bookmark = try dependencies.bookmarkCreator(resolved.url)
                        guard bookmark.count <= AvatarProfile.maximumBookmarkBytes else {
                            throw AvatarProfileStoreError.bookmarkCreationFailed
                        }
                        refreshedBookmark = bookmark
                    } catch let error as AvatarProfileStoreError {
                        throw error
                    } catch {
                        throw AvatarProfileStoreError.bookmarkCreationFailed
                    }
                }
                return LoadedAsset(
                    asset: asset,
                    digest: digest,
                    refreshedBookmark: refreshedBookmark
                )
            }
        } catch let error as AvatarProfileStoreError {
            return try failLoad(id: id, profiles: profiles, error: error)
        } catch {
            return try failLoad(id: id, profiles: profiles, error: .assetRejected)
        }

        var updated = current
        if let refreshedBookmark = loaded.refreshedBookmark {
            updated = replacing(updated, modelBookmark: refreshedBookmark)
        }
        if updated.modelSHA256 != loaded.digest
            || updated.capturedByteCount != UInt64(loaded.asset.bytes.count)
        {
            updated = replacing(
                updated,
                modelSHA256: loaded.digest,
                capturedByteCount: UInt64(loaded.asset.bytes.count)
            )
        }
        if updated != current {
            profiles[index] = updated
            try commit(profiles)
        }
        return LoadedAvatarProfile(profile: updated, asset: loaded.asset)
    }

    public func recordRendererSuccess(id: UUID) throws {
        var profiles = try readProfiles()
        guard let index = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard profiles[index].consecutiveLoadFailures != 0 else { return }
        profiles[index] = replacing(profiles[index], consecutiveLoadFailures: 0)
        try commit(profiles)
    }

    public func recordRendererFailure(id: UUID) throws {
        var profiles = try readProfiles()
        guard let index = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        let next = min(
            AvatarProfile.maximumConsecutiveLoadFailures,
            profiles[index].consecutiveLoadFailures + 1
        )
        guard next != profiles[index].consecutiveLoadFailures else { return }
        profiles[index] = replacing(profiles[index], consecutiveLoadFailures: next)
        try commit(profiles)
    }

    public func remove(id: UUID) throws {
        var profiles = try readProfiles()
        guard let index = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        profiles.remove(at: index)
        try commit(profiles)
    }

    private func capture(url: URL) throws -> Data {
        let bytes = try dependencies.capture(url, AssetBudget.alpha.capturedBytes)
        guard bytes.count <= AssetBudget.alpha.capturedBytes,
              bytes.count <= Int.max
        else {
            throw AvatarProfileStoreError.assetRejected
        }
        return bytes
    }

    private func admit(_ bytes: Data) throws -> AdmittedAsset {
        guard case .admitted(let asset) = dependencies.admission(bytes),
              asset.bytes.count <= AssetBudget.alpha.capturedBytes
        else {
            throw AvatarProfileStoreError.assetRejected
        }
        return asset
    }

    private func withSecurityScope<Value>(
        _ url: URL,
        operation: () throws -> Value
    ) throws -> Value {
        guard dependencies.securityScope.startAccessing(url) else {
            throw AvatarProfileStoreError.securityScopeDenied
        }
        defer { dependencies.securityScope.stopAccessing(url) }
        return try operation()
    }

    private func digest(_ bytes: Data) -> String {
        SHA256.hash(data: bytes).map { String(format: "%02x", $0) }.joined()
    }

    private func failLoad<Value>(
        id: UUID,
        profiles: [AvatarProfile],
        error: AvatarProfileStoreError
    ) throws -> Value {
        guard let index = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        var updated = profiles
        let next = min(
            AvatarProfile.maximumConsecutiveLoadFailures,
            updated[index].consecutiveLoadFailures + 1
        )
        if next != updated[index].consecutiveLoadFailures {
            updated[index] = replacing(updated[index], consecutiveLoadFailures: next)
            try commit(updated)
        }
        throw error
    }

    private func replacing(
        _ profile: AvatarProfile,
        schemaVersion: Int? = nil,
        modelBookmark: Data? = nil,
        modelSHA256: String? = nil,
        capturedByteCount: UInt64? = nil,
        consecutiveLoadFailures: Int? = nil
    ) -> AvatarProfile {
        AvatarProfile(
            schemaVersion: schemaVersion ?? profile.schemaVersion,
            id: profile.id,
            displayName: profile.displayName,
            modelBookmark: modelBookmark ?? profile.modelBookmark,
            modelSHA256: modelSHA256 ?? profile.modelSHA256,
            capturedByteCount: capturedByteCount ?? profile.capturedByteCount,
            rightsLabel: profile.rightsLabel,
            performanceProfile: profile.performanceProfile,
            consecutiveLoadFailures: consecutiveLoadFailures ?? profile.consecutiveLoadFailures
        )
    }

    private func readProfiles() throws -> [AvatarProfile] {
        guard let rootDescriptor = try openRootDirectoryForRead() else {
            return []
        }
        defer { _ = close(rootDescriptor) }

        let descriptor: Int32
        do {
            descriptor = Self.fileName.withCString { name in
                openat(
                    rootDescriptor,
                    name,
                    O_RDONLY | O_NONBLOCK | O_NOFOLLOW | O_CLOEXEC
                )
            }
            if descriptor < 0 {
                let error = errno
                if error == ENOENT { return [] }
                if error == EISDIR || error == ELOOP {
                    throw AvatarProfileStoreError.corruptStore
                }
                var info = stat()
                let status = Self.fileName.withCString { name in
                    fstatat(rootDescriptor, name, &info, AT_SYMLINK_NOFOLLOW)
                }
                if status == 0, (info.st_mode & S_IFMT) != S_IFREG {
                    throw AvatarProfileStoreError.corruptStore
                }
                throw AvatarProfileStoreError.persistenceFailed
            }
        }
        defer { _ = close(descriptor) }

        var before = stat()
        guard fstat(descriptor, &before) == 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        guard (before.st_mode & S_IFMT) == S_IFREG,
              before.st_size >= 0
        else {
            throw AvatarProfileStoreError.corruptStore
        }
        let initialSize = UInt64(before.st_size)
        guard initialSize <= UInt64(Self.maximumJSONBytes) else {
            throw AvatarProfileStoreError.corruptStore
        }

        var data = Data()
        data.reserveCapacity(Int(initialSize))
        var buffer = [UInt8](repeating: 0, count: 64 * 1024)
        while data.count < Self.maximumJSONBytes {
            let requested = min(buffer.count, Self.maximumJSONBytes - data.count)
            let count = buffer.withUnsafeMutableBytes { bufferPointer -> Int in
                guard let baseAddress = bufferPointer.baseAddress else { return -1 }
                return read(descriptor, baseAddress, requested)
            }
            if count < 0, errno == EINTR { continue }
            guard count >= 0 else {
                throw AvatarProfileStoreError.persistenceFailed
            }
            guard count > 0 else { break }
            data.append(contentsOf: buffer[0..<count])
        }

        if data.count == Self.maximumJSONBytes {
            var probe: UInt8 = 0
            while true {
                let count = read(descriptor, &probe, 1)
                if count < 0, errno == EINTR { continue }
                guard count >= 0 else {
                    throw AvatarProfileStoreError.persistenceFailed
                }
                if count > 0 {
                    throw AvatarProfileStoreError.corruptStore
                }
                break
            }
        }

        var after = stat()
        guard fstat(descriptor, &after) == 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        guard sameFileIdentity(before, after),
              after.st_size >= 0,
              UInt64(after.st_size) == UInt64(data.count),
              String(data: data, encoding: .utf8) != nil
        else {
            throw AvatarProfileStoreError.corruptStore
        }

        do {
            var preflight = JSONDuplicateMemberPreflight(data: data)
            try preflight.validate()
            let envelope = try JSONDecoder().decode(ProfileEnvelope.self, from: data)
            guard envelope.profiles.count <= Self.maximumProfiles else {
                throw AvatarProfileStoreError.corruptStore
            }
            var ids = Set<UUID>()
            for profile in envelope.profiles {
                guard ids.insert(profile.id).inserted else {
                    throw AvatarProfileStoreError.corruptStore
                }
            }
            return envelope.profiles.sorted(by: profileSort)
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch {
            throw AvatarProfileStoreError.corruptStore
        }
    }

    private func commit(_ profiles: [AvatarProfile]) throws {
        guard profiles.count <= Self.maximumProfiles else {
            throw AvatarProfileStoreError.profileLimit
        }
        for profile in profiles {
            guard AvatarProfile.isValidDisplayName(profile.displayName),
                  profile.schemaVersion == AvatarProfile.currentSchemaVersion,
                  profile.modelBookmark.count <= AvatarProfile.maximumBookmarkBytes,
                  AvatarProfile.isValidSHA256(profile.modelSHA256),
                  profile.capturedByteCount <= AssetBudget.alpha.capturedBytes,
                  profile.rightsLabel == AvatarProfile.rightsLabel,
                  profile.performanceProfile == AvatarProfile.performanceProfile,
                  (0...AvatarProfile.maximumConsecutiveLoadFailures)
                    .contains(profile.consecutiveLoadFailures)
            else {
                throw AvatarProfileStoreError.corruptStore
            }
        }

        let sorted = profiles.sorted(by: profileSort)
        let data: Data
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.sortedKeys]
            data = try encoder.encode(ProfileEnvelope(profiles: sorted))
        } catch {
            throw AvatarProfileStoreError.persistenceFailed
        }
        guard data.count <= Self.maximumJSONBytes else {
            throw AvatarProfileStoreError.persistenceFailed
        }

        let rootDescriptor = try openRootDirectoryForCommit()
        defer { _ = close(rootDescriptor) }

        let temporaryName = ".profiles-v1.\(UUID().uuidString).tmp"
        var temporaryDescriptor = temporaryName.withCString { name in
            openat(
                rootDescriptor,
                name,
                O_WRONLY | O_CREAT | O_EXCL | O_NOFOLLOW | O_CLOEXEC,
                mode_t(0o600)
            )
        }
        guard temporaryDescriptor >= 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        var temporaryExists = true
        defer {
            if temporaryDescriptor >= 0 { _ = close(temporaryDescriptor) }
            if temporaryExists {
                _ = temporaryName.withCString { name in
                    unlinkat(rootDescriptor, name, 0)
                }
            }
        }

        try write(data, to: temporaryDescriptor)
        guard fchmod(temporaryDescriptor, mode_t(0o600)) == 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        guard close(temporaryDescriptor) == 0 else {
            temporaryDescriptor = -1
            throw AvatarProfileStoreError.persistenceFailed
        }
        temporaryDescriptor = -1

        try validateExistingProfileFile(in: rootDescriptor)
        let renamed = temporaryName.withCString { temporary in
            Self.fileName.withCString { destination in
                renameat(rootDescriptor, temporary, rootDescriptor, destination)
            }
        }
        guard renamed == 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        temporaryExists = false
    }

    private func openRootDirectoryForRead() throws -> Int32? {
        var info = stat()
        guard lstat(root.path, &info) == 0 else {
            let error = errno
            if error == ENOENT { return nil }
            throw AvatarProfileStoreError.persistenceFailed
        }
        guard (info.st_mode & S_IFMT) == S_IFDIR else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        let descriptor = open(
            root.path,
            O_RDONLY | O_DIRECTORY | O_NOFOLLOW | O_CLOEXEC
        )
        guard descriptor >= 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        return descriptor
    }

    private func openRootDirectoryForCommit() throws -> Int32 {
        var info = stat()
        if lstat(root.path, &info) != 0 {
            let error = errno
            guard error == ENOENT else {
                throw AvatarProfileStoreError.persistenceFailed
            }
            do {
                try FileManager.default.createDirectory(
                    at: root,
                    withIntermediateDirectories: true,
                    attributes: [.posixPermissions: 0o700]
                )
            } catch {
                throw AvatarProfileStoreError.persistenceFailed
            }
        } else {
            guard (info.st_mode & S_IFMT) == S_IFDIR else {
                throw AvatarProfileStoreError.persistenceFailed
            }
        }

        let descriptor = open(
            root.path,
            O_RDONLY | O_DIRECTORY | O_NOFOLLOW | O_CLOEXEC
        )
        guard descriptor >= 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        guard fchmod(descriptor, mode_t(0o700)) == 0 else {
            _ = close(descriptor)
            throw AvatarProfileStoreError.persistenceFailed
        }
        return descriptor
    }

    private func validateExistingProfileFile(in rootDescriptor: Int32) throws {
        var info = stat()
        let result = Self.fileName.withCString { name in
            fstatat(rootDescriptor, name, &info, AT_SYMLINK_NOFOLLOW)
        }
        if result != 0 {
            guard errno == ENOENT else {
                throw AvatarProfileStoreError.persistenceFailed
            }
            return
        }
        guard (info.st_mode & S_IFMT) == S_IFREG else {
            throw AvatarProfileStoreError.persistenceFailed
        }
    }

    private func write(_ data: Data, to descriptor: Int32) throws {
        try data.withUnsafeBytes { buffer in
            guard let baseAddress = buffer.baseAddress else { return }
            var offset = 0
            while offset < data.count {
                let count = Darwin.write(
                    descriptor,
                    baseAddress.advanced(by: offset),
                    data.count - offset
                )
                if count < 0, errno == EINTR { continue }
                guard count > 0 else {
                    throw AvatarProfileStoreError.persistenceFailed
                }
                offset += count
            }
        }
    }

    private func profileSort(_ lhs: AvatarProfile, _ rhs: AvatarProfile) -> Bool {
        lhs.id.uuidString.lowercased() < rhs.id.uuidString.lowercased()
    }
}

private struct ImportedAsset {
    let asset: AdmittedAsset
    let bookmark: Data
    let digest: String
}

private struct LoadedAsset {
    let asset: AdmittedAsset
    let digest: String
    let refreshedBookmark: Data?
}

private struct ProfileEnvelope: Codable {
    let schemaVersion: Int
    let profiles: [AvatarProfile]

    init(profiles: [AvatarProfile]) {
        schemaVersion = 1
        self.profiles = profiles
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: StoreCodingKey.self)
        let expected = Set(["schemaVersion", "profiles"])
        let actual = Set(container.allKeys.map(\.stringValue))
        guard actual == expected else { throw AvatarProfileStoreError.corruptStore }
        let schemaVersion = try container.decode(Int.self, forKey: StoreCodingKey("schemaVersion"))
        guard schemaVersion == 1 else { throw AvatarProfileStoreError.corruptStore }
        self.schemaVersion = schemaVersion
        self.profiles = try container.decode(
            [AvatarProfile].self,
            forKey: StoreCodingKey("profiles")
        )
    }
}

private struct StoreCodingKey: CodingKey, Hashable {
    let stringValue: String
    let intValue: Int?

    init(_ value: String) {
        stringValue = value
        intValue = nil
    }

    init?(stringValue: String) { self.init(stringValue) }

    init?(intValue: Int) {
        stringValue = String(intValue)
        self.intValue = intValue
    }
}

private struct JSONDuplicateMemberPreflight {
    private static let maximumNestingDepth = 128
    private let bytes: [UInt8]
    private var index = 0

    init(data: Data) {
        bytes = Array(data)
    }

    mutating func validate() throws {
        try value(depth: 0)
        whitespace()
        guard index == bytes.count else { throw ProfileJSONError.invalid }
    }

    private mutating func value(depth: Int) throws {
        guard depth <= Self.maximumNestingDepth else { throw ProfileJSONError.invalid }
        whitespace()
        guard index < bytes.count else { throw ProfileJSONError.invalid }
        switch bytes[index] {
        case 0x7B: try object(depth: depth + 1)
        case 0x5B: try array(depth: depth + 1)
        case 0x22: _ = try string()
        case 0x74: try literal(Array("true".utf8))
        case 0x66: try literal(Array("false".utf8))
        case 0x6E: try literal(Array("null".utf8))
        case 0x2D, 0x30...0x39: try number()
        default: throw ProfileJSONError.invalid
        }
    }

    private mutating func object(depth: Int) throws {
        try consume(0x7B)
        whitespace()
        var keys = Set<String>()
        if consumeIfPresent(0x7D) { return }
        while true {
            whitespace()
            guard index < bytes.count, bytes[index] == 0x22 else {
                throw ProfileJSONError.invalid
            }
            let key = try string()
            guard keys.insert(key).inserted else { throw ProfileJSONError.invalid }
            whitespace()
            try consume(0x3A)
            try value(depth: depth)
            whitespace()
            if consumeIfPresent(0x7D) { return }
            try consume(0x2C)
        }
    }

    private mutating func array(depth: Int) throws {
        try consume(0x5B)
        whitespace()
        if consumeIfPresent(0x5D) { return }
        while true {
            try value(depth: depth)
            whitespace()
            if consumeIfPresent(0x5D) { return }
            try consume(0x2C)
        }
    }

    private mutating func string() throws -> String {
        let start = index
        try consume(0x22)
        while index < bytes.count {
            let byte = bytes[index]
            if byte == 0x22 {
                index += 1
                let data = Data(bytes[start..<index])
                guard let value = try? JSONDecoder().decode(String.self, from: data) else {
                    throw ProfileJSONError.invalid
                }
                return value
            }
            if byte < 0x20 { throw ProfileJSONError.invalid }
            if byte == 0x5C {
                index += 1
                guard index < bytes.count else { throw ProfileJSONError.invalid }
                switch bytes[index] {
                case 0x22, 0x5C, 0x2F, 0x62, 0x66, 0x6E, 0x72, 0x74:
                    index += 1
                case 0x75:
                    guard index + 4 < bytes.count else { throw ProfileJSONError.invalid }
                    for offset in 1...4 {
                        guard isHex(bytes[index + offset]) else {
                            throw ProfileJSONError.invalid
                        }
                    }
                    index += 5
                default:
                    throw ProfileJSONError.invalid
                }
            } else {
                index += 1
            }
        }
        throw ProfileJSONError.invalid
    }

    private mutating func number() throws {
        if consumeIfPresent(0x2D) && index == bytes.count {
            throw ProfileJSONError.invalid
        }
        if consumeIfPresent(0x30) {
            if index < bytes.count, bytes[index] >= 0x30, bytes[index] <= 0x39 {
                throw ProfileJSONError.invalid
            }
        } else {
            guard index < bytes.count, (0x31...0x39).contains(bytes[index]) else {
                throw ProfileJSONError.invalid
            }
            while index < bytes.count, (0x30...0x39).contains(bytes[index]) { index += 1 }
        }
        if consumeIfPresent(0x2E) {
            guard index < bytes.count, (0x30...0x39).contains(bytes[index]) else {
                throw ProfileJSONError.invalid
            }
            while index < bytes.count, (0x30...0x39).contains(bytes[index]) { index += 1 }
        }
        if index < bytes.count, bytes[index] == 0x65 || bytes[index] == 0x45 {
            index += 1
            if index < bytes.count, bytes[index] == 0x2B || bytes[index] == 0x2D { index += 1 }
            guard index < bytes.count, (0x30...0x39).contains(bytes[index]) else {
                throw ProfileJSONError.invalid
            }
            while index < bytes.count, (0x30...0x39).contains(bytes[index]) { index += 1 }
        }
    }

    private mutating func literal(_ literal: [UInt8]) throws {
        guard index + literal.count <= bytes.count,
              Array(bytes[index..<(index + literal.count)]) == literal
        else { throw ProfileJSONError.invalid }
        index += literal.count
    }

    private mutating func consume(_ value: UInt8) throws {
        guard consumeIfPresent(value) else { throw ProfileJSONError.invalid }
    }

    private mutating func consumeIfPresent(_ value: UInt8) -> Bool {
        guard index < bytes.count, bytes[index] == value else { return false }
        index += 1
        return true
    }

    private mutating func whitespace() {
        while index < bytes.count,
              bytes[index] == 0x20 || bytes[index] == 0x09
                || bytes[index] == 0x0A || bytes[index] == 0x0D
        {
            index += 1
        }
    }

    private func isHex(_ byte: UInt8) -> Bool {
        (byte >= 0x30 && byte <= 0x39)
            || (byte >= 0x41 && byte <= 0x46)
            || (byte >= 0x61 && byte <= 0x66)
    }
}

private enum ProfileJSONError: Error {
    case invalid
}

private func profileSort(_ lhs: AvatarProfile, _ rhs: AvatarProfile) -> Bool {
    lhs.id.uuidString.lowercased() < rhs.id.uuidString.lowercased()
}

private func sameFileIdentity(_ lhs: stat, _ rhs: stat) -> Bool {
    lhs.st_dev == rhs.st_dev
        && lhs.st_ino == rhs.st_ino
        && lhs.st_mode == rhs.st_mode
        && lhs.st_size == rhs.st_size
        && lhs.st_mtimespec.tv_sec == rhs.st_mtimespec.tv_sec
        && lhs.st_mtimespec.tv_nsec == rhs.st_mtimespec.tv_nsec
        && lhs.st_ctimespec.tv_sec == rhs.st_ctimespec.tv_sec
        && lhs.st_ctimespec.tv_nsec == rhs.st_ctimespec.tv_nsec
}
