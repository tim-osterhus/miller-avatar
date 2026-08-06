import Foundation
import MillerAvatarCore
@preconcurrency import WebKit

public enum BridgeControllerError: Error, Equatable, Sendable {
    case invalidCommand
    case messageTooLarge
}

public enum BridgeCommand: Equatable, Sendable {
    case configure(reducedMotion: Bool)
    case loadAsset(token: UUID)
    case projectPhase(
        sequence: UInt64,
        generationID: UUID?,
        phase: PresentationPhase,
        playbackID: UUID?
    )
    case reconcilePresentation(ReconcilePresentationPayload)
    case setVisibility(PresentationVisibility)
    case setPolicy(reducedMotion: Bool)
    case setMouth(
        generationID: UUID,
        playbackID: UUID,
        cueIndex: UInt64,
        playbackOffsetMilliseconds: UInt64,
        scalar: Double
    )
    case reset(generationID: UUID?, reason: ResetReason)
    case dispose(DisposalReason)
}

@MainActor
public protocol JavaScriptCommandCalling: AnyObject {
    func call(source: String, commandJSON: String) async throws
}

@MainActor
public final class WebViewJavaScriptCaller: JavaScriptCommandCalling {
    private weak var webView: WKWebView?

    public init(webView: WKWebView) {
        self.webView = webView
    }

    public func call(source: String, commandJSON: String) async throws {
        guard let webView else { throw BridgeControllerError.invalidCommand }
        _ = try await webView.callAsyncJavaScript(
            source,
            arguments: ["commandJSON": commandJSON],
            in: nil,
            contentWorld: .page
        )
    }
}

@MainActor
public final class BridgeController {
    public static let receiverSource = "return globalThis.millerAvatarBridge.accept(commandJSON);"

    private let sessionID: UUID
    private let caller: any JavaScriptCommandCalling
    private var nextSequence: UInt64 = 1
    private var commandTail: Task<Void, Error>?

    public init(sessionID: UUID, caller: any JavaScriptCommandCalling) {
        self.sessionID = sessionID
        self.caller = caller
    }

    public func send(_ command: BridgeCommand) async throws {
        let previous = commandTail
        let delivery = Task { @MainActor [weak self] in
            if let previous {
                try await previous.value
            }
            guard let self else {
                throw BridgeControllerError.invalidCommand
            }
            guard self.nextSequence <= BridgeContract.maximumSafeInteger else {
                throw BridgeControllerError.invalidCommand
            }
            let envelope = try Self.envelope(
                sessionID: self.sessionID,
                sequence: self.nextSequence,
                command: command
            )
            let data = try JSONSerialization.data(
                withJSONObject: envelope,
                options: [.sortedKeys, .withoutEscapingSlashes]
            )
            guard data.count <= BridgeContract.maximumMessageBytes else {
                throw BridgeControllerError.messageTooLarge
            }
            guard let commandJSON = String(data: data, encoding: .utf8) else {
                throw BridgeControllerError.invalidCommand
            }
            try await self.caller.call(
                source: Self.receiverSource,
                commandJSON: commandJSON
            )
            self.nextSequence += 1
        }
        commandTail = delivery
        try await delivery.value
    }

    private static func envelope(
        sessionID: UUID,
        sequence: UInt64,
        command: BridgeCommand
    ) throws -> [String: Any] {
        let encoded = try commandObject(command)
        return [
            "schema": BridgeContract.commandSchema,
            "session_id": sessionID.uuidString.lowercased(),
            "sequence": sequence,
            "type": encoded.type,
            "payload": encoded.payload,
        ]
    }

    private static func commandObject(
        _ command: BridgeCommand
    ) throws -> (type: String, payload: [String: Any]) {
        switch command {
        case .configure(let reducedMotion):
            return ("configure", [
                "profile": "lightweight",
                "reduced_motion": reducedMotion,
            ])
        case .loadAsset(let token):
            return ("load_asset", ["asset_token": token.uuidString.lowercased()])
        case .projectPhase(let sequence, let generationID, let phase, let playbackID):
            guard sequence > 0,
                  sequence <= BridgeContract.maximumSafeInteger,
                  validPhaseIdentities(
                      phase: phase,
                      generationID: generationID,
                      playbackID: playbackID
                  )
            else { throw BridgeControllerError.invalidCommand }
            return ("project_phase", [
                "projection_sequence": sequence,
                "generation_id": generationID.map {
                    $0.uuidString.lowercased()
                } ?? NSNull(),
                "phase": phase.rawValue,
                "playback_id": playbackID.map {
                    $0.uuidString.lowercased()
                } ?? NSNull(),
            ])
        case .reconcilePresentation(let payload):
            guard payload.lastProjectionSequence == nil
                    || (payload.lastProjectionSequence! > 0
                        && payload.lastProjectionSequence! <= BridgeContract.maximumSafeInteger),
                  validPhaseIdentities(
                      phase: payload.phase,
                      generationID: payload.generationID,
                      playbackID: payload.playbackID
                  )
            else { throw BridgeControllerError.invalidCommand }
            return ("reconcile_presentation", [
                "last_projection_sequence": payload.lastProjectionSequence.map {
                    $0
                } ?? NSNull(),
                "generation_id": payload.generationID.map {
                    $0.uuidString.lowercased()
                } ?? NSNull(),
                "phase": payload.phase.rawValue,
                "playback_id": payload.playbackID.map {
                    $0.uuidString.lowercased()
                } ?? NSNull(),
                "reduced_motion": payload.reducedMotion,
            ])
        case .setVisibility(let visibility):
            return ("set_visibility", ["visibility": visibility.rawValue])
        case .setPolicy(let reducedMotion):
            return ("set_policy", ["reduced_motion": reducedMotion])
        case .setMouth(
            let generationID,
            let playbackID,
            let cueIndex,
            let playbackOffsetMilliseconds,
            let scalar
        ):
            guard cueIndex > 0,
                  cueIndex <= BridgeContract.maximumSafeInteger,
                  playbackOffsetMilliseconds <= BridgeContract.maximumSafeInteger,
                  playbackOffsetMilliseconds <= 86_400_000,
                  scalar.isFinite,
                  (0...1).contains(scalar)
            else { throw BridgeControllerError.invalidCommand }
            return ("set_mouth", [
                "generation_id": generationID.uuidString.lowercased(),
                "playback_id": playbackID.uuidString.lowercased(),
                "cue_index": cueIndex,
                "playback_offset_ms": playbackOffsetMilliseconds,
                "scalar": scalar,
            ])
        case .reset(let generationID, let reason):
            guard generationID != nil || reason == .operator else {
                throw BridgeControllerError.invalidCommand
            }
            return ("reset", [
                "generation_id": generationID.map {
                    $0.uuidString.lowercased()
                } ?? NSNull(),
                "reason": reason.rawValue,
            ])
        case .dispose(let reason):
            return ("dispose", ["reason": reason.rawValue])
        }
    }

    private static func validPhaseIdentities(
        phase: PresentationPhase,
        generationID: UUID?,
        playbackID: UUID?
    ) -> Bool {
        switch phase {
        case .speaking:
            generationID != nil && playbackID != nil
        case .thinking, .responding, .stopped, .failed:
            generationID != nil && playbackID == nil
        case .idle, .listening, .transcribing:
            generationID == nil && playbackID == nil
        }
    }

}
