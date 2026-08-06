import Foundation
import Darwin
import MillerAvatarCore
import Testing
@testable import MillerAvatarHost

@Suite
struct AvatarProfileStoreTests {
    @Test
    func profileMetadataIsPublicSendableAndQuarantineIsDerived() {
        let profile = AvatarProfile(
            id: UUID(uuidString: "11111111-1111-4111-8111-111111111111")!,
            displayName: "Local Avatar",
            modelBookmark: Data([1, 2, 3]),
            modelSHA256: String(repeating: "a", count: 64),
            capturedByteCount: 3,
            consecutiveLoadFailures: 3
        )

        #expect(profile.schemaVersion == 1)
        #expect(profile.rightsLabel == "local_user_supplied")
        #expect(profile.performanceProfile == "lightweight")
        #expect(profile.isQuarantined)
    }

    @Test
    func profileRoundTripsCodableAndEquatableWithoutDerivedState() throws {
        let profile = AvatarProfile(
            id: UUID(uuidString: "11111111-1111-4111-8111-111111111111")!,
            displayName: "Local Avatar",
            modelBookmark: Data([1, 2, 3]),
            modelSHA256: String(repeating: "a", count: 64),
            capturedByteCount: 3,
            consecutiveLoadFailures: 2
        )
        let encoded = try JSONEncoder().encode(profile)
        let decoded = try JSONDecoder().decode(AvatarProfile.self, from: encoded)

        #expect(decoded == profile)
        #expect(!encoded.contains(Data("isQuarantined".utf8)))
    }

