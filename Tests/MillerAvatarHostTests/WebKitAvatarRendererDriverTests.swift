import Foundation
import MillerAvatarCore
import Testing
@testable import MillerAvatarHost

@MainActor
@Suite struct WebKitAvatarRendererDriverTests {
    @Test func appResolverSelectsTheFixedEmbeddedResourceBundle() throws {
        let app = try TemporaryApplicationBundle(resources: bundleResources())
        let fallback = try TemporaryResourceBundle(resources: bundleResources())

        let selected = try RendererResourceProvider.resolveBundle(
            mainBundle: app.bundle,
            fallbackBundle: { fallback.bundle }
        )

        #expect(
            selected.bundleURL.standardizedFileURL
                == app.resourceBundleURL.standardizedFileURL
        )
        #expect(!selected.bundleURL.path.contains(".generated"))
        #expect(
            try RendererResourceProvider(bundle: selected).load()
                == bundleResources()
        )
    }

    @Test func appResolverRejectsMissingOrInvalidFixedInventory() throws {
        let missing = try TemporaryApplicationBundle(resources: nil)
        let fallback = try TemporaryResourceBundle(resources: bundleResources())
        #expect(throws: LocalSchemeError.self) {
            try RendererResourceProvider.resolveBundle(
                mainBundle: missing.bundle,
                fallbackBundle: { fallback.bundle }
            )
        }

        var invalidResources = bundleResources()
        invalidResources.removeValue(forKey: "/bundle/app.js")
        let invalid = try TemporaryApplicationBundle(resources: invalidResources)
        let selected = try RendererResourceProvider.resolveBundle(
            mainBundle: invalid.bundle,
            fallbackBundle: { fallback.bundle }
        )
        #expect(throws: LocalSchemeError.self) {
            try RendererResourceProvider(bundle: selected).load()
        }
    }

    @Test func nonApplicationResolverUsesTheSwiftPMFallbackBundle() throws {
        let nonApplication = try TemporaryResourceBundle(
            resources: bundleResources(),
            pathExtension: "xctest"
        )
        let fallback = try TemporaryResourceBundle(resources: bundleResources())
        let secondNonApplication = try TemporaryResourceBundle(
            resources: bundleResources(),
            pathExtension: "xctest"
        )

        #expect(nonApplication.bundle.bundleURL.pathExtension == "xctest")
        #expect(fallback.bundle.bundleURL.pathExtension == "bundle")
        #expect(nonApplication.bundle.bundleURL != fallback.bundle.bundleURL)
        #expect(nonApplication.bundle.bundleURL != secondNonApplication.bundle.bundleURL)

        let selected = try RendererResourceProvider.resolveBundle(
            mainBundle: nonApplication.bundle,
            fallbackBundle: { fallback.bundle }
        )

        #expect(
            selected.bundleURL.standardizedFileURL
                == fallback.bundle.bundleURL.standardizedFileURL
        )
    }

    @Test func moduleProviderLoadsExactlyTheFiveReviewedResources() throws {
        let resources = try RendererResourceProvider.module.load()

        #expect(Set(resources.keys) == Set([
            "/bundle/index.html",
            "/bundle/app.js",
            "/bundle/styles.css",
            "/bundle/bundle-manifest.json",
            "/bundle/bundle-metafile.json",
        ]))
    }

    @Test func driverRejectsMissingAndExtraResourceInventory() {
        let resources = bundleResources()
        var missing = resources
        missing.removeValue(forKey: "/bundle/app.js")
        var extra = resources
        extra["/bundle/extra.js"] = Data("extra".utf8)

        for candidate in [missing, extra] {
            let driver = WebKitAvatarRendererDriver(
                resourceProvider: RendererResourceProvider(resources: candidate)
            )
            var observations: [HostObservation] = []

            driver.start(sessionID: UUID()) { _, observation in
                observations.append(observation)
            }

            #expect(observations == [.failed(.rendererUnavailable)])
        }
    }

    @Test func resourceProviderRejectsEveryFixedResourceSymlink() throws {
        let fileManager = FileManager.default

        for path in bundleResources().keys.sorted() {
            let bundle = try TemporaryResourceBundle(resources: bundleResources())
            let name = String(path.dropFirst("/bundle/".count))
            let outsideURL = fileManager.temporaryDirectory
                .appendingPathComponent(
                    "Miller Avatar Escape \(UUID().uuidString)-\(name)"
                )
            try Data("outside-web-root".utf8).write(to: outsideURL)

            let resourceURL = bundle.rootURL
                .appendingPathComponent("Web", isDirectory: true)
                .appendingPathComponent(name)
            try fileManager.removeItem(at: resourceURL)
            try fileManager.createSymbolicLink(
                at: resourceURL,
                withDestinationURL: outsideURL
            )

            #expect(throws: LocalSchemeError.self) {
                try RendererResourceProvider(bundle: bundle.bundle).load()
            }

            try? fileManager.removeItem(at: outsideURL)
        }
    }

    @Test func startupResourceFailureForwardsThroughReceiveBeforeCleanup() {
        let resources = bundleResources()
        var missing = resources
        missing.removeValue(forKey: "/bundle/app.js")
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: missing)
        )
        let sessionID = UUID()
        var receivedObservations: [HostObservation] = []
        var callbackOrder: [String] = []

        driver.start(sessionID: sessionID) { _, observation in
            receivedObservations.append(observation)
            callbackOrder.append("receive")
        }

        #expect(receivedObservations == [.failed(.rendererUnavailable)])
        #expect(callbackOrder == ["receive"])
    }

    @Test func oneWebViewCallbackArrivesPerAttachmentAndRemoval() {
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: bundleResources())
        )
        var changes: [Bool] = []
        driver.onWebViewChange = { changes.append($0 != nil) }

        driver.start(sessionID: UUID()) { _, _ in }
        driver.dispose(reason: .operator)
        driver.start(sessionID: UUID()) { _, _ in }

        #expect(changes == [true, false, true])
    }

    @Test func failureCleanupCannotTearDownAReentrantReplacementSession() async {
        let sessionID = UUID()
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: bundleResources())
        )
        var initialObservations: [HostObservation] = []
        var replacementObservations: [HostObservation] = []
        var didReplace = false
        driver.start(sessionID: sessionID) { _, observation in
            initialObservations.append(observation)
            guard observation == .failed(.webglUnavailable), !didReplace else {
                return
            }
            didReplace = true
            driver.start(sessionID: sessionID) { _, observation in
                replacementObservations.append(observation)
            }
        }

        driver.acceptSerializedObservationForTesting(
            observation(
                sessionID: sessionID,
                sequence: 1,
                type: "failed",
                payload: ["code": "webgl_unavailable", "operation": "render"]
            )
        )
        await Task.yield()

        driver.acceptSerializedObservationForTesting(
            observation(
                sessionID: sessionID,
                sequence: 1,
                type: "wrapper_ready",
                payload: ["bridge_version": 2]
            )
        )
        await Task.yield()

        #expect(didReplace)
        #expect(initialObservations == [.failed(.webglUnavailable)])
        #expect(replacementObservations == [.wrapperReady])
    }

    @Test func disposedCleanupCannotTearDownAReentrantReplacementSession() async {
        let sessionID = UUID()
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: bundleResources())
        )
        var initialObservations: [HostObservation] = []
        var replacementObservations: [HostObservation] = []
        var didReplace = false
        driver.start(sessionID: sessionID) { _, observation in
            initialObservations.append(observation)
            guard observation == .disposed, !didReplace else { return }
            didReplace = true
            driver.start(sessionID: sessionID) { _, observation in
                replacementObservations.append(observation)
            }
        }

        driver.acceptSerializedObservationForTesting(
            observation(
                sessionID: sessionID,
                sequence: 1,
                type: "disposed",
                payload: ["reason": "operator"]
            )
        )
        await Task.yield()

        driver.acceptSerializedObservationForTesting(
            observation(
                sessionID: sessionID,
                sequence: 1,
                type: "wrapper_ready",
                payload: ["bridge_version": 2]
            )
        )
        await Task.yield()

        #expect(didReplace)
        #expect(initialObservations == [.disposed])
        #expect(replacementObservations == [.wrapperReady])
    }

    @Test func staleObservationCallbackCannotReachSameIDReplacement() async {
        let sessionID = UUID()
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: bundleResources())
        )
        var replacementObservations: [HostObservation] = []

        driver.start(sessionID: sessionID) { _, _ in }
        driver.acceptSerializedObservationForTesting(
            observation(
                sessionID: sessionID,
                sequence: 1,
                type: "wrapper_ready",
                payload: ["bridge_version": 2]
            )
        )
        driver.start(sessionID: sessionID) { _, observation in
            replacementObservations.append(observation)
        }
        await Task.yield()

        #expect(replacementObservations.isEmpty)
    }

    @Test func staleInvalidObservationCallbackCannotFailSameIDReplacement() async {
        let sessionID = UUID()
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: bundleResources())
        )
        var replacementObservations: [HostObservation] = []

        driver.start(sessionID: sessionID) { _, _ in }
        driver.acceptSerializedObservationForTesting("{not-json")
        driver.start(sessionID: sessionID) { _, observation in
            replacementObservations.append(observation)
        }
        await Task.yield()

        #expect(replacementObservations.isEmpty)
    }

    @Test func stalePolicyCallbackCannotFailSameIDReplacement() async {
        let sessionID = UUID()
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: bundleResources())
        )
        var oldPolicy: NavigationPolicy?
        var replacementObservations: [HostObservation] = []
        driver.onWebViewChange = { webView in
            if oldPolicy == nil {
                oldPolicy = webView?.navigationDelegate as? NavigationPolicy
            }
        }

        driver.start(sessionID: sessionID) { _, _ in }
        #expect(oldPolicy != nil)
        _ = oldPolicy?.decide(
            NavigationRequest(
                url: URL(string: "https://example.com")!,
                isMainFrame: true,
                navigationType: .other
            )
        )
        driver.start(sessionID: sessionID) { _, observation in
            replacementObservations.append(observation)
        }
        await Task.yield()

        #expect(replacementObservations.isEmpty)
    }

    @Test func staleBridgeCallbackCannotFailSameIDReplacement() async {
        let sessionID = UUID()
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: bundleResources())
        )
        var replacementObservations: [HostObservation] = []

        driver.start(sessionID: sessionID) { _, observation in
            replacementObservations.append(observation)
        }
        driver.triggerBridgeFailureForTesting()
        driver.start(sessionID: sessionID) { _, observation in
            replacementObservations.append(observation)
        }
        await Task.yield()

        #expect(replacementObservations.isEmpty)
    }

    @Test func decodedObservationsForwardThroughTheDriver() async throws {
        let sessionID = UUID()
        let driver = WebKitAvatarRendererDriver(
            resourceProvider: RendererResourceProvider(resources: bundleResources())
        )
        var observations: [HostObservation] = []
        driver.start(sessionID: sessionID) { _, observation in
            observations.append(observation)
        }

        driver.acceptSerializedObservationForTesting(
            observation(
                sessionID: sessionID,
                sequence: 1,
                type: "wrapper_ready",
                payload: ["bridge_version": 2]
            )
        )
        await Task.yield()

        driver.acceptSerializedObservationForTesting(
            observation(
                sessionID: sessionID,
                sequence: 2,
                type: "renderer_ready",
                payload: ["webgl": "webgl2"]
            )
        )
        await Task.yield()

        #expect(observations == [.wrapperReady, .rendererReady])
    }

    private func bundleResources() -> [String: Data] {
        [
            "/bundle/index.html": Data("html".utf8),
            "/bundle/app.js": Data("js".utf8),
            "/bundle/styles.css": Data("css".utf8),
            "/bundle/bundle-manifest.json": Data("manifest".utf8),
            "/bundle/bundle-metafile.json": Data("metafile".utf8),
        ]
    }

    private func observation(
        sessionID: UUID,
        sequence: UInt64,
        type: String,
        payload: [String: Any]
    ) -> String {
        let object: [String: Any] = [
            "schema": BridgeContract.observationSchema,
            "session_id": sessionID.uuidString.lowercased(),
            "sequence": sequence,
            "caused_by_sequence": NSNull(),
            "type": type,
            "payload": payload,
        ]
        return String(
            data: try! JSONSerialization.data(withJSONObject: object),
            encoding: .utf8
        )!
    }
}

