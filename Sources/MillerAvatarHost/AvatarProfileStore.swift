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
    package let motionAdmission: @Sendable (Data) -> MotionAdmissionResult
    package let bookmarkCreator: @Sendable (URL) throws -> Data
    package let bookmarkResolver: @Sendable (Data) throws -> AvatarResolvedBookmark
    package let securityScope: any SecurityScopedAccess
    package let capture: @Sendable (URL, UInt64) throws -> Data

    package init(
        admission: @escaping @Sendable (Data) -> AssetAdmissionResult,
        motionAdmission: @escaping @Sendable (Data) -> MotionAdmissionResult = { _ in
            .rejected(.motionRejected)
        },
        bookmarkCreator: @escaping @Sendable (URL) throws -> Data,
        bookmarkResolver: @escaping @Sendable (Data) throws -> AvatarResolvedBookmark,
        securityScope: any SecurityScopedAccess,
        capture: @escaping @Sendable (URL, UInt64) throws -> Data
    ) {
        self.admission = admission
        self.motionAdmission = motionAdmission
        self.bookmarkCreator = bookmarkCreator
        self.bookmarkResolver = bookmarkResolver
        self.securityScope = securityScope
        self.capture = capture
    }

    package init(
        admission: @escaping @Sendable (Data) -> AssetAdmissionResult,
        bookmarkCreator: @escaping @Sendable (URL) throws -> Data,
        bookmarkResolver: @escaping @Sendable (Data) throws -> AvatarResolvedBookmark,
        securityScope: any SecurityScopedAccess,
        capture: @escaping @Sendable (URL, UInt64) throws -> Data
    ) {
        self.init(
            admission: admission,
            motionAdmission: { _ in .rejected(.motionRejected) },
            bookmarkCreator: bookmarkCreator,
            bookmarkResolver: bookmarkResolver,
            securityScope: securityScope,
            capture: capture
        )
    }

    package static func production() -> Self {
        Self(
            admission: { bytes in AssetAdmission().admitSynchronously(bytes) },
            motionAdmission: { bytes in MotionAdmission().admitSynchronously(bytes) },
            bookmarkCreator: { url in
                try url.bookmarkData(
                    options: .withSecurityScope,
                    includingResourceValuesForKeys: nil,
                    relativeTo: nil
                )
            },
            bookmarkResolver: { bookmark in
                var isStale = false
                let url: URL
                do {
                    url = try URL(
                        resolvingBookmarkData: bookmark,
                        options: .withSecurityScope,
                        relativeTo: nil,
                        bookmarkDataIsStale: &isStale
                    )
                } catch {
                    throw AvatarProfileStoreError.bookmarkResolutionFailed
                }
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
                case .cancelled:
                    throw AvatarProfileStoreError.cancelled
                case .rejected(let code):
                    switch code {
                    case .resourceLimit:
                        throw AvatarProfileStoreError.resourceLimit
                    default:
                        throw AvatarProfileStoreError.assetRejected
                    }
                }
            }
        )
    }
}

package struct ProfileStoreFileOperations: Sendable {
    package let read: @Sendable (URL) throws -> Data?
    package let write: @Sendable (URL, Data) throws -> Void
    package let fileFsync: @Sendable (URL) throws -> Void
    package let rename: @Sendable (URL, URL) throws -> Void
    package let reopen: @Sendable (URL) throws -> Data?
    package let directoryFsync: @Sendable (URL) throws -> Void
    package let unlink: @Sendable (URL) throws -> Void

    package var fsyncFile: @Sendable (URL) throws -> Void { fileFsync }
    package var fsyncDirectory: @Sendable (URL) throws -> Void { directoryFsync }

    package init(
        read: @escaping @Sendable (URL) throws -> Data?,
        write: @escaping @Sendable (URL, Data) throws -> Void,
        fileFsync: @escaping @Sendable (URL) throws -> Void,
        rename: @escaping @Sendable (URL, URL) throws -> Void,
        reopen: @escaping @Sendable (URL) throws -> Data?,
        directoryFsync: @escaping @Sendable (URL) throws -> Void,
        unlink: @escaping @Sendable (URL) throws -> Void
    ) {
        self.read = read
        self.write = write
        self.fileFsync = fileFsync
        self.rename = rename
        self.reopen = reopen
        self.directoryFsync = directoryFsync
        self.unlink = unlink
    }

    package init(
        read: @escaping @Sendable (URL) throws -> Data?,
        write: @escaping @Sendable (URL, Data) throws -> Void,
        fsyncFile: @escaping @Sendable (URL) throws -> Void,
        rename: @escaping @Sendable (URL, URL) throws -> Void,
        reopen: @escaping @Sendable (URL) throws -> Data?,
        fsyncDirectory: @escaping @Sendable (URL) throws -> Void,
        unlink: @escaping @Sendable (URL) throws -> Void
    ) {
        self.init(
            read: read,
            write: write,
            fileFsync: fsyncFile,
            rename: rename,
            reopen: reopen,
            directoryFsync: fsyncDirectory,
            unlink: unlink
        )
    }

    package init(
        write: @escaping @Sendable (URL, Data) throws -> Void,
        fileFsync: @escaping @Sendable (URL) throws -> Void,
        rename: @escaping @Sendable (URL, URL) throws -> Void,
        reopen: @escaping @Sendable (URL) throws -> Data?,
        directoryFsync: @escaping @Sendable (URL) throws -> Void,
        unlink: @escaping @Sendable (URL) throws -> Void
    ) {
        self.init(
            read: { try POSIXProfileFileOperations.read(at: $0) },
            write: write,
            fileFsync: fileFsync,
            rename: rename,
            reopen: reopen,
            directoryFsync: directoryFsync,
            unlink: unlink
        )
    }

    package init(
        write: @escaping @Sendable (URL, Data) throws -> Void,
        fsyncFile: @escaping @Sendable (URL) throws -> Void,
        rename: @escaping @Sendable (URL, URL) throws -> Void,
        reopen: @escaping @Sendable (URL) throws -> Data?,
        fsyncDirectory: @escaping @Sendable (URL) throws -> Void,
        unlink: @escaping @Sendable (URL) throws -> Void
    ) {
        self.init(
            write: write,
            fileFsync: fsyncFile,
            rename: rename,
            reopen: reopen,
            directoryFsync: fsyncDirectory,
            unlink: unlink
        )
    }

    package static let production = Self(
        read: { try POSIXProfileFileOperations.read(at: $0) },
        write: { url, data in try POSIXProfileFileOperations.write(data, at: url) },
        fileFsync: { try POSIXProfileFileOperations.fsyncFile(at: $0) },
        rename: { source, destination in
            try POSIXProfileFileOperations.rename(from: source, to: destination)
        },
        reopen: { try POSIXProfileFileOperations.read(at: $0) },
        directoryFsync: { try POSIXProfileFileOperations.fsyncDirectory(at: $0) },
        unlink: { try POSIXProfileFileOperations.unlinkRegular(at: $0) }
    )
}

