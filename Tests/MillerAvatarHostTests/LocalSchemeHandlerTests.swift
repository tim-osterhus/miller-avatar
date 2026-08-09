import Foundation
import Dispatch
import Testing
import MillerAvatarCore
@preconcurrency import WebKit
@testable import MillerAvatarHost

@MainActor
@Suite struct LocalSchemeHandlerTests {
    @Test func modelOnlyProfileInstallsExactlyOneVrmResource() throws {
        let modelToken = UUID(uuidString: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")!
        let modelData = Data([0x01, 0x02, 0x03])
        let handler = makeUninstalledHandler()
        let profile = LoadedAvatarProfile.localSchemeFixture(
            modelToken: modelToken,
            modelData: modelData
        )

        #expect(handler.install(profile))
        #expect(handler.retainedAssetByteCount == modelData.count)

        let response = try handler.response(
            for: URLRequest(url: resourceURL(token: modelToken, fileExtension: "vrm"))
        )
        #expect(response.mimeType == "model/gltf-binary")
        #expect(response.headers["Content-Type"] == "model/gltf-binary")
        #expect(response.data == modelData)
        #expect(throws: LocalSchemeError.self) {
            try handler.response(
                for: URLRequest(url: resourceURL(token: motionToken, fileExtension: "vrma"))
            )
        }
    }

    @Test func sixUniqueReadyMotionsAreStoredOnceAlongsideTheModel() throws {
        let modelData = Data([0x00])
        let tokens = [
            UUID(uuidString: "00000000-0000-4000-8000-000000000001")!,
            UUID(uuidString: "00000000-0000-4000-8000-000000000002")!,
            UUID(uuidString: "00000000-0000-4000-8000-000000000003")!,
            UUID(uuidString: "00000000-0000-4000-8000-000000000004")!,
            UUID(uuidString: "00000000-0000-4000-8000-000000000005")!,
            UUID(uuidString: "00000000-0000-4000-8000-000000000006")!,
        ]
        let roles = AvatarMotionRole.allCases
        let motions = roles.enumerated().map { index, role in
            (role, tokens[index], Data([UInt8(index + 1), UInt8(index + 2)]))
        }
        let handler = makeUninstalledHandler()
        let profile = LoadedAvatarProfile.localSchemeFixture(
            modelToken: modelToken,
            modelData: modelData,
            motions: motions
        )

        #expect(handler.install(profile))
        let motionByteCount = motions.reduce(into: 0) { total, motion in
            total += motion.2.count
        }
        let expectedByteCount = modelData.count + motionByteCount
        #expect(handler.retainedAssetByteCount == expectedByteCount)
        for (_, token, data) in motions {
            let response = try handler.response(
                for: URLRequest(url: resourceURL(token: token, fileExtension: "vrma"))
            )
            #expect(response.mimeType == "model/gltf-binary")
            #expect(response.data == data)
        }
    }

