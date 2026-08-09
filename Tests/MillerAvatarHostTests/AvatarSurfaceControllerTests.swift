import AppKit
import Foundation
import MillerAvatarCore
import Testing
@testable import MillerAvatarHost
@preconcurrency import WebKit

@MainActor
@Suite struct AvatarSurfaceControllerTests {
    @Test func timerStateInvalidationRejectsLaterInstallation() {
        let state = AvatarSurfaceTimerState()
        state.invalidate()
        let timer = Timer(timeInterval: 1, repeats: false) { _ in }

        state.install(timer)

        #expect(!timer.isValid)
        #expect(!state.hasTimer)
    }

    @Test func repeatedStartCreatesOneRendererAndOneDeadlineTimer() {
        let driver = RecordingSurfaceDriver()
        let timer = RecordingSurfaceTimer()
        let surface = AvatarSurfaceController(driver: driver, timer: timer)

        surface.start()
        surface.start()

        #expect(driver.startCount == 1)
        #expect(timer.startCount == 1)
        #expect(timer.interval == 0.25)
    }

    @Test func emptySurfaceHasNoSnapshotTransitionUntilOrchestratorChanges() {
        let driver = RecordingSurfaceDriver()
        let timer = RecordingSurfaceTimer()
        let surface = AvatarSurfaceController(driver: driver, timer: timer)
        var snapshots: [HostSnapshot] = []

        #expect(surface.view.subviews.isEmpty)
        surface.onSnapshot = { snapshots.append($0) }
        #expect(snapshots.isEmpty)

        surface.start()

        #expect(!snapshots.isEmpty)
        #expect(surface.snapshot.lifecycle == .startingRenderer)
        #expect(surface.view.subviews.isEmpty)
    }

