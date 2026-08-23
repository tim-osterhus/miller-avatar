import Foundation
import MillerAvatarCore
import Testing
@testable import MillerAvatarHost

@Suite
struct AvatarProfileStoreTests {
    @Test
    func newStoreIsEmptyAndDoesNotCreateV2File() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }

        let store = AvatarProfileStore(root: root)

        #expect(try await store.list().isEmpty)
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v2.json").path
        ))
    }

    @Test
    func importAndLookupExposeOnlySummariesAndUnknownProfileThrows() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let store = makeStore(root: root, modelBytes: modelBytes, model: model)

        let summary = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )

        #expect(summary.profileRevision == 1)
        #expect(summary.displayName == "Avatar")
        #expect(summary.modelCapturedByteCount == UInt64(modelBytes.count))
        #expect(summary.qualityMode == .lightweight)
        #expect(try await store.profile(id: summary.id) == summary)
        await expectError(.unknownProfile) {
            _ = try await store.profile(id: UUID())
        }
    }

    @Test
    func explicitQualityModeIsPersistedAndReachesCaptureAndAdmissionExactlyOnce() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let observations = QualityModeObservations()
        let recorder = StoreRecorder()
        let dependencies = AvatarProfileStoreDependencies(
            admission: { bytes, mode in
                observations.recordAdmission(mode, byteCount: bytes.count)
                return .admitted(model)
            },
            bookmarkCreator: { url in Data(url.path.utf8) },
            bookmarkResolver: { bookmark in
                guard let path = String(data: bookmark, encoding: .utf8) else {
                    throw TestFailure.failed
                }
                return AvatarResolvedBookmark(
                    url: URL(fileURLWithPath: path),
                    isStale: false
                )
            },
            securityScope: recorder,
            capture: { _, maximumBytes, mode in
                observations.recordCapture(mode, maximumBytes: maximumBytes)
                return modelBytes
            }
        )
        let store = AvatarProfileStore(
            root: root,
            dependencies: dependencies
        )

        let summary = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar",
            qualityMode: .highQuality
        )

        #expect(summary.qualityMode == .highQuality)
        #expect(observations.captureModes == [.highQuality])
        #expect(observations.admissionModes == [.highQuality])
        #expect(observations.captureMaximums == [AssetBudget.highQuality.capturedBytes])
        let persisted = try #require(
            JSONSerialization.jsonObject(
                with: Data(contentsOf: root.appendingPathComponent("profiles-v2.json"))
            ) as? [String: Any]
        )
        let profile = try #require((persisted["profiles"] as? [[String: Any]])?.first)
        #expect(profile["performanceProfile"] as? String == "high_quality")
    }

    @Test
    func highQualityModeSurvivesReloadContentReplacementAndRetryWithoutFallback() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let originalBytes = try minimalGLB()
        let replacementBytes = try minimalGLB(binaryByteCount: 8)
        let originalAsset = try #require(await admittedAsset(for: originalBytes))
        let replacementAsset = try #require(await admittedAsset(for: replacementBytes))
        let asset = LockedBox<AdmittedAsset>(originalAsset)
        let bytes = LockedBox(replacementBytes)
        let observations = QualityModeObservations()
        let dependencies = makeModeAwareDependencies(
            modelBox: asset,
            bytesBox: bytes,
            observations: observations
        )
        let store = AvatarProfileStore(root: root, dependencies: dependencies)

        let imported = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar",
            qualityMode: .highQuality
        )
        try await store.recordRendererFailure(id: imported.id)
        try await store.retry(id: imported.id)

        let restarted = AvatarProfileStore(
            root: root,
            dependencies: makeModeAwareDependencies(
                modelBox: asset,
                bytesBox: bytes,
                observations: observations
            )
        )
        #expect(try await restarted.profile(id: imported.id).qualityMode == .highQuality)

        asset.set(replacementAsset)
        let lease = ProfileMaterializationLease()
        try await restarted.materializeForRendering(id: imported.id, lease: lease)
        #expect(lease.takePreparedProfile()?.model.bytes == replacementBytes)
        #expect(observations.captureModes.last == .highQuality)
        #expect(observations.admissionModes.last == .highQuality)
        #expect(observations.captureMaximums.last == AssetBudget.highQuality.capturedBytes)
        #expect(try await restarted.profile(id: imported.id).qualityMode == .highQuality)
    }

    @Test
    func unknownStoredQualityModeIsAClosedCorruptStoreFailure() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        var profile: [String: Any] = [
            "schemaVersion": 2,
            "id": UUID().uuidString,
            "displayName": "Avatar",
            "modelBookmark": Data([1]).base64EncodedString(),
            "modelSHA256": String(repeating: "a", count: 64),
            "capturedByteCount": 1,
            "rightsLabel": AvatarProfile.rightsLabel,
            "performanceProfile": "future_mode",
            "consecutiveLoadFailures": 0,
            "profileRevision": 1,
            "motionLibrary": [:],
            "motionBindings": [:],
        ]
        try envelopeData(profile: profile).write(
            to: root.appendingPathComponent(AvatarProfileStore.fileName)
        )

        await expectError(.corruptStore) {
            _ = try await AvatarProfileStore(root: root).list()
        }
        profile["performanceProfile"] = "high_quality"
        try envelopeData(profile: profile).write(
            to: root.appendingPathComponent(AvatarProfileStore.fileName)
        )
        #expect(try await AvatarProfileStore(root: root).list().first?.qualityMode == .highQuality)
    }

    @Test
    func storedCaptureValidationUsesTheRecordedModeCeiling() throws {
        let profile = StoredAvatarProfile(
            id: UUID(),
            displayName: "Avatar",
            modelBookmark: Data([1]),
            modelSHA256: String(repeating: "a", count: 64),
            capturedByteCount: AssetBudget.lightweight.capturedBytes + 1,
            profileRevision: 1,
            motionLibrary: [:],
            motionBindings: [:],
            qualityMode: .highQuality
        )

        let encoded = try JSONEncoder().encode(profile)
        let decoded = try JSONDecoder().decode(StoredAvatarProfile.self, from: encoded)

        #expect(decoded.qualityMode == .highQuality)
        #expect(decoded.capturedByteCount == AssetBudget.lightweight.capturedBytes + 1)
        #expect(profile.performanceProfile == "high_quality")

        var overCap = try #require(
            JSONSerialization.jsonObject(with: encoded) as? [String: Any]
        )
        overCap["capturedByteCount"] = AssetBudget.highQuality.capturedBytes + 1
        let overCapData = try JSONSerialization.data(withJSONObject: overCap)
        #expect(throws: AvatarProfileStoreError.corruptStore) {
            try JSONDecoder().decode(StoredAvatarProfile.self, from: overCapData)
        }
    }

    @Test
    func revisionsChangeOnlyForContentAndBindingChanges() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let motion = admittedMotion(bytes: Data([7, 8]))
        let plan = MotionAdmissionPlan()
        plan.append(.admitted(motion))
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: motion,
            motionBytes: ["wave.vrma": Data([7, 8])]
        )

        var profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let initialRevision = profile.profileRevision

        try await store.rename(id: profile.id, displayName: "Renamed")
        profile = try await store.profile(id: profile.id)
        #expect(profile.profileRevision == initialRevision)
        try await store.rename(id: profile.id, displayName: "Renamed")
        #expect((try await store.profile(id: profile.id)).profileRevision == initialRevision)

        try await store.recordRendererFailure(id: profile.id)
        #expect((try await store.profile(id: profile.id)).profileRevision == initialRevision)
        try await store.retry(id: profile.id)
        #expect((try await store.profile(id: profile.id)).profileRevision == initialRevision)

        let motionSummary = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("wave.vrma"),
            displayName: "Wave"
        )
        profile = try await store.profile(id: profile.id)
        let afterImportMotion = profile.profileRevision
        #expect(afterImportMotion == initialRevision + 1)

        try await store.renameMotion(
            profileID: profile.id,
            motionID: motionSummary.id,
            displayName: "Renamed wave"
        )
        #expect((try await store.profile(id: profile.id)).profileRevision == afterImportMotion)

        try await store.bindMotion(
            profileID: profile.id,
            role: .idle,
            motionID: motionSummary.id
        )
        let afterBind = try await store.profile(id: profile.id)
        #expect(afterBind.profileRevision == afterImportMotion + 1)
        try await store.bindMotion(
            profileID: profile.id,
            role: .idle,
            motionID: motionSummary.id
        )
        #expect((try await store.profile(id: profile.id)).profileRevision == afterBind.profileRevision)

        try await store.recordMotionRendererFailure(
            profileID: profile.id,
            motionID: motionSummary.id
        )
        #expect((try await store.profile(id: profile.id)).profileRevision == afterBind.profileRevision)
        try await store.retryMotion(profileID: profile.id, motionID: motionSummary.id)
        #expect((try await store.profile(id: profile.id)).profileRevision == afterBind.profileRevision)

        try await store.bindMotion(profileID: profile.id, role: .idle, motionID: nil)
        #expect((try await store.profile(id: profile.id)).profileRevision == afterBind.profileRevision + 1)
    }

    @Test
    func committedVariantsReturnExactReceiptOrNilForEveryRequestedMutation() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let motion = admittedMotion(bytes: Data([7, 8]))
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionDefault: motion
        )

        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let initialCommit = AvatarProfileCommit(
            profileID: profile.id,
            profileRevision: profile.profileRevision
        )

        #expect(try await store.renameCommitted(
            id: profile.id,
            displayName: "Renamed"
        ) == initialCommit)
        #expect(try await store.renameCommitted(
            id: profile.id,
            displayName: "Renamed"
        ) == nil)

        let importedMotion = try await store.importMotionCommitted(
            profileID: profile.id,
            at: root.appendingPathComponent("wave.vrma"),
            displayName: "Wave"
        )
        #expect(importedMotion.summary.displayName == "Wave")
        let motionCommit = AvatarProfileCommit(
            profileID: profile.id,
            profileRevision: profile.profileRevision + 1
        )
        #expect(importedMotion.commit == motionCommit)

        #expect(try await store.renameMotionCommitted(
            profileID: profile.id,
            motionID: importedMotion.summary.id,
            displayName: "Renamed wave"
        ) == motionCommit)
        #expect(try await store.renameMotionCommitted(
            profileID: profile.id,
            motionID: importedMotion.summary.id,
            displayName: "Renamed wave"
        ) == nil)

        let boundCommit = try #require(try await store.bindMotionCommitted(
            profileID: profile.id,
            role: .idle,
            motionID: importedMotion.summary.id
        ))
        #expect(boundCommit == AvatarProfileCommit(
            profileID: profile.id,
            profileRevision: motionCommit.profileRevision + 1
        ))
        #expect(try await store.bindMotionCommitted(
            profileID: profile.id,
            role: .idle,
            motionID: importedMotion.summary.id
        ) == nil)

        try await store.recordRendererFailure(id: profile.id)
        #expect(try await store.retryCommitted(id: profile.id) == boundCommit)
        #expect(try await store.retryCommitted(id: profile.id) == nil)

        try await store.recordMotionRendererFailure(
            profileID: profile.id,
            motionID: importedMotion.summary.id
        )
        #expect(try await store.retryMotionCommitted(
            profileID: profile.id,
            motionID: importedMotion.summary.id
        ) == boundCommit)
        #expect(try await store.retryMotionCommitted(
            profileID: profile.id,
            motionID: importedMotion.summary.id
        ) == nil)

        let removedMotionCommit = try #require(try await store.removeMotionCommitted(
            profileID: profile.id,
            motionID: importedMotion.summary.id
        ))
        #expect(removedMotionCommit == AvatarProfileCommit(
            profileID: profile.id,
            profileRevision: boundCommit.profileRevision + 1
        ))

        #expect(try await store.removeCommitted(id: profile.id) == removedMotionCommit)
    }

    @Test
    func resetMetadataRemovesOnlyKnownFilesAndIsIdempotent() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let store = makeStore(root: root, modelBytes: modelBytes, model: model)
        _ = try await store.importModel(
            at: root.appendingPathComponent("original.vrm"),
            displayName: "Avatar"
        )

        let originalModel = Data([1, 2, 3])
        let originalMotion = Data([4, 5, 6])
        let unrelated = Data([7, 8, 9])
        try originalModel.write(to: root.appendingPathComponent("original.vrm"))
        try originalMotion.write(to: root.appendingPathComponent("original.vrma"))
        try unrelated.write(to: root.appendingPathComponent("keep.bin"))
        try Data("legacy".utf8).write(
            to: root.appendingPathComponent(AvatarProfileStore.legacyFileName)
        )

        try await store.resetMetadata()
        try await store.resetMetadata()

        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent(AvatarProfileStore.fileName).path
        ))
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent(AvatarProfileStore.legacyFileName).path
        ))
        #expect(try Data(contentsOf: root.appendingPathComponent("original.vrm")) == originalModel)
        #expect(try Data(contentsOf: root.appendingPathComponent("original.vrma")) == originalMotion)
        #expect(try Data(contentsOf: root.appendingPathComponent("keep.bin")) == unrelated)
        #expect(try await store.list().isEmpty)
    }

    @Test
    func resetMetadataSerializesWithImportWithoutCorruptingEitherOutcome() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let store = makeStore(root: root, modelBytes: modelBytes, model: model)

        async let reset: Void = store.resetMetadata()
        async let imported = store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        _ = try await reset
        _ = try await imported

        let profiles = try await store.list()
        #expect(profiles.count == 0 || profiles.count == 1)
        if profiles.isEmpty {
            #expect(!FileManager.default.fileExists(
                atPath: root.appendingPathComponent(AvatarProfileStore.fileName).path
            ))
        } else {
            #expect(profiles[0].profileRevision == 1)
        }
    }

    @Test
    func resetMetadataRefusesSymlinkAndNonRegularKnownFiles() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let outside = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: outside) }
        let store = AvatarProfileStore(root: root)

        for fileName in [AvatarProfileStore.fileName, AvatarProfileStore.legacyFileName] {
            let target = root.appendingPathComponent(fileName)
            let external = outside.appendingPathComponent(fileName)
            try Data([1, 2, 3]).write(to: external)
            try FileManager.default.createSymbolicLink(
                at: target,
                withDestinationURL: external
            )
            await expectError(.persistenceFailed) {
                try await store.resetMetadata()
            }
            #expect(try Data(contentsOf: external) == Data([1, 2, 3]))
            try FileManager.default.removeItem(at: target)

            try FileManager.default.createDirectory(at: target, withIntermediateDirectories: false)
            await expectError(.persistenceFailed) {
                try await store.resetMetadata()
            }
            try FileManager.default.removeItem(at: target)
        }
    }

    @Test
    func resetMetadataPreflightsBothKnownFilesBeforeRemovingEither() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let outside = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: outside) }
        let v2 = root.appendingPathComponent(AvatarProfileStore.fileName)
        let v1 = root.appendingPathComponent(AvatarProfileStore.legacyFileName)
        let external = outside.appendingPathComponent("legacy.json")
        let originalV2 = Data("v2-metadata".utf8)
        let originalExternal = Data("outside".utf8)
        try originalV2.write(to: v2)
        try originalExternal.write(to: external)
        try FileManager.default.createSymbolicLink(at: v1, withDestinationURL: external)

        await expectError(.persistenceFailed) {
            try await AvatarProfileStore(root: root).resetMetadata()
        }

        #expect(try Data(contentsOf: v2) == originalV2)
        #expect(try Data(contentsOf: external) == originalExternal)
        #expect(FileManager.default.fileExists(atPath: v1.path))
    }

    @Test
    func resetMetadataOnAbsentRootIsAnIdempotentNoOpWithoutCreatingRoot() async throws {
        let root = FileManager.default.temporaryDirectory
            .appendingPathComponent("miller-avatar-absent-reset-\(UUID().uuidString)")
        defer { try? FileManager.default.removeItem(at: root) }
        let store = AvatarProfileStore(root: root)

        try await store.resetMetadata()
        try await store.resetMetadata()

        #expect(!FileManager.default.fileExists(atPath: root.path))
    }

    @Test
    func resetInvalidatesSuspendedMaterializationBeforeItCanCommit() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let originalModelBytes = try minimalGLB()
        let changedModelBytes = try minimalGLB(binaryByteCount: 8)
        let originalModel = try #require(await admittedAsset(for: originalModelBytes))
        let changedModel = try #require(await admittedAsset(for: changedModelBytes))
        let motion = admittedMotion(bytes: Data([3, 4]))
        let model = LockedBox<AdmittedAsset?>(originalModel)
        let capturedModel = LockedBox(originalModelBytes)
        let gateEntered = LockedBox(false)
        let gateOpen = LockedBox(false)
        let store = makeStore(
            root: root,
            modelBytes: originalModelBytes,
            model: originalModel,
            modelBox: model,
            motionDefault: motion,
            capture: { url, _ in
                url.pathExtension == "vrm" ? capturedModel.current : Data([3, 4])
            },
            beforeMotionMaterialization: {
                gateEntered.set(true)
                while !gateOpen.current { await Task.yield() }
            }
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let importedMotion = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("motion.vrma"),
            displayName: "Motion"
        )
        try await store.bindMotion(
            profileID: profile.id,
            role: .idle,
            motionID: importedMotion.id
        )
        capturedModel.set(changedModelBytes)
        model.set(changedModel)
        let lease = ProfileMaterializationLease()
        let materialization = Task {
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }
        try await waitUntil { gateEntered.current }
        let reset = Task { try await store.resetMetadata() }
        try await reset.value
        gateOpen.set(true)

        do {
            try await materialization.value
            Issue.record("expected suspended materialization to be invalidated")
        } catch is CancellationError {
            // expected
        } catch {
            Issue.record("expected CancellationError, got \(error)")
        }
        #expect(lease.preparedProfile == nil)
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent(AvatarProfileStore.fileName).path
        ))
    }

    @Test
    func productionOpeningExistingRootEnforcesOwnerOnlyModeAndRejectsSymlinkRoot() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        try FileManager.default.setAttributes(
            [.posixPermissions: NSNumber(value: 0o755)],
            ofItemAtPath: root.path
        )

        #expect(try await AvatarProfileStore(root: root).list().isEmpty)
        let attributes = try FileManager.default.attributesOfItem(atPath: root.path)
        let permissions = try #require(attributes[.posixPermissions] as? NSNumber).intValue
        #expect(permissions & 0o777 == 0o700)

        let actual = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: actual) }
        let alias = root.deletingLastPathComponent()
            .appendingPathComponent("symlink-root-\(UUID().uuidString)")
        defer { try? FileManager.default.removeItem(at: alias) }
        try FileManager.default.createSymbolicLink(at: alias, withDestinationURL: actual)
        await expectError(.persistenceFailed) {
            _ = try await AvatarProfileStore(root: alias).list()
        }
    }

    @Test
    func unchangedMaterializationAndBookmarkOnlyRefreshDoNotChangeRevision() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let store = makeStore(root: root, modelBytes: modelBytes, model: model)
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )

        let firstLease = ProfileMaterializationLease()
        try await store.materializeForRendering(id: profile.id, lease: firstLease)
        let first = try #require(firstLease.takePreparedProfile())
        #expect(first.profileRevision == profile.profileRevision)

        let secondLease = ProfileMaterializationLease()
        try await store.materializeForRendering(id: profile.id, lease: secondLease)
        let second = try #require(secondLease.takePreparedProfile())
        #expect(second.profileRevision == profile.profileRevision)

        #expect((try await store.profile(id: profile.id)).profileRevision == profile.profileRevision)
    }

    @Test
    func changedModelAndMotionContentIncrementRevisionOnce() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let changedModelBytes = try minimalGLB(binaryByteCount: 8)
        let firstModel = try #require(await admittedAsset(for: modelBytes))
        let secondModel = try #require(await admittedAsset(for: changedModelBytes))
        let firstMotion = admittedMotion(bytes: Data([1, 2]))
        let secondMotion = admittedMotion(bytes: Data([3, 4, 5]))
        let modelBox = LockedBox<AdmittedAsset?>(firstModel)
        let plan = MotionAdmissionPlan(results: [.admitted(firstMotion), .admitted(secondMotion)])
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: firstModel,
            modelBox: modelBox,
            motionPlan: plan,
            motionDefault: firstMotion,
            motionBytes: [
                "model.vrm": changedModelBytes,
                "wave.vrma": Data([3, 4, 5]),
            ]
        )
        var profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let motion = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("wave.vrma"),
            displayName: "Wave"
        )
        try await store.bindMotion(profileID: profile.id, role: .idle, motionID: motion.id)
        profile = try await store.profile(id: profile.id)
        let beforeMaterialization = profile.profileRevision

        modelBox.set(secondModel)
        let lease = ProfileMaterializationLease()
        try await store.materializeForRendering(id: profile.id, lease: lease)
        _ = try #require(lease.takePreparedProfile())

        let after = try await store.profile(id: profile.id)
        #expect(after.profileRevision == beforeMaterialization + 1)
        #expect(after.modelCapturedByteCount == UInt64(changedModelBytes.count))
        #expect(after.motions[0].capturedByteCount == UInt64(secondMotion.bytes.count))
    }

    @Test
    func removingBoundMotionRemovesEveryBindingAtomically() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let motion = admittedMotion(bytes: Data([1]))
        let plan = MotionAdmissionPlan(results: [.admitted(motion)])
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: motion
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let imported = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("wave.vrma"),
            displayName: "Wave"
        )
        try await store.bindMotion(profileID: profile.id, role: .idle, motionID: imported.id)
        try await store.bindMotion(profileID: profile.id, role: .speaking, motionID: imported.id)
        let before = try await store.profile(id: profile.id)

        try await store.removeMotion(profileID: profile.id, motionID: imported.id)
        let after = try await store.profile(id: profile.id)
        #expect(after.motions.isEmpty)
        #expect(after.motionBindings.isEmpty)
        #expect(after.profileRevision == before.profileRevision + 1)
    }

    @Test
    func modelFailureIsTerminalAfterThreeFailuresAndModelRetryPreservesMotionState() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let shouldFail = LockedBox(false)
        let motion = admittedMotion(bytes: Data([1]))
        let plan = MotionAdmissionPlan(results: [.admitted(motion)])
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: motion,
            capture: { url, _ in
                if shouldFail.current && url.pathExtension == "vrm" {
                    throw TestFailure.failed
                }
                return url.pathExtension == "vrma" ? Data([1]) : modelBytes
            }
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let importedMotion = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("wave.vrma"),
            displayName: "Wave"
        )
        try await store.recordMotionRendererFailure(
            profileID: profile.id,
            motionID: importedMotion.id
        )
        let before = try await store.profile(id: profile.id)
        shouldFail.set(true)

        for failureCount in 1...3 {
            await expectError(.assetRejected) {
                let lease = ProfileMaterializationLease()
                try await store.materializeForRendering(id: profile.id, lease: lease)
            }
            #expect((try await store.profile(id: profile.id)).modelConsecutiveLoadFailures == failureCount)
        }
        await expectError(.quarantined) {
            let lease = ProfileMaterializationLease()
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }

        try await store.retry(id: profile.id)
        let afterRetry = try await store.profile(id: profile.id)
        #expect(afterRetry.modelConsecutiveLoadFailures == 0)
        #expect(afterRetry.motions[0].consecutiveLoadFailures == before.motions[0].consecutiveLoadFailures)
        #expect(afterRetry.profileRevision == before.profileRevision)
    }

    @Test
    func motionFailuresAreRoleLocalQuarantinedAndRetrySuccessDoesNotChangeRevision() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let motion = admittedMotion(bytes: Data([1]))
        let plan = MotionAdmissionPlan(results: [
            .admitted(motion),
            .rejected(.motionRejected),
            .rejected(.motionRejected),
            .rejected(.motionRejected),
            .admitted(motion),
        ])
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: motion
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let imported = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("wave.vrma"),
            displayName: "Wave"
        )
        try await store.bindMotion(profileID: profile.id, role: .idle, motionID: imported.id)
        let bound = try await store.profile(id: profile.id)

        for count in 1...3 {
            let result = try await materialize(store, profileID: profile.id)
            guard case .rejected(_, let reason) = result.prepared.motionBindings[.idle] else {
                Issue.record("expected a rejected motion")
                return
            }
            #expect(reason == .motionRejected)
            #expect((try await store.profile(id: profile.id)).motions[0].consecutiveLoadFailures == count)
            #expect(result.prepared.model.bytes.count == modelBytes.count)
        }

        let quarantined = try await materialize(store, profileID: profile.id)
        guard case .rejected(_, let reason) = quarantined.prepared.motionBindings[.idle] else {
            Issue.record("expected a quarantined motion")
            return
        }
        #expect(reason == .quarantined)
        try await store.retryMotion(profileID: profile.id, motionID: imported.id)
        let ready = try await materialize(store, profileID: profile.id)
        guard case .ready = ready.prepared.motionBindings[.idle] else {
            Issue.record("expected motion retry to prepare the motion")
            return
        }
        #expect((try await store.profile(id: profile.id)).profileRevision == bound.profileRevision)
    }

    @Test
    func perMotionAdmissionCodeAndFailureRemainLocal() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let motion = admittedMotion(bytes: Data([1]))
        let plan = MotionAdmissionPlan(results: [
            .admitted(motion),
            .rejected(.resourceLimit),
        ])
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: motion
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let imported = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("wave.vrma"),
            displayName: "Wave"
        )
        try await store.bindMotion(profileID: profile.id, role: .idle, motionID: imported.id)

        let result = try await materialize(store, profileID: profile.id)
        guard case .rejected(_, let reason) = result.prepared.motionBindings[.idle] else {
            Issue.record("expected a resource-limited motion")
            return
        }
        #expect(reason == .resourceLimit)
        #expect(result.prepared.readyMotions.isEmpty)
        #expect((try await store.profile(id: profile.id)).modelStatus == .available)
        #expect((try await store.profile(id: profile.id)).motions[0].lastFailure == .resourceLimit)
    }

    @Test
    func aggregateMotionOverflowRejectsEveryRoleWithoutMotionCountersOrBytes() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let motions = (0..<4).map { _ in
            admittedMotion(bytes: Data(repeating: 1, count: 7 * 1_024 * 1_024))
        }
        let plan = MotionAdmissionPlan()
        for motion in motions { plan.append(.admitted(motion)) }
        for motion in motions { plan.append(.admitted(motion)) }
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: motions[0]
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        var motionIDs: [UUID] = []
        for _ in motions.indices {
            let summary = try await store.importMotion(
                profileID: profile.id,
                at: root.appendingPathComponent("motion-(index).vrma"),
                displayName: "Motion (index)"
            )
            motionIDs.append(summary.id)
        }
        for (role, motionID) in zip(
            [AvatarMotionRole.idle, .listening, .thinking, .speaking],
            motionIDs
        ) {
            try await store.bindMotion(profileID: profile.id, role: role, motionID: motionID)
        }
        let before = try await store.profile(id: profile.id)
        let result = try await materialize(store, profileID: profile.id)
        #expect(result.prepared.readyMotions.isEmpty)
        for role in [AvatarMotionRole.idle, .listening, .thinking, .speaking] {
            guard case .rejected(_, let reason) = result.prepared.motionBindings[role] else {
                Issue.record("expected (role) to be rejected")
                continue
            }
            #expect(reason == .resourceLimit)
        }
        let after = try await store.profile(id: profile.id)
        #expect(after.profileRevision == before.profileRevision)
        #expect(after.motions.allSatisfy { $0.consecutiveLoadFailures == 0 })
    }

    @Test
    func aggregateMotionOverflowCommitsSuccessfulMetadataWithoutMotionFailures() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let (store, profile, materializing, motionPaths) = try await makeAggregateOverflowFixture(
            root: root
        )
        materializing.set(true)

        let before = profile
        let result = try await materialize(store, profileID: profile.id)
        #expect(result.prepared.readyMotions.isEmpty)
        for role in [AvatarMotionRole.idle, .listening, .thinking, .speaking] {
            guard case .rejected(_, let reason) = result.prepared.motionBindings[role] else {
                Issue.record("expected (role) to be rejected")
                continue
            }
            #expect(reason == .resourceLimit)
        }

        let after = try await store.profile(id: profile.id)
        #expect(after.profileRevision == before.profileRevision + 1)
        #expect(after.motions.allSatisfy {
            $0.capturedByteCount == 7 * 1_024 * 1_024
                && $0.consecutiveLoadFailures == 0
                && $0.lastFailure == nil
        })

        let persisted = try #require(
            JSONSerialization.jsonObject(
                with: Data(contentsOf: root.appendingPathComponent("profiles-v2.json"))
            ) as? [String: Any]
        )
        let persistedProfile = try #require(
            (persisted["profiles"] as? [[String: Any]])?.first
        )
        let library = try #require(persistedProfile["motionLibrary"] as? [String: Any])
        for path in motionPaths {
            let id = try #require(
                library.values.first { value in
                    guard let reference = value as? [String: Any],
                          let bookmark = reference["bookmark"] as? String
                    else { return false }
                    return bookmark == Data((path + ".refreshed").utf8).base64EncodedString()
                }
            )
            #expect(id is [String: Any])
        }
    }

    @Test
    func aggregateMotionOverflowCancellationAtCommitPersistsNothing() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let (store, profile, materializing, _) = try await makeAggregateOverflowFixture(
            root: root
        )
        materializing.set(true)
        let before = try Data(contentsOf: root.appendingPathComponent("profiles-v2.json"))
        let cancellation = LockedBox<(@Sendable () -> Void)?>(nil)
        let ready = DispatchSemaphore(value: 0)
        let lease = ProfileMaterializationLease(beforeLock: {
            ready.wait()
            cancellation.current?()
        })
        let task = Task {
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }
        cancellation.set { task.cancel() }
        ready.signal()

        do {
            try await task.value
            Issue.record("expected cancellation")
        } catch is CancellationError {
            // expected
        } catch {
            Issue.record("expected CancellationError, got (error)")
        }
        #expect(try Data(contentsOf: root.appendingPathComponent("profiles-v2.json")) == before)
        #expect(lease.preparedProfile == nil)
        #expect((try await store.profile(id: profile.id)).motions.allSatisfy {
            $0.capturedByteCount == 1 && $0.consecutiveLoadFailures == 1
        })
    }

    @Test
    func multiplyBoundMotionIsCapturedAndAdmittedOnce() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let motion = admittedMotion(bytes: Data([1, 2]))
        let plan = MotionAdmissionPlan(results: [.admitted(motion), .admitted(motion)])
        let captures = LockedCounter()
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: motion,
            motionBytes: ["shared.vrma": Data([1, 2])],
            captureObserver: { url in
                if url.lastPathComponent == "shared.vrma" { captures.increment() }
            }
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let imported = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("shared.vrma"),
            displayName: "Shared"
        )
        let beforeMaterialization = captures.value
        try await store.bindMotion(profileID: profile.id, role: .idle, motionID: imported.id)
        try await store.bindMotion(profileID: profile.id, role: .speaking, motionID: imported.id)
        let result = try await materialize(store, profileID: profile.id)
        #expect(captures.value == beforeMaterialization + 1)
        guard case .ready = result.prepared.motionBindings[.idle],
              case .ready = result.prepared.motionBindings[.speaking]
        else {
            Issue.record("expected both roles to receive the shared motion")
            return
        }
    }

    @Test
    func cancellationNeverPersistsModelOrMotionFailureAndLeaseReleasesPreparedData() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let entered = LockedBox(false)
        let release = LockedBox(false)
        let captureCalls = LockedCounter()
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            capture: { _, _ in
                captureCalls.increment()
                if captureCalls.value > 1 {
                    entered.set(true)
                    while !release.current { Thread.sleep(forTimeInterval: 0.001) }
                }
                return modelBytes
            }
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let before = try Data(contentsOf: root.appendingPathComponent("profiles-v2.json"))
        let lease = ProfileMaterializationLease()
        let task = Task {
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }
        try await waitUntil { entered.current }
        lease.invalidate()
        release.set(true)
        do {
            try await task.value
            Issue.record("expected cancellation")
        } catch is CancellationError {
            // expected
        } catch {
            Issue.record("expected CancellationError, got \(error)")
        }
        #expect(try Data(contentsOf: root.appendingPathComponent("profiles-v2.json")) == before)
        #expect((try await store.profile(id: profile.id)).modelConsecutiveLoadFailures == 0)
        #expect(lease.preparedProfile == nil)
        #expect(!lease.isActive)
    }

    @Test
    func taskCancellationBeforeFinalCommitLockDoesNotPersistOrPublish() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let originalBytes = try minimalGLB()
        let changedBytes = try minimalGLB(binaryByteCount: 8)
        let originalModel = try #require(await admittedAsset(for: originalBytes))
        let changedModel = try #require(await admittedAsset(for: changedBytes))
        let modelBox = LockedBox<AdmittedAsset?>(originalModel)
        let store = makeStore(
            root: root,
            modelBytes: originalBytes,
            model: originalModel,
            modelBox: modelBox
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        modelBox.set(changedModel)
        let before = try Data(contentsOf: root.appendingPathComponent("profiles-v2.json"))
        let cancellation = LockedBox<(@Sendable () -> Void)?>(nil)
        let ready = DispatchSemaphore(value: 0)
        let lease = ProfileMaterializationLease(beforeLock: {
            ready.wait()
            cancellation.current?()
        })
        let task = Task {
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }
        cancellation.set { task.cancel() }
        ready.signal()

        do {
            try await task.value
            Issue.record("expected cancellation")
        } catch is CancellationError {
            // expected
        } catch {
            Issue.record("expected CancellationError, got \(error)")
        }
        #expect(try Data(contentsOf: root.appendingPathComponent("profiles-v2.json")) == before)
        #expect(lease.preparedProfile == nil)
        #expect(lease.isActive)
    }

    @Test
    func taskCancellationBeforeFailureCommitDoesNotPersistFailure() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let shouldFail = LockedBox(false)
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            capture: { _, _ in
                if shouldFail.current { throw TestFailure.failed }
                return modelBytes
            }
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        shouldFail.set(true)
        let before = try Data(contentsOf: root.appendingPathComponent("profiles-v2.json"))
        let cancellation = LockedBox<(@Sendable () -> Void)?>(nil)
        let ready = DispatchSemaphore(value: 0)
        let lease = ProfileMaterializationLease(beforeLock: {
            ready.wait()
            cancellation.current?()
        })
        let task = Task {
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }
        cancellation.set { task.cancel() }
        ready.signal()

        do {
            try await task.value
            Issue.record("expected cancellation")
        } catch is CancellationError {
            // expected
        } catch {
            Issue.record("expected CancellationError, got \(error)")
        }
        #expect(try Data(contentsOf: root.appendingPathComponent("profiles-v2.json")) == before)
        #expect((try await store.profile(id: profile.id)).modelConsecutiveLoadFailures == 0)
        #expect(lease.preparedProfile == nil)
        #expect(lease.isActive)
    }

    @Test
    func cancellationBetweenModelAndMotionCaptureDoesNotCommitStagedState() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let motion = admittedMotion(bytes: Data([1, 2]))
        let plan = MotionAdmissionPlan(results: [
            .admitted(motion),
            .admitted(motion),
        ])
        let blockMotionCapture = LockedBox(false)
        let entered = LockedBox(false)
        let release = LockedBox(false)
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: motion,
            capture: { url, _ in
                if url.pathExtension == "vrma", blockMotionCapture.current {
                    entered.set(true)
                    while !release.current { Thread.sleep(forTimeInterval: 0.001) }
                }
                return url.pathExtension == "vrma" ? Data([1, 2]) : modelBytes
            }
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let imported = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("motion.vrma"),
            displayName: "Motion"
        )
        try await store.bindMotion(profileID: profile.id, role: .idle, motionID: imported.id)
        let before = try Data(contentsOf: root.appendingPathComponent("profiles-v2.json"))
        blockMotionCapture.set(true)

        let lease = ProfileMaterializationLease()
        let task = Task {
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }
        try await waitUntil { entered.current }
        lease.invalidate()
        release.set(true)

        do {
            try await task.value
            Issue.record("expected cancellation")
        } catch is CancellationError {
            // expected
        } catch {
            Issue.record("expected CancellationError, got (error)")
        }
        #expect(try Data(contentsOf: root.appendingPathComponent("profiles-v2.json")) == before)
        #expect(lease.preparedProfile == nil)
        #expect((try await store.profile(id: profile.id)).motions[0].capturedByteCount == 2)
    }

    @Test
    func cancellationDuringSecondUniqueMultiplyBoundMotionDoesNotCommit() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let sharedAsset = admittedMotion(bytes: Data([1, 2]))
        let secondAsset = admittedMotion(bytes: Data([3, 4]))
        let plan = MotionAdmissionPlan(results: [
            .admitted(sharedAsset),
            .admitted(secondAsset),
            .admitted(sharedAsset),
            .admitted(secondAsset),
        ])
        let blockSecondCapture = LockedBox(false)
        let entered = LockedBox(false)
        let release = LockedBox(false)
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: sharedAsset,
            capture: { url, _ in
                if url.lastPathComponent == "second.vrma", blockSecondCapture.current {
                    entered.set(true)
                    while !release.current { Thread.sleep(forTimeInterval: 0.001) }
                }
                return url.pathExtension == "vrma" ? Data([1, 2]) : modelBytes
            }
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        let shared = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("shared.vrma"),
            displayName: "Shared"
        )
        let second = try await store.importMotion(
            profileID: profile.id,
            at: root.appendingPathComponent("second.vrma"),
            displayName: "Second"
        )
        try await store.bindMotion(profileID: profile.id, role: .idle, motionID: shared.id)
        try await store.bindMotion(profileID: profile.id, role: .listening, motionID: shared.id)
        try await store.bindMotion(profileID: profile.id, role: .thinking, motionID: second.id)
        let before = try Data(contentsOf: root.appendingPathComponent("profiles-v2.json"))
        blockSecondCapture.set(true)

        let lease = ProfileMaterializationLease()
        let task = Task {
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }
        try await waitUntil { entered.current }
        lease.invalidate()
        release.set(true)

        do {
            try await task.value
            Issue.record("expected cancellation")
        } catch is CancellationError {
            // expected
        } catch {
            Issue.record("expected CancellationError, got (error)")
        }
        #expect(try Data(contentsOf: root.appendingPathComponent("profiles-v2.json")) == before)
        #expect(lease.preparedProfile == nil)
        let after = try await store.profile(id: profile.id)
        #expect(after.motions.allSatisfy { $0.capturedByteCount == 2 })
    }

    @Test
    func bookmarkResolutionFailurePreservesItsBoundedStoreError() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            bookmarkResolver: { _ in throw TestFailure.failed }
        )
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )

        await expectError(.bookmarkResolutionFailed) {
            let lease = ProfileMaterializationLease()
            try await store.materializeForRendering(id: profile.id, lease: lease)
        }
        #expect((try await store.profile(id: profile.id)).modelConsecutiveLoadFailures == 1)
    }

    @Test
    func productionBookmarkResolverUsesItsBoundedStoreError() throws {
        let resolver = AvatarProfileStoreDependencies.production().bookmarkResolver

        #expect(throws: AvatarProfileStoreError.bookmarkResolutionFailed) {
            _ = try resolver(Data([0]))
        }
    }

    @Test
    func v2MotionFailureCountsRequireMatchingAllowedFailureCodes() throws {
        let motionID = UUID(uuidString: "77777777-7777-4777-8777-777777777777")!
        let reference = StoredAvatarMotionReference(
            id: motionID,
            displayName: "Wave",
            bookmark: Data([1]),
            sha256: String(repeating: "a", count: 64),
            capturedByteCount: 1,
            consecutiveLoadFailures: 0,
            lastFailure: nil
        )
        let encoded = try JSONEncoder().encode(reference)

        for (count, failure) in [(0, "motion_rejected"), (1, nil), (1, "cancelled")] {
            var object = try #require(
                JSONSerialization.jsonObject(with: encoded) as? [String: Any]
            )
            object["consecutiveLoadFailures"] = count
            object["lastFailure"] = failure.map { $0 } ?? NSNull()
            let data = try JSONSerialization.data(withJSONObject: object)
            #expect(throws: AvatarProfileStoreError.corruptStore) {
                try JSONDecoder().decode(StoredAvatarMotionReference.self, from: data)
            }
        }

        var validObject = try #require(
            JSONSerialization.jsonObject(with: encoded) as? [String: Any]
        )
        validObject["consecutiveLoadFailures"] = 1
        validObject["lastFailure"] = MotionFailureCode.motionRejected.rawValue
        let validData = try JSONSerialization.data(withJSONObject: validObject)
        let decoded = try JSONDecoder().decode(StoredAvatarMotionReference.self, from: validData)
        #expect(decoded.consecutiveLoadFailures == 1)
        #expect(decoded.lastFailure == .motionRejected)
    }

    @Test
    func v2SchemaRejectsExplicitProfileAndMotionBoundaryCases() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let motionID = UUID(uuidString: "77777777-7777-4777-8777-777777777777")!
        let motion = StoredAvatarMotionReference(
            id: motionID,
            displayName: "Wave",
            bookmark: Data([1]),
            sha256: String(repeating: "b", count: 64),
            capturedByteCount: 1,
            consecutiveLoadFailures: 0,
            lastFailure: nil
        )
        let profile = StoredAvatarProfile(
            id: UUID(uuidString: "88888888-8888-4888-8888-888888888888")!,
            displayName: "Avatar",
            modelBookmark: Data([2]),
            modelSHA256: String(repeating: "a", count: 64),
            capturedByteCount: 1,
            profileRevision: 1,
            motionLibrary: [motionID: motion],
            motionBindings: [.idle: motionID]
        )
        let baseObject = try #require(
            JSONSerialization.jsonObject(
                with: JSONEncoder().encode(profile)
            ) as? [String: Any]
        )
        let motionKey = motionID.uuidString.lowercased()

        func changingMotion(
            _ object: [String: Any],
            _ change: ([String: Any]) -> [String: Any]
        ) -> [String: Any] {
            var result = object
            var library = result["motionLibrary"] as! [String: Any]
            library[motionKey] = change(library[motionKey] as! [String: Any])
            result["motionLibrary"] = library
            return result
        }

        var invalidCases: [(String, [String: Any])] = []
        var invalidName = baseObject
        invalidName["displayName"] = ""
        invalidCases.append(("invalid profile name", invalidName))

        let invalidMotionName = changingMotion(baseObject) { reference in
            var reference = reference
            reference["displayName"] = "\u{0001}"
            return reference
        }
        invalidCases.append(("invalid motion name", invalidMotionName))

        var oversizedBookmark = baseObject
        oversizedBookmark["modelBookmark"] = Data(
            repeating: 0,
            count: AvatarProfile.maximumBookmarkBytes + 1
        ).base64EncodedString()
        invalidCases.append(("oversized model bookmark", oversizedBookmark))
        invalidCases.append((
            "oversized motion bookmark",
            changingMotion(baseObject) { reference in
                var reference = reference
                reference["bookmark"] = Data(
                    repeating: 0,
                    count: AvatarProfile.maximumBookmarkBytes + 1
                ).base64EncodedString()
                return reference
            }
        ))

        var invalidDigest = baseObject
        invalidDigest["modelSHA256"] = "not-a-digest"
        invalidCases.append(("invalid model digest", invalidDigest))
        invalidCases.append((
            "invalid motion digest",
            changingMotion(baseObject) { reference in
                var reference = reference
                reference["sha256"] = "not-a-digest"
                return reference
            }
        ))

        var oversizedModel = baseObject
        oversizedModel["capturedByteCount"] = AssetBudget.alpha.capturedBytes + 1
        invalidCases.append(("oversized model capture", oversizedModel))
        invalidCases.append((
            "oversized motion capture",
            changingMotion(baseObject) { reference in
                var reference = reference
                reference["capturedByteCount"] = MotionBudget.lightweight.capturedBytes + 1
                return reference
            }
        ))

        var invalidModelFailures = baseObject
        invalidModelFailures["consecutiveLoadFailures"] = 4
        invalidCases.append(("out of range model failure count", invalidModelFailures))
        invalidCases.append((
            "out of range motion failure count",
            changingMotion(baseObject) { reference in
                var reference = reference
                reference["consecutiveLoadFailures"] = 4
                reference["lastFailure"] = MotionFailureCode.motionRejected.rawValue
                return reference
            }
        ))

        var unknownRole = baseObject
        unknownRole["motionBindings"] = [
            "unexpected": motionKey,
        ]
        invalidCases.append(("unknown role", unknownRole))

        var danglingBinding = baseObject
        danglingBinding["motionBindings"] = [
            "idle": "99999999-9999-4999-8999-999999999999",
        ]
        invalidCases.append(("dangling binding", danglingBinding))

        var zeroRevision = baseObject
        zeroRevision["profileRevision"] = 0
        invalidCases.append(("zero revision", zeroRevision))
        var unsafeRevision = baseObject
        unsafeRevision["profileRevision"] = NSNumber(
            value: BridgeContract.maximumSafeInteger + 1
        )
        invalidCases.append(("unsafe revision", unsafeRevision))

        let persistedCancelled = changingMotion(baseObject) { reference in
            var reference = reference
            reference["consecutiveLoadFailures"] = 1
            reference["lastFailure"] = MotionFailureCode.cancelled.rawValue
            return reference
        }
        invalidCases.append(("persisted cancellation", persistedCancelled))

        var tooManyEntries = baseObject
        var tooManyLibrary = tooManyEntries["motionLibrary"] as! [String: Any]
        let reference = tooManyLibrary[motionKey] as! [String: Any]
        for _ in 0..<32 {
            let id = UUID().uuidString.lowercased()
            var copy = reference
            copy["id"] = id
            tooManyLibrary[id] = copy
        }
        tooManyEntries["motionLibrary"] = tooManyLibrary
        invalidCases.append(("33rd motion entry", tooManyEntries))

        var duplicateUUID = baseObject
        var duplicateLibrary = duplicateUUID["motionLibrary"] as! [String: Any]
        duplicateLibrary[UUID().uuidString.lowercased()] = reference
        duplicateUUID["motionLibrary"] = duplicateLibrary
        invalidCases.append(("duplicate motion UUID", duplicateUUID))

        for (label, object) in invalidCases {
            try envelopeData(profile: object).write(
                to: root.appendingPathComponent("profiles-v2.json")
            )
            await expectError(.corruptStore) {
                _ = try await AvatarProfileStore(root: root).list()
            }
            #expect(!label.isEmpty)
        }

        let validEnvelope = try envelopeData(profile: baseObject)
        let validJSON = try #require(String(data: validEnvelope, encoding: .utf8))
        let duplicateKeyJSON = validJSON.replacingOccurrences(
            of: "\"profileRevision\":1",
            with: "\"profileRevision\":1,\"profileRevision\":1"
        )
        try Data(duplicateKeyJSON.utf8).write(
            to: root.appendingPathComponent("profiles-v2.json")
        )
        await expectError(.corruptStore) {
            _ = try await AvatarProfileStore(root: root).list()
        }
    }

    @Test
    func activeLeaseSerializesOperationsAndSynchronousInvalidation() throws {
        let lease = ProfileMaterializationLease()
        let counter = LockedCounter()
        #expect(lease.performIfActive {
            counter.increment()
            return 42
        } == 42)
        #expect(counter.value == 1)

        lease.invalidate()
        #expect(lease.performIfActive {
            counter.increment()
            return 7
        } == nil)
        #expect(counter.value == 1)
    }

    @Test
    func v1MigrationValidatesInnerSchemaRemovesOnlyRegularLegacyAndV2WinsRestart() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let legacyID = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
        let legacy = LegacyProfile(
            schemaVersion: 1,
            id: legacyID,
            displayName: "Legacy",
            modelBookmark: Data([1]),
            modelSHA256: String(repeating: "a", count: 64),
            capturedByteCount: 1,
            rightsLabel: AvatarProfile.rightsLabel,
            performanceProfile: AvatarProfile.performanceProfile,
            consecutiveLoadFailures: 0
        )
        try JSONEncoder().encode(LegacyEnvelope(profiles: [legacy]))
            .write(to: root.appendingPathComponent("profiles-v1.json"))

        let migrated = try await AvatarProfileStore(root: root).list()
        #expect(migrated.map(\.id) == [legacyID])
        #expect(FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v2.json").path
        ))
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v1.json").path
        ))

        let other = LegacyProfile(
            schemaVersion: 1,
            id: UUID(),
            displayName: "Ignored",
            modelBookmark: Data([2]),
            modelSHA256: String(repeating: "b", count: 64),
            capturedByteCount: 1,
            rightsLabel: AvatarProfile.rightsLabel,
            performanceProfile: AvatarProfile.performanceProfile,
            consecutiveLoadFailures: 0
        )
        try JSONEncoder().encode(LegacyEnvelope(profiles: [other]))
            .write(to: root.appendingPathComponent("profiles-v1.json"))
        #expect(try await AvatarProfileStore(root: root).list().map(\.id) == [legacyID])
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v1.json").path
        ))

        let invalidRoot = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: invalidRoot) }
        let invalid = LegacyProfile(schemaVersion: 2, id: UUID(), displayName: "Invalid")
        try JSONEncoder().encode(LegacyEnvelope(profiles: [invalid]))
            .write(to: invalidRoot.appendingPathComponent("profiles-v1.json"))
        await expectError(.corruptStore) {
            _ = try await AvatarProfileStore(root: invalidRoot).list()
        }
        #expect(!FileManager.default.fileExists(
            atPath: invalidRoot.appendingPathComponent("profiles-v2.json").path
        ))
    }

    @Test
    func everyMigrationPersistenceSeamFailsClosedAndRestartCleansLegacy() async throws {
        for step in FileStep.allCases {
            let root = try temporaryDirectory()
            defer { try? FileManager.default.removeItem(at: root) }
            let legacy = LegacyProfile(
                schemaVersion: 1,
                id: UUID(),
                displayName: "Legacy",
                modelBookmark: Data([1]),
                modelSHA256: String(repeating: "a", count: 64),
                capturedByteCount: 1,
                rightsLabel: AvatarProfile.rightsLabel,
                performanceProfile: AvatarProfile.performanceProfile,
                consecutiveLoadFailures: 0
            )
            try JSONEncoder().encode(LegacyEnvelope(profiles: [legacy]))
                .write(to: root.appendingPathComponent("profiles-v1.json"))
            let fault = FileFault(failing: step)
            let store = makeStore(
                root: root,
                modelBytes: try minimalGLB(),
                model: nil,
                fileOperations: fileOperations(for: root, fault: fault)
            )

            await expectError(.persistenceFailed) { _ = try await store.list() }
            #expect(FileManager.default.fileExists(
                atPath: root.appendingPathComponent("profiles-v1.json").path
            ))

            fault.failing = nil
            let reopened = try await store.list()
            #expect(reopened.map(\.id) == [legacy.id])
            #expect(!FileManager.default.fileExists(
                atPath: root.appendingPathComponent("profiles-v1.json").path
            ))
        }
    }

    @Test
    func cleanupDirectoryFsyncFailureAfterLegacyUnlinkKeepsV2AuthoritativeOnRestart() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let legacyID = UUID(uuidString: "88888888-8888-4888-8888-888888888888")!
        let legacy = LegacyProfile(
            schemaVersion: 1,
            id: legacyID,
            displayName: "Legacy"
        )
        try JSONEncoder().encode(LegacyEnvelope(profiles: [legacy]))
            .write(to: root.appendingPathComponent("profiles-v1.json"))

        let fault = FileFault(
            failing: nil,
            failingOnCall: (.directoryFsync, 2)
        )
        let fileOperations = fileOperations(for: root, fault: fault)
        let store = makeStore(
            root: root,
            modelBytes: try minimalGLB(),
            model: nil,
            fileOperations: fileOperations
        )

        await expectError(.persistenceFailed) { _ = try await store.list() }
        #expect(FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v2.json").path
        ))
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v1.json").path
        ))

        let replacement = LegacyProfile(
            schemaVersion: 1,
            id: UUID(),
            displayName: "Should not migrate"
        )
        try JSONEncoder().encode(LegacyEnvelope(profiles: [replacement]))
            .write(to: root.appendingPathComponent("profiles-v1.json"))
        fault.failingOnCall = nil

        let restarted = makeStore(
            root: root,
            modelBytes: try minimalGLB(),
            model: nil,
            fileOperations: fileOperations
        )
        #expect(try await restarted.list().map(\.id) == [legacyID])
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v1.json").path
        ))
    }

    @Test
    func readFailureIsPersistenceFailedWithoutLegacyFallback() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let fault = ProfileStoreFileOperations(
            read: { _ in throw TestFailure.failed },
            write: { _, _ in },
            fileFsync: { _ in },
            rename: { _, _ in },
            reopen: { _ in nil },
            directoryFsync: { _ in },
            unlink: { _ in }
        )
        let store = makeStore(
            root: root,
            modelBytes: try minimalGLB(),
            model: nil,
            fileOperations: fault
        )
        await expectError(.persistenceFailed) { _ = try await store.list() }
    }

    private func materialize(
        _ store: AvatarProfileStore,
        profileID: UUID
    ) async throws -> (lease: ProfileMaterializationLease, prepared: LoadedAvatarProfile) {
        let lease = ProfileMaterializationLease()
        try await store.materializeForRendering(id: profileID, lease: lease)
        guard let prepared = lease.takePreparedProfile() else {
            throw TestFailure.failed
        }
        return (lease, prepared)
    }

    private func makeAggregateOverflowFixture(
        root: URL
    ) async throws -> (
        store: AvatarProfileStore,
        profile: AvatarProfileSummary,
        materializing: LockedBox<Bool>,
        motionPaths: [String]
    ) {
        let modelBytes = try minimalGLB()
        let model = try #require(await admittedAsset(for: modelBytes))
        let smallMotions = (0..<4).map { index in
            admittedMotion(bytes: Data([UInt8(index + 1)]))
        }
        let largeMotions = (0..<4).map { _ in
            admittedMotion(bytes: Data(repeating: 9, count: 7 * 1_024 * 1_024))
        }
        let plan = MotionAdmissionPlan(
            results: smallMotions.map(MotionAdmissionResult.admitted)
                + largeMotions.map(MotionAdmissionResult.admitted)
        )
        let materializing = LockedBox(false)
        let motionPaths = (0..<4).map { index in
            root.appendingPathComponent("motion-\(index).vrma").path
        }
        let store = makeStore(
            root: root,
            modelBytes: modelBytes,
            model: model,
            motionPlan: plan,
            motionDefault: smallMotions[0],
            capture: { url, _ in
                if url.pathExtension == "vrma", materializing.current {
                    return Data(repeating: 9, count: 7 * 1_024 * 1_024)
                }
                return url.pathExtension == "vrma" ? Data([1]) : modelBytes
            },
            bookmarkResolver: { bookmark in
                guard let path = String(data: bookmark, encoding: .utf8) else {
                    throw TestFailure.failed
                }
                return AvatarResolvedBookmark(
                    url: URL(fileURLWithPath: path + ".refreshed"),
                    isStale: true
                )
            },
            bookmarkCreator: { url in Data(url.path.utf8) }
        )
        let importedProfile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        var motionIDs: [UUID] = []
        for path in motionPaths {
            let summary = try await store.importMotion(
                profileID: importedProfile.id,
                at: URL(fileURLWithPath: path),
                displayName: "Motion"
            )
            motionIDs.append(summary.id)
        }
        for (role, motionID) in zip(
            [AvatarMotionRole.idle, .listening, .thinking, .speaking],
            motionIDs
        ) {
            try await store.bindMotion(
                profileID: importedProfile.id,
                role: role,
                motionID: motionID
            )
            try await store.recordMotionRendererFailure(
                profileID: importedProfile.id,
                motionID: motionID
            )
        }
        return (
            store,
            try await store.profile(id: importedProfile.id),
            materializing,
            motionPaths
        )
    }

    private func makeStore(
        root: URL,
        modelBytes: Data,
        model: AdmittedAsset?,
        modelBox: LockedBox<AdmittedAsset?>? = nil,
        motionPlan: MotionAdmissionPlan = MotionAdmissionPlan(),
        motionDefault: AdmittedMotion? = nil,
        motionBytes: [String: Data] = [:],
        captureObserver: @escaping @Sendable (URL) -> Void = { _ in },
        capture: (@Sendable (URL, UInt64) throws -> Data)? = nil,
        bookmarkResolver: (@Sendable (Data) throws -> AvatarResolvedBookmark)? = nil,
        bookmarkCreator: (@Sendable (URL) throws -> Data)? = nil,
        beforeMotionMaterialization: (@Sendable () async -> Void)? = nil,
        fileOperations: ProfileStoreFileOperations = .production
    ) -> AvatarProfileStore {
        let selectedModel = modelBox ?? LockedBox(model)
        let recorder = StoreRecorder()
        let dependencies = AvatarProfileStoreDependencies(
            admission: { _ in
                guard let model = selectedModel.current else {
                    return .rejected(.assetRejected)
                }
                return .admitted(model)
            },
            motionAdmission: { bytes in
                motionPlan.next(default: motionDefault)
            },
            bookmarkCreator: { url in
                if let bookmarkCreator { return try bookmarkCreator(url) }
                return Data(url.path.utf8)
            },
            bookmarkResolver: { bookmark in
                if let bookmarkResolver { return try bookmarkResolver(bookmark) }
                guard let path = String(data: bookmark, encoding: .utf8) else {
                    throw TestFailure.failed
                }
                return AvatarResolvedBookmark(
                    url: URL(fileURLWithPath: path),
                    isStale: false
                )
            },
            securityScope: recorder,
            capture: { url, maximumBytes in
                captureObserver(url)
                if let capture { return try capture(url, maximumBytes) }
                if let bytes = motionBytes[url.lastPathComponent] { return bytes }
                return url.pathExtension == "vrma" ? Data([7]) : modelBytes
            },
            beforeMotionMaterialization: beforeMotionMaterialization
        )
        return AvatarProfileStore(
            root: root,
            dependencies: dependencies,
            fileOperations: fileOperations
        )
    }

    private func makeModeAwareDependencies(
        modelBox: LockedBox<AdmittedAsset>,
        bytesBox: LockedBox<Data>,
        observations: QualityModeObservations
    ) -> AvatarProfileStoreDependencies {
        AvatarProfileStoreDependencies(
            admission: { bytes, mode in
                observations.recordAdmission(mode, byteCount: bytes.count)
                return .admitted(modelBox.current)
            },
            bookmarkCreator: { url in Data(url.path.utf8) },
            bookmarkResolver: { bookmark in
                guard let path = String(data: bookmark, encoding: .utf8) else {
                    throw TestFailure.failed
                }
                return AvatarResolvedBookmark(
                    url: URL(fileURLWithPath: path),
                    isStale: false
                )
            },
            securityScope: StoreRecorder(),
            capture: { _, maximumBytes, mode in
                observations.recordCapture(mode, maximumBytes: maximumBytes)
                return bytesBox.current
            }
        )
    }

    private func admittedAsset(for bytes: Data) async throws -> AdmittedAsset? {
        switch await AssetAdmission().admit(bytes) {
        case .admitted(let asset): return asset
        case .rejected: return nil
        }
    }

    private func admittedMotion(bytes: Data) -> AdmittedMotion {
        AdmittedMotion(
            token: UUID(),
            bytes: bytes,
            summary: MotionAdmissionSummary(
                nodeCount: 1,
                channelCount: 1,
                keyframeScalarValues: 4,
                durationMilliseconds: 1,
                hasExpressionTracks: false,
                hasLookAtTrack: false
            )
        )
    }

    private func expectError(
        _ expected: AvatarProfileStoreError,
        operation: () async throws -> Void
    ) async {
        do {
            try await operation()
            Issue.record("expected \(expected), but operation succeeded")
        } catch let error as AvatarProfileStoreError {
            #expect(error == expected)
        } catch {
            Issue.record("expected \(expected), got \(error)")
        }
    }

    private func waitUntil(
        _ condition: @escaping @Sendable () -> Bool
    ) async throws {
        for _ in 0..<2_000 {
            if condition() { return }
            try await Task.sleep(nanoseconds: 1_000_000)
        }
        throw TestFailure.failed
    }

    private func temporaryDirectory() throws -> URL {
        let root = FileManager.default.temporaryDirectory
            .appendingPathComponent("miller-avatar-profile-tests", isDirectory: true)
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        return root
    }

    private func minimalGLB(binaryByteCount: Int = 4) throws -> Data {
        let json = Data("{\"asset\":{\"version\":\"2.0\"},\"buffers\":[{\"byteLength\":\(binaryByteCount)}],\"extensionsUsed\":[\"VRMC_vrm\"],\"extensionsRequired\":[\"VRMC_vrm\"],\"extensions\":{\"VRMC_vrm\":{\"specVersion\":\"1.0\"}}}".utf8)
        var paddedJSON = json
        while paddedJSON.count % 4 != 0 { paddedJSON.append(0x20) }
        let binary = Data(repeating: 0, count: binaryByteCount)
        var result = Data()
        result.appendLE(0x4654_6C67)
        result.appendLE(2)
        result.appendLE(UInt32(12 + 8 + paddedJSON.count + 8 + binary.count))
        result.appendLE(UInt32(paddedJSON.count))
        result.appendLE(0x4E4F_534A)
        result.append(paddedJSON)
        result.appendLE(UInt32(binary.count))
        result.appendLE(0x004E_4942)
        result.append(binary)
        return result
    }
}

