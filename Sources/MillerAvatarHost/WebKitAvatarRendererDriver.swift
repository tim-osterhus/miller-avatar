import Foundation
import MillerAvatarCore
@preconcurrency import WebKit

@MainActor
internal struct RendererResourceProvider {
    private static let embeddedBundleName = "MillerAvatar_MillerAvatarHost.bundle"
    private let loadResources: () throws -> [String: Data]

    static let module = Self {
        let bundle = try Self.resolveBundle(
            mainBundle: Bundle.main,
            fallbackBundle: { Bundle.module }
        )
        return try Self.resources(from: bundle)
    }

    private init(loadResources: @escaping () throws -> [String: Data]) {
        self.loadResources = loadResources
    }

    init(resources: [String: Data]) {
        loadResources = { resources }
    }

    init(bundle: Bundle) {
        loadResources = { try Self.resources(from: bundle) }
    }

    static func resolveBundle(
        mainBundle: Bundle,
        fallbackBundle: () -> Bundle
    ) throws -> Bundle {
        guard mainBundle.bundleURL.pathExtension.lowercased() == "app" else {
            return fallbackBundle()
        }

        guard let resourceURL = mainBundle.resourceURL?.appendingPathComponent(
            embeddedBundleName,
            isDirectory: true
        ),
        let bundle = Bundle(url: resourceURL)
        else {
            throw LocalSchemeError.invalidInventory
        }
        return bundle
    }

    func load() throws -> [String: Data] {
        let resources = try loadResources()
        guard Set(resources.keys) == Set(LocalSchemeBundlePolicy.mimeTypes.keys) else {
            throw LocalSchemeError.invalidInventory
        }
        return resources
    }

    private static func resources(from bundle: Bundle) throws -> [String: Data] {
        guard let resourceRoot = bundle.resourceURL?.appendingPathComponent(
            "Web",
            isDirectory: true
        )
        else {
            throw LocalSchemeError.invalidInventory
        }

        do {
            let values = try resourceRoot.resourceValues(
                forKeys: [.isDirectoryKey, .isSymbolicLinkKey]
            )
            guard values.isDirectory == true, values.isSymbolicLink != true else {
                throw LocalSchemeError.invalidInventory
            }
        } catch is LocalSchemeError {
            throw LocalSchemeError.invalidInventory
        } catch {
            throw LocalSchemeError.invalidInventory
        }

        let names: [String]
        do {
            names = try FileManager.default.contentsOfDirectory(
                atPath: resourceRoot.path
            )
        } catch {
            throw LocalSchemeError.invalidInventory
        }

        let expectedNames: Set<String> = Set(
            LocalSchemeBundlePolicy.mimeTypes.keys.compactMap { path -> String? in
                guard path.hasPrefix("/bundle/") else { return nil }
                return String(path.dropFirst("/bundle/".count))
            }
        )
        guard Set(names) == expectedNames else {
            throw LocalSchemeError.invalidInventory
        }

        var resourceURLs: [String: URL] = [:]
        for name in expectedNames {
            let url = resourceRoot.appendingPathComponent(name)
            do {
                let values = try url.resourceValues(
                    forKeys: [.isRegularFileKey, .isSymbolicLinkKey]
                )
                guard values.isRegularFile == true, values.isSymbolicLink != true else {
                    throw LocalSchemeError.invalidInventory
                }
                resourceURLs[name] = url
            } catch is LocalSchemeError {
                throw LocalSchemeError.invalidInventory
            } catch {
                throw LocalSchemeError.invalidInventory
            }
        }

        var resources: [String: Data] = [:]
        for name in expectedNames {
            guard let url = resourceURLs[name] else {
                throw LocalSchemeError.invalidInventory
            }
            do {
                resources["/bundle/\(name)"] = try Data(contentsOf: url)
            } catch {
                throw LocalSchemeError.invalidInventory
            }
        }
        return resources
    }
}