public actor AvatarProfileStore {
    package static let fileName = "profiles-v2.json"
    package static let legacyFileName = "profiles-v1.json"
    package static let maximumProfiles = 32
    package static let maximumJSONBytes = 2 * 1024 * 1024
    package static let maximumMotionBytes = 24 * 1024 * 1024

    private let root: URL
    private let dependencies: AvatarProfileStoreDependencies
    private let fileOperations: ProfileStoreFileOperations

    public init(root: URL) {
        self.root = root
        dependencies = .production()
        fileOperations = .production
    }

    package init(
        root: URL,
        dependencies: AvatarProfileStoreDependencies,
        fileOperations: ProfileStoreFileOperations = .production
    ) {
        self.root = root
        self.dependencies = dependencies
        self.fileOperations = fileOperations
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

    public func list() throws -> [AvatarProfileSummary] {
        try readProfiles().map(\.summary)
    }

    public func profile(id: UUID) throws -> AvatarProfileSummary {
        let profiles = try readProfiles()
        guard let profile = profiles.first(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        return profile.summary
    }

    public func importModel(at url: URL, displayName: String) throws -> AvatarProfileSummary {
        guard AvatarProfile.isValidDisplayName(displayName) else {
            throw AvatarProfileStoreError.invalidDisplayName
        }
        var profiles = try readProfiles()
        guard profiles.count < Self.maximumProfiles else {
            throw AvatarProfileStoreError.profileLimit
        }

        let imported = try captureModelForImport(at: url)
        let profile = StoredAvatarProfile(
            id: UUID(),
            displayName: displayName,
            modelBookmark: imported.bookmark,
            modelSHA256: imported.digest,
            capturedByteCount: UInt64(imported.asset.bytes.count),
            profileRevision: 1,
            motionLibrary: [:],
            motionBindings: [:]
        )
        profiles.append(profile)
        try commit(profiles)
        return profile.summary
    }

    public func rename(id: UUID, displayName: String) throws {
        guard AvatarProfile.isValidDisplayName(displayName) else {
            throw AvatarProfileStoreError.invalidDisplayName
        }
        var profiles = try readProfiles()
        guard let index = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard profiles[index].displayName != displayName else {
            return
        }
        profiles[index] = try replacing(
            profiles[index],
            displayName: displayName
        )
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

    public func importMotion(
        profileID: UUID,
        at url: URL,
        displayName: String
    ) throws -> AvatarMotionSummary {
        guard AvatarProfile.isValidDisplayName(displayName) else {
            throw AvatarProfileStoreError.invalidDisplayName
        }
        var profiles = try readProfiles()
        guard let profileIndex = profiles.firstIndex(where: { $0.id == profileID }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard profiles[profileIndex].motionLibrary.count
                < StoredAvatarProfile.maximumMotionLibraryEntries
        else {
            throw AvatarProfileStoreError.motionLimit
        }

        let imported = try captureMotionForImport(at: url)
        let motion = StoredAvatarMotionReference(
            id: UUID(),
            displayName: displayName,
            bookmark: imported.bookmark,
            sha256: imported.digest,
            capturedByteCount: UInt64(imported.motion.bytes.count),
            consecutiveLoadFailures: 0,
            lastFailure: nil
        )
        var library = profiles[profileIndex].motionLibrary
        library[motion.id] = motion
        profiles[profileIndex] = try replacing(
            profiles[profileIndex],
            profileRevision: nextRevision(profiles[profileIndex].profileRevision),
            motionLibrary: library
        )
        try commit(profiles)
        return motion.summary
    }

    public func renameMotion(
        profileID: UUID,
        motionID: UUID,
        displayName: String
    ) throws {
        guard AvatarProfile.isValidDisplayName(displayName) else {
            throw AvatarProfileStoreError.invalidDisplayName
        }
        var profiles = try readProfiles()
        guard let profileIndex = profiles.firstIndex(where: { $0.id == profileID }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard let motion = profiles[profileIndex].motionLibrary[motionID] else {
            throw AvatarProfileStoreError.unknownMotion
        }
        guard motion.displayName != displayName else { return }
        var library = profiles[profileIndex].motionLibrary
        library[motionID] = replacing(motion, displayName: displayName)
        profiles[profileIndex] = try replacing(
            profiles[profileIndex],
            motionLibrary: library
        )
        try commit(profiles)
    }

    public func removeMotion(profileID: UUID, motionID: UUID) throws {
        var profiles = try readProfiles()
        guard let profileIndex = profiles.firstIndex(where: { $0.id == profileID }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard profiles[profileIndex].motionLibrary[motionID] != nil else {
            throw AvatarProfileStoreError.unknownMotion
        }
        var library = profiles[profileIndex].motionLibrary
        library.removeValue(forKey: motionID)
        var bindings = profiles[profileIndex].motionBindings
        bindings = Dictionary(uniqueKeysWithValues: bindings.filter { $0.value != motionID })
        profiles[profileIndex] = try replacing(
            profiles[profileIndex],
            profileRevision: nextRevision(profiles[profileIndex].profileRevision),
            motionLibrary: library,
            motionBindings: bindings
        )
        try commit(profiles)
    }

    public func bindMotion(
        profileID: UUID,
        role: AvatarMotionRole,
        motionID: UUID?
    ) throws {
        var profiles = try readProfiles()
        guard let profileIndex = profiles.firstIndex(where: { $0.id == profileID }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        if let motionID {
            guard let motion = profiles[profileIndex].motionLibrary[motionID] else {
                throw AvatarProfileStoreError.unknownMotion
            }
            guard !motion.isQuarantined else {
                throw AvatarProfileStoreError.motionQuarantined
            }
        }
        guard profiles[profileIndex].motionBindings[role] != motionID else {
            return
        }
        var bindings = profiles[profileIndex].motionBindings
        if let motionID {
            bindings[role] = motionID
        } else {
            bindings.removeValue(forKey: role)
        }
        profiles[profileIndex] = try replacing(
            profiles[profileIndex],
            profileRevision: nextRevision(profiles[profileIndex].profileRevision),
            motionBindings: bindings
        )
        try commit(profiles)
    }

    public func retry(id: UUID) throws {
        var profiles = try readProfiles()
        guard let index = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        let current = profiles[index]
        guard current.consecutiveLoadFailures != 0 else {
            return
        }
        profiles[index] = try replacing(
            current,
            consecutiveLoadFailures: 0
        )
        try commit(profiles)
    }

    public func retryMotion(profileID: UUID, motionID: UUID) throws {
        var profiles = try readProfiles()
        guard let profileIndex = profiles.firstIndex(where: { $0.id == profileID }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard let motion = profiles[profileIndex].motionLibrary[motionID] else {
            throw AvatarProfileStoreError.unknownMotion
        }
        guard motion.consecutiveLoadFailures != 0 || motion.lastFailure != nil else {
            return
        }
        var library = profiles[profileIndex].motionLibrary
        library[motionID] = replacing(
            motion,
            consecutiveLoadFailures: 0,
            lastFailure: .some(nil)
        )
        profiles[profileIndex] = try replacing(
            profiles[profileIndex],
            motionLibrary: library
        )
        try commit(profiles)
    }

    public func recordRendererSuccess(id: UUID) throws {
        var profiles = try readProfiles()
        guard let index = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard profiles[index].consecutiveLoadFailures != 0 else { return }
        profiles[index] = try replacing(profiles[index], consecutiveLoadFailures: 0)
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
        guard next != profiles[index].consecutiveLoadFailures else {
            return
        }
        profiles[index] = try replacing(profiles[index], consecutiveLoadFailures: next)
        try commit(profiles)
    }

    package func recordMotionRendererSuccess(
        profileID: UUID,
        motionID: UUID
    ) throws {
        var profiles = try readProfiles()
        guard let profileIndex = profiles.firstIndex(where: { $0.id == profileID }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard let motion = profiles[profileIndex].motionLibrary[motionID] else {
            throw AvatarProfileStoreError.unknownMotion
        }
        guard motion.consecutiveLoadFailures != 0 || motion.lastFailure != nil else {
            return
        }
        var library = profiles[profileIndex].motionLibrary
        library[motionID] = replacing(
            motion,
            consecutiveLoadFailures: 0,
            lastFailure: .some(nil)
        )
        profiles[profileIndex] = try replacing(
            profiles[profileIndex],
            motionLibrary: library
        )
        try commit(profiles)
    }

    package func recordMotionRendererFailure(
        profileID: UUID,
        motionID: UUID
    ) throws {
        try recordMotionRendererFailure(
            profileID: profileID,
            motionID: motionID,
            code: .motionRuntimeFailed
        )
    }

    package func recordMotionRendererFailure(
        profileID: UUID,
        motionID: UUID,
        code: MotionFailureCode
    ) throws {
        guard code != .cancelled else { throw AvatarProfileStoreError.cancelled }
        var profiles = try readProfiles()
        guard let profileIndex = profiles.firstIndex(where: { $0.id == profileID }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        guard let motion = profiles[profileIndex].motionLibrary[motionID] else {
            throw AvatarProfileStoreError.unknownMotion
        }
        let next = min(
            AvatarProfile.maximumConsecutiveLoadFailures,
            motion.consecutiveLoadFailures + 1
        )
        guard next != motion.consecutiveLoadFailures || motion.lastFailure != code else {
            return
        }
        var library = profiles[profileIndex].motionLibrary
        library[motionID] = replacing(
            motion,
            consecutiveLoadFailures: next,
            lastFailure: code
        )
        profiles[profileIndex] = try replacing(
            profiles[profileIndex],
            motionLibrary: library
        )
        try commit(profiles)
    }

    package func materializeForRendering(
        id: UUID,
        lease: ProfileMaterializationLease
    ) async throws {
        try leaseCheckpoint(lease)
        let profiles = try readProfiles()
        try leaseCheckpoint(lease)
        guard let profileIndex = profiles.firstIndex(where: { $0.id == id }) else {
            throw AvatarProfileStoreError.unknownProfile
        }
        try leaseCheckpoint(lease)
        let current = profiles[profileIndex]
        guard !current.isQuarantined else {
            throw AvatarProfileStoreError.quarantined
        }

        let modelResult: MaterializedModel
        do {
            try leaseCheckpoint(lease)
            let resolvedModel: AvatarResolvedBookmark
            do {
                resolvedModel = try dependencies.bookmarkResolver(current.modelBookmark)
            } catch is CancellationError {
                throw CancellationError()
            } catch let error as AvatarProfileStoreError {
                throw error
            } catch {
                throw AvatarProfileStoreError.bookmarkResolutionFailed
            }
            try leaseCheckpoint(lease)
            modelResult = try withSecurityScope(resolvedModel.url) {
                try leaseCheckpoint(lease)
                let bytes = try dependencies.capture(
                    resolvedModel.url,
                    AssetBudget.alpha.capturedBytes
                )
                try leaseCheckpoint(lease)
                guard bytes.count <= AssetBudget.alpha.capturedBytes else {
                    throw AvatarProfileStoreError.resourceLimit
                }
                let admission = dependencies.admission(bytes)
                try leaseCheckpoint(lease)
                let asset: AdmittedAsset
                switch admission {
                case .admitted(let admitted):
                    guard admitted.bytes.count <= AssetBudget.alpha.capturedBytes else {
                        throw AvatarProfileStoreError.resourceLimit
                    }
                    asset = admitted
                case .rejected(let code):
                    switch code {
                    case .resourceLimit:
                        throw AvatarProfileStoreError.resourceLimit
                    default:
                        throw AvatarProfileStoreError.assetRejected
                    }
                }
                try leaseCheckpoint(lease)
                let refreshedBookmark = try refreshedBookmarkIfNeeded(
                    resolvedModel,
                    url: resolvedModel.url
                )
                try leaseCheckpoint(lease)
                return MaterializedModel(
                    asset: asset,
                    digest: digest(asset.bytes),
                    refreshedBookmark: refreshedBookmark
                )
            }
        } catch is CancellationError {
            throw CancellationError()
        } catch let error as AvatarProfileStoreError {
            if error == .cancelled || Task.isCancelled || !lease.isActive {
                throw CancellationError()
            }
            try persistModelFailure(
                current,
                profiles: profiles,
                profileIndex: profileIndex,
                lease: lease,
                error: error
            )
        } catch {
            if Task.isCancelled || !lease.isActive {
                throw CancellationError()
            }
            try persistModelFailure(
                current,
                profiles: profiles,
                profileIndex: profileIndex,
                lease: lease,
                error: .assetRejected
            )
        }

        try leaseCheckpoint(lease)
        var staged = current
        var contentChanged = false
        if let refreshedBookmark = modelResult.refreshedBookmark,
           staged.modelBookmark != refreshedBookmark
        {
            try leaseCheckpoint(lease)
            staged = try replacing(staged, modelBookmark: refreshedBookmark)
        }
        if staged.modelSHA256 != modelResult.digest
            || staged.capturedByteCount != UInt64(modelResult.asset.bytes.count)
        {
            try leaseCheckpoint(lease)
            staged = try replacing(
                staged,
                modelSHA256: modelResult.digest,
                capturedByteCount: UInt64(modelResult.asset.bytes.count)
            )
            contentChanged = true
        }

        var loadedBindings: [AvatarMotionRole: LoadedMotionBinding] = [:]
        var capturedMotions: [UUID: MotionMaterialization] = [:]
        var motionBytes: UInt64 = 0
        var aggregateOverflow = false
        for role in AvatarMotionRole.allCases {
            try leaseCheckpoint(lease)
            guard let motionID = staged.motionBindings[role] else { continue }
            guard let reference = staged.motionLibrary[motionID] else {
                try leaseCheckpoint(lease)
                loadedBindings[role] = .rejected(
                    motionID: motionID,
                    reason: .motionRejected
                )
                continue
            }
            if let result = capturedMotions[motionID] {
                try leaseCheckpoint(lease)
                loadedBindings[role] = result.binding
                continue
            }

            let result = try await materializeMotion(
                reference,
                motionID: motionID,
                lease: lease
            )
            try leaseCheckpoint(lease)
            capturedMotions[motionID] = result
            loadedBindings[role] = result.binding
            if case .ready = result.binding {
                let (total, overflow) = motionBytes.addingReportingOverflow(result.byteCount)
                if overflow || total > UInt64(Self.maximumMotionBytes) {
                    aggregateOverflow = true
                    break
                }
                motionBytes = total
            }
        }

        if aggregateOverflow {
            for (motionID, result) in capturedMotions {
                guard case .ready = result.binding,
                      let reference = staged.motionLibrary[motionID],
                      result.reference != reference
                else { continue }
                try leaseCheckpoint(lease)
                var library = staged.motionLibrary
                library[motionID] = result.reference
                staged = try replacing(staged, motionLibrary: library)
                if reference.sha256 != result.reference.sha256
                    || reference.capturedByteCount != result.reference.capturedByteCount
                {
                    contentChanged = true
                }
            }
            loadedBindings = [:]
            for role in AvatarMotionRole.allCases {
                try leaseCheckpoint(lease)
                guard let motionID = staged.motionBindings[role] else { continue }
                loadedBindings[role] = .rejected(
                    motionID: motionID,
                    reason: .resourceLimit
                )
            }
        } else {
            for (motionID, result) in capturedMotions {
                guard let reference = staged.motionLibrary[motionID] else { continue }
                guard result.reference != reference else { continue }
                try leaseCheckpoint(lease)
                var library = staged.motionLibrary
                library[motionID] = result.reference
                staged = try replacing(staged, motionLibrary: library)
                if reference.sha256 != result.reference.sha256
                    || reference.capturedByteCount != result.reference.capturedByteCount
                {
                    contentChanged = true
                }
            }
        }

        if contentChanged {
            try leaseCheckpoint(lease)
            staged = try replacing(
                staged,
                profileRevision: nextRevision(current.profileRevision)
            )
        }

        try leaseCheckpoint(lease)
        let prepared = LoadedAvatarProfile(
            profileRevision: staged.profileRevision,
            model: modelResult.asset,
            motionBindings: loadedBindings
        )
        var finalProfiles = profiles
        try leaseCheckpoint(lease)
        let needsCommit = staged != current
        if needsCommit {
            finalProfiles[profileIndex] = staged
        }
        let committed = try lease.performIfActiveAndPublish {
            if needsCommit {
                try commit(finalProfiles)
            }
            return prepared
        }
        guard committed else { throw CancellationError() }
    }

    private func captureModelForImport(at url: URL) throws -> ImportedAsset {
        do {
            return try withSecurityScope(url) {
                let bytes = try capture(url: url, maximumBytes: AssetBudget.alpha.capturedBytes)
                let asset = try admit(bytes)
                let bookmark = try makeBookmark(url)
                return ImportedAsset(
                    asset: asset,
                    bookmark: bookmark,
                    digest: digest(asset.bytes)
                )
            }
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch {
            throw AvatarProfileStoreError.assetRejected
        }
    }

    private func captureMotionForImport(at url: URL) throws -> ImportedMotion {
        do {
            return try withSecurityScope(url) {
                let bytes = try capture(
                    url: url,
                    maximumBytes: MotionBudget.lightweight.capturedBytes
                )
                let motion = try admitMotion(bytes)
                let bookmark = try makeBookmark(url)
                return ImportedMotion(
                    motion: motion,
                    bookmark: bookmark,
                    digest: digest(motion.bytes)
                )
            }
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch {
            throw AvatarProfileStoreError.motionRejected
        }
    }

    private func capture(url: URL, maximumBytes: UInt64) throws -> Data {
        do {
            let bytes = try dependencies.capture(url, maximumBytes)
            guard bytes.count <= maximumBytes, bytes.count <= Int.max else {
                throw AvatarProfileStoreError.resourceLimit
            }
            return bytes
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch is CancellationError {
            throw CancellationError()
        } catch {
            throw AvatarProfileStoreError.assetRejected
        }
    }

    private func admit(_ bytes: Data) throws -> AdmittedAsset {
        switch dependencies.admission(bytes) {
        case .admitted(let asset):
            guard asset.bytes.count <= AssetBudget.alpha.capturedBytes else {
                throw AvatarProfileStoreError.resourceLimit
            }
            return asset
        case .rejected(let code):
            switch code {
            case .resourceLimit: throw AvatarProfileStoreError.resourceLimit
            default: throw AvatarProfileStoreError.assetRejected
            }
        }
    }

    private func admitMotion(_ bytes: Data) throws -> AdmittedMotion {
        switch dependencies.motionAdmission(bytes) {
        case .admitted(let motion):
            guard motion.bytes.count <= MotionBudget.lightweight.capturedBytes else {
                throw AvatarProfileStoreError.resourceLimit
            }
            return motion
        case .rejected(let code):
            switch code {
            case .cancelled: throw AvatarProfileStoreError.cancelled
            case .resourceLimit: throw AvatarProfileStoreError.resourceLimit
            default: throw AvatarProfileStoreError.motionRejected
            }
        }
    }

    private func makeBookmark(_ url: URL) throws -> Data {
        do {
            let bookmark = try dependencies.bookmarkCreator(url)
            guard bookmark.count <= AvatarProfile.maximumBookmarkBytes else {
                throw AvatarProfileStoreError.bookmarkCreationFailed
            }
            return bookmark
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch {
            throw AvatarProfileStoreError.bookmarkCreationFailed
        }
    }

    private func materializeMotion(
        _ reference: StoredAvatarMotionReference,
        motionID: UUID,
        lease: ProfileMaterializationLease
    ) async throws -> MotionMaterialization {
        try leaseCheckpoint(lease)
        if reference.isQuarantined {
            return MotionMaterialization(
                reference: reference,
                binding: .rejected(motionID: motionID, reason: .quarantined)
            )
        }

        let resolved: AvatarResolvedBookmark
        do {
            try leaseCheckpoint(lease)
            resolved = try dependencies.bookmarkResolver(reference.bookmark)
            try leaseCheckpoint(lease)
        } catch is CancellationError {
            throw CancellationError()
        } catch {
            if Task.isCancelled || !lease.isActive { throw CancellationError() }
            try leaseCheckpoint(lease)
            return failedMotion(
                reference,
                motionID: motionID,
                reason: .bookmarkUnavailable
            )
        }

        do {
            let result = try withSecurityScope(resolved.url) {
                try leaseCheckpoint(lease)
                let bytes = try dependencies.capture(
                    resolved.url,
                    MotionBudget.lightweight.capturedBytes
                )
                try leaseCheckpoint(lease)
                guard bytes.count <= MotionBudget.lightweight.capturedBytes else {
                    throw AvatarProfileStoreError.resourceLimit
                }
                let admission = dependencies.motionAdmission(bytes)
                try leaseCheckpoint(lease)
                let motion: AdmittedMotion
                switch admission {
                case .admitted(let admitted):
                    guard admitted.bytes.count <= MotionBudget.lightweight.capturedBytes else {
                        throw AvatarProfileStoreError.resourceLimit
                    }
                    motion = admitted
                case .rejected(let code):
                    if code == .cancelled {
                        throw AvatarProfileStoreError.cancelled
                    }
                    try leaseCheckpoint(lease)
                    return failedMotion(
                        reference,
                        motionID: motionID,
                        reason: code
                    )
                }
                try leaseCheckpoint(lease)
                let refreshedBookmark = try refreshedBookmarkIfNeeded(resolved, url: resolved.url)
                try leaseCheckpoint(lease)
                return MotionMaterialization(
                    reference: replacing(
                        reference,
                        bookmark: refreshedBookmark,
                        sha256: digest(motion.bytes),
                        capturedByteCount: UInt64(motion.bytes.count),
                        consecutiveLoadFailures: 0,
                        lastFailure: .some(nil)
                    ),
                    binding: .ready(motionID: motionID, motion: motion),
                    byteCount: UInt64(motion.bytes.count)
                )
            }
            try leaseCheckpoint(lease)
            return result
        } catch is CancellationError {
            throw CancellationError()
        } catch let error as AvatarProfileStoreError {
            if error == .cancelled || Task.isCancelled || !lease.isActive {
                throw CancellationError()
            }
            try leaseCheckpoint(lease)
            return failedMotion(
                reference,
                motionID: motionID,
                reason: motionFailureCode(for: error)
            )
        } catch {
            if Task.isCancelled || !lease.isActive { throw CancellationError() }
            try leaseCheckpoint(lease)
            return failedMotion(
                reference,
                motionID: motionID,
                reason: .motionLoadFailed
            )
        }
    }

    private func failedMotion(
        _ reference: StoredAvatarMotionReference,
        motionID: UUID,
        reason: MotionFailureCode
    ) -> MotionMaterialization {
        let next = min(
            AvatarProfile.maximumConsecutiveLoadFailures,
            reference.consecutiveLoadFailures + 1
        )
        let updated = replacing(
            reference,
            consecutiveLoadFailures: next,
            lastFailure: reason
        )
        return MotionMaterialization(
            reference: updated,
            binding: .rejected(motionID: motionID, reason: reason)
        )
    }

    private func persistModelFailure(
        _ profile: StoredAvatarProfile,
        profiles: [StoredAvatarProfile],
        profileIndex: Int,
        lease: ProfileMaterializationLease,
        error: AvatarProfileStoreError
    ) throws -> Never {
        let next = min(
            AvatarProfile.maximumConsecutiveLoadFailures,
            profile.consecutiveLoadFailures + 1
        )
        var stagedProfiles = profiles
        if next != profile.consecutiveLoadFailures {
            try leaseCheckpoint(lease)
            stagedProfiles[profileIndex] = try replacing(
                profile,
                consecutiveLoadFailures: next
            )
        }
        let persisted = try lease.performIfActive {
            try commit(stagedProfiles)
            return true
        } ?? false
        guard persisted else { throw CancellationError() }
        throw error
    }

    private func refreshedBookmarkIfNeeded(
        _ resolved: AvatarResolvedBookmark,
        url: URL
    ) throws -> Data? {
        guard resolved.isStale else { return nil }
        return try makeBookmark(url)
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

    private func leaseCheckpoint(_ lease: ProfileMaterializationLease) throws {
        try Task.checkCancellation()
        guard lease.isActive else { throw CancellationError() }
    }

    private func digest(_ bytes: Data) -> String {
        SHA256.hash(data: bytes).map { String(format: "%02x", $0) }.joined()
    }

    private func nextRevision(_ value: UInt64) throws -> UInt64 {
        let (next, overflow) = value.addingReportingOverflow(1)
        guard !overflow, next <= BridgeContract.maximumSafeInteger else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        return next
    }

    private func replacing(
        _ profile: StoredAvatarProfile,
        schemaVersion: Int? = nil,
        displayName: String? = nil,
        modelBookmark: Data? = nil,
        modelSHA256: String? = nil,
        capturedByteCount: UInt64? = nil,
        rightsLabel: String? = nil,
        performanceProfile: String? = nil,
        consecutiveLoadFailures: Int? = nil,
        profileRevision: UInt64? = nil,
        motionLibrary: [UUID: StoredAvatarMotionReference]? = nil,
        motionBindings: [AvatarMotionRole: UUID]? = nil
    ) throws -> StoredAvatarProfile {
        StoredAvatarProfile(
            schemaVersion: schemaVersion ?? profile.schemaVersion,
            id: profile.id,
            displayName: displayName ?? profile.displayName,
            modelBookmark: modelBookmark ?? profile.modelBookmark,
            modelSHA256: modelSHA256 ?? profile.modelSHA256,
            capturedByteCount: capturedByteCount ?? profile.capturedByteCount,
            rightsLabel: rightsLabel ?? profile.rightsLabel,
            performanceProfile: performanceProfile ?? profile.performanceProfile,
            consecutiveLoadFailures: consecutiveLoadFailures ?? profile.consecutiveLoadFailures,
            profileRevision: profileRevision ?? profile.profileRevision,
            motionLibrary: motionLibrary ?? profile.motionLibrary,
            motionBindings: motionBindings ?? profile.motionBindings
        )
    }

    private func replacing(
        _ motion: StoredAvatarMotionReference,
        displayName: String? = nil,
        bookmark: Data? = nil,
        sha256: String? = nil,
        capturedByteCount: UInt64? = nil,
        consecutiveLoadFailures: Int? = nil,
        lastFailure: MotionFailureCode?? = nil
    ) -> StoredAvatarMotionReference {
        StoredAvatarMotionReference(
            id: motion.id,
            displayName: displayName ?? motion.displayName,
            bookmark: bookmark ?? motion.bookmark,
            sha256: sha256 ?? motion.sha256,
            capturedByteCount: capturedByteCount ?? motion.capturedByteCount,
            consecutiveLoadFailures: consecutiveLoadFailures ?? motion.consecutiveLoadFailures,
            lastFailure: lastFailure.map { $0 } ?? motion.lastFailure
        )
    }

    private func readProfiles() throws -> [StoredAvatarProfile] {
        if let data = try read(fileName: Self.fileName) {
            let profiles = try decodeV2(data)
            try removeLegacyIfPresent()
            return profiles
        }
        guard let legacyData = try read(fileName: Self.legacyFileName) else {
            return []
        }
        let legacy = try decodeV1(legacyData)
        let migrated = legacy.map { profile in
            StoredAvatarProfile(
                id: profile.id,
                displayName: profile.displayName,
                modelBookmark: profile.modelBookmark,
                modelSHA256: profile.modelSHA256,
                capturedByteCount: profile.capturedByteCount,
                profileRevision: 1,
                motionLibrary: [:],
                motionBindings: [:],
                consecutiveLoadFailures: profile.consecutiveLoadFailures
            )
        }
        try commit(migrated)
        try removeLegacyIfPresent()
        return migrated.sorted(by: profileSort)
    }

    private func removeLegacyIfPresent() throws {
        let legacyURL = root.appendingPathComponent(Self.legacyFileName)
        do {
            guard try fileOperations.read(legacyURL) != nil else { return }
            try fileOperations.unlink(legacyURL)
            try fileOperations.directoryFsync(root)
        } catch {
            throw AvatarProfileStoreError.persistenceFailed
        }
    }

    private func read(fileName: String) throws -> Data? {
        do {
            return try fileOperations.read(root.appendingPathComponent(fileName))
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch {
            throw AvatarProfileStoreError.persistenceFailed
        }
    }

    private func decodeV2(_ data: Data) throws -> [StoredAvatarProfile] {
        guard data.count <= Self.maximumJSONBytes else {
            throw AvatarProfileStoreError.corruptStore
        }
        do {
            var preflight = JSONDuplicateMemberPreflight(data: data)
            try preflight.validate()
            let envelope = try JSONDecoder().decode(V2ProfileEnvelope.self, from: data)
            guard envelope.schemaVersion == StoredAvatarProfile.currentSchemaVersion,
                  envelope.profiles.count <= Self.maximumProfiles
            else { throw AvatarProfileStoreError.corruptStore }
            var IDs = Set<UUID>()
            for profile in envelope.profiles {
                guard IDs.insert(profile.id).inserted else {
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

    private func decodeV1(_ data: Data) throws -> [LegacyAvatarProfile] {
        guard data.count <= Self.maximumJSONBytes else {
            throw AvatarProfileStoreError.corruptStore
        }
        do {
            var preflight = JSONDuplicateMemberPreflight(data: data)
            try preflight.validate()
            let envelope = try JSONDecoder().decode(LegacyProfileEnvelope.self, from: data)
            guard envelope.schemaVersion == 1,
                  envelope.profiles.count <= Self.maximumProfiles
            else { throw AvatarProfileStoreError.corruptStore }
            var IDs = Set<UUID>()
            for profile in envelope.profiles {
                guard IDs.insert(profile.id).inserted,
                      AvatarProfile.isValidDisplayName(profile.displayName),
                      profile.modelBookmark.count <= AvatarProfile.maximumBookmarkBytes,
                      AvatarProfile.isValidSHA256(profile.modelSHA256),
                      profile.capturedByteCount <= AssetBudget.alpha.capturedBytes,
                      profile.rightsLabel == AvatarProfile.rightsLabel,
                      profile.performanceProfile == AvatarProfile.performanceProfile,
                      (0...AvatarProfile.maximumConsecutiveLoadFailures)
                        .contains(profile.consecutiveLoadFailures)
                else { throw AvatarProfileStoreError.corruptStore }
            }
            return envelope.profiles
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch {
            throw AvatarProfileStoreError.corruptStore
        }
    }

    private func commit(_ profiles: [StoredAvatarProfile]) throws {
        guard profiles.count <= Self.maximumProfiles else {
            throw AvatarProfileStoreError.profileLimit
        }
        var IDs = Set<UUID>()
        for profile in profiles {
            guard IDs.insert(profile.id).inserted else {
                throw AvatarProfileStoreError.corruptStore
            }
        }
        let sorted = profiles.sorted(by: profileSort)
        let data: Data
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.sortedKeys]
            data = try encoder.encode(V2ProfileEnvelope(profiles: sorted))
        } catch let error as AvatarProfileStoreError {
            throw error
        } catch {
            throw AvatarProfileStoreError.persistenceFailed
        }
        guard data.count <= Self.maximumJSONBytes else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        let destination = root.appendingPathComponent(Self.fileName)
        let temporary = root.appendingPathComponent(
            ".\(Self.fileName).\(UUID().uuidString).tmp"
        )
        var renamed = false
        do {
            try fileOperations.write(temporary, data)
            try fileOperations.fileFsync(temporary)
            try fileOperations.rename(temporary, destination)
            renamed = true
            guard let reopened = try fileOperations.reopen(destination),
                  reopened == data
            else {
                throw AvatarProfileStoreError.persistenceFailed
            }
            _ = try decodeV2(data)
            try fileOperations.directoryFsync(root)
        } catch {
            if !renamed { try? fileOperations.unlink(temporary) }
            throw AvatarProfileStoreError.persistenceFailed
        }
    }

    private func profileSort(
        _ lhs: StoredAvatarProfile,
        _ rhs: StoredAvatarProfile
    ) -> Bool {
        lhs.id.uuidString.lowercased() < rhs.id.uuidString.lowercased()
    }

    private func motionFailureCode(for error: AvatarProfileStoreError) -> MotionFailureCode {
        switch error {
        case .motionRejected: .motionRejected
        case .resourceLimit: .resourceLimit
        case .bookmarkResolutionFailed, .bookmarkCreationFailed, .securityScopeDenied:
            .bookmarkUnavailable
        default: .motionLoadFailed
        }
    }
}

private struct ImportedAsset {
    let asset: AdmittedAsset
    let bookmark: Data
    let digest: String
}

private struct ImportedMotion {
    let motion: AdmittedMotion
    let bookmark: Data
    let digest: String
}

private struct MaterializedModel {
    let asset: AdmittedAsset
    let digest: String
    let refreshedBookmark: Data?
}

private struct MotionMaterialization {
    let reference: StoredAvatarMotionReference
    let binding: LoadedMotionBinding
    let byteCount: UInt64

    init(
        reference: StoredAvatarMotionReference,
        binding: LoadedMotionBinding,
        byteCount: UInt64 = 0
    ) {
        self.reference = reference
        self.binding = binding
        self.byteCount = byteCount
    }
}

private struct V2ProfileEnvelope: Codable {
    let schemaVersion: Int
    let profiles: [StoredAvatarProfile]

    init(profiles: [StoredAvatarProfile]) {
        schemaVersion = StoredAvatarProfile.currentSchemaVersion
        self.profiles = profiles
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: StoreCodingKey.self)
        guard Set(container.allKeys.map(\.stringValue)) == ["profiles", "schemaVersion"] else {
            throw AvatarProfileStoreError.corruptStore
        }
        schemaVersion = try container.decode(Int.self, forKey: StoreCodingKey("schemaVersion"))
        profiles = try container.decode(
            [StoredAvatarProfile].self,
            forKey: StoreCodingKey("profiles")
        )
    }
}

private struct LegacyProfileEnvelope: Codable {
    let schemaVersion: Int
    let profiles: [LegacyAvatarProfile]

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: StoreCodingKey.self)
        guard Set(container.allKeys.map(\.stringValue)) == ["profiles", "schemaVersion"] else {
            throw AvatarProfileStoreError.corruptStore
        }
        schemaVersion = try container.decode(Int.self, forKey: StoreCodingKey("schemaVersion"))
        profiles = try container.decode(
            [LegacyAvatarProfile].self,
            forKey: StoreCodingKey("profiles")
        )
    }
}

private struct LegacyAvatarProfile: Codable {
    let schemaVersion: Int
    let id: UUID
    let displayName: String
    let modelBookmark: Data
    let modelSHA256: String
    let capturedByteCount: UInt64
    let rightsLabel: String
    let performanceProfile: String
    let consecutiveLoadFailures: Int

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

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        guard Set(container.allKeys.map(\.stringValue))
                == Set(CodingKeys.allCases.map(\.rawValue))
        else { throw AvatarProfileStoreError.corruptStore }
        schemaVersion = try container.decode(Int.self, forKey: .schemaVersion)
        guard schemaVersion == 1 else { throw AvatarProfileStoreError.corruptStore }
        id = try container.decode(UUID.self, forKey: .id)
        displayName = try container.decode(String.self, forKey: .displayName)
        modelBookmark = try container.decode(Data.self, forKey: .modelBookmark)
        modelSHA256 = try container.decode(String.self, forKey: .modelSHA256)
        capturedByteCount = try container.decode(UInt64.self, forKey: .capturedByteCount)
        rightsLabel = try container.decode(String.self, forKey: .rightsLabel)
        performanceProfile = try container.decode(String.self, forKey: .performanceProfile)
        consecutiveLoadFailures = try container.decode(
            Int.self,
            forKey: .consecutiveLoadFailures
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

    init(data: Data) { bytes = Array(data) }

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

private enum POSIXProfileFileOperations {
    static let maximumJSONBytes = AvatarProfileStore.maximumJSONBytes

    static func read(at url: URL) throws -> Data? {
        var rootInfo = stat()
        let rootPath = url.deletingLastPathComponent()
        if lstat(rootPath.path, &rootInfo) != 0 {
            guard errno == ENOENT else { throw AvatarProfileStoreError.persistenceFailed }
            return nil
        }
        guard (rootInfo.st_mode & S_IFMT) == S_IFDIR else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        let rootDescriptor = open(
            rootPath.path,
            O_RDONLY | O_DIRECTORY | O_NOFOLLOW | O_CLOEXEC
        )
        guard rootDescriptor >= 0 else { throw AvatarProfileStoreError.persistenceFailed }
        defer { _ = close(rootDescriptor) }

        let descriptor = url.lastPathComponent.withCString { name in
            openat(rootDescriptor, name, O_RDONLY | O_NONBLOCK | O_NOFOLLOW | O_CLOEXEC)
        }
        guard descriptor >= 0 else {
            if errno == ENOENT { return nil }
            if errno == ELOOP || errno == EISDIR { throw AvatarProfileStoreError.corruptStore }
            throw AvatarProfileStoreError.persistenceFailed
        }
        defer { _ = close(descriptor) }

        var before = stat()
        guard fstat(descriptor, &before) == 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        guard (before.st_mode & S_IFMT) == S_IFREG,
              before.st_size >= 0,
              UInt64(before.st_size) <= UInt64(maximumJSONBytes)
        else { throw AvatarProfileStoreError.corruptStore }

        var data = Data()
        data.reserveCapacity(Int(before.st_size))
        var buffer = [UInt8](repeating: 0, count: 64 * 1024)
        while data.count < maximumJSONBytes {
            let requested = min(buffer.count, maximumJSONBytes - data.count)
            let count = buffer.withUnsafeMutableBytes { pointer -> Int in
                guard let baseAddress = pointer.baseAddress else { return -1 }
                return Darwin.read(descriptor, baseAddress, requested)
            }
            if count < 0, errno == EINTR { continue }
            guard count >= 0 else { throw AvatarProfileStoreError.persistenceFailed }
            guard count > 0 else { break }
            data.append(contentsOf: buffer[0..<count])
        }
        if data.count == maximumJSONBytes {
            var byte: UInt8 = 0
            let count = Darwin.read(descriptor, &byte, 1)
            guard count == 0 else {
                if count < 0 { throw AvatarProfileStoreError.persistenceFailed }
                throw AvatarProfileStoreError.corruptStore
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
        else { throw AvatarProfileStoreError.corruptStore }
        return data
    }

    static func write(_ data: Data, at url: URL) throws {
        let rootDescriptor = try openRootDescriptor(url.deletingLastPathComponent())
        defer { _ = close(rootDescriptor) }

        let descriptor = url.lastPathComponent.withCString { name in
            openat(
                rootDescriptor,
                name,
                O_WRONLY | O_CREAT | O_EXCL | O_NOFOLLOW | O_CLOEXEC,
                mode_t(0o600)
            )
        }
        guard descriptor >= 0 else { throw AvatarProfileStoreError.persistenceFailed }
        var shouldUnlink = true
        defer {
            _ = close(descriptor)
            if shouldUnlink {
                _ = url.lastPathComponent.withCString { name in
                    unlinkat(rootDescriptor, name, 0)
                }
            }
        }
        try write(data, to: descriptor)
        guard fchmod(descriptor, mode_t(0o600)) == 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        shouldUnlink = false
    }

    static func fsyncFile(at url: URL) throws {
        let rootDescriptor = try openRootDescriptor(url.deletingLastPathComponent())
        defer { _ = close(rootDescriptor) }
        let descriptor = url.lastPathComponent.withCString { name in
            openat(rootDescriptor, name, O_RDONLY | O_NOFOLLOW | O_CLOEXEC)
        }
        guard descriptor >= 0 else { throw AvatarProfileStoreError.persistenceFailed }
        defer { _ = close(descriptor) }
        var info = stat()
        guard fstat(descriptor, &info) == 0,
              (info.st_mode & S_IFMT) == S_IFREG,
              fsync(descriptor) == 0
        else { throw AvatarProfileStoreError.persistenceFailed }
    }

    static func rename(from source: URL, to destination: URL) throws {
        let sourceRoot = source.deletingLastPathComponent()
        let destinationRoot = destination.deletingLastPathComponent()
        guard sourceRoot.standardizedFileURL.path == destinationRoot.standardizedFileURL.path else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        let rootDescriptor = try openRootDescriptor(sourceRoot)
        defer { _ = close(rootDescriptor) }
        try validateDestination(destination.lastPathComponent, in: rootDescriptor)
        let result = source.lastPathComponent.withCString { sourceName in
            destination.lastPathComponent.withCString { destinationName in
                renameat(rootDescriptor, sourceName, rootDescriptor, destinationName)
            }
        }
        guard result == 0 else { throw AvatarProfileStoreError.persistenceFailed }
    }

    static func fsyncDirectory(at root: URL) throws {
        let descriptor = try openRootDescriptor(root)
        defer { _ = close(descriptor) }
        guard fsync(descriptor) == 0 else {
            throw AvatarProfileStoreError.persistenceFailed
        }
    }

    static func unlinkRegular(at url: URL) throws {
        let root = url.deletingLastPathComponent()
        var rootInfo = stat()
        if lstat(root.path, &rootInfo) != 0 {
            guard errno == ENOENT else { throw AvatarProfileStoreError.persistenceFailed }
            return
        }
        let rootDescriptor = try openRootDescriptor(root)
        defer { _ = close(rootDescriptor) }
        var info = stat()
        let status = url.lastPathComponent.withCString { name in
            fstatat(rootDescriptor, name, &info, AT_SYMLINK_NOFOLLOW)
        }
        if status != 0 {
            guard errno == ENOENT else { throw AvatarProfileStoreError.persistenceFailed }
            return
        }
        guard (info.st_mode & S_IFMT) == S_IFREG else {
            throw AvatarProfileStoreError.persistenceFailed
        }
        let result = url.lastPathComponent.withCString { name in
            unlinkat(rootDescriptor, name, 0)
        }
        guard result == 0 else { throw AvatarProfileStoreError.persistenceFailed }
    }

    private static func openRootDescriptor(_ root: URL) throws -> Int32 {
        try ensureRootDirectory(root)
        let descriptor = open(
            root.path,
            O_RDONLY | O_DIRECTORY | O_NOFOLLOW | O_CLOEXEC
        )
        guard descriptor >= 0 else { throw AvatarProfileStoreError.persistenceFailed }
        return descriptor
    }

    private static func ensureRootDirectory(_ root: URL) throws {
        var info = stat()
        if lstat(root.path, &info) != 0 {
            guard errno == ENOENT else { throw AvatarProfileStoreError.persistenceFailed }
            do {
                try FileManager.default.createDirectory(
                    at: root,
                    withIntermediateDirectories: true,
                    attributes: [.posixPermissions: 0o700]
                )
            } catch {
                throw AvatarProfileStoreError.persistenceFailed
            }
        } else if (info.st_mode & S_IFMT) != S_IFDIR {
            throw AvatarProfileStoreError.persistenceFailed
        }
    }

    private static func validateDestination(
        _ name: String,
        in rootDescriptor: Int32
    ) throws {
        var info = stat()
        let result = name.withCString { value in
            fstatat(rootDescriptor, value, &info, AT_SYMLINK_NOFOLLOW)
        }
        if result != 0 {
            guard errno == ENOENT else { throw AvatarProfileStoreError.persistenceFailed }
            return
        }
        guard (info.st_mode & S_IFMT) == S_IFREG else {
            throw AvatarProfileStoreError.persistenceFailed
        }
    }

    private static func write(_ data: Data, to descriptor: Int32) throws {
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
                guard count > 0 else { throw AvatarProfileStoreError.persistenceFailed }
                offset += count
            }
        }
    }

    private static func sameFileIdentity(_ lhs: stat, _ rhs: stat) -> Bool {
        lhs.st_dev == rhs.st_dev
            && lhs.st_ino == rhs.st_ino
            && lhs.st_mode == rhs.st_mode
            && lhs.st_size == rhs.st_size
            && lhs.st_mtimespec.tv_sec == rhs.st_mtimespec.tv_sec
            && lhs.st_mtimespec.tv_nsec == rhs.st_mtimespec.tv_nsec
            && lhs.st_ctimespec.tv_sec == rhs.st_ctimespec.tv_sec
            && lhs.st_ctimespec.tv_nsec == rhs.st_ctimespec.tv_nsec
    }
}