    @Test func multiplyBoundMotionUsesOneTokenResourceAndOneByteAllocation() throws {
        let sharedToken = UUID(uuidString: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb")!
        let motionData = Data([0x10, 0x11, 0x12])
        let handler = makeUninstalledHandler()
        let profile = LoadedAvatarProfile.localSchemeFixture(
            modelToken: modelToken,
            modelData: Data([0x20]),
            motions: [
                (.idle, sharedToken, motionData),
                (.listening, sharedToken, motionData),
            ]
        )

        #expect(handler.install(profile))
        #expect(handler.retainedAssetByteCount == 1 + motionData.count)
        let response = try handler.response(
            for: URLRequest(url: resourceURL(token: sharedToken, fileExtension: "vrma"))
        )
        #expect(response.data == motionData)
        #expect(!handler.install(.localSchemeFixture(
            modelToken: modelToken,
            modelData: Data([0x20]),
            motions: [
                (.idle, sharedToken, Data([0x99])),
                (.listening, sharedToken, motionData),
            ]
        )))
        #expect(handler.retainedAssetByteCount == 1 + motionData.count)
        #expect(throws: LocalSchemeError.self) {
            try handler.response(
                for: URLRequest(url: resourceURL(token: sharedToken, fileExtension: "vrm"))
            )
        }
    }

    @Test func replacementSwapsTheCompleteProfileWithoutExposingAHalfInstalledSet() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        var scheduled: [() -> Void] = []
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            scheduleDelivery: { scheduled.append($0) }
        )
        let oldProfile = LoadedAvatarProfile.localSchemeFixture(
            modelToken: modelToken,
            modelData: Data([0x01]),
            motions: [(.idle, motionToken, Data([0x02]))]
        )
        let replacementModelToken = UUID(uuidString: "cccccccc-cccc-4ccc-8ccc-cccccccccccc")!
        let replacementMotionToken = UUID(uuidString: "dddddddd-dddd-4ddd-8ddd-dddddddddddd")!
        let replacementProfile = LoadedAvatarProfile.localSchemeFixture(
            profileRevision: 2,
            modelToken: replacementModelToken,
            modelData: Data([0x03, 0x04]),
            motions: [(.idle, replacementMotionToken, Data([0x05, 0x06]))]
        )

        #expect(handler.install(oldProfile))
        let oldModelURL = resourceURL(token: modelToken, fileExtension: "vrm")
        let oldMotionURL = resourceURL(token: motionToken, fileExtension: "vrma")
        let oldSink = RecordingSchemeTaskSink(request: URLRequest(url: oldModelURL))
        handler.start(oldSink)
        #expect(scheduled.count == 1)

        #expect(handler.install(replacementProfile))
        #expect(handler.retainedAssetByteCount == 4)
        #expect(
            try handler.response(
                for: URLRequest(url: resourceURL(token: replacementModelToken, fileExtension: "vrm"))
            ).data == Data([0x03, 0x04])
        )
        #expect(
            try handler.response(
                for: URLRequest(url: resourceURL(token: replacementMotionToken, fileExtension: "vrma"))
            ).data == Data([0x05, 0x06])
        )
        #expect(throws: LocalSchemeError.self) {
            try handler.response(for: URLRequest(url: oldMotionURL))
        }

        scheduled[0]()
        #expect(oldSink.events == ["response", "data", "finish"])
        #expect(handler.retainedAssetByteCount == 4)
    }

    @Test func staleSessionCannotServeOrCompleteBytes() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        var scheduled: (() -> Void)?
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            scheduleDelivery: { scheduled = $0 }
        )
        #expect(handler.install(.localSchemeFixture(
            modelToken: modelToken,
            modelData: Data([0x01])
        )))
        let sink = RecordingSchemeTaskSink(
            request: URLRequest(url: resourceURL(token: modelToken, fileExtension: "vrm"))
        )
        handler.start(sink)
        _ = controller.begin(id: UUID(uuidString: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee")!)
        scheduled?()

        #expect(sink.events == ["failure"])
        #expect(throws: LocalSchemeError.self) {
            try handler.response(
                for: URLRequest(url: resourceURL(token: modelToken, fileExtension: "vrm"))
            )
        }
    }

    @Test func completionReleasesOnlyTheResourceThatFinished() throws {
        var pendingDeliveries: [() -> Void] = []
        let handler = makeUninstalledHandler { callback in
            pendingDeliveries.append(callback)
        }
        #expect(handler.install(.localSchemeFixture(
            modelToken: modelToken,
            modelData: Data([0x01, 0x02]),
            motions: [(.idle, motionToken, Data([0x03, 0x04, 0x05]))]
        )))
        var modelByteCountAtFinish = 0
        var motionByteCountAtFinish = 0
        let modelSink = AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: resourceURL(token: modelToken, fileExtension: "vrm")),
            finish: { modelByteCountAtFinish = handler.retainedAssetByteCount }
        )
        let motionSink = AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: resourceURL(token: motionToken, fileExtension: "vrma")),
            finish: { motionByteCountAtFinish = handler.retainedAssetByteCount }
        )

        handler.start(modelSink)
        handler.start(motionSink)
        #expect(pendingDeliveries.count == 2)
        pendingDeliveries[0]()
        #expect(modelByteCountAtFinish == 5)
        #expect(handler.retainedAssetByteCount == 3)
        #expect(motionSink.events.isEmpty)
        pendingDeliveries[1]()
        #expect(motionByteCountAtFinish == 3)
        #expect(handler.retainedAssetByteCount == 0)
    }

    @Test func revokeAndReleaseDisableAndClearEveryActiveResourceIdempotently() throws {
        let handler = makeUninstalledHandler()
        #expect(handler.install(.localSchemeFixture(
            modelToken: modelToken,
            modelData: Data([0x01]),
            motions: [(.idle, motionToken, Data([0x02]))]
        )))
        handler.revokeAssetServing()
        handler.revokeAssetServing()
        for (token, fileExtension) in [(modelToken, "vrm"), (motionToken, "vrma")] {
            #expect(throws: LocalSchemeError.self) {
                try handler.response(
                    for: URLRequest(url: resourceURL(token: token, fileExtension: fileExtension))
                )
            }
        }
        handler.releaseAssetBytes()
        handler.releaseAssetBytes()
        #expect(handler.retainedAssetByteCount == 0)
    }

    @Test func exactResourceURLAndMimeMatrixRejectsEveryNonExactRequest() throws {
        let handler = makeUninstalledHandler()
        #expect(handler.install(.localSchemeFixture(
            modelToken: modelToken,
            modelData: Data([0x01]),
            motions: [(.idle, motionToken, Data([0x02]))]
        )))
        let modelURL = resourceURL(token: modelToken, fileExtension: "vrm")
        let motionURL = resourceURL(token: motionToken, fileExtension: "vrma")
        #expect(try handler.response(for: URLRequest(url: modelURL)).mimeType == "model/gltf-binary")
        #expect(try handler.response(for: URLRequest(url: motionURL)).mimeType == "model/gltf-binary")

        let invalidURLs = [
            "miller-avatar-local://app/session/\(sessionID.uuidString.lowercased())/ffffffff-ffff-4fff-8fff-ffffffffffff.vrm",
            "miller-avatar-local://app/session/\(sessionID.uuidString.lowercased())/\(modelToken.uuidString.lowercased()).vrma",
            "miller-avatar-local://app/session/\(sessionID.uuidString.lowercased())/\(motionToken.uuidString.lowercased()).vrm",
            "miller-avatar-local://app/session/ffffffff-ffff-4fff-8fff-ffffffffffff/\(modelToken.uuidString.lowercased()).vrm",
            "miller-avatar-local://other/session/\(sessionID.uuidString.lowercased())/\(modelToken.uuidString.lowercased()).vrm",
            "miller-avatar-local://app/session/\(sessionID.uuidString.lowercased())/\(modelToken.uuidString.lowercased()).vrm?x=1",
            "miller-avatar-local://app/session/\(sessionID.uuidString.lowercased())/\(modelToken.uuidString.lowercased()).vrm#x",
            "miller-avatar-local://app/session/\(sessionID.uuidString.lowercased())/../\(modelToken.uuidString.lowercased()).vrm",
            "https://app/session/\(sessionID.uuidString.lowercased())/\(modelToken.uuidString.lowercased()).vrm",
        ]
        for rawURL in invalidURLs {
            #expect(throws: LocalSchemeError.self, "accepted \(rawURL)") {
                try handler.response(for: URLRequest(url: URL(string: rawURL)!))
            }
        }

        var post = URLRequest(url: modelURL)
        post.httpMethod = "POST"
        #expect(throws: LocalSchemeError.self) { try handler.response(for: post) }
        var range = URLRequest(url: motionURL)
        range.setValue("bytes=0-1", forHTTPHeaderField: "Range")
        #expect(throws: LocalSchemeError.self) { try handler.response(for: range) }
        var conditional = URLRequest(url: modelURL)
        conditional.setValue("etag", forHTTPHeaderField: "If-None-Match")
        #expect(throws: LocalSchemeError.self) { try handler.response(for: conditional) }
    }

    @Test func lateCompletionWithReusedTokensReleasesOnlyTheDetachedGeneration() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        var scheduled: [() -> Void] = []
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            scheduleDelivery: { scheduled.append($0) }
        )
        let oldProfile = LoadedAvatarProfile.localSchemeFixture(
            modelToken: modelToken,
            modelData: Data([0x01]),
            motions: [(.idle, motionToken, Data([0x02]))]
        )
        let newProfile = LoadedAvatarProfile.localSchemeFixture(
            profileRevision: 2,
            modelToken: modelToken,
            modelData: Data([0x03, 0x04]),
            motions: [(.idle, motionToken, Data([0x05, 0x06, 0x07]))]
        )
        #expect(handler.install(oldProfile))
        var oldModelData: Data?
        var oldMotionData: Data?
        handler.start(AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: resourceURL(token: modelToken, fileExtension: "vrm")),
            receiveData: { oldModelData = $0 }
        ))
        handler.start(AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: resourceURL(token: motionToken, fileExtension: "vrma")),
            receiveData: { oldMotionData = $0 }
        ))
        #expect(scheduled.count == 2)

        handler.revokeAssetServing()
        #expect(handler.install(newProfile))
        #expect(handler.retainedAssetByteCount == 5)
        scheduled[0]()
        scheduled[1]()

        #expect(oldModelData == Data([0x01]))
        #expect(oldMotionData == Data([0x02]))
        #expect(handler.retainedAssetByteCount == 5)
        #expect(
            try handler.response(
                for: URLRequest(url: resourceURL(token: modelToken, fileExtension: "vrm"))
            ).data == Data([0x03, 0x04])
        )
        #expect(
            try handler.response(
                for: URLRequest(url: resourceURL(token: motionToken, fileExtension: "vrma"))
            ).data == Data([0x05, 0x06, 0x07])
        )
    }

    @Test func repeatedProfileReplacementWithoutRequestsDropsReplacedGenerationBytes() throws {
        let handler = makeUninstalledHandler()

        for index in 0..<16 {
            let modelToken = UUID()
            let motionToken = UUID()
            #expect(handler.install(.localSchemeFixture(
                profileRevision: UInt64(index + 1),
                modelToken: modelToken,
                modelData: Data(repeating: UInt8(index), count: 1_024),
                motions: [
                    (.idle, motionToken, Data(repeating: UInt8(index + 1), count: 2_048)),
                ]
            )))
        }

        #expect(detachedBytes(in: handler) == 0)
    }

    @Test func installedAssetReplacesTheInitialOpaqueAsset() throws {
        let controller = RendererSessionController()
        let lease = controller.begin()
        let initialToken = UUID()
        let replacementToken = UUID()
        let resources = bundleResources()
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: resources,
            resourceRecords: resources.keys.sorted().map {
                LocalSchemeResourceRecord.make(path: $0, data: resources[$0]!)
            },
            assetToken: initialToken,
            assetData: Data()
        )

        #expect(handler.install(.localSchemeFixture(
            modelToken: replacementToken,
            modelData: Data([1, 2, 3])
        )))

        #expect(handler.retainedAssetByteCount == 3)
        let response = try handler.response(for: URLRequest(url: handler.activeAssetURL))
        #expect(response.data == Data([1, 2, 3]))
        #expect(!handler.activeAssetURL.absoluteString.contains(initialToken.uuidString.lowercased()))
    }

    @Test func assetBytesStayRetainedUntilSuccessfulSinkCompletion() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        let assetData = Data([1, 2, 3, 4])
        var scheduled: (() -> Void)?
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: assetData,
            scheduleDelivery: { scheduled = $0 }
        )
        var byteCountWhenData = 0
        var byteCountWhenFinish = 0
        let sink = AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: handler.activeAssetURL),
            receiveData: { _ in
                byteCountWhenData = handler.retainedAssetByteCount
            },
            finish: {
                byteCountWhenFinish = handler.retainedAssetByteCount
            }
        )

        handler.start(sink)

        #expect(handler.retainedAssetByteCount == assetData.count)
        scheduled?()
        #expect(sink.events == ["response", "data", "finish"])
        #expect(byteCountWhenData == assetData.count)
        #expect(byteCountWhenFinish == assetData.count)
        #expect(handler.retainedAssetByteCount == 0)
        #expect(throws: LocalSchemeError.self) {
            try handler.response(for: URLRequest(url: handler.activeAssetURL))
        }
    }

    @Test func cancellationReleasesAssetBytesAfterTheFailureSinkReturns() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data([1, 2, 3, 4])
        )
        var byteCountWhenFailure = 0
        let sink = AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: handler.activeAssetURL),
            receiveResponse: { handler.cancelAll() },
            failure: {
                byteCountWhenFailure = handler.retainedAssetByteCount
            }
        )

        handler.start(sink)

        #expect(sink.events == ["response", "failure"])
        #expect(byteCountWhenFailure == 4)
        #expect(handler.retainedAssetByteCount == 0)
    }

    @Test func bundleDeliveryDoesNotReleaseTheActiveAssetBytes() throws {
        let handler = makeHandler()
        let sink = RecordingSchemeTaskSink(request: request("/bundle/index.html"))

        handler.start(sink)

        #expect(handler.retainedAssetByteCount == 4)
    }

    @Test func queuedOldAssetReplacementKeepsReplacementActiveUntilItsDeliveryCompletes() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        let oldToken = assetToken
        let replacementToken = UUID(uuidString: "33333333-3333-3333-3333-333333333333")!
        let oldData = Data([1, 2])
        let replacementData = Data([3, 4, 5, 6])
        var scheduled: [() -> Void] = []
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: oldToken,
            assetData: oldData,
            scheduleDelivery: { scheduled.append($0) }
        )
        let oldURL = handler.activeAssetURL
        var oldDeliveredData: Data?
        let oldSink = AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: oldURL),
            receiveData: { data in oldDeliveredData = data }
        )

        handler.start(oldSink)
        #expect(scheduled.count == 1)
        #expect(handler.install(.localSchemeFixture(
            modelToken: replacementToken,
            modelData: replacementData
        )))
        let replacementURL = handler.activeAssetURL

        #expect(replacementURL != oldURL)
        #expect(handler.retainedAssetByteCount == replacementData.count)

        scheduled[0]()

        #expect(oldSink.events == ["response", "data", "finish"])
        #expect(oldDeliveredData == oldData)
        #expect(handler.activeAssetURL == replacementURL)
        #expect(handler.retainedAssetByteCount == replacementData.count)
        #expect(
            try handler.response(for: URLRequest(url: replacementURL)).data
                == replacementData
        )

        var replacementByteCountWhenFinish = 0
        let replacementSink = AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: replacementURL),
            finish: {
                replacementByteCountWhenFinish = handler.retainedAssetByteCount
            }
        )
        handler.start(replacementSink)
        #expect(scheduled.count == 2)
        #expect(handler.retainedAssetByteCount == replacementData.count)

        scheduled[1]()

        #expect(replacementSink.events == ["response", "data", "finish"])
        #expect(replacementByteCountWhenFinish == replacementData.count)
        #expect(handler.retainedAssetByteCount == 0)
        #expect(throws: LocalSchemeError.self) {
            try handler.response(for: URLRequest(url: replacementURL))
        }
    }

    @Test func queuedOldAssetWithSameTokenCannotReleaseReplacementBytes() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        let oldData = Data([1, 2])
        let replacementData = Data([3, 4, 5, 6])
        var scheduled: [() -> Void] = []
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: oldData,
            scheduleDelivery: { scheduled.append($0) }
        )
        let assetURL = handler.activeAssetURL
        var oldDeliveredData: Data?
        let oldSink = AssetLifetimeSchemeTaskSink(
            request: URLRequest(url: assetURL),
            receiveData: { oldDeliveredData = $0 }
        )

        handler.start(oldSink)
        #expect(scheduled.count == 1)
        #expect(handler.install(.localSchemeFixture(
            modelToken: assetToken,
            modelData: replacementData
        )))
        #expect(handler.activeAssetURL == assetURL)
        #expect(
            try handler.response(for: URLRequest(url: assetURL)).data
                == replacementData
        )

        scheduled[0]()

        #expect(oldDeliveredData == oldData)
        #expect(handler.retainedAssetByteCount == replacementData.count)
        #expect(
            try handler.response(for: URLRequest(url: assetURL)).data
                == replacementData
        )
    }

    @Test func stoppingOneWebKitTaskDoesNotCancelAnotherPendingDelivery() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        var scheduled: [() -> Void] = []
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data(),
            scheduleDelivery: { scheduled.append($0) }
        )
        let webView = WKWebView()
        let first = RecordingWKURLSchemeTask(request: request("/bundle/index.html"))
        let second = RecordingWKURLSchemeTask(request: request("/bundle/index.html"))

        handler.webView(webView, start: first)
        handler.webView(webView, start: second)
        #expect(scheduled.count == 2)

        handler.webView(webView, stop: first)

        #expect(first.events == ["failure"])
        #expect(second.events.isEmpty)
        scheduled[0]()
        #expect(second.events.isEmpty)
        scheduled[1]()

        #expect(second.events == ["response", "data", "finish"])
    }

    private let sessionID = UUID(uuidString: "11111111-1111-1111-1111-111111111111")!
    private let modelToken = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
    private let motionToken = UUID(uuidString: "22222222-2222-4222-8222-222222222222")!
    private let assetToken = UUID(uuidString: "22222222-2222-2222-2222-222222222222")!

    @Test func servesOnlyManifestPathsAndTheActiveAsset() throws {
        let handler = makeHandler()

        let entry = try handler.response(for: request("/bundle/index.html"))
        #expect(entry.mimeType == "text/html; charset=utf-8")
        #expect(entry.data == Data("html".utf8))
        let policy = entry.headers["Content-Security-Policy"]
        #expect(policy?.contains("connect-src 'self' blob: miller-avatar-local:") == true)
        #expect(policy?.contains("http:") == false)
        #expect(policy?.contains("https:") == false)

        let script = try handler.response(for: request("/bundle/app.js"))
        #expect(script.mimeType == "text/javascript; charset=utf-8")

        let asset = try handler.response(for: URLRequest(url: handler.activeAssetURL))
        #expect(asset.mimeType == "model/gltf-binary")
        #expect(asset.data == Data([0x67, 0x6c, 0x54, 0x46]))
        #expect(asset.headers["Cache-Control"] == "no-store")
        #expect(asset.headers["X-Content-Type-Options"] == "nosniff")

        #expect(throws: LocalSchemeError.self) {
            try handler.response(for: request("/bundle/not-in-manifest.js"))
        }
        #expect(throws: LocalSchemeError.self) {
            try handler.response(
                for: request("/session/\(sessionID.uuidString.lowercased())/other.vrm")
            )
        }
    }

    @Test func servesTheBundleOnlyFromTheActiveSessionScopedEntrypoint() throws {
        let handler = makeHandler()
        let entryURL = URL(string: "miller-avatar-local://app/session/\(sessionID.uuidString.lowercased())/bundle/index.html")!

        let entry = try handler.response(for: URLRequest(url: entryURL))

        #expect(entry.data == Data("html".utf8))
        #expect(entry.url == entryURL)
    }

    @Test func rejectsEveryNoncanonicalOrAmbiguousURLForm() {
        let handler = makeHandler()
        let rejected = [
            "miller-avatar-local://other/bundle/index.html",
            "miller-avatar-local://user@app/bundle/index.html",
            "miller-avatar-local://app:99/bundle/index.html",
            "miller-avatar-local://app//bundle/index.html",
            "miller-avatar-local://app/bundle/../index.html",
            "miller-avatar-local://app/bundle/%2e%2e/index.html",
            "miller-avatar-local://app/bundle%2findex.html",
            "miller-avatar-local://app/bundle%5cindex.html",
            "miller-avatar-local://app/bundle/%C0%AFindex.html",
            "miller-avatar-local://app/bundle/index.html?x=1",
            "miller-avatar-local://app/bundle/index.html#x",
            "https://app/bundle/index.html",
        ]

        for rawURL in rejected {
            #expect(throws: LocalSchemeError.self, "accepted \(rawURL)") {
                try handler.response(for: URLRequest(url: URL(string: rawURL)!))
            }
        }
    }

    @Test func rejectsMethodsRangesAndUnknownMIMETypes() {
        let handler = makeHandler()

        var post = request("/bundle/index.html")
        post.httpMethod = "POST"
        #expect(throws: LocalSchemeError.self) { try handler.response(for: post) }

        var range = request("/bundle/index.html")
        range.setValue("bytes=0-1", forHTTPHeaderField: "Range")
        #expect(throws: LocalSchemeError.self) { try handler.response(for: range) }

        for header in ["If-Match", "If-Modified-Since", "If-None-Match"] {
            var conditional = request("/bundle/index.html")
            conditional.setValue("cached", forHTTPHeaderField: header)
            #expect(throws: LocalSchemeError.self, "accepted \(header)") {
                try handler.response(for: conditional)
            }
        }

        #expect(throws: LocalSchemeError.self) {
            try handler.response(for: request("/bundle/archive.bin"))
        }
    }

    @Test func rejectsAnInventoryWithAnUnknownOrAssetMIME() {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        for path in ["/bundle/archive.bin", "/bundle/asset.vrm"] {
            #expect(throws: LocalSchemeError.self) {
                try LocalSchemeHandler(
                    lease: lease,
                    sessionController: controller,
                    bundledResources: bundleResources(extra: [path: Data()]),
                    resourceRecords: resourceRecords(for: bundleResources(extra: [path: Data()])),
                    assetToken: assetToken,
                    assetData: Data()
                )
            }
        }
    }

    @Test func rejectsManifestRecordsThatDoNotMatchBytesOrClosedMIME() {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        let resources = bundleResources()
        var records = resourceRecords(for: resources)
        records[0] = LocalSchemeResourceRecord(
            path: "/bundle/index.html",
            mimeType: "text/html; charset=utf-8",
            byteCount: resources["/bundle/index.html"]!.count + 1,
            sha256: records[0].sha256
        )
        #expect(throws: LocalSchemeError.self) {
            try LocalSchemeHandler(
                lease: lease,
                sessionController: controller,
                bundledResources: resources,
                resourceRecords: records,
                assetToken: assetToken,
                assetData: Data()
            )
        }

        var wrongMIME = resourceRecords(for: resources)
        wrongMIME[0] = LocalSchemeResourceRecord(
            path: "/bundle/index.html",
            mimeType: "text/javascript; charset=utf-8",
            byteCount: resources["/bundle/index.html"]!.count,
            sha256: wrongMIME[0].sha256
        )
        #expect(throws: LocalSchemeError.self) {
            try LocalSchemeHandler(
                lease: lease,
                sessionController: controller,
                bundledResources: resources,
                resourceRecords: wrongMIME,
                assetToken: assetToken,
                assetData: Data()
            )
        }

        var wrongDigest = resourceRecords(for: resources)
        wrongDigest[0] = LocalSchemeResourceRecord(
            path: "/bundle/index.html",
            mimeType: "text/html; charset=utf-8",
            byteCount: resources["/bundle/index.html"]!.count,
            sha256: String(repeating: "0", count: 64)
        )
        #expect(throws: LocalSchemeError.self) {
            try LocalSchemeHandler(
                lease: lease,
                sessionController: controller,
                bundledResources: resources,
                resourceRecords: wrongDigest,
                assetToken: assetToken,
                assetData: Data()
            )
        }
    }

    @Test func staleLeaseDeliversNoBytesAndCompletesWithFailure() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        var scheduled: (() -> Void)?
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data([0x67, 0x6c, 0x54, 0x46]),
            scheduleDelivery: { scheduled = $0 }
        )
        let sink = RecordingSchemeTaskSink(
            request: request("/bundle/index.html")
        )

        handler.start(sink)
        #expect(scheduled != nil)
        lease.invalidate()
        scheduled?()

        #expect(sink.events == ["failure"])
    }

    @Test func deferredDeliveryRetainsItsTaskUntilCompletion() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        var scheduled: (() -> Void)?
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data(),
            scheduleDelivery: { scheduled = $0 }
        )
        let recorder = SchemeEventRecorder()
        var sink: LifetimeSchemeTaskSink? = LifetimeSchemeTaskSink(
            request: request("/bundle/index.html"),
            recorder: recorder
        )
        weak var weakSink = sink

        handler.start(sink!)
        sink = nil

        #expect(weakSink != nil)
        scheduled?()
        #expect(recorder.events == ["response", "data", "finish"])
    }

    @Test func cancellationBetweenRegistrationAndSchedulingReleasesTheTask() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        var handler: LocalSchemeHandler!
        var scheduled: (() -> Void)?
        handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data(),
            scheduleDelivery: { callback in
                handler.cancelAll()
                scheduled = callback
            }
        )
        var sink: LifetimeSchemeTaskSink? = LifetimeSchemeTaskSink(
            request: request("/bundle/index.html"),
            recorder: SchemeEventRecorder()
        )
        weak var weakSink = sink

        handler.start(sink!)
        sink = nil

        #expect(weakSink == nil)
        scheduled?()
    }

    @Test func schedulingStaysInsideTheAdmittedSessionTransaction() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        let race = SchedulingTransactionRace()
        var scheduled: (() -> Void)?
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data(),
            scheduleDelivery: { callback in
                race.scheduleEntered.signal()
                _ = race.allowScheduling.wait(timeout: .now() + 1)
                scheduled = callback
            }
        )
        let sink = RecordingSchemeTaskSink(
            request: request("/bundle/index.html")
        )

        DispatchQueue.global().async {
            guard race.scheduleEntered.wait(timeout: .now() + 1) == .success else {
                return
            }
            race.teardownStarted.signal()
            controller.release(lease)
            handler.cancelAll()
            race.teardownFinished.signal()
        }
        DispatchQueue.global().async {
            guard race.teardownStarted.wait(timeout: .now() + 1) == .success else {
                return
            }
            let teardownFinishedBeforeScheduling = race.teardownFinished.wait(
                timeout: .now() + 0.2
            ) == .success
            race.allowScheduling.signal()
            let teardownFinishedAfterScheduling = teardownFinishedBeforeScheduling
                || race.teardownFinished.wait(timeout: .now() + 1) == .success
            race.record(
                teardownFinishedBeforeScheduling: teardownFinishedBeforeScheduling,
                teardownFinishedAfterScheduling: teardownFinishedAfterScheduling
            )
            race.verificationFinished.signal()
        }

        handler.start(sink)

        #expect(race.verificationFinished.wait(timeout: .now() + 1) == .success)
        #expect(race.teardownFinishedBeforeScheduling == false)
        #expect(race.teardownFinishedAfterScheduling)
        scheduled?()
        #expect(sink.events == ["failure"])
    }

    @Test func completionAndCancellationCannotInvertSessionAndDeliveryGates() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        let sessionHeld = DispatchSemaphore(value: 0)
        let completionStarted = DispatchSemaphore(value: 0)
        let cancellationFinished = DispatchSemaphore(value: 0)
        var scheduled: (() -> Void)?
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data(),
            scheduleDelivery: { callback in
                scheduled = {
                    completionStarted.signal()
                    callback()
                }
            }
        )
        let sink = RecordingSchemeTaskSink(
            request: request("/bundle/index.html")
        )

        handler.start(sink)
        DispatchQueue.global().async {
            controller.synchronize {
                sessionHeld.signal()
                _ = completionStarted.wait(timeout: .now() + 1)
                handler.cancelAll()
            }
            cancellationFinished.signal()
        }
        #expect(sessionHeld.wait(timeout: .now() + 1) == .success)

        scheduled?()

        #expect(cancellationFinished.wait(timeout: .now() + 1) == .success)
        #expect(sink.events == ["failure"])
    }

    @Test func reentrantCancellationStopsDeliveryAfterTheCurrentCallback() throws {
        let resources = bundleResources()
        let controller = RendererSessionController()
        let handler = try LocalSchemeHandler(
            lease: controller.begin(id: sessionID),
            sessionController: controller,
            bundledResources: resources,
            resourceRecords: resourceRecords(for: resources),
            assetToken: assetToken,
            assetData: Data()
        )
        let sink = ReentrantSchemeTaskSink(request: request("/bundle/index.html")) {
            handler.cancelAll()
        }

        handler.start(sink)

        #expect(sink.events == ["response", "failure"])
    }

    @Test func replacementCannotPassAnAdmittedDelivery() throws {
        let resources = bundleResources()
        let controller = RendererSessionController()
        let replacementID = sessionID
        let trigger = DeliveryTrigger()
        let handler = try LocalSchemeHandler(
            lease: controller.begin(id: sessionID),
            sessionController: controller,
            bundledResources: resources,
            resourceRecords: resourceRecords(for: resources),
            assetToken: assetToken,
            assetData: Data(),
            scheduleDelivery: trigger.schedule
        )
        let race = SchemeHandlerRace(trigger: trigger)
        let sink = BlockingResponseSchemeTaskSink(
            request: request("/bundle/index.html")
        )

        handler.start(sink)
        DispatchQueue.global().async {
            guard sink.responseStarted.wait(timeout: .now() + 1) == .success else {
                return
            }
            race.replacementStarted.signal()
            _ = controller.begin(id: replacementID)
            race.replacementFinished.signal()
        }

        DispatchQueue.global().async {
            guard race.replacementStarted.wait(timeout: .now() + 1) == .success else {
                return
            }
            let replacementStayedBlocked = race.replacementFinished.wait(
                timeout: .now() + 0.2
            ) == .timedOut
            sink.allowResponseToReturn.signal()
            let replacementFinished = race.replacementFinished.wait(
                timeout: .now() + 1
            ) == .success
            race.record(
                operationStayedBlocked: replacementStayedBlocked,
                operationFinished: replacementFinished
            )
            race.verificationFinished.signal()
        }

        race.trigger.run()

        let verification = race.verificationFinished.wait(timeout: .now() + 1)
        #expect(verification == .success)
        #expect(race.operationStayedBlocked)
        #expect(race.operationFinished)
        #expect(sink.events == ["response", "data", "finish"])
    }

    @Test func aTaskStartingAfterInvalidationFailsWithoutDeliveringData() throws {
        let controller = RendererSessionController()
        let lease = controller.begin(id: sessionID)
        let handler = try LocalSchemeHandler(
            lease: lease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data()
        )
        let sink = RecordingSchemeTaskSink(
            request: request("/bundle/index.html")
        )

        lease.invalidate()
        handler.start(sink)

        #expect(sink.events == ["failure"])
    }

    @Test func replacementGenerationCompletesAnOldQueuedTaskWithFailure() throws {
        let controller = RendererSessionController()
        let oldLease = controller.begin(id: sessionID)
        var scheduled: (() -> Void)?
        let handler = try LocalSchemeHandler(
            lease: oldLease,
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            assetToken: assetToken,
            assetData: Data(),
            scheduleDelivery: { scheduled = $0 }
        )
        let sink = RecordingSchemeTaskSink(
            request: request("/bundle/index.html")
        )

        handler.start(sink)
        _ = controller.begin(id: sessionID)
        scheduled?()

        #expect(sink.events == ["failure"])
    }

    private func makeUninstalledHandler(
        _ scheduleDelivery: @escaping (@escaping () -> Void) -> Void = { $0() }
    ) -> LocalSchemeHandler {
        let controller = RendererSessionController()
        return try! LocalSchemeHandler(
            lease: controller.begin(id: sessionID),
            sessionController: controller,
            bundledResources: bundleResources(),
            resourceRecords: resourceRecords(for: bundleResources()),
            scheduleDelivery: scheduleDelivery
        )
    }

    private func makeHandler(
        resources: [String: Data]? = nil
    ) -> LocalSchemeHandler {
        let resources = resources ?? bundleResources()
        let controller = RendererSessionController()
        return try! LocalSchemeHandler(
            lease: controller.begin(id: sessionID),
            sessionController: controller,
            bundledResources: resources,
            resourceRecords: resourceRecords(for: resources),
            assetToken: assetToken,
            assetData: Data([0x67, 0x6c, 0x54, 0x46])
        )
    }

    private func resourceURL(token: UUID, fileExtension: String) -> URL {
        URL(string: "miller-avatar-local://app/session/"
            + "\(sessionID.uuidString.lowercased())/"
            + "\(token.uuidString.lowercased()).\(fileExtension)")!
    }

    private func request(_ path: String) -> URLRequest {
        let scopedPath: String
        if path.hasPrefix("/bundle/") {
            scopedPath = "/session/\(sessionID.uuidString.lowercased())\(path)"
        } else {
            scopedPath = path
        }
        return URLRequest(url: URL(string: "miller-avatar-local://app\(scopedPath)")!)
    }

    private func bundleResources(
        extra: [String: Data] = [:]
    ) -> [String: Data] {
        [
            "/bundle/index.html": Data("html".utf8),
            "/bundle/app.js": Data("js".utf8),
            "/bundle/styles.css": Data("css".utf8),
            "/bundle/bundle-manifest.json": Data("manifest".utf8),
            "/bundle/bundle-metafile.json": Data("metafile".utf8),
        ].merging(extra) { _, replacement in replacement }
    }

    private func resourceRecords(
        for resources: [String: Data]
    ) -> [LocalSchemeResourceRecord] {
        resources.keys.sorted().map { path in
            LocalSchemeResourceRecord.make(
                path: path,
                data: resources[path]!
            )
        }
    }

    private func detachedBytes(in handler: LocalSchemeHandler) -> Int {
        guard let store = Mirror(reflecting: handler).children.first(where: {
            $0.label == "resourceStore"
        })?.value,
        let detached = Mirror(reflecting: store).children.first(where: {
            $0.label == "detached"
        })?.value
        else {
            return 0
        }
        return dataBytes(in: detached)
    }

    private func dataBytes(in value: Any) -> Int {
        if let data = value as? Data { return data.count }
        return Mirror(reflecting: value).children.reduce(into: 0) { total, child in
            total += dataBytes(in: child.value)
        }
    }
}