    @Test func rendererViewsReplaceWithFourEdgeConstraints() {
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        let first = WKWebView()
        let replacement = WKWebView()

        driver.emitView(first)
        #expect(surface.view.subviews.count == 1)
        #expect(surface.view.subviews.first === first)
        #expect(surface.view.constraints.count == 4)

        driver.emitView(replacement)
        #expect(first.superview == nil)
        #expect(surface.view.subviews == [replacement])
        #expect(surface.view.constraints.count == 4)
        #expect(surface.view.constraints.allSatisfy { constraint in
            constraint.firstItem as AnyObject === replacement
                || constraint.secondItem as AnyObject === replacement
        })
    }

    @Test func disposeDetachesTheRendererAndInvalidatesTheTimerOnce() {
        let driver = RecordingSurfaceDriver()
        let timer = RecordingSurfaceTimer()
        let surface = AvatarSurfaceController(driver: driver, timer: timer)
        surface.start()
        driver.emitView(WKWebView())

        surface.dispose()
        surface.dispose(reason: .termination)

        #expect(surface.view.subviews.isEmpty)
        #expect(driver.disposeReasons == [.operator])
        #expect(timer.invalidateCount == 1)
    }

    @Test func lateWebViewChangesAfterDisposeCannotReattachRenderer() throws {
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        driver.emitView(WKWebView())
        let lateCallback = try #require(driver.onWebViewChange)

        surface.dispose()
        #expect(surface.view.subviews.isEmpty)

        lateCallback(WKWebView())

        #expect(surface.view.subviews.isEmpty)
    }

    @Test func deinitializationBestEffortInvalidatesDeadlineTimer() {
        let timer = RecordingSurfaceTimer()
        var surface: AvatarSurfaceController? = AvatarSurfaceController(
            driver: RecordingSurfaceDriver(),
            timer: timer
        )
        surface?.start()

        surface = nil

        #expect(timer.invalidateCount == 1)
    }

    @Test func callbacksAreForwardedOnTheMainActorAfterSessionValidation() {
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        var observations: [HostObservation] = []
        var callbackWasOnMainThread = false
        surface.onObservation = { observation in
            observations.append(observation)
            callbackWasOnMainThread = Thread.isMainThread
        }

        surface.start()
        let sessionID = try! #require(driver.sessionID)
        driver.emitObservation(.wrapperReady, for: sessionID)
        driver.emitObservation(.wrapperReady, for: UUID())

        #expect(observations == [.wrapperReady])
        #expect(callbackWasOnMainThread)
    }

    @Test
    func profileLoadRequiresRendererReadyAtEntry() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        let store = makeProfileStore(root: root)
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )

        #expect(await surface.load(profileID: profile.id, from: store) == .notReady)
        surface.dispose()
        #expect(await surface.load(profileID: profile.id, from: store) == .disposed)
    }

    @Test
    func profileLoadDispositionMapsEveryStoreError() async throws {
        let mappings: [(AvatarProfileStoreError, ProfileLoadDisposition)] = [
            (.unknownProfile, .rejected(.unknownProfile)),
            (.corruptStore, .rejected(.corruptStore)),
            (.invalidDisplayName, .rejected(.corruptStore)),
            (.profileLimit, .rejected(.corruptStore)),
            (.motionLimit, .rejected(.corruptStore)),
            (.unknownMotion, .rejected(.corruptStore)),
            (.motionQuarantined, .rejected(.corruptStore)),
            (.persistenceFailed, .rejected(.persistenceFailed)),
            (.bookmarkCreationFailed, .rejected(.modelUnavailable)),
            (.bookmarkResolutionFailed, .rejected(.modelUnavailable)),
            (.securityScopeDenied, .rejected(.modelUnavailable)),
            (.assetRejected, .rejected(.modelRejected)),
            (.resourceLimit, .rejected(.modelRejected)),
            (.motionRejected, .rejected(.modelRejected)),
            (.quarantined, .rejected(.modelQuarantined)),
            (.cancelled, .superseded),
        ]

        for (error, expected) in mappings {
            let root = try temporaryDirectory()
            defer { try? FileManager.default.removeItem(at: root) }
            let fileOperations = ProfileStoreFileOperations(
                read: { _ in throw error },
                write: { _, _ in },
                fileFsync: { _ in },
                rename: { _, _ in },
                reopen: { _ in nil },
                directoryFsync: { _ in },
                unlink: { _ in }
            )
            let store = makeProfileStore(root: root, fileOperations: fileOperations)
            let driver = RecordingSurfaceDriver()
            let surface = AvatarSurfaceController(
                driver: driver,
                timer: RecordingSurfaceTimer()
            )
            surface.start()
            let sessionID = try #require(driver.sessionID)
            driver.emitObservation(.wrapperReady, for: sessionID)
            driver.emitObservation(.rendererReady, for: sessionID)

            #expect(await surface.load(profileID: UUID(), from: store) == expected, "(error)")
            surface.dispose()
        }
    }

    @Test
    func profileLoadInstallsOnePreparedProfileAndSendsOneLoadCommand() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        let sessionID = try #require(driver.sessionID)
        driver.emitObservation(.wrapperReady, for: sessionID)
        driver.emitObservation(.rendererReady, for: sessionID)
        let store = makeProfileStore(root: root)
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )

        #expect(await surface.load(profileID: profile.id, from: store) == .accepted)
        #expect(driver.installedProfiles.count == 1)
        #expect(driver.commands.filter {
            if case .loadProfile = $0 { return true }
            return false
        }.count == 1)
    }

    @Test
    func profileLoadDisposalAtThePostAwaitSeamCannotInstallOrSend() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let gate = SurfaceCaptureGate()
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        let sessionID = try #require(driver.sessionID)
        driver.emitObservation(.wrapperReady, for: sessionID)
        driver.emitObservation(.rendererReady, for: sessionID)
        let store = makeProfileStore(root: root, captureGate: gate)
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        gate.blockNextCapture()

        let load = Task { await surface.load(profileID: profile.id, from: store) }
        try await waitUntil { gate.didEnter }
        surface.dispose()
        gate.release()

        #expect(await load.value == .superseded)
        #expect(driver.installedProfiles.isEmpty)
        #expect(driver.commands.filter {
            if case .loadProfile = $0 { return true }
            return false
        }.isEmpty)
    }

    @Test
    func profileLoadRendererFailureAtThePostAwaitSeamCannotInstallOrSend() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let gate = SurfaceCaptureGate()
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        let sessionID = try #require(driver.sessionID)
        driver.emitObservation(.wrapperReady, for: sessionID)
        driver.emitObservation(.rendererReady, for: sessionID)
        let store = makeProfileStore(root: root, captureGate: gate)
        let profile = try await store.importModel(
            at: root.appendingPathComponent("model.vrm"),
            displayName: "Avatar"
        )
        gate.blockNextCapture()

        let load = Task { await surface.load(profileID: profile.id, from: store) }
        try await waitUntil { gate.didEnter }
        driver.emitObservation(.failed(.renderFailed), for: sessionID)
        gate.release()

        #expect(await load.value == .superseded)
        #expect(driver.installedProfiles.isEmpty)
        #expect(driver.commands.filter {
            if case .loadProfile = $0 { return true }
            return false
        }.isEmpty)
    }

    @Test
    func newerProfileLoadSupersedesAnOlderMaterialization() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let gate = SurfaceCaptureGate()
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        let sessionID = try #require(driver.sessionID)
        driver.emitObservation(.wrapperReady, for: sessionID)
        driver.emitObservation(.rendererReady, for: sessionID)
        let store = makeProfileStore(root: root, captureGate: gate)
        let first = try await store.importModel(
            at: root.appendingPathComponent("first.vrm"),
            displayName: "First"
        )
        let second = try await store.importModel(
            at: root.appendingPathComponent("second.vrm"),
            displayName: "Second"
        )
        gate.blockNextCapture()

        let firstLoad = Task {
            await surface.load(profileID: first.id, from: store)
        }
        try await waitUntil { gate.didEnter }
        let secondLoad = Task {
            await surface.load(profileID: second.id, from: store)
        }
        gate.release()

        #expect(await firstLoad.value == .superseded)
        #expect(await secondLoad.value == .accepted)
        #expect(driver.installedProfiles.count == 1)
        #expect(driver.commands.filter {
            if case .loadProfile = $0 { return true }
            return false
        }.count == 1)
    }

    @Test
    func callerOwnedFreshSessionsSupportProfileReplacementAndRetryWithoutStaleMutation() async throws {
        let root = try temporaryDirectory()
        defer { try? FileManager.default.removeItem(at: root) }
        let store = makeReplacementProfileStore(root: root)
        let profileA = try await store.importModel(
            at: root.appendingPathComponent("profile-a.vrm"),
            displayName: "Profile A"
        )
        let profileB = try await store.importModel(
            at: root.appendingPathComponent("profile-b.vrm"),
            displayName: "Profile B"
        )
        #expect(profileA.profileRevision == 1)
        #expect(profileB.profileRevision == 1)

        let driverA = RecordingSurfaceDriver()
        let surfaceA = AvatarSurfaceController(
            driver: driverA,
            timer: RecordingSurfaceTimer()
        )
        surfaceA.start()
        let sessionA = try #require(driverA.sessionID)
        driverA.emitObservation(.wrapperReady, for: sessionA)
        driverA.emitObservation(.rendererReady, for: sessionA)
        #expect(await surfaceA.load(profileID: profileA.id, from: store) == .accepted)
        surfaceA.dispose()

        let driverB = RecordingSurfaceDriver()
        let surfaceB = AvatarSurfaceController(
            driver: driverB,
            timer: RecordingSurfaceTimer()
        )
        surfaceB.start()
        let sessionB = try #require(driverB.sessionID)
        driverB.emitObservation(.wrapperReady, for: sessionB)
        driverB.emitObservation(.rendererReady, for: sessionB)
        #expect(await surfaceB.load(profileID: profileB.id, from: store) == .accepted)
        surfaceB.dispose()

        try await store.recordRendererFailure(id: profileA.id)
        try await store.retry(id: profileA.id)

        let driverRetry = RecordingSurfaceDriver()
        let surfaceRetry = AvatarSurfaceController(
            driver: driverRetry,
            timer: RecordingSurfaceTimer()
        )
        surfaceRetry.start()
        let retrySession = try #require(driverRetry.sessionID)
        driverRetry.emitObservation(.wrapperReady, for: retrySession)
        driverRetry.emitObservation(.rendererReady, for: retrySession)
        #expect(await surfaceRetry.load(profileID: profileA.id, from: store) == .accepted)
        let currentSnapshot = surfaceRetry.snapshot

        driverA.emitObservation(.failed(.renderFailed), for: sessionA)
        driverB.emitObservation(.failed(.renderFailed), for: sessionB)

        #expect(surfaceRetry.snapshot == currentSnapshot)
        #expect(loadProfiles(driverA.commands).count == 1)
        #expect(loadProfiles(driverB.commands).count == 1)
        #expect(loadProfiles(driverRetry.commands).count == 1)
        #expect(driverA.installedProfiles.count == 1)
        #expect(driverB.installedProfiles.count == 1)
        #expect(driverRetry.installedProfiles.count == 1)
        #expect(driverA.installedProfiles[0].model.token != driverB.installedProfiles[0].model.token)
        #expect(driverA.installedProfiles[0].model.token == driverRetry.installedProfiles[0].model.token)

        surfaceRetry.dispose()
    }

    @Test func surfaceAndInstalledRendererDoNotEnterInteractionPaths() {
        let driver = RecordingSurfaceDriver()
        let surface = AvatarSurfaceController(
            driver: driver,
            timer: RecordingSurfaceTimer()
        )
        surface.start()
        let webView = NoninteractiveTestWebView()
        driver.emitView(webView)

        for view in [surface.view, webView] {
            #expect(!view.acceptsFirstResponder)
            #expect(view.hitTest(NSPoint(x: 1, y: 1)) == nil)
            #expect(!view.isAccessibilityElement())
            #expect(view.accessibilityChildren()?.isEmpty == true)
            #expect(view.registeredDraggedTypes.isEmpty)
            #expect(view.nextKeyView == nil)
            #expect(view.previousKeyView == nil)
        }
    }
}