    @Test
    func newStoreListsNoProfilesWithoutCreatingARepositoryFile() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }

        let store = AvatarProfileStore(root: root)

        #expect(try await store.list().isEmpty)
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v1.json").path
        ))
    }

    @Test
    func deniedSecurityScopeRefusesCaptureBeforeOpeningSource() throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let source = root.appendingPathComponent("source.vrm")
        try Data("source".utf8).write(to: source)
        let recorder = ProfileStoreRecorder(allowStart: false)

        let result = AssetSelectionController.capture(
            url: source,
            securityScope: recorder
        )

        #expect(result == .rejected(.assetRejected))
        #expect(recorder.startCount == 1)
        #expect(recorder.stopCount == 0)
    }

    @Test
    func captureRejectsFIFOWithoutBlocking() throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let fifo = root.appendingPathComponent("avatar.fifo")
        let result = fifo.path.withCString { path in
            mkfifo(path, mode_t(0o600))
        }
        #expect(result == 0)

        #expect(
            AssetSelectionController.captureScoped(url: fifo)
                == .rejected(.assetRejected)
        )
    }

    @Test
    func profileStoreCreatesOwnerOnlyRootAndFile() async throws {
        let root = uncreatedTemporaryPath()
        defer { try? FileManager.default.removeItem(at: root) }
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let recorder = ProfileStoreRecorder()
        let store = AvatarProfileStore(
            root: root,
            dependencies: dependencies(
                bytes: bytes,
                admitted: admitted,
                recorder: recorder
            )
        )

        _ = try await store.importModel(
            at: root.appendingPathComponent("source.vrm"),
            displayName: "Avatar"
        )

        let rootMode = try #require(
            (FileManager.default.attributesOfItem(atPath: root.path)[.posixPermissions] as? NSNumber)?.intValue
        )
        let file = root.appendingPathComponent("profiles-v1.json")
        let fileMode = try #require(
            (FileManager.default.attributesOfItem(atPath: file.path)[.posixPermissions] as? NSNumber)?.intValue
        )
        #expect(rootMode & 0o777 == 0o700)
        #expect(fileMode & 0o777 == 0o600)
    }

    @Test
    func profileStoreRejectsSymlinkedRootWithoutWritingThroughIt() async throws {
        let container = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: container) }
        let target = container.appendingPathComponent("target", isDirectory: true)
        try FileManager.default.createDirectory(at: target, withIntermediateDirectories: true)
        let root = container.appendingPathComponent("root", isDirectory: true)
        try FileManager.default.createSymbolicLink(at: root, withDestinationURL: target)

        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let store = AvatarProfileStore(
            root: root,
            dependencies: dependencies(
                bytes: bytes,
                admitted: admitted,
                recorder: ProfileStoreRecorder()
            )
        )

        await expectError(.persistenceFailed) {
            _ = try await store.importModel(
                at: root.appendingPathComponent("source.vrm"),
                displayName: "Avatar"
            )
        }
        #expect(!FileManager.default.fileExists(
            atPath: target.appendingPathComponent("profiles-v1.json").path
        ))
    }

    @Test
    func profileStoreRejectsNonDirectoryRoot() async throws {
        let container = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: container) }
        let root = container.appendingPathComponent("root")
        try Data("not a directory".utf8).write(to: root)
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let store = AvatarProfileStore(
            root: root,
            dependencies: dependencies(
                bytes: bytes,
                admitted: admitted,
                recorder: ProfileStoreRecorder()
            )
        )

        await expectError(.persistenceFailed) {
            _ = try await store.importModel(
                at: root.appendingPathComponent("source.vrm"),
                displayName: "Avatar"
            )
        }
    }

    @Test
    func commitRejectsDestinationSymlinkWithoutReplacingExternalTarget() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let external = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: external) }
        let target = external.appendingPathComponent("external.json")
        let original = Data("external-owned".utf8)
        try original.write(to: target)
        let destination = root.appendingPathComponent("profiles-v1.json")
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let recorder = ProfileStoreRecorder()
        let dependencies = AvatarProfileStoreDependencies(
            admission: { _ in .admitted(admitted) },
            bookmarkCreator: { _ in Data([1, 2, 3]) },
            bookmarkResolver: { _ in
                AvatarResolvedBookmark(url: target, isStale: false)
            },
            securityScope: recorder,
            capture: { _, _ in
                try FileManager.default.createSymbolicLink(
                    at: destination,
                    withDestinationURL: target
                )
                return bytes
            }
        )
        let store = AvatarProfileStore(root: root, dependencies: dependencies)

        await expectError(.persistenceFailed) {
            _ = try await store.importModel(at: target, displayName: "Avatar")
        }
        #expect(try Data(contentsOf: target) == original)
        #expect(
            try FileManager.default.destinationOfSymbolicLink(atPath: destination.path)
                == target.path
        )
    }

    @Test
    func profileStoreRejectsSymlinkedAndNonregularProfileFiles() async throws {
        let external = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: external) }
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let profile = AvatarProfile(
            id: UUID(),
            displayName: "Avatar",
            modelBookmark: Data([1]),
            modelSHA256: String(repeating: "a", count: 64),
            capturedByteCount: 1
        )
        try writeStore([profile], to: external)
        let link = root.appendingPathComponent("profiles-v1.json")
        try FileManager.default.createSymbolicLink(
            at: link,
            withDestinationURL: external.appendingPathComponent("profiles-v1.json")
        )

        await expectError(.corruptStore) {
            _ = try await AvatarProfileStore(root: root).list()
        }

        try FileManager.default.removeItem(at: link)
        try FileManager.default.createDirectory(at: link, withIntermediateDirectories: true)
        await expectError(.corruptStore) {
            _ = try await AvatarProfileStore(root: root).list()
        }
    }

    @Test
    func importPersistsOnlyBoundedMetadataAndBalancesOneScope() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let source = root.appendingPathComponent("source.vrm")
        let bytes = try minimalGLB()
        try Data("original".utf8).write(to: source)
        let admitted = try #require(await admittedAsset(for: bytes))
        let recorder = ProfileStoreRecorder()

        let dependencies = AvatarProfileStoreDependencies(
            admission: { captured in
                recorder.record("admit:\(captured.count)")
                return .admitted(admitted)
            },
            bookmarkCreator: { _ in
                recorder.record("bookmark")
                return Data([1, 2, 3])
            },
            bookmarkResolver: { _ in
                fatalError("import does not resolve a bookmark")
            },
            securityScope: recorder,
            capture: { _, _ in
                recorder.record("capture")
                return bytes
            }
        )
        let store = AvatarProfileStore(root: root, dependencies: dependencies)

        let loaded = try await store.importModel(at: source, displayName: "My Avatar")
        let profiles = try await store.list()
        let file = root.appendingPathComponent("profiles-v1.json")

        #expect(loaded.asset.bytes == bytes)
        #expect(profiles.count == 1)
        #expect(profiles[0].displayName == "My Avatar")
        #expect(profiles[0].modelBookmark == Data([1, 2, 3]))
        #expect(profiles[0].modelSHA256.count == 64)
        #expect(profiles[0].capturedByteCount == UInt64(bytes.count))
        #expect(recorder.startCount == 1)
        #expect(recorder.stopCount == 1)
        #expect(recorder.events == ["start", "capture", "admit:\(bytes.count)", "bookmark", "stop"])
        #expect(try Data(contentsOf: file).count < 2 * 1024 * 1024)
        #expect(!String(data: try Data(contentsOf: file), encoding: .utf8)!.contains(source.path))
        #expect(try Data(contentsOf: source) == Data("original".utf8))
    }

    @Test
    func encodingIsDeterministicSortedAndOwnerOnly() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let recorder = ProfileStoreRecorder()
        let store = AvatarProfileStore(
            root: root,
            dependencies: dependencies(
                bytes: bytes,
                admitted: admitted,
                recorder: recorder
            )
        )

        _ = try await store.importModel(at: root.appendingPathComponent("one.vrm"), displayName: "One")
        _ = try await store.importModel(at: root.appendingPathComponent("two.vrm"), displayName: "Two")
        let file = root.appendingPathComponent("profiles-v1.json")
        let first = try Data(contentsOf: file)
        let object = try #require(JSONSerialization.jsonObject(with: first) as? [String: Any])
        let encodedProfiles = try #require(object["profiles"] as? [[String: Any]])
        let ids = encodedProfiles.compactMap { $0["id"] as? String }
        let expectedProfileKeys: Set<String> = [
            "schemaVersion", "id", "displayName", "modelBookmark", "modelSHA256",
            "capturedByteCount", "rightsLabel", "performanceProfile", "consecutiveLoadFailures",
        ]

        #expect(Set(object.keys) == ["schemaVersion", "profiles"])
        #expect(ids == ids.sorted())
        #expect(encodedProfiles.allSatisfy { Set($0.keys) == expectedProfileKeys })
        #expect(!first.contains(Data("isQuarantined".utf8)))

        let profileID = try #require((try await store.list()).first?.id)
        try await store.recordRendererFailure(id: profileID)
        try await store.recordRendererSuccess(id: profileID)
        #expect(try Data(contentsOf: file) == first)

        let rootMode = try #require(
            (FileManager.default.attributesOfItem(atPath: root.path)[.posixPermissions] as? NSNumber)?.intValue
        )
        let fileMode = try #require(
            (FileManager.default.attributesOfItem(atPath: file.path)[.posixPermissions] as? NSNumber)?.intValue
        )
        #expect(rootMode & 0o777 == 0o700)
        #expect(fileMode & 0o777 == 0o600)
    }

    @Test
    func invalidDisplayNamesFailBeforeScopeAndProfileBoundsAreRejected() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let recorder = ProfileStoreRecorder()
        let store = AvatarProfileStore(
            root: root,
            dependencies: dependencies(
                bytes: Data([1]),
                admitted: nil,
                recorder: recorder
            )
        )

        for name in ["", String(repeating: "a", count: 81), "bad\u{0000}name"] {
            await expectError(.invalidDisplayName) {
                _ = try await store.importModel(at: root.appendingPathComponent("source.vrm"), displayName: name)
            }
        }
        #expect(recorder.startCount == 0)

        let profiles = (0..<32).map { index in
            AvatarProfile(
                id: UUID(uuidString: String(format: "00000000-0000-4000-8000-%012d", index))!,
                displayName: "Profile \(index)",
                modelBookmark: Data([1]),
                modelSHA256: String(repeating: "a", count: 64),
                capturedByteCount: 1
            )
        }
        try writeStore(profiles, to: root)
        await expectError(.profileLimit) {
            _ = try await store.importModel(at: root.appendingPathComponent("source.vrm"), displayName: "Extra")
        }
        #expect(recorder.startCount == 0)
    }

    @Test
    func oversizedBookmarkFailsInsideTheBalancedScope() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let recorder = ProfileStoreRecorder()
        let store = AvatarProfileStore(
            root: root,
            dependencies: dependencies(
                bytes: bytes,
                admitted: admitted,
                recorder: recorder,
                bookmark: Data(repeating: 0, count: 64 * 1024 + 1)
            )
        )

        await expectError(.bookmarkCreationFailed) {
            _ = try await store.importModel(at: root.appendingPathComponent("source.vrm"), displayName: "Avatar")
        }
        #expect(recorder.startCount == 1)
        #expect(recorder.stopCount == 1)
        #expect(!FileManager.default.fileExists(
            atPath: root.appendingPathComponent("profiles-v1.json").path
        ))
    }

    @Test
    func corruptJSONIsRejectedBeforeAnyMutationWithPathFreeErrors() async throws {
        let cases: [Data] = [
            Data(#"{"schemaVersion":2,"profiles":[]}"#.utf8),
            Data(#"{"schemaVersion":1,"profiles":[],"extra":true}"#.utf8),
            Data(#"{"schemaVersion":1,"schemaVersion":1,"profiles":[]}"#.utf8),
            Data(#"{"schemaVersion":1,"profiles":[{"schemaVersion":1,"schemaVersion":1,"id":"11111111-1111-4111-8111-111111111111","displayName":"A","modelBookmark":"AQ==","modelSHA256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","capturedByteCount":1,"rightsLabel":"local_user_supplied","performanceProfile":"lightweight","consecutiveLoadFailures":0}]}"#.utf8),
            Data(#"{"schemaVersion":1,"profiles":[{"schemaVersion":1,"id":"11111111-1111-4111-8111-111111111111","displayName":"A","modelBookmark":"AQ==","modelSHA256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","capturedByteCount":1,"rightsLabel":"local_user_supplied","performanceProfile":"lightweight","consecutiveLoadFailures":0,"unknown":true}]}"#.utf8),
            Data(#"{"schemaVersion":1,"profiles":[{"schemaVersion":1,"id":"11111111-1111-4111-8111-111111111111","displayName":"A","modelBookmark":"AQ==","modelSHA256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","capturedByteCount":1,"rightsLabel":"local_user_supplied","performanceProfile":"lightweight","consecutiveLoadFailures":0},{"schemaVersion":1,"id":"11111111-1111-4111-8111-111111111111","displayName":"B","modelBookmark":"AQ==","modelSHA256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","capturedByteCount":1,"rightsLabel":"local_user_supplied","performanceProfile":"lightweight","consecutiveLoadFailures":0}]}"#.utf8),
            Data([0xFF, 0xFE, 0xFD]),
        ]

        for bytes in cases {
            let root = try temporaryDirectory()
            defer { try? FileManager.default.removeItem(at: root) }
            try bytes.write(to: root.appendingPathComponent("profiles-v1.json"))
            let store = AvatarProfileStore(root: root)

            do {
                _ = try await store.list()
                Issue.record("corrupt profile store was accepted")
            } catch let error as AvatarProfileStoreError {
                #expect(error == .corruptStore)
                #expect(!String(describing: error).contains(root.path))
            }
        }

        for profile in [
            AvatarProfile(
                id: UUID(), displayName: "A", modelBookmark: Data(repeating: 0, count: 64 * 1024 + 1),
                modelSHA256: String(repeating: "a", count: 64), capturedByteCount: 1
            ),
            AvatarProfile(
                id: UUID(), displayName: "A", modelBookmark: Data([1]),
                modelSHA256: String(repeating: "a", count: 64),
                capturedByteCount: AssetBudget.alpha.capturedBytes + 1
            ),
            AvatarProfile(
                id: UUID(), displayName: "A", modelBookmark: Data([1]),
                modelSHA256: String(repeating: "A", count: 64), capturedByteCount: 1
            ),
            AvatarProfile(
                id: UUID(), displayName: "A", modelBookmark: Data([1]),
                modelSHA256: String(repeating: "a", count: 64), capturedByteCount: 1,
                consecutiveLoadFailures: 4
            ),
        ] {
            let root = try temporaryDirectory()
            defer { try? FileManager.default.removeItem(at: root) }
            try writeStore([profile], to: root)
            await expectError(.corruptStore) {
                _ = try await AvatarProfileStore(root: root).list()
            }
        }
    }

    @Test
    func callerOwnedCaptureScopeIsObservedAndBalanced() throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let source = root.appendingPathComponent("source.vrm")
        let bytes = Data("source".utf8)
        try bytes.write(to: source)

        let recorder = ProfileStoreRecorder()
        let result = AssetSelectionController.capture(
            url: source,
            securityScope: recorder
        )

        #expect(result == .captured(bytes))
        #expect(recorder.startCount == 1)
        #expect(recorder.stopCount == 1)
    }

    @Test
    func everyImportFailureBalancesTheScopeAndRefusesDeniedAccess() async throws {
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))

        for failure in ProfileStoreFailure.allCases {
            let root = try temporaryDirectory()
            defer { try? FileManager.default.removeItem(at: root) }
            let recorder = ProfileStoreRecorder(allowStart: failure != .scopeDenied)
            let store = AvatarProfileStore(
                root: root,
                dependencies: failingDependencies(
                    failure: failure,
                    bytes: bytes,
                    admitted: admitted,
                    recorder: recorder
                )
            )

            await expectError(failure.expectedError) {
                _ = try await store.importModel(
                    at: root.appendingPathComponent("source.vrm"),
                    displayName: "Avatar"
                )
            }
            #expect(recorder.startCount == 1)
            #expect(recorder.stopCount == (failure == .scopeDenied ? 0 : 1))
        }
    }

    @Test
    func staleBookmarkRefreshesInsideTheScopeEvenWhenDigestMatches() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let behavior = ProfileStoreBehavior(bytes: bytes, admitted: admitted)
        let store = AvatarProfileStore(
            root: root,
            dependencies: behavior.dependencies()
        )

        let imported = try await store.importModel(
            at: root.appendingPathComponent("source.vrm"),
            displayName: "Avatar"
        )
        behavior.stale = true
        behavior.bookmark = Data([9, 8, 7])
        let loaded = try await store.load(id: imported.profile.id)

        #expect(loaded.profile.modelBookmark == Data([9, 8, 7]))
        #expect(loaded.profile.modelSHA256 == imported.profile.modelSHA256)
        #expect(behavior.bookmarkCreationCount == 2)
        #expect(behavior.recorder.startCount == 2)
        #expect(behavior.recorder.stopCount == 2)
        #expect(behavior.events.contains("bookmark-refresh"))
    }

    @Test
    func changedDigestIsReadmittedAndByteCountIsUpdated() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let firstBytes = try minimalGLB()
        let secondBytes = try minimalGLB(binaryByteCount: 8)
        let firstAsset = try #require(await admittedAsset(for: firstBytes))
        let secondAsset = try #require(await admittedAsset(for: secondBytes))
        let behavior = ProfileStoreBehavior(bytes: firstBytes, admitted: firstAsset)
        let store = AvatarProfileStore(root: root, dependencies: behavior.dependencies())
        let imported = try await store.importModel(
            at: root.appendingPathComponent("source.vrm"),
            displayName: "Avatar"
        )

        behavior.bytes = secondBytes
        behavior.admitted = secondAsset
        let loaded = try await store.load(id: imported.profile.id)

        #expect(loaded.profile.modelSHA256 != imported.profile.modelSHA256)
        #expect(loaded.profile.capturedByteCount == UInt64(secondBytes.count))
        #expect(loaded.asset.bytes == secondBytes)
        #expect(behavior.admissionCount == 2)
    }

    @Test
    func failuresQuarantineAtThreeSuccessResetsAndReselectionIsFresh() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let behavior = ProfileStoreBehavior(bytes: bytes, admitted: admitted)
        let store = AvatarProfileStore(root: root, dependencies: behavior.dependencies())
        let imported = try await store.importModel(
            at: root.appendingPathComponent("source.vrm"),
            displayName: "Original"
        )

        behavior.captureFailure = true
        for expected in 1...3 {
            await expectError(.assetRejected) {
                _ = try await store.load(id: imported.profile.id)
            }
            #expect((try await store.profile(id: imported.profile.id))?.consecutiveLoadFailures == expected)
        }
        let resolverCount = behavior.resolveCount
        await expectError(.quarantined) {
            _ = try await store.load(id: imported.profile.id)
        }
        #expect(behavior.resolveCount == resolverCount)

        try await store.recordRendererSuccess(id: imported.profile.id)
        #expect((try await store.profile(id: imported.profile.id))?.consecutiveLoadFailures == 0)
        behavior.captureFailure = false
        _ = try await store.load(id: imported.profile.id)

        try await store.recordRendererFailure(id: imported.profile.id)
        try await store.recordRendererFailure(id: imported.profile.id)
        try await store.recordRendererFailure(id: imported.profile.id)
        #expect((try await store.profile(id: imported.profile.id))?.isQuarantined == true)

        behavior.captureFailure = false
        let reselection = try await store.importModel(
            at: root.appendingPathComponent("source.vrm"),
            displayName: "Reselected"
        )
        #expect(reselection.profile.id != imported.profile.id)
        #expect((try await store.list()).count == 2)
        #expect((try await store.profile(id: imported.profile.id))?.isQuarantined == true)
        #expect(!reselection.profile.isQuarantined)
    }

    @Test
    func removalDoesNotTouchTheOriginalSourceAndConcurrentUpdatesAreRetained() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let source = root.appendingPathComponent("source.vrm")
        let original = Data("user-owned-source".utf8)
        try original.write(to: source)
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let behavior = ProfileStoreBehavior(bytes: bytes, admitted: admitted)
        let store = AvatarProfileStore(root: root, dependencies: behavior.dependencies())
        let imported = try await store.importModel(at: source, displayName: "Avatar")

        await withTaskGroup(of: Void.self) { group in
            for _ in 0..<8 {
                group.addTask {
                    try? await store.recordRendererFailure(id: imported.profile.id)
                }
            }
        }
        #expect((try await store.profile(id: imported.profile.id))?.consecutiveLoadFailures == 3)

        try await store.remove(id: imported.profile.id)
        #expect(try await store.profile(id: imported.profile.id) == nil)
        #expect(try Data(contentsOf: source) == original)
    }

    @Test
    func completeJSONSizeLimitIsAppliedBeforeDecoding() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let profiles = (0..<32).map { index in
            AvatarProfile(
                id: UUID(uuidString: String(format: "00000000-0000-4000-8000-%012d", index))!,
                displayName: "Profile \(index)",
                modelBookmark: Data(repeating: 0, count: 64 * 1024),
                modelSHA256: String(repeating: "a", count: 64),
                capturedByteCount: 1
            )
        }
        try writeStore(profiles, to: root)
        #expect(try Data(contentsOf: root.appendingPathComponent("profiles-v1.json")).count > 2 * 1024 * 1024)

        await expectError(.corruptStore) {
            _ = try await AvatarProfileStore(root: root).list()
        }
    }

    @Test
    func excessivelyNestedProfileJSONIsRejectedAsCorrupt() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let depth = 512
        var json = Data(#"{"schemaVersion":1,"profiles":["#.utf8)
        json.append(contentsOf: repeatByte(0x5B, count: depth))
        json.append(contentsOf: Data("0".utf8))
        json.append(contentsOf: repeatByte(0x5D, count: depth))
        json.append(contentsOf: Data("]}".utf8))
        try json.write(to: root.appendingPathComponent("profiles-v1.json"))

        await expectError(.corruptStore) {
            _ = try await AvatarProfileStore(root: root).list()
        }
    }

    @Test
    func loadResolutionAdmissionAndRefreshFailuresIncrementAndBalanceAccess() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let bytes = try minimalGLB()
        let admitted = try #require(await admittedAsset(for: bytes))
        let behavior = ProfileStoreBehavior(bytes: bytes, admitted: admitted)
        let store = AvatarProfileStore(root: root, dependencies: behavior.dependencies())
        let imported = try await store.importModel(
            at: root.appendingPathComponent("source.vrm"),
            displayName: "Avatar"
        )

        behavior.resolveFailure = true
        await expectError(.bookmarkResolutionFailed) {
            _ = try await store.load(id: imported.profile.id)
        }
        #expect(behavior.recorder.startCount == 1)
        #expect(behavior.recorder.stopCount == 1)
        #expect((try await store.profile(id: imported.profile.id))?.consecutiveLoadFailures == 1)

        try await store.recordRendererSuccess(id: imported.profile.id)
        behavior.resolveFailure = false
        behavior.admissionFailure = true
        await expectError(.assetRejected) {
            _ = try await store.load(id: imported.profile.id)
        }
        #expect(behavior.recorder.startCount == 2)
        #expect(behavior.recorder.stopCount == 2)

        try await store.recordRendererSuccess(id: imported.profile.id)
        behavior.admissionFailure = false
        behavior.stale = true
        behavior.bookmarkFailure = true
        await expectError(.bookmarkCreationFailed) {
            _ = try await store.load(id: imported.profile.id)
        }
        #expect(behavior.recorder.startCount == 3)
        #expect(behavior.recorder.stopCount == 3)
        #expect((try await store.profile(id: imported.profile.id))?.consecutiveLoadFailures == 1)
    }

    private func temporaryDirectory() throws -> URL {
        let root = FileManager.default.temporaryDirectory
            .appendingPathComponent("miller-avatar-profile-tests", isDirectory: true)
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        return root
    }

    private func uncreatedTemporaryPath() -> URL {
        FileManager.default.temporaryDirectory
            .appendingPathComponent("miller-avatar-profile-tests", isDirectory: true)
            .appendingPathComponent(UUID().uuidString, isDirectory: true)
    }

    private func repeatByte(_ byte: UInt8, count: Int) -> [UInt8] {
        Array(repeating: byte, count: count)
    }

    private func admittedAsset(for bytes: Data) async throws -> AdmittedAsset? {
        switch await AssetAdmission().admit(bytes) {
        case .admitted(let asset):
            return asset
        case .rejected:
            return nil
        }
    }

    private func dependencies(
        bytes: Data,
        admitted: AdmittedAsset?,
        recorder: ProfileStoreRecorder,
        bookmark: Data = Data([1, 2, 3]),
        stale: Bool = false,
        resolvedURL: URL? = nil
    ) -> AvatarProfileStoreDependencies {
        AvatarProfileStoreDependencies(
            admission: { _ in
                admitted.map(AssetAdmissionResult.admitted) ?? .rejected(.assetRejected)
            },
            bookmarkCreator: { _ in bookmark },
            bookmarkResolver: { _ in
                AvatarResolvedBookmark(
                    url: resolvedURL ?? URL(fileURLWithPath: "/tmp/avatar.vrm"),
                    isStale: stale
                )
            },
            securityScope: recorder,
            capture: { _, _ in bytes }
        )
    }

    private func failingDependencies(
        failure: ProfileStoreFailure,
        bytes: Data,
        admitted: AdmittedAsset,
        recorder: ProfileStoreRecorder
    ) -> AvatarProfileStoreDependencies {
        AvatarProfileStoreDependencies(
            admission: { _ in
                failure == .admission
                    ? .rejected(.assetRejected)
                    : .admitted(admitted)
            },
            bookmarkCreator: { _ in
                if failure == .bookmark { throw ProfileStoreTestError.failed }
                return Data([1, 2, 3])
            },
            bookmarkResolver: { _ in
                AvatarResolvedBookmark(url: URL(fileURLWithPath: "/tmp/avatar.vrm"), isStale: false)
            },
            securityScope: recorder,
            capture: { _, _ in
                if failure == .capture { throw ProfileStoreTestError.failed }
                return bytes
            }
        )
    }

    private func writeStore(_ profiles: [AvatarProfile], to root: URL) throws {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys]
        try encoder.encode(TestProfileEnvelope(profiles: profiles))
            .write(to: root.appendingPathComponent("profiles-v1.json"))
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

