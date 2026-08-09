import Foundation
import Testing
@testable import MillerAvatarCore

@Suite struct MotionAdmissionTests {
    @Test func admitsMinimalVRMAWithExactSummary() throws {
        let bytes = try SyntheticGLBFactory.makeMotion()
        let result = MotionAdmission().admitSynchronously(bytes)

        guard case let .admitted(motion) = result else {
            Issue.record("minimal VRMA was rejected")
            return
        }
        #expect(motion.bytes == bytes)
        #expect(motion.summary.nodeCount == 1)
        #expect(motion.summary.channelCount == 1)
        #expect(motion.summary.keyframeScalarValues == 8)
        #expect(motion.summary.durationMilliseconds == 1_000)
        #expect(!motion.summary.hasExpressionTracks)
        #expect(!motion.summary.hasLookAtTrack)
    }

    @Test func asyncAdmissionSharesTheSynchronousResult() async throws {
        let bytes = try SyntheticGLBFactory.makeMotion()
        let synchronous = MotionAdmission().admitSynchronously(bytes)
        let asynchronous = await MotionAdmission().admit(bytes)
        #expect(asynchronous.admissionEquivalent(to: synchronous))
    }

    @Test func rejectsAnimationDataThatOnlyFitsPaddedBINChunk() throws {
        for declaredByteLength in [29, 30, 31] {
            var document = SyntheticGLBFactory.minimalMotionDocument()
            document["buffers"] = [["byteLength": declaredByteLength]]

            #expect(
                MotionAdmission().admitSynchronously(
                    try SyntheticGLBFactory.makeMotion(document: document)
                ) == .rejected(.motionRejected)
            )
        }
    }

    @Test func rejectsMisalignedAnimationAccessorOffsets() throws {
        var document = SyntheticGLBFactory.minimalMotionDocument()
        var views = document["bufferViews"] as! [[String: Any]]
        views[1]["byteOffset"] = 9
        document["bufferViews"] = views
        document["buffers"] = [["byteLength": 36]]

        var binary = SyntheticGLBFactory.motionBinary()
        binary.append(Data(repeating: 0, count: 4))
        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: document, binary: binary)
            ) == .rejected(.motionRejected)
        )

        var accessorDocument = SyntheticGLBFactory.minimalMotionDocument()
        var accessorViews = accessorDocument["bufferViews"] as! [[String: Any]]
        accessorViews[1]["byteLength"] = 25
        accessorDocument["bufferViews"] = accessorViews
        var accessors = accessorDocument["accessors"] as! [[String: Any]]
        accessors[1]["byteOffset"] = 1
        accessorDocument["accessors"] = accessors
        accessorDocument["buffers"] = [["byteLength": 36]]
        var accessorBinary = SyntheticGLBFactory.motionBinary()
        accessorBinary.append(Data(repeating: 0, count: 4))
        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(
                    document: accessorDocument,
                    binary: accessorBinary
                )
            ) == .rejected(.motionRejected)
        )
    }

    @Test func rejectsExplicitAnimationByteStrideEvenWhenReadable() throws {
        var document = SyntheticGLBFactory.minimalMotionDocument()
        var views = document["bufferViews"] as! [[String: Any]]
        views[1]["byteLength"] = 36
        views[1]["byteStride"] = 24
        document["bufferViews"] = views
        document["buffers"] = [["byteLength": 44]]

        var binary = SyntheticGLBFactory.motionBinary()
        binary.append(Data(repeating: 0, count: 12))
        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: document, binary: binary)
            ) == .rejected(.motionRejected)
        )

        var nonNilPackedDocument = SyntheticGLBFactory.minimalMotionDocument()
        var nonNilPackedViews = nonNilPackedDocument["bufferViews"] as! [[String: Any]]
        nonNilPackedViews[1]["byteStride"] = 12
        nonNilPackedDocument["bufferViews"] = nonNilPackedViews
        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: nonNilPackedDocument)
            ) == .rejected(.motionRejected)
        )
    }

    @Test func requiresWellFormedReachableLookAtAndExpressionNodes() throws {
        var missingLookAtNode = SyntheticGLBFactory.minimalMotionDocument()
        var missingLookAtExtensions = missingLookAtNode["extensions"] as! [String: Any]
        var missingLookAtPayload = missingLookAtExtensions["VRMC_vrm_animation"] as! [String: Any]
        missingLookAtPayload["lookAt"] = [:]
        missingLookAtExtensions["VRMC_vrm_animation"] = missingLookAtPayload
        missingLookAtNode["extensions"] = missingLookAtExtensions

        var malformedOffset = SyntheticGLBFactory.minimalMotionDocument()
        var malformedOffsetExtensions = malformedOffset["extensions"] as! [String: Any]
        var malformedOffsetPayload = malformedOffsetExtensions["VRMC_vrm_animation"] as! [String: Any]
        malformedOffsetPayload["lookAt"] = [
            "node": 0,
            "offsetFromHeadBone": [0, 1],
        ]
        malformedOffsetExtensions["VRMC_vrm_animation"] = malformedOffsetPayload
        malformedOffset["extensions"] = malformedOffsetExtensions

        var missingExpressionNode = SyntheticGLBFactory.minimalMotionDocument()
        var missingExpressionExtensions = missingExpressionNode["extensions"] as! [String: Any]
        var missingExpressionPayload = missingExpressionExtensions["VRMC_vrm_animation"] as! [String: Any]
        missingExpressionPayload["expressions"] = [
            "preset": ["happy": [:]],
        ]
        missingExpressionExtensions["VRMC_vrm_animation"] = missingExpressionPayload
        missingExpressionNode["extensions"] = missingExpressionExtensions

        for document in [missingLookAtNode, malformedOffset, missingExpressionNode] {
            #expect(
                MotionAdmission().admitSynchronously(
                    try SyntheticGLBFactory.makeMotion(document: document)
                ) == .rejected(.motionRejected)
            )
        }
    }

    @Test func rejectsDefaultSceneRootThatIsAlsoAChild() throws {
        var document = SyntheticGLBFactory.minimalMotionDocument()
        document["nodes"] = [
            ["translation": [0, 1, 0], "children": [1]],
            ["translation": [0, 0, 0]],
        ]
        document["scenes"] = [["nodes": [0, 1]]]

        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: document)
            ) == .rejected(.motionRejected)
        )
    }

    @Test func rejectsExplicitNullOptionalStructuralFields() throws {
        let mutations: [(inout [String: Any]) -> Void] = [
            { document in
                var accessors = document["accessors"] as! [[String: Any]]
                accessors[0]["sparse"] = NSNull()
                document["accessors"] = accessors
            },
            { document in
                var accessors = document["accessors"] as! [[String: Any]]
                accessors[0]["byteOffset"] = NSNull()
                document["accessors"] = accessors
            },
            { document in
                var views = document["bufferViews"] as! [[String: Any]]
                views[0]["byteOffset"] = NSNull()
                document["bufferViews"] = views
            },
            { document in
                var views = document["bufferViews"] as! [[String: Any]]
                views[0]["byteStride"] = NSNull()
                document["bufferViews"] = views
            },
        ]

        for mutate in mutations {
            var document = SyntheticGLBFactory.minimalMotionDocument()
            mutate(&document)
            #expect(
                MotionAdmission().admitSynchronously(
                    try SyntheticGLBFactory.makeMotion(document: document)
                ) == .rejected(.motionRejected)
            )
        }
    }

    @Test func rejectsEmptyAnimationChannels() throws {
        var document = SyntheticGLBFactory.minimalMotionDocument()
        var animations = document["animations"] as! [[String: Any]]
        animations[0]["channels"] = []
        document["animations"] = animations

        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: document)
            ) == .rejected(.motionRejected)
        )
    }

    @Test func rejectsUnsafeUnsignedStructuralNumbers() throws {
        let values: [Any] = [
            NSNumber(value: Double(UInt64.max)),
            NSNumber(value: UInt64.max),
        ]
        for value in values {
            var document = SyntheticGLBFactory.minimalMotionDocument()
            document["buffers"] = [["byteLength": value]]
            #expect(
                MotionAdmission().admitSynchronously(
                    try SyntheticGLBFactory.makeMotion(document: document)
                ) == .rejected(.motionRejected)
            )
        }
    }

    @Test func distinguishesExactIntegerStringsFromUnsafeFloatingStructuralNumbers() throws {
        var exact = SyntheticGLBFactory.minimalMotionDocument()
        var exactAccessors = exact["accessors"] as! [[String: Any]]
        exactAccessors.append([
            "componentType": 5126,
            "count": NSNumber(value: UInt64.max),
            "type": "SCALAR",
        ])
        exact["accessors"] = exactAccessors
        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: exact)
            ).motionTestIsAdmitted
        )

        var unsafe = SyntheticGLBFactory.minimalMotionDocument()
        var unsafeAccessors = unsafe["accessors"] as! [[String: Any]]
        unsafeAccessors.append([
            "componentType": 5126,
            "count": NSNumber(value: Double(9_007_199_254_740_994)),
            "type": "SCALAR",
        ])
        unsafe["accessors"] = unsafeAccessors
        let unsafeJSON = try JSONSerialization.data(withJSONObject: unsafe)
        let unsafeJSONWithFraction = Data(
            String(decoding: unsafeJSON, as: UTF8.self)
                .replacingOccurrences(of: "9007199254740994", with: "9007199254740994.0")
                .utf8
        )
        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.make(
                    json: unsafeJSONWithFraction,
                    binary: SyntheticGLBFactory.motionBinary()
                )
            ) == .rejected(.motionRejected)
        )
    }

    @Test func admissionEnforcesEveryMotionBudgetAtItsMeasuredBoundary() throws {
        let document = SyntheticGLBFactory.minimalMotionDocument()
        let bytes = try SyntheticGLBFactory.makeMotion(document: document)
        let jsonObject = try JSONSerialization.jsonObject(with: Data(
            JSONSerialization.data(withJSONObject: document)
        ))
        let jsonValues = countJSONValues(jsonObject)
        let jsonNesting = maximumJSONDepth(jsonObject)
        let jsonLength = Int(bytes.uint32(at: 12))
        let actual = MotionBudget(
            capturedBytes: UInt64(bytes.count),
            jsonBytes: UInt64(jsonLength),
            jsonValues: jsonValues,
            jsonNesting: jsonNesting,
            nodes: 1,
            scenes: 1,
            bufferViews: 2,
            accessors: 2,
            samplers: 1,
            channels: 1,
            referencedBufferBytes: 32,
            keyframeScalarValues: 8,
            durationMilliseconds: 1_000,
            preflightNanoseconds: 100
        )

        #expect(MotionAdmission(budget: actual, monotonicNow: { 0 }).admitSynchronously(bytes).motionTestIsAdmitted)

        let belowBoundary: [MotionBudget] = [
            actual.with(capturedBytes: actual.capturedBytes - 1),
            actual.with(jsonBytes: actual.jsonBytes - 1),
            actual.with(jsonValues: actual.jsonValues - 1),
            actual.with(jsonNesting: actual.jsonNesting - 1),
            actual.with(nodes: 0),
            actual.with(scenes: 0),
            actual.with(bufferViews: 1),
            actual.with(accessors: 1),
            actual.with(samplers: 0),
            actual.with(channels: 0),
            actual.with(referencedBufferBytes: 31),
            actual.with(keyframeScalarValues: 7),
            actual.with(durationMilliseconds: 999),
        ]
        for budget in belowBoundary {
            #expect(
                MotionAdmission(budget: budget, monotonicNow: { 0 })
                    .admitSynchronously(bytes) == .rejected(.resourceLimit)
            )
        }

        let beforeBoundaryClock = AdmissionTestClock(values: [0, actual.preflightNanoseconds - 1])
        #expect(
            MotionAdmission(
                budget: actual,
                monotonicNow: { beforeBoundaryClock.now() }
            ).admitSynchronously(bytes).motionTestIsAdmitted
        )
        let boundaryClock = AdmissionTestClock(values: [0, actual.preflightNanoseconds])
        let elapsedAtBoundary = MotionAdmission(
            budget: actual,
            monotonicNow: { boundaryClock.now() }
        ).admitSynchronously(bytes)
        #expect(elapsedAtBoundary == .rejected(.resourceLimit))
    }

    @Test func suppliedTimeoutCannotExceedPreflightBudget() throws {
        let budget = MotionBudget.lightweight.with(preflightNanoseconds: 100)
        let clock = AdmissionTestClock(values: [0, 100])
        let result = MotionAdmission(
            budget: budget,
            timeoutNanoseconds: 101,
            monotonicNow: { clock.now() }
        ).admitSynchronously(try SyntheticGLBFactory.makeMotion())
        #expect(result == .rejected(.resourceLimit))
    }

    @Test func cancellationHasTheSameResultThroughAsyncAdmission() async throws {
        let bytes = try SyntheticGLBFactory.makeMotion()
        let admission = MotionAdmission(isCancelled: { true })
        let synchronous = admission.admitSynchronously(bytes)
        let asynchronous = await admission.admit(bytes)
        #expect(asynchronous == synchronous)
    }

    @Test func rejectsConstructibleStructuralArithmeticOverflow() throws {
        var document = SyntheticGLBFactory.minimalMotionDocument()
        var views = document["bufferViews"] as! [[String: Any]]
        views[1]["byteOffset"] = UInt64.max
        document["bufferViews"] = views

        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: document)
            ) == .rejected(.resourceLimit)
        )
    }

    @Test func acceptsStandardExpressionAndLookAtDeclarations() throws {
        var document = SyntheticGLBFactory.minimalMotionDocument()
        var extensionPayload = document["extensions"] as! [String: Any]
        var animationExtension = extensionPayload["VRMC_vrm_animation"] as! [String: Any]
        animationExtension["lookAt"] = [
            "node": 0,
            "offsetFromHeadBone": [0, 0, 0],
        ]
        animationExtension["expressions"] = [
            "preset": ["happy": ["node": 0]],
            "custom": [:],
        ]
        extensionPayload["VRMC_vrm_animation"] = animationExtension
        document["extensions"] = extensionPayload

        let result = MotionAdmission().admitSynchronously(
            try SyntheticGLBFactory.makeMotion(document: document)
        )
        guard case let .admitted(motion) = result else {
            Issue.record("standard declarations were rejected")
            return
        }
        #expect(!motion.summary.hasExpressionTracks)
        #expect(!motion.summary.hasLookAtTrack)
    }

    @Test func summarizesExpressionAndLookAtTracks() throws {
        var expressionDocument = SyntheticGLBFactory.minimalMotionDocument()
        expressionDocument["nodes"] = [
            ["translation": [0, 1, 0], "children": [1]],
            ["translation": [0, 0, 0]],
        ]
        var expressionExtensions = expressionDocument["extensions"] as! [String: Any]
        var expressionPayload = expressionExtensions["VRMC_vrm_animation"] as! [String: Any]
        expressionPayload["expressions"] = [
            "preset": ["happy": ["node": 1]],
        ]
        expressionExtensions["VRMC_vrm_animation"] = expressionPayload
        expressionDocument["extensions"] = expressionExtensions
        var expressionAnimations = expressionDocument["animations"] as! [[String: Any]]
        var expressionAnimation = expressionAnimations[0]
        expressionAnimation["channels"] = [[
            "sampler": 0,
            "target": ["node": 1, "path": "translation"],
        ]]
        expressionAnimations[0] = expressionAnimation
        expressionDocument["animations"] = expressionAnimations

        let expressionResult = MotionAdmission().admitSynchronously(
            try SyntheticGLBFactory.makeMotion(document: expressionDocument)
        )
        guard case let .admitted(expressionMotion) = expressionResult else {
            Issue.record("expression track was rejected")
            return
        }
        #expect(expressionMotion.summary.hasExpressionTracks)
        #expect(!expressionMotion.summary.hasLookAtTrack)

        var lookAtDocument = SyntheticGLBFactory.minimalMotionDocument()
        lookAtDocument["nodes"] = [
            ["translation": [0, 1, 0], "children": [1]],
            ["translation": [0, 0, 0]],
        ]
        var lookAtExtensions = lookAtDocument["extensions"] as! [String: Any]
        var lookAtPayload = lookAtExtensions["VRMC_vrm_animation"] as! [String: Any]
        lookAtPayload["lookAt"] = ["node": 1]
        lookAtExtensions["VRMC_vrm_animation"] = lookAtPayload
        lookAtDocument["extensions"] = lookAtExtensions
        lookAtDocument["buffers"] = [["byteLength": 40]]
        var lookAtViews = lookAtDocument["bufferViews"] as! [[String: Any]]
        lookAtViews[1]["byteLength"] = 32
        lookAtDocument["bufferViews"] = lookAtViews
        var lookAtAccessors = lookAtDocument["accessors"] as! [[String: Any]]
        lookAtAccessors[1]["type"] = "VEC4"
        lookAtDocument["accessors"] = lookAtAccessors
        var lookAtAnimations = lookAtDocument["animations"] as! [[String: Any]]
        var lookAtAnimation = lookAtAnimations[0]
        lookAtAnimation["channels"] = [[
            "sampler": 0,
            "target": ["node": 1, "path": "rotation"],
        ]]
        lookAtAnimations[0] = lookAtAnimation
        lookAtDocument["animations"] = lookAtAnimations

        let lookAtResult = MotionAdmission().admitSynchronously(
            try SyntheticGLBFactory.makeMotion(
                document: lookAtDocument,
                binary: SyntheticGLBFactory.motionBinary(
                    outputs: [0, 0, 0, 1, 0, 0, 0, 1]
                )
            )
        )
        guard case let .admitted(lookAtMotion) = lookAtResult else {
            Issue.record("look-at track was rejected")
            return
        }
        #expect(!lookAtMotion.summary.hasExpressionTracks)
        #expect(lookAtMotion.summary.hasLookAtTrack)
    }

    @Test func rejectsInvalidTimesAndNonfiniteKeyframes() throws {
        for times: [Float] in [[-1, 1], [0, 0], [1, 0]] {
            #expect(
                MotionAdmission().admitSynchronously(
                    try SyntheticGLBFactory.makeMotion(
                        binary: SyntheticGLBFactory.motionBinary(times: times)
                    )
                ) == .rejected(.motionRejected)
            )
        }
        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(
                    binary: SyntheticGLBFactory.motionBinary(
                        outputs: [.nan, 0, 0, 0, 0.1, 0]
                    )
                )
            ) == .rejected(.motionRejected)
        )
    }

    @Test func admitsStepAndCubicSplineCardinality() throws {
        var stepDocument = SyntheticGLBFactory.minimalMotionDocument()
        var stepAnimations = stepDocument["animations"] as! [[String: Any]]
        var stepAnimation = stepAnimations[0]
        stepAnimation["samplers"] = [["input": 0, "interpolation": "STEP", "output": 1]]
        stepAnimations[0] = stepAnimation
        stepDocument["animations"] = stepAnimations
        #expect(
            MotionAdmission().admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: stepDocument)
            ).motionTestIsAdmitted
        )

        var cubicDocument = SyntheticGLBFactory.minimalMotionDocument()
        cubicDocument["buffers"] = [["byteLength": 80]]
        var cubicViews = cubicDocument["bufferViews"] as! [[String: Any]]
        cubicViews[1]["byteLength"] = 72
        cubicDocument["bufferViews"] = cubicViews
        var cubicAccessors = cubicDocument["accessors"] as! [[String: Any]]
        cubicAccessors[1]["count"] = 6
        cubicDocument["accessors"] = cubicAccessors
        var cubicAnimations = cubicDocument["animations"] as! [[String: Any]]
        var cubicAnimation = cubicAnimations[0]
        cubicAnimation["samplers"] = [["input": 0, "interpolation": "CUBICSPLINE", "output": 1]]
        cubicAnimations[0] = cubicAnimation
        cubicDocument["animations"] = cubicAnimations
        let cubicResult = MotionAdmission().admitSynchronously(
            try SyntheticGLBFactory.makeMotion(
                document: cubicDocument,
                binary: SyntheticGLBFactory.motionBinary(
                    outputs: Array(repeating: Float(0), count: 18)
                )
            )
        )
        guard case let .admitted(cubicMotion) = cubicResult else {
            Issue.record("valid CUBICSPLINE track was rejected")
            return
        }
        #expect(cubicMotion.summary.keyframeScalarValues == 20)
    }

    @Test(arguments: [
        "assetVersion", "missingExtension", "draftVersion", "missingScene",
        "invalidScene", "unreachableBone", "cycle", "missingHips", "zeroHips",
        "zeroAnimations", "multipleAnimations", "externalURI", "badBufferView",
        "badAccessor", "badSampler", "badChannel", "unknownTarget", "weights",
        "scale", "nonHipsTranslation", "duplicateChannel", "sparse", "normalized", "wrongComponent",
        "wrongInputType", "wrongOutputType", "wrongCardinality", "unknownInterpolation",
        "bufferOverrun",
    ])
    func rejectsStructuralMotion(caseName: String) throws {
        var document = SyntheticGLBFactory.minimalMotionDocument()
        try mutate(&document, for: caseName)
        let result = MotionAdmission().admitSynchronously(
            try SyntheticGLBFactory.makeMotion(document: document)
        )
        #expect(result == .rejected(.motionRejected))
    }

    @Test func preservesModelRejectionForRootAnimations() async throws {
        var document = SyntheticGLBFactory.minimalDocument()
        document["animations"] = [[
            "channels": [],
            "samplers": [],
        ]]
        let result = await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: document)
        )
        if case .admitted = result {
            Issue.record("model GLB with root animations was admitted")
        }
    }

    @Test func cancellationIsDistinctFromResourceFailure() throws {
        let admission = MotionAdmission(isCancelled: { true })
        #expect(
            admission.admitSynchronously(try SyntheticGLBFactory.makeMotion())
                == .rejected(.cancelled)
        )
    }

    @Test func everyMotionBudgetIsEnforced() throws {
        let baseline = SyntheticGLBFactory.makeMotionDocument()
        let cases: [MotionBudget] = [
            makeBudget(nodes: 0),
            makeBudget(scenes: 0),
            makeBudget(bufferViews: 1),
            makeBudget(accessors: 1),
            makeBudget(samplers: 0),
            makeBudget(channels: 0),
            makeBudget(referencedBufferBytes: 31),
            makeBudget(keyframeScalarValues: 7),
            makeBudget(durationMilliseconds: 999),
        ]
        for budget in cases {
            let result = MotionAdmission(budget: budget).admitSynchronously(
                try SyntheticGLBFactory.makeMotion(document: baseline.document, binary: baseline.binary)
            )
            #expect(result == .rejected(.resourceLimit))
        }
    }

    private func mutate(_ document: inout [String: Any], for name: String) throws {
        switch name {
        case "assetVersion":
            document["asset"] = ["version": "1.0"]
        case "missingExtension":
            document["extensions"] = [:]
        case "draftVersion":
            var extensions = document["extensions"] as! [String: Any]
            extensions["VRMC_vrm_animation"] = ["specVersion": "1.0-draft"]
            document["extensions"] = extensions
        case "missingScene":
            document.removeValue(forKey: "scene")
            document.removeValue(forKey: "scenes")
        case "invalidScene":
            document["scene"] = 3
        case "unreachableBone":
            document["scenes"] = [["nodes": []]]
        case "cycle":
            document["nodes"] = [["translation": [0, 1, 0], "children": [0]]]
        case "missingHips":
            var extensions = document["extensions"] as! [String: Any]
            extensions["VRMC_vrm_animation"] = [
                "specVersion": "1.0",
                "humanoid": ["humanBones": [:]],
            ]
            document["extensions"] = extensions
        case "zeroHips":
            document["nodes"] = [["translation": [0, 0, 0]]]
        case "zeroAnimations":
            document["animations"] = []
        case "multipleAnimations":
            var animations = document["animations"] as! [[String: Any]]
            animations.append(animations[0])
            document["animations"] = animations
        case "externalURI":
            document["buffers"] = [["byteLength": 32, "uri": "motion.bin"]]
        case "badBufferView":
            document["accessors"] = [["bufferView": 99, "componentType": 5126, "count": 2, "type": "SCALAR"]]
        case "badAccessor":
            var animations = document["animations"] as! [[String: Any]]
            var animation = animations[0]
            animation["samplers"] = [["input": 99, "output": 1]]
            animations[0] = animation
            document["animations"] = animations
        case "badSampler":
            var animations = document["animations"] as! [[String: Any]]
            var animation = animations[0]
            animation["channels"] = [["sampler": 99, "target": ["node": 0, "path": "translation"]]]
            animations[0] = animation
            document["animations"] = animations
        case "badChannel":
            var animations = document["animations"] as! [[String: Any]]
            var animation = animations[0]
            animation["channels"] = [["sampler": 0, "target": ["node": 99, "path": "translation"]]]
            animations[0] = animation
            document["animations"] = animations
        case "unknownTarget", "weights", "scale":
            var animations = document["animations"] as! [[String: Any]]
            var animation = animations[0]
            var channel = animation["channels"] as! [[String: Any]]
            var target = channel[0]["target"] as! [String: Any]
            target["path"] = name == "unknownTarget" ? "rotationX" : name
            channel[0]["target"] = target
            animation["channels"] = channel
            animations[0] = animation
            document["animations"] = animations
        case "nonHipsTranslation":
            document["nodes"] = [
                ["translation": [0, 1, 0], "children": [1]],
                ["translation": [0, 1, 0]],
            ]
            var animations = document["animations"] as! [[String: Any]]
            var animation = animations[0]
            animation["channels"] = [["sampler": 0, "target": ["node": 1, "path": "translation"]]]
            animations[0] = animation
            document["animations"] = animations
        case "duplicateChannel":
            var animations = document["animations"] as! [[String: Any]]
            var animation = animations[0]
            animation["channels"] = [
                ["sampler": 0, "target": ["node": 0, "path": "translation"]],
                ["sampler": 0, "target": ["node": 0, "path": "translation"]],
            ]
            animations[0] = animation
            document["animations"] = animations
        case "sparse":
            var accessors = document["accessors"] as! [[String: Any]]
            accessors[0]["sparse"] = ["count": 1]
            document["accessors"] = accessors
        case "normalized":
            var accessors = document["accessors"] as! [[String: Any]]
            accessors[0]["normalized"] = true
            document["accessors"] = accessors
        case "wrongComponent":
            var accessors = document["accessors"] as! [[String: Any]]
            accessors[0]["componentType"] = 5123
            document["accessors"] = accessors
        case "wrongInputType":
            var accessors = document["accessors"] as! [[String: Any]]
            accessors[0]["type"] = "VEC2"
            document["accessors"] = accessors
        case "wrongOutputType":
            var accessors = document["accessors"] as! [[String: Any]]
            accessors[1]["type"] = "VEC4"
            document["accessors"] = accessors
        case "wrongCardinality":
            var accessors = document["accessors"] as! [[String: Any]]
            accessors[1]["count"] = 1
            document["accessors"] = accessors
        case "unknownInterpolation":
            var animations = document["animations"] as! [[String: Any]]
            var animation = animations[0]
            animation["samplers"] = [["input": 0, "interpolation": "UNKNOWN", "output": 1]]
            animations[0] = animation
            document["animations"] = animations
        case "bufferOverrun":
            var views = document["bufferViews"] as! [[String: Any]]
            views[1]["byteLength"] = 128
            document["bufferViews"] = views
        default:
            break
        }
    }

    private func makeBudget(
        capturedBytes: UInt64 = MotionBudget.lightweight.capturedBytes,
        jsonBytes: UInt64 = MotionBudget.lightweight.jsonBytes,
        jsonValues: UInt64 = MotionBudget.lightweight.jsonValues,
        jsonNesting: UInt64 = MotionBudget.lightweight.jsonNesting,
        nodes: UInt64 = MotionBudget.lightweight.nodes,
        scenes: UInt64 = MotionBudget.lightweight.scenes,
        bufferViews: UInt64 = MotionBudget.lightweight.bufferViews,
        accessors: UInt64 = MotionBudget.lightweight.accessors,
        samplers: UInt64 = MotionBudget.lightweight.samplers,
        channels: UInt64 = MotionBudget.lightweight.channels,
        referencedBufferBytes: UInt64 = MotionBudget.lightweight.referencedBufferBytes,
        keyframeScalarValues: UInt64 = MotionBudget.lightweight.keyframeScalarValues,
        durationMilliseconds: UInt64 = MotionBudget.lightweight.durationMilliseconds,
        preflightNanoseconds: UInt64 = MotionBudget.lightweight.preflightNanoseconds
    ) -> MotionBudget {
        MotionBudget(
            capturedBytes: capturedBytes,
            jsonBytes: jsonBytes,
            jsonValues: jsonValues,
            jsonNesting: jsonNesting,
            nodes: nodes,
            scenes: scenes,
            bufferViews: bufferViews,
            accessors: accessors,
            samplers: samplers,
            channels: channels,
            referencedBufferBytes: referencedBufferBytes,
            keyframeScalarValues: keyframeScalarValues,
            durationMilliseconds: durationMilliseconds,
            preflightNanoseconds: preflightNanoseconds
        )
    }
}

