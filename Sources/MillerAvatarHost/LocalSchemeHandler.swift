import Foundation
import CryptoKit
@preconcurrency import WebKit

public enum LocalSchemeError: Error, Equatable, Sendable {
    case rejected
    case staleSession
    case invalidInventory
}

public struct LocalSchemeResponse: Equatable, Sendable {
    public let url: URL
    public let mimeType: String
    public let headers: [String: String]
    public let data: Data
}

public struct LocalSchemeResourceRecord: Equatable, Sendable {
    public let path: String
    public let mimeType: String
    public let byteCount: Int
    public let sha256: String

    public init(
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

    public static func make(path: String, data: Data) -> Self {
        Self(
            path: path,
            mimeType: LocalSchemeBundlePolicy.mimeType(for: path) ?? "",
            byteCount: data.count,
            sha256: LocalSchemeBundlePolicy.sha256(of: data)
        )
    }
}

private enum LocalSchemeBundlePolicy {
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

public protocol LocalSchemeTaskSink: AnyObject {
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
    img-src 'self' blob: data:; connect-src 'self' miller-avatar-local:; \
    font-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; \
    child-src 'none'; worker-src 'none'; manifest-src 'none'; \
    base-uri 'none'; form-action 'none'; navigate-to 'none'
    """

    public var activeAssetURL: URL {
        lock.withLock { storedAssetURL }
    }

    public var entrypointURL: URL {
        Self.entrypointURL(for: lease.id)
    }

    private let lease: RendererSessionLease
    private let sessionController: RendererSessionController
    private let bundledResources: [String: Data]
    private var storedAssetURL: URL
    private var assetData: Data?
    private let scheduleDelivery: (@escaping () -> Void) -> Void
    private let lock = NSLock()
    private let deliveryGate = SerializedCallbackGate(
        label: "miller-avatar.scheme-delivery"
    )
    // Access is confined to sessionController.synchronize -> deliveryGate.
    private nonisolated(unsafe) var deliveries: [UUID: LocalSchemeDelivery] = [:]
    private var assetServingEnabled = true

    public init(
        lease: RendererSessionLease,
        sessionController: RendererSessionController,
        bundledResources: [String: Data],
        resourceRecords: [LocalSchemeResourceRecord],
        assetToken: UUID,
        assetData: Data,
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
        self.assetData = assetData
        self.scheduleDelivery = scheduleDelivery
        let assetPath = "/session/\(lease.id.uuidString.lowercased())/"
            + "\(assetToken.uuidString.lowercased()).vrm"
        guard let activeAssetURL = URL(string: Self.origin + assetPath) else {
            throw LocalSchemeError.invalidInventory
        }
        storedAssetURL = activeAssetURL
    }

    @discardableResult
    public func installAsset(token: UUID, data: Data) -> Bool {
        guard let url = URL(string: Self.origin + "/session/"
            + lease.id.uuidString.lowercased() + "/"
            + token.uuidString.lowercased() + ".vrm")
        else {
            return false
        }
        return sessionController.perform(for: lease) {
            lock.withLock {
                storedAssetURL = url
                assetData = data
                assetServingEnabled = true
            }
        }
    }

    public func response(for request: URLRequest) throws -> LocalSchemeResponse {
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
        if url == activeAssetURL {
            guard let activeAssetData = lock.withLock({
                assetServingEnabled ? assetData : nil
            }) else {
                throw LocalSchemeError.staleSession
            }
            data = activeAssetData
            mimeType = "model/gltf-binary"
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

    public func start(_ sink: any LocalSchemeTaskSink) {
        let id = UUID()
        var scheduled = false
        var failure: (any Error)?
        let admitted = sessionController.perform(for: lease) {
            do {
                let response = try responseUnchecked(for: sink.request)
                let pendingDelivery = LocalSchemeDelivery(
                    response: response,
                    sink: sink
                )
                deliveryGate.sync {
                    lock.withLock {
                        deliveries[id] = pendingDelivery
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

    public nonisolated func cancelAll() {
        sessionController.synchronize {
            deliveryGate.sync {
                let pending = lock.withLock {
                    let pending = Array(deliveries.values)
                    deliveries.removeAll()
                    return pending
                }
                pending.forEach { $0.cancel() }
            }
        }
    }

    public func revokeAssetServing() {
        lock.withLock {
            assetServingEnabled = false
        }
    }

    public func releaseAssetBytes() {
        lock.withLock {
            assetData = nil
        }
    }

    public func webView(
        _ webView: WKWebView,
        start urlSchemeTask: any WKURLSchemeTask
    ) {
        start(WebKitSchemeTaskSink(task: urlSchemeTask))
    }

    public func webView(
        _ webView: WKWebView,
        stop urlSchemeTask: any WKURLSchemeTask
    ) {
        cancelAll()
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
        _ = lock.withLock {
            deliveries.removeValue(forKey: id)
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

    init(
        response: LocalSchemeResponse,
        sink: any LocalSchemeTaskSink
    ) {
        self.response = response
        self.sink = sink
    }

    func cancel() {
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
        sink = nil
        self.response = nil
        pendingSink.finish()
    }

    private var canContinue: Bool {
        !cancelled && sink != nil && response != nil
    }

    private func failAsStale() {
        guard let pendingSink = sink else { return }
        cancelled = true
        sink = nil
        response = nil
        pendingSink.fail(with: LocalSchemeError.staleSession)
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