private final class ProfileStoreRecorder: SecurityScopedAccess, @unchecked Sendable {
    private let lock = NSLock()
    private(set) var startCount = 0
    private(set) var stopCount = 0
    private(set) var events: [String] = []
    private let allowStart: Bool

    init(allowStart: Bool = true) {
        self.allowStart = allowStart
    }

    func record(_ event: String) {
        lock.lock()
        defer { lock.unlock() }
        events.append(event)
    }

    func startAccessing(_ url: URL) -> Bool {
        lock.lock()
        startCount += 1
        lock.unlock()
        record("start")
        return allowStart
    }

    func stopAccessing(_ url: URL) {
        lock.lock()
        stopCount += 1
        lock.unlock()
        record("stop")
    }
}

private enum ProfileStoreFailure: CaseIterable, Equatable {
    case scopeDenied
    case capture
    case admission
    case bookmark

    var expectedError: AvatarProfileStoreError {
        switch self {
        case .scopeDenied: .securityScopeDenied
        case .capture, .admission: .assetRejected
        case .bookmark: .bookmarkCreationFailed
        }
    }
}

private enum ProfileStoreTestError: Error {
    case failed
}

private final class ProfileStoreBehavior: @unchecked Sendable {
    private let lock = NSLock()
    let recorder = ProfileStoreRecorder()
    var bytes: Data
    var admitted: AdmittedAsset
    var bookmark = Data([1, 2, 3])
    var stale = false
    var captureFailure = false
    var resolveFailure = false
    var admissionFailure = false
    var bookmarkFailure = false
    private(set) var admissionCount = 0
    private(set) var resolveCount = 0
    private(set) var bookmarkCreationCount = 0
    private(set) var events: [String] = []

