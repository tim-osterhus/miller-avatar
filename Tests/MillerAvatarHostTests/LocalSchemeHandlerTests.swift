import Foundation
import Dispatch
import Testing
@testable import MillerAvatarHost

@MainActor
@Suite struct LocalSchemeHandlerTests {
    private let sessionID = UUID(uuidString: "11111111-1111-1111-1111-111111111111")!
    private let assetToken = UUID(uuidString: "22222222-2222-2222-2222-222222222222")!

    @Test func servesOnlyManifestPathsAndTheActiveAsset() throws {
        let handler = makeHandler()

        let entry = try handler.response(for: request("/bundle/index.html"))
        #expect(entry.mimeType == "text/html; charset=utf-8")
        #expect(entry.data == Data("html".utf8))

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

    private func request(_ path: String) -> URLRequest {
        URLRequest(url: URL(string: "miller-avatar-local://app\(path)")!)
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
