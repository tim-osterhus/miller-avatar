import Foundation
import Testing
@testable import MillerAvatarCore

@Suite struct BridgeContractTests {
    private let fixtureRoot = URL(fileURLWithPath: #filePath)
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .appendingPathComponent("ContractFixtures")

    @Test func schemaNamesAndSharedLimits() {
        #expect(
            BridgeContract.commandSchema
                == "miller-avatar.presentation-command/v1"
        )
        #expect(
            BridgeContract.observationSchema
                == "miller-avatar.presentation-observation/v1"
        )
        #expect(BridgeContract.maximumMessageBytes == 16_384)
        #expect(BridgeContract.maximumContainerDepth == 8)
        #expect(BridgeContract.maximumArrayLength == 64)
        #expect(BridgeContract.maximumSafeInteger == 9_007_199_254_740_991)
    }

    @Test func everyValidFixtureIsAccepted() throws {
        let fixtures = try fixtureURLs(in: "valid")
        #expect(fixtures.count == 16)
        #expect(
            Set(fixtures.map { $0.deletingPathExtension().lastPathComponent })
                == [
                "command-configure", "command-load-asset", "command-project-phase",
                "command-set-visibility", "command-set-policy", "command-set-mouth",
                "command-reset", "command-dispose", "observation-wrapper-ready",
                "observation-renderer-ready", "observation-asset-loaded",
                "observation-first-frame", "observation-suspended", "observation-resumed",
                "observation-disposed", "observation-failed",
            ]
        )

        for url in fixtures {
            try decodeFixture(url)
        }
    }

    @Test func everyInvalidFixtureIsRejected() throws {
        let fixtures = try fixtureURLs(in: "invalid")
        #expect(fixtures.count >= 24)
        for url in fixtures {
            #expect(throws: (any Error).self) {
                try decodeFixture(url)
            }
        }
    }

    @Test func invalidFixtureMatrixCoversStructuralAndStatefulBoundaries() throws {
        let names = Set(try fixtureURLs(in: "invalid").map {
            $0.deletingPathExtension().lastPathComponent
        })
        #expect(names.isSuperset(of: [
            "message-duplicate-key", "command-unknown-top-level-field",
            "observation-asset-loaded", "command-missing-required-field",
            "command-unknown-type", "command-uppercase-uuid",
            "command-noncanonical-uuid", "command-negative-integer",
            "command-unsafe-integer", "command-sequence-duplicate",
            "command-sequence-decrease", "command-projection-sequence-duplicate",
            "command-projection-sequence-decrease", "command-stale-generation",
            "command-stale-playback", "command-mouth-cue-decrease",
            "command-mouth-offset-decrease", "command-hidden-visibility-revokes-playback",
            "command-post-disposal",
        ]))
    }

    @Test func hiddenVisibilityRevokesPlaybackButPreservesGeneration() throws {
        let decoder = commandDecoder()
        _ = try decoder.decode(command(
            sequence: 1,
            type: "project_phase",
            payload: [
                "projection_sequence": 1,
                "generation_id": Self.generationID,
                "phase": "speaking",
                "playback_id": Self.playbackID,
            ]
        ))
        _ = try decoder.decode(command(
            sequence: 2,
            type: "set_mouth",
            payload: [
                "generation_id": Self.generationID,
                "playback_id": Self.playbackID,
                "cue_index": 1,
                "playback_offset_ms": 100,
                "scalar": 0.5,
            ]
        ))
        _ = try decoder.decode(command(
            sequence: 3,
            type: "set_visibility",
            payload: ["visibility": "hidden"]
        ))

        let state = Dictionary(uniqueKeysWithValues: Mirror(reflecting: decoder).children.compactMap {
            child -> (String, Any)? in
            guard let label = child.label else { return nil }
            return (label, child.value)
        })
        #expect(state["activeGenerationID"] as? UUID == UUID(uuidString: Self.generationID))
        #expect((state["activePlaybackID"] as? UUID) == nil)
        #expect((state["lastCueIndex"] as? UInt64) == nil)
        #expect((state["lastPlaybackOffsetMilliseconds"] as? UInt64) == nil)

        #expect(throws: BridgeContractError.invalidSequence) {
            try decoder.decode(command(
                sequence: 4,
                type: "set_mouth",
                payload: [
                    "generation_id": Self.generationID,
                    "playback_id": Self.playbackID,
                    "cue_index": 2,
                    "playback_offset_ms": 200,
                    "scalar": 0.5,
                ]
            ))
        }
    }

    @Test func duplicateKeysAreRejectedBeforeFoundationNormalizesThem() {
        let raw = """
        {"schema":"miller-avatar.presentation-command/v1","session_id":"11111111-1111-4111-8111-111111111111","sequence":1,"type":"configure","payload":{"profile":"lightweight","reduced_motion":false,"reduced_motion":true}}
        """
        #expect(throws: (any Error).self) {
            try commandDecoder().decode(Data(raw.utf8))
        }
    }

    @Test func closedPayloadsRoundTripThroughCodable() throws {
        let payload = ProjectPhasePayload(
            projectionSequence: 4,
            generationID: UUID(uuidString: Self.generationID),
            phase: .speaking,
            playbackID: UUID(uuidString: Self.playbackID)
        )
        let decoded = try JSONDecoder().decode(
            ProjectPhasePayload.self,
            from: JSONEncoder().encode(payload)
        )
        #expect(decoded == payload)
    }

    @Test func allClosedCommandVocabulariesAreAccepted() throws {
        for phase in PresentationPhase.allCases {
            let generationID: Any
            let playbackID: Any
            switch phase {
            case .speaking:
                generationID = Self.generationID
                playbackID = Self.playbackID
            case .thinking, .responding, .stopped, .failed:
                generationID = Self.generationID
                playbackID = NSNull()
            case .idle, .listening, .transcribing:
                generationID = NSNull()
                playbackID = NSNull()
            }
            let command = command(
                type: "project_phase",
                payload: [
                    "projection_sequence": 1,
                    "generation_id": generationID,
                    "phase": phase.rawValue,
                    "playback_id": playbackID,
                ]
            )
            _ = try commandDecoder().decode(command)
        }

        for visibility in PresentationVisibility.allCases {
            let message = command(
                type: "set_visibility",
                payload: ["visibility": visibility.rawValue]
            )
            _ = try commandDecoder().decode(message)
        }

        for reason in ResetReason.allCases {
            let generationID: Any = reason == .operator ? NSNull() : Self.generationID
            let message = command(
                type: "reset",
                payload: ["generation_id": generationID, "reason": reason.rawValue]
            )
            _ = try commandDecoder().decode(message)
        }

        for reason in DisposalReason.allCases {
            let message = command(type: "dispose", payload: ["reason": reason.rawValue])
            _ = try commandDecoder().decode(message)
        }
    }

    @Test func allClosedFailureVocabulariesAreAccepted() throws {
        for code in FailureCode.allCases {
            for operation in FailureOperation.allCases {
                let message = observation(
                    type: "failed",
                    payload: ["code": code.rawValue, "operation": operation.rawValue]
                )
                _ = try observationDecoder().decode(message)
            }
        }
    }

    @Test func failurePayloadRejectsSensitiveOrUnboundedData() {
        for key in ["path", "url", "exception", "asset_metadata"] {
            let message = observation(
                type: "failed",
                payload: [
                    "code": "render_failed",
                    "operation": "render",
                    key: "not allowed",
                ]
            )
            #expect(throws: (any Error).self) {
                try observationDecoder().decode(message)
            }
        }
    }

    private func decodeFixture(_ url: URL) throws {
        let fixtureData = try Data(contentsOf: url)
        guard let fixture = try JSONSerialization.jsonObject(with: fixtureData)
            as? [String: Any],
            let direction = fixture["direction"] as? String,
            let sessionString = fixture["session_id"] as? String,
            let sessionID = UUID(uuidString: sessionString),
            let messages = fixture["messages"] as? [[String: Any]]
        else {
            throw FixtureError.invalidFixture
        }

        let mutation = fixture["mutation"] as? String
        if direction == "command" {
            let decoder = PresentationCommandDecoder(sessionID: sessionID)
            for message in messages {
                _ = try decoder.decode(try encoded(message, mutation: mutation))
            }
        } else if direction == "observation" {
            let decoder = PresentationObservationDecoder(sessionID: sessionID)
            for message in messages {
                _ = try decoder.decode(try encoded(message, mutation: mutation))
            }
        } else {
            throw FixtureError.invalidFixture
        }
    }

    private func encoded(
        _ original: [String: Any],
        mutation: String?
    ) throws -> Data {
        var message = original
        switch mutation {
        case nil:
            return try JSONSerialization.data(withJSONObject: message)
        case "add_depth_nine":
            var nested: [String: Any] = ["leaf": true]
            for _ in 0..<7 {
                nested = ["nested": nested]
            }
            message["probe"] = nested
            return try JSONSerialization.data(withJSONObject: message)
        case "add_array_65":
            message["probe"] = Array(repeating: 0, count: 65)
            return try JSONSerialization.data(withJSONObject: message)
        case "add_string_over_64_bytes":
            message["probe"] = String(repeating: "é", count: 33)
            return try JSONSerialization.data(withJSONObject: message)
        case "pad_to_16385_bytes":
            var data = try JSONSerialization.data(withJSONObject: message)
            data.append(
                Data(
                    repeating: 0x20,
                    count: BridgeContract.maximumMessageBytes + 1 - data.count
                )
            )
            return data
        case "replace_scalar_with_nan":
            let data = try JSONSerialization.data(withJSONObject: message)
            guard let json = String(data: data, encoding: .utf8),
                  let range = json.range(of: "\"scalar\":0.5")
            else {
                throw FixtureError.invalidFixture
            }
            return Data(
                json.replacingCharacters(in: range, with: "\"scalar\":NaN").utf8
            )
        case "replace_profile_with_control":
            let data = try JSONSerialization.data(withJSONObject: message)
            guard let json = String(data: data, encoding: .utf8),
                  let range = json.range(of: "\"profile\":\"lightweight\"")
            else {
                throw FixtureError.invalidFixture
            }
            return Data(
                json.replacingCharacters(
                    in: range,
                    with: "\"profile\":\"light\\nweight\""
                ).utf8
            )
        case "raw_invalid_utf8":
            return Data([0x7B, 0x22, 0x78, 0x22, 0x3A, 0x22, 0xFF, 0x22, 0x7D])
        case "duplicate_reduced_motion_key":
            let data = try JSONSerialization.data(withJSONObject: message)
            guard let json = String(data: data, encoding: .utf8),
                  let range = json.range(of: "\"reduced_motion\":false")
            else {
                throw FixtureError.invalidFixture
            }
            return Data(
                json.replacingCharacters(
                    in: range,
                    with: "\"reduced_motion\":false,\"reduced_motion\":true"
                ).utf8
            )
        default:
            throw FixtureError.invalidFixture
        }
    }

    private func fixtureURLs(in directory: String) throws -> [URL] {
        try FileManager.default.contentsOfDirectory(
            at: fixtureRoot.appendingPathComponent(directory),
            includingPropertiesForKeys: nil
        )
        .filter { $0.pathExtension == "json" }
        .sorted { $0.lastPathComponent < $1.lastPathComponent }
    }

    private func commandDecoder() -> PresentationCommandDecoder {
        PresentationCommandDecoder(sessionID: UUID(uuidString: Self.sessionID)!)
    }

    private func observationDecoder() -> PresentationObservationDecoder {
        PresentationObservationDecoder(sessionID: UUID(uuidString: Self.sessionID)!)
    }

    private func command(
        sequence: UInt64 = 1,
        type: String,
        payload: [String: Any]
    ) -> Data {
        try! JSONSerialization.data(withJSONObject: [
            "schema": BridgeContract.commandSchema,
            "session_id": Self.sessionID,
            "sequence": sequence,
            "type": type,
            "payload": payload,
        ])
    }

    private func observation(type: String, payload: [String: Any]) -> Data {
        try! JSONSerialization.data(withJSONObject: [
            "schema": BridgeContract.observationSchema,
            "session_id": Self.sessionID,
            "sequence": 1,
            "caused_by_sequence": NSNull(),
            "type": type,
            "payload": payload,
        ])
    }

    private static let sessionID = "11111111-1111-4111-8111-111111111111"
    private static let generationID = "33333333-3333-4333-8333-333333333333"
    private static let playbackID = "44444444-4444-4444-8444-444444444444"
}

private enum FixtureError: Error {
    case invalidFixture
}