    init(bytes: Data, admitted: AdmittedAsset) {
        self.bytes = bytes
        self.admitted = admitted
    }

    func dependencies() -> AvatarProfileStoreDependencies {
        AvatarProfileStoreDependencies(
            admission: { [self] _ in
                lock.lock()
                admissionCount += 1
                let shouldFail = admissionFailure
                let result = AssetAdmissionResult.admitted(admitted)
                lock.unlock()
                if shouldFail { return .rejected(.assetRejected) }
                return result
            },
            bookmarkCreator: { [self] _ in
                lock.lock()
                bookmarkCreationCount += 1
                let shouldFail = bookmarkFailure
                let value = bookmark
                lock.unlock()
                if shouldFail { throw ProfileStoreTestError.failed }
                events.append(bookmarkCreationCount == 1 ? "bookmark-import" : "bookmark-refresh")
                return value
            },
            bookmarkResolver: { [self] _ in
                lock.lock()
                resolveCount += 1
                let shouldFail = resolveFailure
                let value = AvatarResolvedBookmark(
                    url: URL(fileURLWithPath: "/tmp/avatar.vrm"),
                    isStale: stale
                )
                lock.unlock()
                if shouldFail { throw ProfileStoreTestError.failed }
                return value
            },
            securityScope: recorder,
            capture: { [self] _, _ in
                lock.lock()
                let shouldFail = captureFailure
                let value = bytes
                lock.unlock()
                if shouldFail { throw ProfileStoreTestError.failed }
                return value
            }
        )
    }
}

private struct TestProfileEnvelope: Encodable {
    let schemaVersion = 1
    let profiles: [AvatarProfile]
}

private extension Data {
    mutating func appendLE(_ value: UInt32) {
        var value = value.littleEndian
        Swift.withUnsafeBytes(of: &value) { append(contentsOf: $0) }
    }
}