@MainActor
private final class TemporaryApplicationBundle {
    let rootURL: URL
    let resourceBundleURL: URL
    let bundle: Bundle

    init(resources: [String: Data]?) throws {
        let fileManager = FileManager.default
        rootURL = fileManager.temporaryDirectory
            .appendingPathComponent("Miller Avatar Test \(UUID().uuidString).app")
        resourceBundleURL = rootURL
            .appendingPathComponent("Contents", isDirectory: true)
            .appendingPathComponent("Resources", isDirectory: true)
            .appendingPathComponent("MillerAvatar_MillerAvatarHost.bundle", isDirectory: true)
        try fileManager.createDirectory(
            at: rootURL.appendingPathComponent("Contents", isDirectory: true),
            withIntermediateDirectories: true
        )
        try Data(applicationInfoPlist.utf8).write(
            to: rootURL.appendingPathComponent("Contents/Info.plist")
        )
        if let resources {
            try TemporaryResourceBundle.write(
                resources: resources,
                to: resourceBundleURL,
                fileManager: fileManager
            )
        }
        guard let bundle = Bundle(url: rootURL) else {
            throw LocalSchemeError.invalidInventory
        }
        self.bundle = bundle
    }

    deinit {
        try? FileManager.default.removeItem(at: rootURL)
    }
}