private final class LockedBox<Value: Sendable>: @unchecked Sendable {
    private let lock = NSLock()
    private var value: Value

    init(_ value: Value) { self.value = value }

    var current: Value {
        lock.lock()
        defer { lock.unlock() }
        return value
    }

    func set(_ value: Value) {
        lock.lock()
        self.value = value
        lock.unlock()
    }
}

private final class LockedCounter: @unchecked Sendable {
    private let lock = NSLock()
    private var count = 0

    var value: Int {
        lock.lock()
        defer { lock.unlock() }
        return count
    }

    func increment() {
        lock.lock()
        count += 1
        lock.unlock()
    }
}

private final class QualityModeObservations: @unchecked Sendable {
    private let lock = NSLock()
    private var captured: [(AvatarAssetQualityMode, UInt64)] = []
    private var admitted: [(AvatarAssetQualityMode, Int)] = []

    var captureModes: [AvatarAssetQualityMode] {
        lock.lock()
        defer { lock.unlock() }
        return captured.map(\.0)
    }

    var admissionModes: [AvatarAssetQualityMode] {
        lock.lock()
        defer { lock.unlock() }
        return admitted.map(\.0)
    }

    var captureMaximums: [UInt64] {
        lock.lock()
        defer { lock.unlock() }
        return captured.map(\.1)
    }