private extension MotionAdmissionResult {
    var motionTestIsAdmitted: Bool {
        if case .admitted = self { return true }
        return false
    }

    func admissionEquivalent(to other: MotionAdmissionResult) -> Bool {
        switch (self, other) {
        case let (.rejected(lhs), .rejected(rhs)):
            return lhs == rhs
        case let (.admitted(lhs), .admitted(rhs)):
            return lhs.bytes == rhs.bytes && lhs.summary == rhs.summary
        default:
            return false
        }
    }
}

private extension MotionBudget {
    func with(
        capturedBytes: UInt64? = nil,
        jsonBytes: UInt64? = nil,
        jsonValues: UInt64? = nil,
        jsonNesting: UInt64? = nil,
        nodes: UInt64? = nil,
        scenes: UInt64? = nil,
        bufferViews: UInt64? = nil,
        accessors: UInt64? = nil,
        samplers: UInt64? = nil,
        channels: UInt64? = nil,
        referencedBufferBytes: UInt64? = nil,
        keyframeScalarValues: UInt64? = nil,
        durationMilliseconds: UInt64? = nil,
        preflightNanoseconds: UInt64? = nil
    ) -> MotionBudget {
        MotionBudget(
            capturedBytes: capturedBytes ?? self.capturedBytes,
            jsonBytes: jsonBytes ?? self.jsonBytes,
            jsonValues: jsonValues ?? self.jsonValues,
            jsonNesting: jsonNesting ?? self.jsonNesting,
            nodes: nodes ?? self.nodes,
            scenes: scenes ?? self.scenes,
            bufferViews: bufferViews ?? self.bufferViews,
            accessors: accessors ?? self.accessors,
            samplers: samplers ?? self.samplers,
            channels: channels ?? self.channels,
            referencedBufferBytes: referencedBufferBytes ?? self.referencedBufferBytes,
            keyframeScalarValues: keyframeScalarValues ?? self.keyframeScalarValues,
            durationMilliseconds: durationMilliseconds ?? self.durationMilliseconds,
            preflightNanoseconds: preflightNanoseconds ?? self.preflightNanoseconds
        )
    }
}

private func countJSONValues(_ value: Any) -> UInt64 {
    if let object = value as? [String: Any] {
        return 1 + object.values.reduce(0) { $0 + countJSONValues($1) }
    }
    if let array = value as? [Any] {
        return 1 + array.reduce(0) { $0 + countJSONValues($1) }
    }
    return 1
}

private func maximumJSONDepth(_ value: Any, depth: UInt64 = 1) -> UInt64 {
    if let object = value as? [String: Any] {
        return object.values.map { maximumJSONDepth($0, depth: depth + 1) }.max() ?? depth
    }
    if let array = value as? [Any] {
        return array.map { maximumJSONDepth($0, depth: depth + 1) }.max() ?? depth
    }
    return depth
}

private extension Data {
    func uint32(at offset: Int) -> UInt32 {
        subdata(in: offset..<(offset + 4)).withUnsafeBytes {
            UInt32(littleEndian: $0.loadUnaligned(as: UInt32.self))
        }
    }
}

private final class AdmissionTestClock: @unchecked Sendable {
    private var values: [UInt64]
    private var index = 0

    init(values: [UInt64]) {
        self.values = values
    }

    func now() -> UInt64 {
        defer { index = min(index + 1, values.count - 1) }
        return values[index]
    }
}
