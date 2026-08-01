import Foundation
import MillerAvatarCore
@preconcurrency import WebKit

/// The fixed WebKit-to-native ingress. Only serialized JSON observations for
/// the active lease are decoded and delivered to the native renderer session.
public final class RendererObservationHandler: NSObject, WKScriptMessageHandler {
    public static let channelName = "millerAvatarObservation"

    private let lease: RendererSessionLease
    private let sessionController: RendererSessionController
    private let decoder: PresentationObservationDecoder
    private let receive: (PresentationObservationEnvelope) -> Void
    private let onInvalidObservation: () -> Void

    public init(
        lease: RendererSessionLease,
        sessionController: RendererSessionController,
        receive: @escaping (PresentationObservationEnvelope) -> Void = { _ in },
        onInvalidObservation: @escaping () -> Void = {}
    ) {
        self.lease = lease
        self.sessionController = sessionController
        decoder = PresentationObservationDecoder(sessionID: lease.id)
        self.receive = receive
        self.onInvalidObservation = onInvalidObservation
    }

    public func accept(_ body: Any) {
        guard let serialized = body as? String else {
            rejectIfCurrent()
            return
        }
        let data = Data(serialized.utf8)
        _ = sessionController.perform(for: lease) { [decoder, receive] in
            do {
                receive(try decoder.decode(data))
            } catch {
                self.containInvalidObservation()
            }
        }
    }

    public func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard message.name == Self.channelName else { return }
        accept(message.body)
    }

    private func rejectIfCurrent() {
        _ = sessionController.perform(for: lease) {
            containInvalidObservation()
        }
    }

    private func containInvalidObservation() {
        sessionController.release(lease)
        onInvalidObservation()
    }
}
