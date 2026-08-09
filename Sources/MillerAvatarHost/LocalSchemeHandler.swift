import Foundation
import CryptoKit
import MillerAvatarCore
@preconcurrency import WebKit

package enum LocalSchemeError: Error, Equatable, Sendable {
    case rejected
    case staleSession
    case invalidInventory
}

package struct LocalSchemeResponse: Equatable, Sendable {
    package let url: URL
    package let mimeType: String
    package let headers: [String: String]
    package let data: Data
}

package struct LocalSchemeResourceRecord: Equatable, Sendable {
    package let path: String
    package let mimeType: String
    package let byteCount: Int
    package let sha256: String

    package init(
        path: String,
        mimeType: String,
        byteCount: Int,
        sha256: String
    ) {
        self.path = path
        self.mimeType = mimeType
        self.byteCount = byteCount
        self.sha256 = sha256
    }

    package static func make(path: String, data: Data) -> Self {
        Self(
            path: path,
            mimeType: LocalSchemeBundlePolicy.mimeType(for: path) ?? "",
            byteCount: data.count,
            sha256: LocalSchemeBundlePolicy.sha256(of: data)
        )
    }
}

enum LocalSchemeBundlePolicy {
    static let mimeTypes: [String: String] = [
        "/bundle/index.html": "text/html; charset=utf-8",
        "/bundle/app.js": "text/javascript; charset=utf-8",
        "/bundle/styles.css": "text/css; charset=utf-8",
        "/bundle/bundle-manifest.json": "application/json; charset=utf-8",
        "/bundle/bundle-metafile.json": "application/json; charset=utf-8",
    ]

    static func mimeType(for path: String) -> String? {
        mimeTypes[path]
    }

    static func sha256(of data: Data) -> String {
        SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
    }
}

private struct LocalSchemeResourceIdentity: Equatable {
    let url: URL
    let generation: UInt64
}

private struct LocalSchemeStoredResource {
    let token: UUID
    let fileExtension: String
    let mimeType: String
    var data: Data?
}

private struct LocalSchemeResourceSet {
    let generation: UInt64
    let modelURL: URL
    var servingEnabled: Bool
    var resources: [URL: LocalSchemeStoredResource]
}

private final class LocalSchemeProfileResourceStore: @unchecked Sendable {
    private let lock = NSLock()
    private let sessionID: UUID
    private var active: LocalSchemeResourceSet?
    private var nextGeneration: UInt64 = 0

    init(sessionID: UUID) {
        self.sessionID = sessionID
    }

    var activeURL: URL {
        return lock.withLock {
            active?.modelURL ?? Self.resourceURL(
                sessionID: sessionID,
                token: UUID(uuidString: "00000000-0000-4000-8000-000000000000")!,
                fileExtension: "vrm"
            )
        }
    }

    var retainedByteCount: Int {
        lock.withLock {
            active?.resources.values.reduce(into: 0) { total, resource in
                total += resource.data?.count ?? 0
            } ?? 0
        }
    }

    func install(
        modelToken: UUID,
        modelData: Data,
        motions: [UUID: Data]
    ) -> Bool {
        guard motions.count <= AvatarMotionRole.allCases.count else { return false }

        var nextResources: [URL: LocalSchemeStoredResource] = [:]
        let nextModelURL = Self.resourceURL(
            sessionID: sessionID,
            token: modelToken,
            fileExtension: "vrm"
        )
        nextResources[nextModelURL] = LocalSchemeStoredResource(
            token: modelToken,
            fileExtension: "vrm",
            mimeType: "model/gltf-binary",
            data: modelData
        )
        for token in motions.keys.sorted(by: { $0.uuidString < $1.uuidString }) {
            let url = Self.resourceURL(
                sessionID: sessionID,
                token: token,
                fileExtension: "vrma"
            )
            guard nextResources[url] == nil else { return false }
            nextResources[url] = LocalSchemeStoredResource(
                token: token,
                fileExtension: "vrma",
                mimeType: "model/gltf-binary",
                data: motions[token]!
            )
        }

        return lock.withLock {
            guard nextGeneration < UInt64.max else { return false }
            nextGeneration += 1
            active = LocalSchemeResourceSet(
                generation: nextGeneration,
                modelURL: nextModelURL,
                servingEnabled: true,
                resources: nextResources
            )
            return true
        }
    }