@MainActor
private final class RecordingSurfaceDriver: AvatarSurfaceRendererDriving {
    var onWebViewChange: ((WKWebView?) -> Void)?
    private(set) var startCount = 0
    private(set) var disposeReasons: [DisposalReason] = []
    private(set) var sessionID: UUID?
    private(set) var installedProfiles: [LoadedAvatarProfile] = []
    private(set) var commands: [BridgeCommand] = []
    private var receive: ((UUID, HostObservation) -> Void)?

    func start(
        sessionID: UUID,
        receive: @escaping (UUID, HostObservation) -> Void
    ) {
        startCount += 1
        self.sessionID = sessionID
        self.receive = receive
    }

    func install(_ profile: LoadedAvatarProfile) -> Bool {
        installedProfiles.append(profile)
        return true
    }

    func send(_ command: BridgeCommand) {
        commands.append(command)
    }

    func dispose(reason: DisposalReason) {
        disposeReasons.append(reason)
        onWebViewChange?(nil)
    }

    func emitView(_ webView: WKWebView?) {
        onWebViewChange?(webView)
    }

    func emitObservation(_ observation: HostObservation, for sessionID: UUID) {
        receive?(sessionID, observation)
    }
}

private final class SurfaceCaptureGate: @unchecked Sendable {
    private let lock = NSLock()
    private var blocksNextCapture = false
    private var enteredCapture = false
    private var releasedCapture = false