private final class RecordingSchemeTaskSink: LocalSchemeTaskSink {
    let request: URLRequest
    private(set) var events: [String] = []

    init(request: URLRequest) {
        self.request = request
    }

    func receive(response: URLResponse) {
        events.append("response")
    }

    func receive(data: Data) {
        events.append("data")
    }

    func finish() {
        events.append("finish")
    }

    func fail(with error: any Error) {
        events.append("failure")
    }
}

private final class RecordingWKURLSchemeTask: NSObject, WKURLSchemeTask {
    let request: URLRequest
    private(set) var events: [String] = []

    init(request: URLRequest) {
        self.request = request
    }

    func didReceive(_ response: URLResponse) {
        events.append("response")
    }

    func didReceive(_ data: Data) {
        events.append("data")
    }

    func didFinish() {
        events.append("finish")
    }

    func didFailWithError(_ error: Error) {
        events.append("failure")
    }
}

private final class AssetLifetimeSchemeTaskSink: LocalSchemeTaskSink {
    let request: URLRequest
    private let receiveResponseHandler: () -> Void
    private let receiveDataHandler: (Data) -> Void
    private let finishHandler: () -> Void
    private let failureHandler: () -> Void
    private(set) var events: [String] = []

    init(
        request: URLRequest,
        receiveResponse: @escaping () -> Void = {},
        receiveData: @escaping (Data) -> Void = { _ in },
        finish: @escaping () -> Void = {},
        failure: @escaping () -> Void = {}
    ) {
        self.request = request
        receiveResponseHandler = receiveResponse
        receiveDataHandler = receiveData
        finishHandler = finish
        failureHandler = failure
    }