    func isKnownURL(_ candidate: URL) -> Bool {
        lock.withLock { active?.resources[candidate] != nil }
    }

    func resource(for candidate: URL) -> (mimeType: String, data: Data)? {
        lock.withLock {
            guard let active,
                  active.servingEnabled,
                  let resource = active.resources[candidate],
                  let data = resource.data
            else {
                return nil
            }
            return (resource.mimeType, data)
        }
    }

    func identity(for candidate: URL) -> LocalSchemeResourceIdentity? {
        lock.withLock {
            guard let active,
                  active.servingEnabled,
                  active.resources[candidate]?.data != nil
            else {
                return nil
            }
            return LocalSchemeResourceIdentity(
                url: candidate,
                generation: active.generation
            )
        }
    }

    func revokeServing() {
        lock.withLock {
            active?.servingEnabled = false
        }
    }

    func releaseBytes() {
        lock.withLock {
            if var active {
                active.servingEnabled = false
                for url in active.resources.keys {
                    active.resources[url]?.data = nil
                }
                self.active = active
            }
        }
    }

    func release(identity: LocalSchemeResourceIdentity?) {
        lock.withLock {
            guard let identity else { return }

            if active?.generation == identity.generation {
                active?.resources[identity.url]?.data = nil
            }
        }
    }

    private static func resourceURL(
        sessionID: UUID,
        token: UUID,
        fileExtension: String
    ) -> URL {
        URL(
            string: "miller-avatar-local://app/session/"
                + "\(sessionID.uuidString.lowercased())/"
                + "\(token.uuidString.lowercased()).\(fileExtension)"
        )!
    }
}

package protocol LocalSchemeTaskSink: AnyObject {
    var request: URLRequest { get }
    func receive(response: URLResponse)
    func receive(data: Data)
    func finish()
    func fail(with error: any Error)
}

public final class LocalSchemeHandler: NSObject, WKURLSchemeHandler {
    public static let scheme = "miller-avatar-local"
    public static let host = "app"
    public static let origin = "miller-avatar-local://app"
    public static func entrypointURL(for sessionID: UUID) -> URL {
        URL(
            string: origin + "/session/"
                + sessionID.uuidString.lowercased()
                + "/bundle/index.html"
        )!
    }

    private static let contentSecurityPolicy = """
    default-src 'none'; script-src 'self'; style-src 'self'; \
    img-src 'self' blob: data:; connect-src 'self' blob: miller-avatar-local:; \
    font-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; \
    child-src 'none'; worker-src 'none'; manifest-src 'none'; \
    base-uri 'none'; form-action 'none'; navigate-to 'none'
    """

    package var activeAssetURL: URL { resourceStore.activeURL }

    package var entrypointURL: URL {
        Self.entrypointURL(for: lease.id)
    }

    private let lease: RendererSessionLease
    private let sessionController: RendererSessionController
    private let bundledResources: [String: Data]
    private let resourceStore: LocalSchemeProfileResourceStore
    private let scheduleDelivery: (@escaping () -> Void) -> Void
    private let lock = NSLock()
    private let deliveryGate = SerializedCallbackGate(
        label: "miller-avatar.scheme-delivery"
    )
    // Access is confined to sessionController.synchronize -> deliveryGate.
    private nonisolated(unsafe) var deliveries: [UUID: LocalSchemeDelivery] = [:]
    private nonisolated(unsafe) var deliveryIDsByTask: [ObjectIdentifier: UUID] = [:]
    private nonisolated(unsafe) var taskIDsByDelivery: [UUID: ObjectIdentifier] = [:]

    internal var retainedAssetByteCount: Int {
        resourceStore.retainedByteCount
    }