    var didEnter: Bool {
        lock.lock()
        defer { lock.unlock() }
        return enteredCapture
    }

    func blockNextCapture() {
        lock.lock()
        blocksNextCapture = true
        releasedCapture = false
        lock.unlock()
    }

    func captureIfBlocked() {
        lock.lock()
        let shouldBlock = blocksNextCapture
        if shouldBlock {
            blocksNextCapture = false
            enteredCapture = true
        }
        lock.unlock()

        guard shouldBlock else { return }
        while true {
            lock.lock()
            let released = releasedCapture
            lock.unlock()
            if released { return }
            Thread.sleep(forTimeInterval: 0.001)
        }
    }

    func release() {
        lock.lock()
        releasedCapture = true
        lock.unlock()
    }
}

private final class SurfaceSecurityScope: SecurityScopedAccess, @unchecked Sendable {
    func startAccessing(_ url: URL) -> Bool { true }
    func stopAccessing(_ url: URL) {}
}

private func makeProfileStore(
    root: URL,
    captureGate: SurfaceCaptureGate? = nil,
    fileOperations: ProfileStoreFileOperations = .production
) -> AvatarProfileStore {
    let modelBytes = Data([1, 2, 3, 4])
    let model = AdmittedAsset(
        token: UUID(),
        bytes: modelBytes,
        summary: AssetAdmissionSummary(
            nodeCount: 1,
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
    )
    return AvatarProfileStore(
        root: root,
        dependencies: AvatarProfileStoreDependencies(
            admission: { _ in .admitted(model) },
            bookmarkCreator: { url in Data(url.path.utf8) },
            bookmarkResolver: { bookmark in
                guard let path = String(data: bookmark, encoding: .utf8) else {
                    throw AvatarProfileStoreError.bookmarkResolutionFailed
                }
                return AvatarResolvedBookmark(
                    url: URL(fileURLWithPath: path),
                    isStale: false
                )
            },
            securityScope: SurfaceSecurityScope(),
            capture: { _, _ in
                captureGate?.captureIfBlocked()
                return modelBytes
            }
        ),
        fileOperations: fileOperations
    )
}

private func loadProfiles(_ commands: [BridgeCommand]) -> [LoadProfilePayload] {
    commands.compactMap { command in
        guard case .loadProfile(let payload) = command else { return nil }
        return payload
    }
}

private func makeReplacementProfileStore(root: URL) -> AvatarProfileStore {
    let modelABytes = Data([1, 2, 3, 4])
    let modelBBytes = Data([5, 6, 7, 8])
    let modelA = AdmittedAsset(
        token: UUID(uuidString: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")!,
        bytes: modelABytes,
        summary: AssetAdmissionSummary(
            nodeCount: 1,
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
    )
    let modelB = AdmittedAsset(
        token: UUID(uuidString: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb")!,
        bytes: modelBBytes,
        summary: modelA.summary
    )
    return AvatarProfileStore(
        root: root,
        dependencies: AvatarProfileStoreDependencies(
            admission: { bytes in
                bytes == modelABytes ? .admitted(modelA) : .admitted(modelB)
            },
            bookmarkCreator: { url in Data(url.path.utf8) },
            bookmarkResolver: { bookmark in
                guard let path = String(data: bookmark, encoding: .utf8) else {
                    throw AvatarProfileStoreError.bookmarkResolutionFailed
                }
                return AvatarResolvedBookmark(
                    url: URL(fileURLWithPath: path),
                    isStale: false
                )
            },
            securityScope: SurfaceSecurityScope(),
            capture: { url, _ in
                url.lastPathComponent == "profile-b.vrm" ? modelBBytes : modelABytes
            }
        )
    )
}

private func temporaryDirectory() throws -> URL {
    let root = FileManager.default.temporaryDirectory
        .appendingPathComponent("miller-avatar-surface-tests", isDirectory: true)
        .appendingPathComponent(UUID().uuidString, isDirectory: true)
    try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
    return root
}

private func waitUntil(
    _ condition: @escaping @Sendable () -> Bool
) async throws {
    for _ in 0..<2_000 {
        if condition() { return }
        try await Task.sleep(nanoseconds: 1_000_000)
    }
    throw SurfaceTestFailure.timeout
}

private enum SurfaceTestFailure: Error {
    case timeout
}

private final class RecordingSurfaceTimer: AvatarSurfaceTimer {
    private nonisolated let state = RecordingSurfaceTimerState()

    var startCount: Int { state.startCount }
    var invalidateCount: Int { state.invalidateCount }
    var interval: TimeInterval? { state.interval }

    func start(
        interval: TimeInterval,
        handler: @escaping @MainActor @Sendable () -> Void
    ) {
        state.start(interval: interval, handler: handler)
    }

    nonisolated func invalidate() {
        state.invalidate()
    }
}

private final class RecordingSurfaceTimerState: @unchecked Sendable {
    private let lock = NSLock()
    private var storedStartCount = 0
    private var storedInvalidateCount = 0
    private var storedInterval: TimeInterval?
    private var handler: (@MainActor @Sendable () -> Void)?

    var startCount: Int {
        lock.lock()
        defer { lock.unlock() }
        return storedStartCount
    }

    var invalidateCount: Int {
        lock.lock()
        defer { lock.unlock() }
        return storedInvalidateCount
    }

    var interval: TimeInterval? {
        lock.lock()
        defer { lock.unlock() }
        return storedInterval
    }

    func start(
        interval: TimeInterval,
        handler: @escaping @MainActor @Sendable () -> Void
    ) {
        lock.lock()
        storedStartCount += 1
        storedInterval = interval
        self.handler = handler
        lock.unlock()
    }

    func invalidate() {
        lock.lock()
        storedInvalidateCount += 1
        handler = nil
        lock.unlock()
    }
}

@MainActor
private final class NoninteractiveTestWebView: WKWebView {
    override var acceptsFirstResponder: Bool { false }

    override func hitTest(_ point: NSPoint) -> NSView? { nil }

    override func accessibilityIsIgnored() -> Bool { true }

    override func accessibilityChildren() -> [Any]? { [] }

    override var registeredDraggedTypes: [NSPasteboard.PasteboardType] { [] }

    override func registerForDraggedTypes(_ types: [NSPasteboard.PasteboardType]) {}
}