    func receive(response: URLResponse) {
        events.append("response")
        receiveResponseHandler()
    }

    func receive(data: Data) {
        events.append("data")
        receiveDataHandler(data)
    }

    func finish() {
        events.append("finish")
        finishHandler()
    }

    func fail(with error: any Error) {
        events.append("failure")
        failureHandler()
    }
}

private final class ReentrantSchemeTaskSink: LocalSchemeTaskSink {
    let request: URLRequest
    private let cancel: () -> Void
    private(set) var events: [String] = []

    init(request: URLRequest, cancel: @escaping () -> Void) {
        self.request = request
        self.cancel = cancel
    }

    func receive(response: URLResponse) {
        events.append("response")
        cancel()
    }

    func receive(data: Data) {
        events.append("data")
    }

    func finish() {
        events.append("finish")
    }

    func fail(with error: any Error) {
        events.append("failure")
    }
}

private final class SchemeEventRecorder {
    var events: [String] = []
}

private final class LifetimeSchemeTaskSink: LocalSchemeTaskSink {
    let request: URLRequest
    private let recorder: SchemeEventRecorder

    init(request: URLRequest, recorder: SchemeEventRecorder) {
        self.request = request
        self.recorder = recorder
    }

    func receive(response: URLResponse) {
        recorder.events.append("response")
    }

