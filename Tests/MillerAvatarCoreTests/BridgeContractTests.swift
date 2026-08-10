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
                == "miller-avatar.presentation-command/v2"
        )
        #expect(
            BridgeContract.observationSchema
                == "miller-avatar.presentation-observation/v2"
        )
        #expect(BridgeContract.maximumMessageBytes == 16_384)
        #expect(BridgeContract.maximumContainerDepth == 8)
        #expect(BridgeContract.maximumArrayLength == 64)
        #expect(BridgeContract.maximumSafeInteger == 9_007_199_254_740_991)
    }

    @Test func everyValidFixtureIsAccepted() throws {
        let fixtures = try fixtureURLs(in: "valid")
        #expect(fixtures.count == 19)
        #expect(
            Set(fixtures.map { $0.deletingPathExtension().lastPathComponent })
                == [
                "command-configure", "command-load-profile", "command-project-phase",
                "command-project-succeeded",
                "command-set-visibility", "command-set-policy", "command-set-mouth",
                "command-reset", "command-dispose", "observation-wrapper-ready",
                "observation-renderer-ready", "observation-profile-model-loaded",
                "observation-first-frame", "observation-suspended", "observation-resumed",
                "observation-disposed", "observation-failed",
                "observation-motion-status", "observation-motion-active",
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
            "observation-profile-model-loaded", "command-missing-required-field",
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
        {"schema":"miller-avatar.presentation-command/v2","session_id":"11111111-1111-4111-8111-111111111111","sequence":1,"type":"configure","payload":{"profile":"lightweight","reduced_motion":false,"reduced_motion":true}}
        """
        #expect(throws: (any Error).self) {
            try commandDecoder().decode(Data(raw.utf8))
        }
    }

    @Test func loadProfileRequiresExactBindingsAndOnlyLoadsOnce() throws {
        let decoder = commandDecoder()
        let bindings = Dictionary(uniqueKeysWithValues: AvatarMotionRole.allCases.map { role in
            (role.rawValue, ["status": "missing", "token": NSNull()] as [String: Any])
        })
        let message = command(
            type: "load_profile",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "motion_bindings": bindings,
            ]
        )
        let envelope = try decoder.decode(message)
        guard case .loadProfile(let payload) = envelope.command else {
            Issue.record("expected load_profile")
            return
        }
        #expect(payload.profileRevision == 1)
        #expect(payload.modelToken == UUID(uuidString: Self.modelToken))
        #expect(payload.motionBindings.count == AvatarMotionRole.allCases.count)
        #expect(throws: BridgeContractError.invalidSequence) {
            try decoder.decode(command(
                sequence: 2,
                type: "load_profile",
                payload: [
                    "profile_revision": 1,
                    "model_token": Self.modelToken,
                    "motion_bindings": bindings,
                ]
            ))
        }

        for mutation in [
            "missing_role", "extra_role", "extra_descriptor_key", "ready_without_token",
            "missing_with_token", "unknown_status",
        ] {
            var mutated = bindings
            switch mutation {
            case "missing_role": mutated.removeValue(forKey: AvatarMotionRole.failure.rawValue)
            case "extra_role": mutated["unexpected"] = ["status": "missing", "token": NSNull()]
            case "extra_descriptor_key":
                var descriptor = mutated[AvatarMotionRole.idle.rawValue]!
                descriptor["extra"] = false
                mutated[AvatarMotionRole.idle.rawValue] = descriptor
            case "ready_without_token": mutated[AvatarMotionRole.idle.rawValue] = ["status": "ready", "token": NSNull()]
            case "missing_with_token": mutated[AvatarMotionRole.idle.rawValue] = ["status": "missing", "token": Self.motionToken]
            case "unknown_status": mutated[AvatarMotionRole.idle.rawValue] = ["status": "unknown", "token": NSNull()]
            default: Issue.record("unknown mutation"); continue
            }
            #expect(throws: (any Error).self) {
                try commandDecoder().decode(command(
                    type: "load_profile",
                    payload: [
                        "profile_revision": 1,
                        "model_token": Self.modelToken,
                        "motion_bindings": mutated,
                    ]
                ))
            }
        }
    }

    @Test func profileObservationsFenceIdentityCausalityAndDisposal() throws {
        let expectedProfile = LoadProfilePayload(
            profileRevision: 1,
            modelToken: UUID(uuidString: Self.modelToken)!,
            motionBindings: Dictionary(uniqueKeysWithValues: AvatarMotionRole.allCases.map { role in
                (role, role == .idle ? .ready(token: UUID(uuidString: Self.motionToken)!) : .missing)
            })
        )
        let decoder = PresentationObservationDecoder(
            sessionID: UUID(uuidString: Self.sessionID)!,
            expectedProfile: expectedProfile,
            expectedProfileLoadSequence: 4
        )
        decoder.setExpectedPhaseCauseSequence(9)
        _ = try decoder.decode(observation(
            sequence: 1,
            causedBySequence: 4,
            type: "profile_model_loaded",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "capabilities": ["aa": true, "look_at": true, "spring_bone": false, "mtoon_materials": 1],
            ]
        ))
        _ = try decoder.decode(observation(
            sequence: 2,
            causedBySequence: 4,
            type: "first_frame",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "viewport_width": 800,
                "viewport_height": 600,
                "visible_meshes": 1,
                "decoded_textures": 2,
                "material_bindings": 2,
                "alpha_probe_pixels": 5,
            ]
        ))
        _ = try decoder.decode(observation(
            sequence: 3,
            causedBySequence: 4,
            type: "motion_status",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "motion_token": Self.motionToken,
                "role": "idle",
                "status": "ready",
                "motion_code": NSNull(),
            ]
        ))
        _ = try decoder.decode(observation(
            sequence: 4,
            causedBySequence: 9,
            type: "motion_active",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "motion_token": Self.motionToken,
                "role": "idle",
                "mode": "loop",
            ]
        ))

        let stale = PresentationObservationDecoder(
            sessionID: UUID(uuidString: Self.sessionID)!,
            expectedProfile: expectedProfile,
            expectedProfileLoadSequence: 4
        )
        _ = try stale.decode(observation(
            sequence: 1,
            causedBySequence: 4,
            type: "profile_model_loaded",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "capabilities": ["aa": true, "look_at": true, "spring_bone": false, "mtoon_materials": 1],
            ]
        ))
        #expect(throws: BridgeContractError.staleSession) {
            try stale.decode(observation(
                sequence: 2,
                causedBySequence: 4,
                type: "first_frame",
                payload: [
                    "profile_revision": 2,
                    "model_token": Self.modelToken,
                    "viewport_width": 800,
                    "viewport_height": 600,
                    "visible_meshes": 1,
                    "decoded_textures": 2,
                    "material_bindings": 2,
                    "alpha_probe_pixels": 5,
                ]
            ))
        }

        let disposed = observationDecoder()
        _ = try disposed.decode(observation(type: "disposed", payload: ["reason": "operator"]))
        #expect(throws: BridgeContractError.disposed) {
            try disposed.decode(observation(
                sequence: 2,
                causedBySequence: 1,
                type: "motion_status",
                payload: [
                    "profile_revision": 1,
                    "model_token": Self.modelToken,
                    "motion_token": Self.motionToken,
                    "role": "idle",
                    "status": "ready",
                    "motion_code": NSNull(),
                ]
            ))
        }
    }

    @Test func defaultObservationDecoderAnchorsLoadCauseAndRejectsStaleOrDisposedEvents() throws {
        let decoder = observationDecoder()
        _ = try decoder.decode(observation(
            sequence: 1,
            causedBySequence: 7,
            type: "profile_model_loaded",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "capabilities": [
                    "aa": true,
                    "look_at": true,
                    "spring_bone": false,
                    "mtoon_materials": 1,
                ],
            ]
        ))

        #expect(throws: BridgeContractError.invalidSequence) {
            try decoder.decode(observation(
                sequence: 2,
                causedBySequence: 8,
                type: "first_frame",
                payload: [
                    "profile_revision": 1,
                    "model_token": Self.modelToken,
                    "viewport_width": 800,
                    "viewport_height": 600,
                    "visible_meshes": 1,
                    "decoded_textures": 2,
                    "material_bindings": 2,
                    "alpha_probe_pixels": 5,
                ]
            ))
        }
        _ = try decoder.decode(observation(
            sequence: 2,
            causedBySequence: 7,
            type: "first_frame",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "viewport_width": 800,
                "viewport_height": 600,
                "visible_meshes": 1,
                "decoded_textures": 2,
                "material_bindings": 2,
                "alpha_probe_pixels": 5,
            ]
        ))

        #expect(throws: BridgeContractError.staleSession) {
            try decoder.decode(observation(
                sequence: 3,
                causedBySequence: 7,
                type: "motion_status",
                payload: [
                    "profile_revision": 1,
                    "model_token": "99999999-9999-4999-8999-999999999999",
                    "motion_token": Self.motionToken,
                    "role": "idle",
                    "status": "ready",
                    "motion_code": NSNull(),
                ]
            ))
        }
        _ = try decoder.decode(observation(
            sequence: 3,
            causedBySequence: 7,
            type: "motion_status",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "motion_token": Self.motionToken,
                "role": "idle",
                "status": "ready",
                "motion_code": NSNull(),
            ]
        ))

        _ = try decoder.decode(observation(
            sequence: 4,
            causedBySequence: nil,
            type: "disposed",
            payload: ["reason": "operator"]
        ))
        #expect(throws: BridgeContractError.disposed) {
            try decoder.decode(observation(
                sequence: 5,
                causedBySequence: 7,
                type: "first_frame",
                payload: [
                    "profile_revision": 1,
                    "model_token": Self.modelToken,
                    "viewport_width": 800,
                    "viewport_height": 600,
                    "visible_meshes": 1,
                    "decoded_textures": 2,
                    "material_bindings": 2,
                    "alpha_probe_pixels": 5,
                ]
            ))
        }
    }

    @Test func motionStatusAndActiveModeMatricesAreClosed() throws {
        for status in MotionStatus.allCases {
            let token: Any = [.ready, .loadFailed, .timedOut, .runtimeFailed].contains(status)
                ? Self.motionToken
                : NSNull()
            let code: Any = switch status {
            case .loadFailed: "motion_load_failed"
            case .timedOut: "motion_load_timeout"
            case .runtimeFailed: "motion_runtime_failed"
            default: NSNull()
            }
            let decoder = observationDecoder()
            _ = try decoder.decode(observation(
                sequence: 1,
                causedBySequence: 1,
                type: "profile_model_loaded",
                payload: [
                    "profile_revision": 1,
                    "model_token": Self.modelToken,
                    "capabilities": ["aa": true, "look_at": true, "spring_bone": false, "mtoon_materials": 1],
                ]
            ))
            #expect(throws: Never.self) {
                try decoder.decode(observation(
                    sequence: 2,
                    causedBySequence: 1,
                    type: "motion_status",
                    payload: [
                        "profile_revision": 1,
                        "model_token": Self.modelToken,
                        "motion_token": token,
                        "role": "idle",
                        "status": status.rawValue,
                        "motion_code": code,
                    ]
                ))
            }
        }

        for payload in [
            ["profile_revision": 1, "model_token": Self.modelToken, "motion_token": Self.motionToken, "role": "success", "mode": "loop"] as [String: Any],
            ["profile_revision": 1, "model_token": Self.modelToken, "motion_token": Self.motionToken, "role": "idle", "mode": "one_shot"],
            ["profile_revision": 1, "model_token": Self.modelToken, "motion_token": NSNull(), "role": "idle", "mode": "rest"],
            ["profile_revision": 1, "model_token": Self.modelToken, "motion_token": Self.motionToken, "role": NSNull(), "mode": "rest"],
        ] {
            let decoder = observationDecoder()
            _ = try decoder.decode(observation(
                sequence: 1,
                causedBySequence: 1,
                type: "profile_model_loaded",
                payload: [
                    "profile_revision": 1,
                    "model_token": Self.modelToken,
                    "capabilities": ["aa": true, "look_at": true, "spring_bone": false, "mtoon_materials": 1],
                ]
            ))
            #expect(throws: (any Error).self) {
                try decoder.decode(observation(sequence: 2, causedBySequence: 8, type: "motion_active", payload: payload))
            }
        }

        // resource_limit is intentionally shared with the terminal renderer vocabulary.
        for code in MotionFailureCode.allCases where code != .resourceLimit {
            #expect(throws: (any Error).self) {
                try observationDecoder().decode(observation(
                    type: "failed",
                    payload: ["code": code.rawValue, "operation": "load"]
                ))
            }
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

    @Test func succeededPhaseIsAcceptedByTheSwiftCommandValidator() {
        #expect(throws: Never.self) {
            try commandDecoder().decode(command(
                type: "project_phase",
                payload: [
                    "projection_sequence": 1,
                    "generation_id": Self.generationID,
                    "phase": "succeeded",
                    "playback_id": NSNull(),
                ]
            ))
        }
    }

    @Test func runtimeMotionFailureMayCarryItsActiveProjectionCause() throws {
        let expectedProfile = LoadProfilePayload(
            profileRevision: 1,
            modelToken: UUID(uuidString: Self.modelToken)!,
            motionBindings: Dictionary(uniqueKeysWithValues: AvatarMotionRole.allCases.map { role in
                (role, role == .idle ? .ready(token: UUID(uuidString: Self.motionToken)!) : .missing)
            })
        )
        let decoder = PresentationObservationDecoder(
            sessionID: UUID(uuidString: Self.sessionID)!,
            expectedProfile: expectedProfile,
            expectedProfileLoadSequence: 1
        )
        _ = try decoder.decode(observation(
            sequence: 1,
            causedBySequence: 1,
            type: "profile_model_loaded",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "capabilities": ["aa": true, "look_at": true, "spring_bone": false, "mtoon_materials": 1],
            ]
        ))
        _ = try decoder.decode(observation(
            sequence: 2,
            causedBySequence: 9,
            type: "motion_status",
            payload: [
                "profile_revision": 1,
                "model_token": Self.modelToken,
                "motion_token": Self.motionToken,
                "role": "idle",
                "status": "runtime_failed",
                "motion_code": "motion_runtime_failed",
            ]
        ))
    }

    @Test func reconcilePayloadRetainsProjectionSequenceAndClearsWebLeaseHistory() throws {
        let decoder = commandDecoder()
        _ = try decoder.decode(command(
            sequence: 1,
            type: "project_phase",
            payload: [
                "projection_sequence": 4,
                "generation_id": Self.generationID,
                "phase": "speaking",
                "playback_id": Self.playbackID,
            ]
        ))
        _ = try decoder.decode(command(
            sequence: 2,
            type: "set_visibility",
            payload: ["visibility": "hidden"]
        ))
        let envelope = try decoder.decode(command(
            sequence: 3,
            type: "reconcile_presentation",
            payload: [
                "last_projection_sequence": 4,
                "generation_id": Self.generationID,
                "phase": "speaking",
                "playback_id": Self.playbackID,
                "reduced_motion": true,
            ]
        ))
        #expect(envelope.command == .reconcilePresentation(.init(
            lastProjectionSequence: 4,
            generationID: UUID(uuidString: Self.generationID),
            phase: .speaking,
            playbackID: UUID(uuidString: Self.playbackID),
            reducedMotion: true
        )))
        #expect(throws: BridgeContractError.invalidSequence) {
            try decoder.decode(command(
                sequence: 4,
                type: "project_phase",
                payload: [
                    "projection_sequence": 4,
                    "generation_id": NSNull(),
                    "phase": "idle",
                    "playback_id": NSNull(),
                ]
            ))
        }
    }

    @Test func allClosedCommandVocabulariesAreAccepted() throws {
        for phase in PresentationPhase.allCases {
            let generationID: Any
            let playbackID: Any
            switch phase {
            case .speaking:
                generationID = Self.generationID
                playbackID = Self.playbackID
            case .thinking, .responding, .succeeded, .stopped, .failed:
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
        observation(sequence: 1, causedBySequence: nil, type: type, payload: payload)
    }

    private func observation(
        sequence: UInt64,
        causedBySequence: UInt64?,
        type: String,
        payload: [String: Any]
    ) -> Data {
        try! JSONSerialization.data(withJSONObject: [
            "schema": BridgeContract.observationSchema,
            "session_id": Self.sessionID,
            "sequence": sequence,
            "caused_by_sequence": causedBySequence ?? NSNull(),
            "type": type,
            "payload": payload,
        ])
    }

    private static let sessionID = "11111111-1111-4111-8111-111111111111"
    private static let modelToken = "22222222-2222-4222-8222-222222222222"
    private static let motionToken = "33333333-3333-4333-8333-333333333333"
    private static let generationID = "33333333-3333-4333-8333-333333333333"
    private static let playbackID = "44444444-4444-4444-8444-444444444444"
}

private enum FixtureError: Error {
    case invalidFixture
}