    func recordCapture(_ mode: AvatarAssetQualityMode, maximumBytes: UInt64) {
        lock.lock()
        captured.append((mode, maximumBytes))
        lock.unlock()
    }

    func recordAdmission(_ mode: AvatarAssetQualityMode, byteCount: Int) {
        lock.lock()
        admitted.append((mode, byteCount))
        lock.unlock()
    }
}

private final class MotionAdmissionPlan: @unchecked Sendable {
    private let lock = NSLock()
    private var results: [MotionAdmissionResult]

    init(results: [MotionAdmissionResult] = []) { self.results = results }

    func append(_ result: MotionAdmissionResult) {
        lock.lock()
        results.append(result)
        lock.unlock()
    }

    func next(default value: AdmittedMotion?) -> MotionAdmissionResult {
        lock.lock()
        defer { lock.unlock() }
        if !results.isEmpty { return results.removeFirst() }
        return value.map(MotionAdmissionResult.admitted) ?? .rejected(.motionRejected)
    }
}

private final class StoreRecorder: SecurityScopedAccess, @unchecked Sendable {
    private let lock = NSLock()
    private(set) var startCount = 0
    private(set) var stopCount = 0

    func startAccessing(_ url: URL) -> Bool {
        lock.lock()
        startCount += 1
        lock.unlock()
        return true
    }