@MainActor
public final class WebKitAvatarRendererDriver:
    HostRendererDriving,
    AvatarSurfaceRendererDriving
{
    public var onWebViewChange: ((WKWebView?) -> Void)?

    private let resourceProvider: RendererResourceProvider
    private let sessionController = RendererSessionController()
    private var receive: ((UUID, HostObservation) -> Void)?
    private var lease: RendererSessionLease?
    private var schemeHandler: LocalSchemeHandler?
    private var bridge: BridgeController?
    private var teardown: RendererTeardown?
    private var navigationPolicyRetention: NavigationPolicyRetention?
    private var observationHandler: RendererObservationHandler?
    private var webView: WKWebView?

    public init() {
        resourceProvider = .module
    }

    internal init(resourceProvider: RendererResourceProvider) {
        self.resourceProvider = resourceProvider
    }

    public func start(
        sessionID: UUID,
        receive: @escaping (UUID, HostObservation) -> Void
    ) {
        teardown?.run()
        clear()
        self.receive = receive
        let lease = sessionController.begin(id: sessionID)
        self.lease = lease

        do {
            let resources = try resourceProvider.load()
            let handler = try LocalSchemeHandler(
                lease: lease,
                sessionController: sessionController,
                bundledResources: resources,
                resourceRecords: resources.keys.sorted().map {
                    LocalSchemeResourceRecord.make(path: $0, data: resources[$0]!)
                },
                assetToken: UUID(),
                assetData: Data()
            )
            schemeHandler = handler

            let observationHandler = RendererObservationHandler(
                lease: lease,
                sessionController: sessionController,
                receive: { [weak self, originatingIdentity = lease.identity] envelope in
                    Task { @MainActor in
                        self?.accept(envelope, for: originatingIdentity)
                    }
                },
                onInvalidObservation: { [weak self, originatingIdentity = lease.identity] in
                    Task { @MainActor in
                        self?.fail(.bridgeInvalid, for: originatingIdentity)
                    }
                }
            )
            self.observationHandler = observationHandler
            let navigationPolicy = NavigationPolicy(
                lease: lease,
                onPolicyFailure: { [weak self, originatingIdentity = lease.identity] failure in
                    Task { @MainActor in
                        self?.fail(failure.code, for: originatingIdentity)
                    }
                }
            )
            navigationPolicyRetention = NavigationPolicyRetention(
                navigationPolicy
            )
            let assembly = WebViewFactory.make(
                schemeHandler: handler,
                navigationPolicy: navigationPolicy,
                observationHandler: observationHandler
            )
            webView = assembly.webView
            bridge = BridgeController(
                sessionID: sessionID,
                caller: WebViewJavaScriptCaller(webView: assembly.webView)
            )
            let actions = WebKitRendererTeardownActions(
                webView: assembly.webView,
                schemeHandler: handler,
                scriptHandlerNames: WebViewFactory.scriptMessageHandlerNames,
                onDelegatesCleared: { [weak self] in
                    self?.navigationPolicyRetention?.releaseAfterDelegatesCleared()
                },
                fallback: { [weak self] in
                    self?.onWebViewChange?(nil)
                }
            )
            teardown = RendererTeardown(
                lease: lease,
                sessionController: sessionController,
                actions: actions
            )
            onWebViewChange?(assembly.webView)
        } catch {
            let startupTeardown = teardown
            let observation = HostObservation.failed(.rendererUnavailable)
            receive(sessionID, observation)
            startupTeardown?.run()
            sessionController.release(lease)
            guard self.lease?.identity == lease.identity else { return }
            clear()
        }
    }

    public func install(_ asset: AdmittedAsset) {
        guard schemeHandler?.installAsset(token: asset.token, data: asset.bytes) == true else {
            fail(.schemeRejected)
            return
        }
    }

    public func send(_ command: BridgeCommand) {
        guard let bridge, let lease else {
            fail(.bridgeInvalid)
            return
        }
        let originatingIdentity = lease.identity
        Task { @MainActor [weak self] in
            do {
                try await bridge.send(command)
            } catch {
                self?.fail(.bridgeInvalid, for: originatingIdentity)
            }
        }
    }

    public func dispose(reason: DisposalReason) {
        if let bridge {
            Task { @MainActor in
                try? await bridge.send(.dispose(reason))
            }
        }
        teardown?.run()
        clear()
    }

    internal func acceptSerializedObservationForTesting(_ body: String) {
        observationHandler?.accept(body)
    }

    internal func triggerBridgeFailureForTesting() {
        guard let originatingIdentity = lease?.identity else { return }
        Task { @MainActor [weak self] in
            self?.fail(.bridgeInvalid, for: originatingIdentity)
        }
    }

    private func accept(
        _ envelope: PresentationObservationEnvelope,
        for originatingIdentity: RendererSessionLeaseIdentity
    ) {
        guard let activeLease = lease,
              activeLease.identity == originatingIdentity,
              envelope.sessionID == activeLease.id
        else {
            return
        }
        switch envelope.observation {
        case .wrapperReady(let payload):
            if payload.bridgeVersion == 1 {
                forward(.wrapperReady, sessionID: activeLease.id)
            } else {
                fail(.bridgeInvalid, for: originatingIdentity)
            }
        case .rendererReady(let payload):
            if payload.webgl == "webgl2" {
                forward(.rendererReady, sessionID: activeLease.id)
            } else {
                fail(.webglUnavailable, for: originatingIdentity)
            }
        case .assetLoaded:
            break
        case .firstFrame(let payload):
            forward(
                .firstFrame(
                    assetToken: payload.assetToken,
                    counters: HostCounters(frames: 1, updates: 0, renders: 1)
                ),
                sessionID: activeLease.id
            )
        case .suspended(let payload):
            forward(
                .suspended(
                    visibility: payload.visibility,
                    counters: HostCounters(
                        frames: payload.frames,
                        updates: payload.updates,
                        renders: payload.renders
                    )
                ),
                sessionID: activeLease.id
            )
        case .resumed(let payload):
            forward(
                .resumed(
                    counters: HostCounters(
                        frames: payload.frames,
                        updates: payload.updates,
                        renders: payload.renders
                    )
                ),
                sessionID: activeLease.id
            )
        case .disposed:
            let originatingTeardown = teardown
            forward(.disposed, sessionID: activeLease.id)
            guard self.lease?.identity == originatingIdentity else { return }
            originatingTeardown?.run()
            clear(ifMatching: originatingIdentity)
        case .failed(let payload):
            fail(payload.code, for: originatingIdentity)
        }
    }

    private func forward(_ observation: HostObservation, sessionID: UUID) {
        let receive = self.receive
        receive?(sessionID, observation)
    }

    private func fail(_ code: FailureCode) {
        guard let originatingIdentity = lease?.identity else { return }
        fail(code, for: originatingIdentity)
    }

    private func fail(
        _ code: FailureCode,
        for originatingIdentity: RendererSessionLeaseIdentity
    ) {
        guard let activeLease = lease,
              activeLease.identity == originatingIdentity
        else {
            return
        }
        let originatingTeardown = teardown
        forward(.failed(code), sessionID: activeLease.id)
        guard self.lease?.identity == originatingIdentity else { return }
        originatingTeardown?.run()
        clear(ifMatching: originatingIdentity)
    }

    private func clear(ifMatching identity: RendererSessionLeaseIdentity? = nil) {
        if let identity, lease?.identity != identity {
            return
        }
        bridge = nil
        schemeHandler = nil
        observationHandler = nil
        webView = nil
        teardown = nil
        navigationPolicyRetention = nil
        lease = nil
        receive = nil
    }
}