    package init(
        lease: RendererSessionLease,
        sessionController: RendererSessionController,
        bundledResources: [String: Data],
        resourceRecords: [LocalSchemeResourceRecord],
        scheduleDelivery: @escaping (@escaping () -> Void) -> Void = { $0() }
    ) throws {
        guard Self.validInventory(
            resources: bundledResources,
            records: resourceRecords
        )
        else {
            throw LocalSchemeError.invalidInventory
        }
        self.lease = lease
        self.sessionController = sessionController
        self.bundledResources = bundledResources
        self.scheduleDelivery = scheduleDelivery
        resourceStore = LocalSchemeProfileResourceStore(sessionID: lease.id)
    }

    @discardableResult
    package func install(_ profile: LoadedAvatarProfile) -> Bool {
        var motions: [UUID: AdmittedMotion] = [:]
        for binding in profile.motionBindings.values {
            guard case .ready(_, let motion) = binding else { continue }
            if let existing = motions[motion.token] {
                guard existing.bytes == motion.bytes else { return false }
                continue
            }
            motions[motion.token] = motion
        }
        guard motions.count <= AvatarMotionRole.allCases.count else {
            return false
        }

        var installed = false
        let admitted = sessionController.perform(for: lease) {
            installed = resourceStore.install(
                modelToken: profile.model.token,
                modelData: profile.model.bytes,
                motions: motions.mapValues(\.bytes)
            )
        }
        return admitted && installed
    }

    package func response(for request: URLRequest) throws -> LocalSchemeResponse {
        var response: LocalSchemeResponse?
        var failure: (any Error)?
        let admitted = sessionController.perform(for: lease) {
            do {
                response = try responseUnchecked(for: request)
            } catch {
                failure = error
            }
        }
        guard admitted else {
            throw LocalSchemeError.staleSession
        }
        if let failure {
            throw failure
        }
        guard let response else {
            throw LocalSchemeError.staleSession
        }
        return response
    }

    private func responseUnchecked(for request: URLRequest) throws -> LocalSchemeResponse {
        let hasConditionalHeader = (request.allHTTPHeaderFields ?? [:]).keys.contains {
            $0.lowercased().hasPrefix("if-")
        }
        guard request.httpMethod == nil || request.httpMethod == "GET",
              request.value(forHTTPHeaderField: "Range") == nil,
              !hasConditionalHeader,
              let url = request.url,
              let path = Self.canonicalPath(for: url)
        else {
            throw LocalSchemeError.rejected
        }

        let data: Data
        let mimeType: String
        if resourceStore.isKnownURL(url) {
            guard let resource = resourceStore.resource(for: url) else {
                throw LocalSchemeError.staleSession
            }
            data = resource.data
            mimeType = resource.mimeType
        } else {
            guard let bundlePath = bundlePath(for: path),
                  let resource = bundledResources[bundlePath],
                  let bundleMIMEType = Self.bundleMIMEType(for: bundlePath)
            else {
                throw LocalSchemeError.rejected
            }
            data = resource
            mimeType = bundleMIMEType
        }

        var headers = [
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            "Content-Type": mimeType,
        ]
        if mimeType == "text/html; charset=utf-8" {
            headers["Content-Security-Policy"] = Self.contentSecurityPolicy
        }
        return LocalSchemeResponse(
            url: url,
            mimeType: mimeType,
            headers: headers,
            data: data
        )
    }

    package func start(_ sink: any LocalSchemeTaskSink) {
        start(sink, taskIdentity: nil)
    }

    private func start(
        _ sink: any LocalSchemeTaskSink,
        taskIdentity: ObjectIdentifier?
    ) {
        let id = UUID()
        var scheduled = false
        var failure: (any Error)?
        let admitted = sessionController.perform(for: lease) {
            do {
                let response = try responseUnchecked(for: sink.request)
                let resourceIdentity = resourceStore.identity(for: response.url)
                let pendingDelivery = LocalSchemeDelivery(
                    response: response,
                    sink: sink,
                    resourceIdentity: resourceIdentity,
                    releaseResource: resourceStore.release
                )
                deliveryGate.sync {
                    lock.withLock {
                        deliveries[id] = pendingDelivery
                        if let taskIdentity {
                            deliveryIDsByTask[taskIdentity] = id
                            taskIDsByDelivery[id] = taskIdentity
                        }
                    }
                }
                scheduleDelivery { [weak self, pendingDelivery] in
                    self?.complete(id: id, delivery: pendingDelivery)
                }
                scheduled = true
            } catch {
                failure = error
            }
        }
        guard admitted, scheduled else {
            sink.fail(with: failure ?? LocalSchemeError.staleSession)
            return
        }
    }