@MainActor
private final class TemporaryResourceBundle {
    let rootURL: URL
    let bundle: Bundle

    init(
        resources: [String: Data],
        pathExtension: String = "bundle"
    ) throws {
        let fileManager = FileManager.default
        rootURL = fileManager.temporaryDirectory
            .appendingPathComponent(
                "Miller Avatar Fallback \(UUID().uuidString).\(pathExtension)"
            )
        try Self.write(resources: resources, to: rootURL, fileManager: fileManager)
        guard let bundle = Bundle(url: rootURL) else {
            throw LocalSchemeError.invalidInventory
        }
        self.bundle = bundle
    }

    static func write(
        resources: [String: Data],
        to rootURL: URL,
        fileManager: FileManager
    ) throws {
        try fileManager.createDirectory(at: rootURL, withIntermediateDirectories: true)
        try Data(resourceBundleInfoPlist.utf8).write(
            to: rootURL.appendingPathComponent("Info.plist")
        )
        let webURL = rootURL.appendingPathComponent("Web", isDirectory: true)
        try fileManager.createDirectory(at: webURL, withIntermediateDirectories: true)
        for (path, data) in resources {
            let name = String(path.dropFirst("/bundle/".count))
            try data.write(to: webURL.appendingPathComponent(name))
        }
    }

    deinit {
        try? FileManager.default.removeItem(at: rootURL)
    }
}

private let applicationInfoPlist = """
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleIdentifier</key><string>ai.millrace.test.avatar</string>
<key>CFBundlePackageType</key><string>APPL</string>
</dict></plist>
"""

private let resourceBundleInfoPlist = """
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleIdentifier</key><string>ai.millrace.test.avatar.host</string>
<key>CFBundlePackageType</key><string>BNDL</string>
</dict></plist>
"""