    func stopAccessing(_ url: URL) {
        lock.lock()
        stopCount += 1
        lock.unlock()
    }
}

private enum TestFailure: Error {
    case failed
}

private enum FileStep: CaseIterable, Equatable, Hashable {
    case write
    case fileFsync
    case rename
    case reopen
    case directoryFsync
    case unlink
}

private final class FileFault: @unchecked Sendable {
    private let lock = NSLock()
    var failing: FileStep?
    var failingOnCall: (FileStep, Int)?
    private var callCounts: [FileStep: Int] = [:]

    init(
        failing: FileStep?,
        failingOnCall: (FileStep, Int)? = nil
    ) {
        self.failing = failing
        self.failingOnCall = failingOnCall
    }

    func hit(_ step: FileStep) throws {
        lock.lock()
        let count = (callCounts[step] ?? 0) + 1
        callCounts[step] = count
        let shouldFail = failing == step
            || (failingOnCall?.0 == step && failingOnCall?.1 == count)
        lock.unlock()
        if shouldFail { throw TestFailure.failed }
    }
}

private func fileOperations(
    for root: URL,
    fault: FileFault
) -> ProfileStoreFileOperations {
    ProfileStoreFileOperations(
        read: { url in
            guard FileManager.default.fileExists(atPath: url.path) else { return nil }
            return try Data(contentsOf: url)
        },
        write: { url, data in
            try fault.hit(.write)
            try data.write(to: url)
        },
        fileFsync: { url in
            try fault.hit(.fileFsync)
            _ = try Data(contentsOf: url)
        },
        rename: { source, destination in
            try fault.hit(.rename)
            if FileManager.default.fileExists(atPath: destination.path) {
                try FileManager.default.removeItem(at: destination)
            }
            try FileManager.default.moveItem(at: source, to: destination)
        },
        reopen: { url in
            try fault.hit(.reopen)
            return try Data(contentsOf: url)
        },
        directoryFsync: { _ in try fault.hit(.directoryFsync) },
        unlink: { url in
            try fault.hit(.unlink)
            if FileManager.default.fileExists(atPath: url.path) {
                try FileManager.default.removeItem(at: url)
            }
        }
    )
}