    package nonisolated func cancelAll() {
        sessionController.synchronize {
            deliveryGate.sync {
                let pending = lock.withLock {
                    let pending = Array(deliveries.values)
                    deliveries.removeAll()
                    deliveryIDsByTask.removeAll()
                    taskIDsByDelivery.removeAll()
                    return pending
                }
                pending.forEach { $0.cancel() }
            }
        }
    }

    package func revokeAssetServing() {
        resourceStore.revokeServing()
    }

    package func releaseAssetBytes() {
        resourceStore.releaseBytes()
    }

    public func webView(
        _ webView: WKWebView,
        start urlSchemeTask: any WKURLSchemeTask
    ) {
        start(
            WebKitSchemeTaskSink(task: urlSchemeTask),
            taskIdentity: ObjectIdentifier(urlSchemeTask)
        )
    }

    public func webView(
        _ webView: WKWebView,
        stop urlSchemeTask: any WKURLSchemeTask
    ) {
        let taskIdentity = ObjectIdentifier(urlSchemeTask)
        sessionController.synchronize {
            deliveryGate.sync {
                let pending: LocalSchemeDelivery? = lock.withLock {
                    guard let id = deliveryIDsByTask.removeValue(forKey: taskIdentity) else {
                        return nil
                    }
                    taskIDsByDelivery.removeValue(forKey: id)
                    return deliveries.removeValue(forKey: id)
                }
                pending?.cancel()
            }
        }
    }

    private func complete(id: UUID, delivery: LocalSchemeDelivery) {
        sessionController.synchronize {
            deliveryGate.sync {
                guard sessionController.isCurrent(lease) else {
                    delivery.cancel()
                    removeDelivery(id)
                    return
                }
                delivery.complete(isCurrent: {
                    sessionController.isCurrent(lease)
                })
                removeDelivery(id)
            }
        }
    }

    private func removeDelivery(_ id: UUID) {
        lock.withLock {
            deliveries.removeValue(forKey: id)
            if let taskIdentity = taskIDsByDelivery.removeValue(forKey: id) {
                if deliveryIDsByTask[taskIdentity] == id {
                    deliveryIDsByTask.removeValue(forKey: taskIdentity)
                }
            }
        }
    }

    private static func canonicalPath(for url: URL) -> String? {
        guard url.absoluteString.hasPrefix(origin + "/"),
              url.scheme == scheme,
              url.host == host,
              url.user == nil,
              url.password == nil,
              url.port == nil,
              url.query == nil,
              url.fragment == nil,
              let components = URLComponents(
                  url: url,
                  resolvingAgainstBaseURL: false
              )
        else {
            return nil
        }
        let path = components.percentEncodedPath
        guard !path.contains("%"),
              !path.contains("\\"),
              !path.contains("//"),
              path.unicodeScalars.allSatisfy(\.isASCII),
              !path.split(separator: "/", omittingEmptySubsequences: false)
                  .contains(where: { $0 == "." || $0 == ".." }),
              url.absoluteString == origin + path
        else {
            return nil
        }
        return path
    }

    private func bundlePath(for path: String) -> String? {
        let prefix = "/session/\(lease.id.uuidString.lowercased())/bundle/"
        guard path.hasPrefix(prefix) else { return nil }
        return "/bundle/" + String(path.dropFirst(prefix.count))
    }

    private static func isCanonicalBundlePath(_ path: String) -> Bool {
        guard path.hasPrefix("/bundle/"),
              let url = URL(string: origin + path)
        else {
            return false
        }
        return canonicalPath(for: url) == path
    }

