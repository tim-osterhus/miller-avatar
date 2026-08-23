import Foundation
import MillerAvatarCore
@preconcurrency import WebKit

package enum BridgeControllerError: Error, Equatable, Sendable {
    case invalidCommand
    case messageTooLarge
}

package enum BridgeCommand: Equatable, Sendable {
    case configure(ConfigurePayload)
    case loadProfile(LoadProfilePayload)
    case projectPhase(
        sequence: UInt64,
        generationID: UUID?,
        phase: PresentationPhase,
        playbackID: UUID?
    )
    case reconcilePresentation(ReconcilePresentationPayload)
    case setVisibility(PresentationVisibility)
    case setPolicy(SetPolicyPayload)
    case setMouth(SetMouthPayload)
    case reset(generationID: UUID?, reason: ResetReason)
    case dispose(DisposalReason)
}

@MainActor
package protocol JavaScriptCommandCalling: AnyObject {
    func call(source: String, commandJSON: String) async throws
}

@MainActor
package final class WebViewJavaScriptCaller: JavaScriptCommandCalling {
    private weak var webView: WKWebView?

    package init(webView: WKWebView) {
        self.webView = webView
    }

    package func call(source: String, commandJSON: String) async throws {
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
package final class BridgeController {
    package static let receiverSource = "return globalThis.millerAvatarBridge.accept(commandJSON);"

    private let sessionID: UUID
    private let caller: any JavaScriptCommandCalling
    private var nextSequence: UInt64 = 1
    private var commandTail: Task<Void, Error>?

    package init(sessionID: UUID, caller: any JavaScriptCommandCalling) {
        self.sessionID = sessionID
        self.caller = caller
    }

    package func send(
        _ command: BridgeCommand,
        beforeDispatch: (@MainActor (UInt64) -> Void)? = nil
    ) async throws {
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
            let sequence = self.nextSequence
            let envelope = try Self.envelope(
                sessionID: self.sessionID,
                sequence: sequence,
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
            self.nextSequence += 1
            beforeDispatch?(sequence)
            try await self.caller.call(
                source: Self.receiverSource,
                commandJSON: commandJSON
            )
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
        case .configure(let payload):
            return ("configure", [
                "profile": payload.profile,
                "reduced_motion": payload.reducedMotion,
                "mouth_cues_enabled": payload.mouthCuesEnabled,
            ])
        case .loadProfile(let profile):
            guard profile.profileRevision > 0,
                  profile.profileRevision <= BridgeContract.maximumSafeInteger,
                  profile.motionBindings.count == AvatarMotionRole.allCases.count,
                  Set(profile.motionBindings.keys)
                      == Set(AvatarMotionRole.allCases),
                  profile.motionBindings.values.allSatisfy(\.isValid)
            else {
                throw BridgeControllerError.invalidCommand
            }
            var bindings: [String: Any] = [:]
            for role in AvatarMotionRole.allCases {
                guard let binding = profile.motionBindings[role] else {
                    throw BridgeControllerError.invalidCommand
                }
                bindings[role.rawValue] = [
                    "status": binding.status.rawValue,
                    "token": binding.token?.uuidString.lowercased() ?? NSNull(),
                ]
            }
            return ("load_profile", [
                "profile_revision": profile.profileRevision,
                "model_token": profile.modelToken.uuidString.lowercased(),
                "motion_bindings": bindings,
            ])
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
                "mouth_cues_enabled": payload.mouthCuesEnabled,
            ])
        case .setVisibility(let visibility):
            return ("set_visibility", ["visibility": visibility.rawValue])
        case .setPolicy(let payload):
            return ("set_policy", [
                "reduced_motion": payload.reducedMotion,
                "mouth_cues_enabled": payload.mouthCuesEnabled,
            ])
        case .setMouth(let payload):
            guard payload.cueIndex > 0,
                  payload.cueIndex <= BridgeContract.maximumSafeInteger,
                  payload.playbackOffsetMilliseconds <= BridgeContract.maximumSafeInteger,
                  payload.playbackOffsetMilliseconds <= 86_400_000,
                  payload.scalar.isFinite,
                  (0...1).contains(payload.scalar),
                  payload.vowels?.isValid ?? true
            else { throw BridgeControllerError.invalidCommand }
            var payloadObject: [String: Any] = [
                "generation_id": payload.generationID.uuidString.lowercased(),
                "playback_id": payload.playbackID.uuidString.lowercased(),
                "cue_index": payload.cueIndex,
                "playback_offset_ms": payload.playbackOffsetMilliseconds,
                "scalar": payload.scalar,
            ]
            if let vowels = payload.vowels {
                payloadObject["vowels"] = [
                    "aa": vowels.aa,
                    "ih": vowels.ih,
                    "ou": vowels.ou,
                    "ee": vowels.ee,
                    "oh": vowels.oh,
                ]
            }
            return ("set_mouth", payloadObject)
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
        case .thinking, .responding, .succeeded, .stopped, .failed:
            generationID != nil && playbackID == nil
        case .idle, .listening, .transcribing:
            generationID == nil && playbackID == nil
        }
    }

}