private func envelopeData(profile: [String: Any]) throws -> Data {
    try JSONSerialization.data(withJSONObject: [
        "schemaVersion": 2,
        "profiles": [profile],
    ])
}

private struct LegacyEnvelope: Codable {
    let schemaVersion: Int
    let profiles: [LegacyProfile]

    init(profiles: [LegacyProfile]) {
        schemaVersion = 1
        self.profiles = profiles
    }
}

private struct LegacyProfile: Codable {
    let schemaVersion: Int
    let id: UUID
    let displayName: String
    let modelBookmark: Data
    let modelSHA256: String
    let capturedByteCount: UInt64
    let rightsLabel: String
    let performanceProfile: String
    let consecutiveLoadFailures: Int

    init(
        schemaVersion: Int,
        id: UUID,
        displayName: String,
        modelBookmark: Data = Data([1]),
        modelSHA256: String = String(repeating: "a", count: 64),
        capturedByteCount: UInt64 = 1,
        rightsLabel: String = AvatarProfile.rightsLabel,
        performanceProfile: String = AvatarProfile.performanceProfile,
        consecutiveLoadFailures: Int = 0
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
}

private extension Data {
    mutating func appendLE(_ value: UInt32) {
        var value = value.littleEndian
        Swift.withUnsafeBytes(of: &value) { append(contentsOf: $0) }
    }
}