    static func bundleMIMEType(for path: String) -> String? {
        LocalSchemeBundlePolicy.mimeType(for: path)
    }

    private static func validInventory(
        resources: [String: Data],
        records: [LocalSchemeResourceRecord]
    ) -> Bool {
        guard Set(resources.keys) == Set(LocalSchemeBundlePolicy.mimeTypes.keys),
              records.count == LocalSchemeBundlePolicy.mimeTypes.count,
              Set(records.map(\.path)) == Set(LocalSchemeBundlePolicy.mimeTypes.keys)
        else {
            return false
        }

        var recordsByPath: [String: LocalSchemeResourceRecord] = [:]
        for record in records {
            guard recordsByPath[record.path] == nil else { return false }
            recordsByPath[record.path] = record
        }
        for (path, data) in resources {
            guard isCanonicalBundlePath(path),
                  let expectedMIMEType = LocalSchemeBundlePolicy.mimeTypes[path],
                  let record = recordsByPath[path],
                  record.mimeType == expectedMIMEType,
                  record.byteCount == data.count,
                  record.sha256 == LocalSchemeBundlePolicy.sha256(of: data)
            else {
                return false
            }
        }
        return true
    }

}

private final class LocalSchemeDelivery {
    private var response: LocalSchemeResponse?
    private var sink: (any LocalSchemeTaskSink)?
    private var cancelled = false
    private var finishing = false
    private var resourceReleased = false
    private let resourceIdentity: LocalSchemeResourceIdentity?
    private let releaseResource: (LocalSchemeResourceIdentity?) -> Void

    init(
        response: LocalSchemeResponse,
        sink: any LocalSchemeTaskSink,
        resourceIdentity: LocalSchemeResourceIdentity?,
        releaseResource: @escaping (LocalSchemeResourceIdentity?) -> Void
    ) {
        self.response = response
        self.sink = sink
        self.resourceIdentity = resourceIdentity
        self.releaseResource = releaseResource
    }

    func cancel() {
        guard !finishing else { return }
        failAsStale()
    }

    func complete(isCurrent: () -> Bool) {
        guard canContinue,
              let pendingSink = sink,
              let response
        else {
            return
        }
        guard isCurrent() else {
            failAsStale()
            return
        }
        let urlResponse = HTTPURLResponse(
            url: response.url,
            statusCode: 200,
            httpVersion: "HTTP/1.1",
            headerFields: response.headers
        ) ?? URLResponse(
            url: response.url,
            mimeType: response.mimeType,
            expectedContentLength: response.data.count,
            textEncodingName: nil
        )
        pendingSink.receive(response: urlResponse)
        guard canContinue, isCurrent() else {
            failAsStale()
            return
        }
        pendingSink.receive(data: response.data)
        guard canContinue, isCurrent() else {
            failAsStale()
            return
        }
        finishing = true
        pendingSink.finish()
        cancelled = true
        releaseResourceIfNeeded()
        sink = nil
        self.response = nil
    }

    private var canContinue: Bool {
        !cancelled && !finishing && sink != nil && response != nil
    }

    private func failAsStale() {
        guard !cancelled, !finishing, let pendingSink = sink else { return }
        cancelled = true
        pendingSink.fail(with: LocalSchemeError.staleSession)
        releaseResourceIfNeeded()
        sink = nil
        response = nil
    }

    private func releaseResourceIfNeeded() {
        guard !resourceReleased else { return }
        resourceReleased = true
        releaseResource(resourceIdentity)
    }

}

private final class WebKitSchemeTaskSink: LocalSchemeTaskSink {
    private let task: any WKURLSchemeTask

    init(task: any WKURLSchemeTask) {
        self.task = task
    }

    var request: URLRequest {
        task.request
    }

    func receive(response: URLResponse) {
        task.didReceive(response)
    }

    func receive(data: Data) {
        task.didReceive(data)
    }

    func finish() {
        task.didFinish()
    }

    func fail(with error: any Error) {
        task.didFailWithError(error)
    }
}
