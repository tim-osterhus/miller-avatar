import Foundation
import MillerAvatarCore
import Testing
@testable import MillerAvatarHost

@Suite
struct V2ContractRedTests {
    @Test
    func loadProfileUsesTheClosedSixRoleBindingEnvelope() throws {
        let modelToken = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
        let motionToken = UUID(uuidString: "22222222-2222-4222-8222-222222222222")!
        let payload = LoadProfilePayload(
            profileRevision: 1,
            modelToken: modelToken,
            motionBindings: [
                .idle: .ready(token: motionToken),
                .listening: .missing,
                .thinking: .rejected,
                .speaking: .missing,
                .success: .missing,
                .failure: .missing,
            ]
        )

        let command = PresentationCommand.loadProfile(payload)
        #expect(command == .loadProfile(payload))
        #expect(AvatarMotionRole.allCases.count == 6)
    }

    @Test
    func motionStatusMatrixCarriesNullTokensOnlyForMissingOrRejected() throws {
        let modelToken = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
        let motionToken = UUID(uuidString: "22222222-2222-4222-8222-222222222222")!
        let ready = MotionStatusPayload(
            profileRevision: 1,
            modelToken: modelToken,
            motionToken: motionToken,
            role: .idle,
            status: .ready,
            motionCode: nil
        )
        #expect(ready.motionToken == motionToken)
        #expect(ready.motionCode == nil)
        #expect(MotionStatusPayload(
            profileRevision: 1,
            modelToken: modelToken,
            motionToken: nil,
            role: .idle,
            status: .missing,
            motionCode: nil
        ).motionToken == nil)
    }

    @Test
    func observationIdentityUsesThePreparedProfileAndKeepsMotionFailureNonterminal() throws {
        let sessionID = UUID(uuidString: "11111111-1111-4111-8111-111111111111")!
        let modelToken = UUID(uuidString: "22222222-2222-4222-8222-222222222222")!
        let motionToken = UUID(uuidString: "33333333-3333-4333-8333-333333333333")!
        let profile = LoadProfilePayload(
            profileRevision: 7,
            modelToken: modelToken,
            motionBindings: Dictionary(uniqueKeysWithValues: AvatarMotionRole.allCases.map {
                ($0, $0 == .speaking ? .ready(token: motionToken) : .missing)
            })
        )
        let decoder = PresentationObservationDecoder(
            sessionID: sessionID,
            expectedProfile: profile,
            expectedProfileLoadSequence: 4
        )

        _ = try decoder.decode(observation(
            sessionID: sessionID,
            sequence: 1,
            causedBySequence: 4,
            type: "profile_model_loaded",
            payload: [
                "profile_revision": 7,
                "model_token": modelToken.uuidString.lowercased(),
                "capabilities": [
                    "aa": true,
                    "look_at": true,
                    "spring_bone": false,
                    "mtoon_materials": 1,
                ],
            ]
        ))
        let failed = try decoder.decode(observation(
            sessionID: sessionID,
            sequence: 2,
            causedBySequence: 4,
            type: "motion_status",
            payload: [
                "profile_revision": 7,
                "model_token": modelToken.uuidString.lowercased(),
                "motion_token": motionToken.uuidString.lowercased(),
                "role": "speaking",
                "status": "runtime_failed",
                "motion_code": "motion_runtime_failed",
            ]
        ))

        #expect(failed.observation == .motionStatus(MotionStatusPayload(
            profileRevision: 7,
            modelToken: modelToken,
            motionToken: motionToken,
            role: .speaking,
            status: .runtimeFailed,
            motionCode: .motionRuntimeFailed
        )))
        #expect(throws: BridgeContractError.invalidValue) {
            try decoder.decode(observation(
                sessionID: sessionID,
                sequence: 3,
                causedBySequence: 4,
                type: "motion_status",
                payload: [
                    "profile_revision": 7,
                    "model_token": modelToken.uuidString.lowercased(),
                    "motion_token": motionToken.uuidString.lowercased(),
                    "role": "idle",
                    "status": "runtime_failed",
                    "motion_code": "motion_runtime_failed",
                ]
            ))
        }
    }

    private func observation(
        sessionID: UUID,
        sequence: UInt64,
        causedBySequence: UInt64?,
        type: String,
        payload: [String: Any]
    ) -> Data {
        let encodedCause: Any = causedBySequence.map { NSNumber(value: $0) } ?? NSNull()
        return try! JSONSerialization.data(withJSONObject: [
            "schema": BridgeContract.observationSchema,
            "session_id": sessionID.uuidString.lowercased(),
            "sequence": sequence,
            "caused_by_sequence": encodedCause,
            "type": type,
            "payload": payload,
        ])
    }
}

@Suite
struct V2ProfileRedTests {
    @Test
    func publicProfileSummaryContainsNoRawAssetFields() throws {
        let summary = AvatarProfileSummary(
            id: UUID(uuidString: "33333333-3333-4333-8333-333333333333")!,
            displayName: "Avatar",
            profileRevision: 1,
            modelCapturedByteCount: 3,
            modelConsecutiveLoadFailures: 0,
            modelStatus: .available,
            motions: [],
            motionBindings: [:]
        )
        #expect(summary.motions.isEmpty)
        #expect(summary.motionBindings.isEmpty)
    }

    @Test
    func storedProfileRevisionAndBindingsAreStrictlyBounded() throws {
        let motionID = UUID(uuidString: "44444444-4444-4444-8444-444444444444")!
        let profile = StoredAvatarProfile(
            id: UUID(uuidString: "55555555-5555-4555-8555-555555555555")!,
            displayName: "Avatar",
            modelBookmark: Data([1]),
            modelSHA256: String(repeating: "a", count: 64),
            capturedByteCount: 3,
            profileRevision: 1,
            motionLibrary: [motionID: StoredAvatarMotionReference(
                id: motionID,
                displayName: "Wave",
                bookmark: Data([2]),
                sha256: String(repeating: "b", count: 64),
                capturedByteCount: 4,
                consecutiveLoadFailures: 0,
                lastFailure: nil
            )],
            motionBindings: [.idle: motionID]
        )

        let encoded = try JSONEncoder().encode(profile)
        let decoded = try JSONDecoder().decode(StoredAvatarProfile.self, from: encoded)
        #expect(decoded == profile)
        #expect(profile.profileRevision == 1)
    }
}