    func receive(data: Data) {
        recorder.events.append("data")
    }

    func finish() {
        recorder.events.append("finish")
    }

    func fail(with error: any Error) {
        recorder.events.append("failure")
    }
}

private final class DeliveryTrigger: @unchecked Sendable {
    private let lock = NSLock()
    private var callback: (() -> Void)?

    func schedule(_ callback: @escaping () -> Void) {
        lock.withLock {
            self.callback = callback
        }
    }

    func run() {
        let callback = lock.withLock { self.callback }
        callback?()
    }
}

private final class SchemeHandlerRace: @unchecked Sendable {
    let trigger: DeliveryTrigger
    let replacementStarted = DispatchSemaphore(value: 0)
    let replacementFinished = DispatchSemaphore(value: 0)
    let verificationFinished = DispatchSemaphore(value: 0)
    private let lock = NSLock()
    private var storedOperationStayedBlocked = false
    private var storedOperationFinished = false

    init(trigger: DeliveryTrigger) {
        self.trigger = trigger
    }

    var operationStayedBlocked: Bool {
        lock.withLock { storedOperationStayedBlocked }
    }

    var operationFinished: Bool {
        lock.withLock { storedOperationFinished }
    }

    func record(operationStayedBlocked: Bool, operationFinished: Bool) {
        lock.withLock {
            storedOperationStayedBlocked = operationStayedBlocked
            storedOperationFinished = operationFinished
        }
    }
}

private final class SchedulingTransactionRace: @unchecked Sendable {
    let scheduleEntered = DispatchSemaphore(value: 0)
    let allowScheduling = DispatchSemaphore(value: 0)
    let teardownStarted = DispatchSemaphore(value: 0)
    let teardownFinished = DispatchSemaphore(value: 0)
    let verificationFinished = DispatchSemaphore(value: 0)
    private let lock = NSLock()
    private var storedTeardownFinishedBeforeScheduling = false
    private var storedTeardownFinishedAfterScheduling = false

    var teardownFinishedBeforeScheduling: Bool {
        lock.withLock { storedTeardownFinishedBeforeScheduling }
    }

    var teardownFinishedAfterScheduling: Bool {
        lock.withLock { storedTeardownFinishedAfterScheduling }
    }

    func record(
        teardownFinishedBeforeScheduling: Bool,
        teardownFinishedAfterScheduling: Bool
    ) {
        lock.withLock {
            storedTeardownFinishedBeforeScheduling = teardownFinishedBeforeScheduling
            storedTeardownFinishedAfterScheduling = teardownFinishedAfterScheduling
        }
    }
}

private final class BlockingResponseSchemeTaskSink: LocalSchemeTaskSink, @unchecked Sendable {
    let request: URLRequest
    let responseStarted = DispatchSemaphore(value: 0)
    let allowResponseToReturn = DispatchSemaphore(value: 0)
    private let lock = NSLock()
    private var recordedEvents: [String] = []

    init(request: URLRequest) {
        self.request = request
    }

    var events: [String] {
        lock.withLock { recordedEvents }
    }

    func receive(response: URLResponse) {
        lock.withLock { recordedEvents.append("response") }
        responseStarted.signal()
        _ = allowResponseToReturn.wait(timeout: .now() + 1)
    }

    func receive(data: Data) {
        lock.withLock { recordedEvents.append("data") }
    }

    func finish() {
        lock.withLock { recordedEvents.append("finish") }
    }

    func fail(with error: any Error) {
        lock.withLock { recordedEvents.append("failure") }
    }
}
