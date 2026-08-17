import Dispatch
import Foundation

package struct MotionAdmissionSummary: Equatable, Sendable {
    package let nodeCount: UInt64
    package let channelCount: UInt64
    package let keyframeScalarValues: UInt64
    package let durationMilliseconds: UInt64
    package let hasExpressionTracks: Bool
    package let hasLookAtTrack: Bool

    package init(
        nodeCount: UInt64,
        channelCount: UInt64,
        keyframeScalarValues: UInt64,
        durationMilliseconds: UInt64,
        hasExpressionTracks: Bool,
        hasLookAtTrack: Bool
    ) {
        self.nodeCount = nodeCount
        self.channelCount = channelCount
        self.keyframeScalarValues = keyframeScalarValues
        self.durationMilliseconds = durationMilliseconds
        self.hasExpressionTracks = hasExpressionTracks
        self.hasLookAtTrack = hasLookAtTrack
    }
}

package struct AdmittedMotion: Equatable, Sendable {
    package let token: UUID
    package let bytes: Data
    package let summary: MotionAdmissionSummary

    package init(token: UUID, bytes: Data, summary: MotionAdmissionSummary) {
        self.token = token
        self.bytes = bytes
        self.summary = summary
    }
}

package enum MotionAdmissionResult: Equatable, Sendable {
    case admitted(AdmittedMotion)
    case rejected(MotionFailureCode)
}

package struct MotionAdmission: Sendable {
    private let budget: MotionBudget
    private let timeoutNanoseconds: UInt64
    private let monotonicNow: @Sendable () -> UInt64
    private let isCancelled: @Sendable () -> Bool

    package init(
        budget: MotionBudget = .lightweight,
        timeoutNanoseconds: UInt64? = nil,
        monotonicNow: @escaping @Sendable () -> UInt64 = {
            DispatchTime.now().uptimeNanoseconds
        },
        isCancelled: @escaping @Sendable () -> Bool = {
            Task.isCancelled
        }
    ) {
        self.budget = budget
        self.timeoutNanoseconds = min(
            timeoutNanoseconds ?? budget.preflightNanoseconds,
            budget.preflightNanoseconds
        )
        self.monotonicNow = monotonicNow
        self.isCancelled = isCancelled
    }

    package func admit(_ capturedBytes: Data) async -> MotionAdmissionResult {
        await withTaskGroup(
            of: MotionAdmissionResult.self,
            returning: MotionAdmissionResult.self
        ) { group in
            group.addTask {
                admitSynchronously(capturedBytes)
            }
            return await group.next()!
        }
    }

    package func admitSynchronously(_ capturedBytes: Data) -> MotionAdmissionResult {
        let start = monotonicNow()
        let (deadline, overflow) = start.addingReportingOverflow(timeoutNanoseconds)
        guard !overflow else { return .rejected(.resourceLimit) }

        do {
            try checkpoint(deadline: deadline)
            let parsed = try GLBParser.parse(
                capturedBytes,
                limits: GLBParsingLimits(
                    capturedBytes: budget.capturedBytes,
                    jsonBytes: budget.jsonBytes,
                    jsonValues: budget.jsonValues,
                    jsonNesting: budget.jsonNesting
                ),
                checkpoint: { try self.checkpoint(deadline: deadline) }
            )
            try checkpoint(deadline: deadline)
            guard let document = try JSONSerialization.jsonObject(with: parsed.json)
                as? [String: Any]
            else {
                throw MotionAdmissionError.invalid
            }
            var validator = MotionSemanticValidator(
                document: document,
                binary: parsed.binary,
                hasBinaryChunk: parsed.hasBinaryChunk,
                budget: budget,
                checkpoint: { try self.checkpoint(deadline: deadline) }
            )
            let summary = try validator.validate()
            try checkpoint(deadline: deadline)
            return .admitted(
                AdmittedMotion(
                    token: UUID(),
                    bytes: capturedBytes,
                    summary: summary
                )
            )
        } catch is MotionCancellationError {
            return .rejected(.cancelled)
        } catch is MotionDeadlineError {
            return .rejected(.resourceLimit)
        } catch is AssetBudgetError {
            return .rejected(.resourceLimit)
        } catch let error as GLBParserError {
            switch error {
            case .fileTooLarge, .jsonTooComplex:
                return .rejected(.resourceLimit)
            default:
                return .rejected(.motionRejected)
            }
        } catch {
            return .rejected(.motionRejected)
        }
    }

    private func checkpoint(deadline: UInt64) throws {
        guard !isCancelled() else { throw MotionCancellationError.cancelled }
        guard monotonicNow() < deadline else { throw MotionDeadlineError.exceeded }
    }
}

private enum MotionAdmissionError: Error {
    case invalid
}

private enum MotionDeadlineError: Error {
    case exceeded
}

private enum MotionCancellationError: Error {
    case cancelled
}

private struct MotionBufferView {
    let offset: UInt64
    let length: UInt64
    let stride: UInt64?
}

private struct MotionAccessor {
    let componentType: UInt64
    let componentCount: UInt64
    let count: UInt64
    let offset: UInt64?
    let bufferViewOffset: UInt64?
    let localOffset: UInt64
    let byteStride: UInt64?
    let stride: UInt64
    let normalized: Bool
    let isSparse: Bool
    let bufferView: Int?
}

private struct MotionAnimationMetrics {
    let channelCount: UInt64
    let keyframeScalarValues: UInt64
    let durationMilliseconds: UInt64
    let hasExpressionTracks: Bool
    let hasLookAtTrack: Bool
}

private struct MotionSemanticValidator {
    let document: [String: Any]
    let binary: Data
    let hasBinaryChunk: Bool
    let budget: MotionBudget
    let checkpoint: @Sendable () throws -> Void

    private var nodes: [[String: Any]] = []
    private var nodeEdges: [[Int]] = []
    private var reachableNodes = Set<Int>()
    private var humanoidNodes = Set<Int>()
    private var hipsNode: Int?
    private var lookAtNode: Int?
    private var expressionNodes = Set<Int>()
    private var nodeLocalHeights: [Double] = []
    private var bufferViews: [MotionBufferView] = []
    private var accessors: [MotionAccessor] = []
    private var declaredBufferByteLength: UInt64 = 0

    init(
        document: [String: Any],
        binary: Data,
        hasBinaryChunk: Bool,
        budget: MotionBudget,
        checkpoint: @escaping @Sendable () throws -> Void
    ) {
        self.document = document
        self.binary = binary
        self.hasBinaryChunk = hasBinaryChunk
        self.budget = budget
        self.checkpoint = checkpoint
    }

    mutating func validate() throws -> MotionAdmissionSummary {
        try checkpoint()
        try validateEnvelope()
        try checkpoint()
        try validateBuffers()
        try checkpoint()
        try validateBufferViews()
        try checkpoint()
        try validateAccessors()
        try checkpoint()
        try validateNodesAndScenes()
        try checkpoint()
        let metrics = try validateAnimation()
        return MotionAdmissionSummary(
            nodeCount: UInt64(nodes.count),
            channelCount: metrics.channelCount,
            keyframeScalarValues: metrics.keyframeScalarValues,
            durationMilliseconds: metrics.durationMilliseconds,
            hasExpressionTracks: metrics.hasExpressionTracks,
            hasLookAtTrack: metrics.hasLookAtTrack
        )
    }

    private mutating func validateEnvelope() throws {
        guard let asset = document["asset"] as? [String: Any] else { throw MotionAdmissionError.invalid }
        guard asset["version"] as? String == "2.0" else { throw MotionAdmissionError.invalid }
        try rejectURIs(in: document)

        guard let used = document["extensionsUsed"] as? [Any] else {
            throw MotionAdmissionError.invalid
        }
        try validateExtensionNames(used)
        let usedNames = Set(try used.map { try string($0) })
        guard usedNames.contains("VRMC_vrm_animation") else {
            throw MotionAdmissionError.invalid
        }
        if let required = document["extensionsRequired"] as? [Any] {
            try validateExtensionNames(required)
            let requiredNames = Set(try required.map { try string($0) })
            guard requiredNames.isSubset(of: usedNames) else { throw MotionAdmissionError.invalid }
        } else if document["extensionsRequired"] != nil {
            throw MotionAdmissionError.invalid
        }

        guard let extensions = document["extensions"] as? [String: Any] else { throw MotionAdmissionError.invalid }
        guard extensions.keys.allSatisfy({ $0 == "VRMC_vrm_animation" }) else { throw MotionAdmissionError.invalid }
        guard let animationExtension = extensions["VRMC_vrm_animation"] as? [String: Any] else { throw MotionAdmissionError.invalid }
        guard animationExtension["specVersion"] as? String == "1.0" else { throw MotionAdmissionError.invalid }
        guard let humanoid = animationExtension["humanoid"] as? [String: Any] else { throw MotionAdmissionError.invalid }
        guard let humanBones = humanoid["humanBones"] as? [String: Any] else { throw MotionAdmissionError.invalid }
        guard let hips = humanBones["hips"] as? [String: Any] else { throw MotionAdmissionError.invalid }
        var mappedNodes = Set<UInt64>()
        for value in humanBones.values {
            try checkpoint()
            guard let bone = value as? [String: Any] else {
                throw MotionAdmissionError.invalid
            }
            let node = try unsigned(bone["node"])
            guard mappedNodes.insert(node).inserted else { throw MotionAdmissionError.invalid }
            humanoidNodes.insert(try checkedInt(node))
        }
        let hipsNumber = try unsigned(hips["node"])
        guard mappedNodes.contains(hipsNumber) else { throw MotionAdmissionError.invalid }
        hipsNode = try checkedInt(hipsNumber)

        if let lookAtValue = animationExtension["lookAt"] {
            guard let lookAt = lookAtValue as? [String: Any] else {
                throw MotionAdmissionError.invalid
            }
            guard let nodeValue = lookAt["node"], !(nodeValue is NSNull) else {
                throw MotionAdmissionError.invalid
            }
            lookAtNode = try checkedInt(try unsigned(nodeValue))
            if let offset = lookAt["offsetFromHeadBone"] {
                _ = try finiteVector(offset, count: 3)
            }
        }
        if let expressionsValue = animationExtension["expressions"] {
            guard let expressions = expressionsValue as? [String: Any] else {
                throw MotionAdmissionError.invalid
            }
            guard expressions.keys.allSatisfy({ $0 == "preset" || $0 == "custom" }) else {
                throw MotionAdmissionError.invalid
            }
            for key in ["preset", "custom"] {
                guard let groupValue = expressions[key] else { continue }
                guard let group = groupValue as? [String: Any] else {
                    throw MotionAdmissionError.invalid
                }
                for value in group.values {
                    try checkpoint()
                    guard let expression = value as? [String: Any] else {
                        throw MotionAdmissionError.invalid
                    }
                    guard let nodeValue = expression["node"], !(nodeValue is NSNull) else {
                        throw MotionAdmissionError.invalid
                    }
                    expressionNodes.insert(try checkedInt(try unsigned(nodeValue)))
                }
            }
        }
    }

    private func validateExtensionNames(_ value: Any) throws {
        guard let values = value as? [Any] else {
            throw MotionAdmissionError.invalid
        }
        var names = Set<String>()
        for value in values {
            try checkpoint()
            let name = try string(value)
            guard name == "VRMC_vrm_animation", names.insert(name).inserted else {
                throw MotionAdmissionError.invalid
            }
        }
    }

    private mutating func validateBuffers() throws {
        guard let buffers = document["buffers"] as? [Any],
              buffers.count == 1,
              hasBinaryChunk,
              let buffer = buffers[0] as? [String: Any]
        else {
            throw MotionAdmissionError.invalid
        }
        let declared = try unsigned(buffer["byteLength"])
        guard declared <= UInt64(binary.count) else {
            throw MotionAdmissionError.invalid
        }
        guard let declaredCount = Int(exactly: declared) else {
            throw AssetBudgetError.arithmeticOverflow
        }
        let padding = UInt64(binary.count) - declared
        guard padding <= 3 else { throw MotionAdmissionError.invalid }
        guard binary[declaredCount...].allSatisfy({ $0 == 0 }) else {
            throw MotionAdmissionError.invalid
        }
        declaredBufferByteLength = declared
    }

    private mutating func validateBufferViews() throws {
        guard let values = document["bufferViews"] as? [Any] else {
            throw MotionAdmissionError.invalid
        }
        try AssetBudget.require(UInt64(values.count), maximum: budget.bufferViews)
        for value in values {
            try checkpoint()
            guard let view = value as? [String: Any],
                  try unsigned(view["buffer"]) == 0
            else {
                throw MotionAdmissionError.invalid
            }
            let offset = try optionalUnsigned(view["byteOffset"]) ?? 0
            let length = try unsigned(view["byteLength"])
            let end = try AssetBudget.add(offset, length)
            guard end <= declaredBufferByteLength else {
                throw MotionAdmissionError.invalid
            }
            let stride = try optionalUnsigned(view["byteStride"])
            if let stride {
                guard stride > 0, stride % 4 == 0 else {
                    throw MotionAdmissionError.invalid
                }
            }
            bufferViews.append(MotionBufferView(offset: offset, length: length, stride: stride))
        }
    }

    private mutating func validateAccessors() throws {
        guard let values = document["accessors"] as? [Any] else {
            throw MotionAdmissionError.invalid
        }
        try AssetBudget.require(UInt64(values.count), maximum: budget.accessors)
        for value in values {
            try checkpoint()
            guard let accessor = value as? [String: Any] else {
                throw MotionAdmissionError.invalid
            }
            let componentType = try unsigned(accessor["componentType"])
            let componentBytes: UInt64
            switch componentType {
            case 5120, 5121: componentBytes = 1
            case 5122, 5123: componentBytes = 2
            case 5125, 5126: componentBytes = 4
            default: throw MotionAdmissionError.invalid
            }
            let componentCount: UInt64
            switch accessor["type"] as? String {
            case "SCALAR": componentCount = 1
            case "VEC2": componentCount = 2
            case "VEC3": componentCount = 3
            case "VEC4": componentCount = 4
            case "MAT2": componentCount = 4
            case "MAT3": componentCount = 9
            case "MAT4": componentCount = 16
            default: throw MotionAdmissionError.invalid
            }
            let count = try unsigned(accessor["count"])
            let normalized: Bool
            if let value = accessor["normalized"] {
                guard let number = value as? NSNumber,
                      isBoolean(number),
                      let bool = value as? Bool
                else { throw MotionAdmissionError.invalid }
                normalized = bool
            } else {
                normalized = false
            }
            let isSparse: Bool
            if let sparse = accessor["sparse"] {
                guard sparse is [String: Any] else { throw MotionAdmissionError.invalid }
                isSparse = true
            } else {
                isSparse = false
            }
            let viewIndex: Int?
            if let bufferView = accessor["bufferView"] {
                viewIndex = try index(bufferView, count: bufferViews.count)
            } else {
                viewIndex = nil
                guard accessor["byteOffset"] == nil else {
                    throw MotionAdmissionError.invalid
                }
            }
            let localOffset = try optionalUnsigned(accessor["byteOffset"]) ?? 0
            let elementBytes = try AssetBudget.multiply(componentBytes, componentCount)
            let absoluteOffset: UInt64?
            let stride: UInt64
            if let viewIndex {
                let view = bufferViews[viewIndex]
                stride = view.stride ?? elementBytes
                guard stride >= elementBytes else { throw MotionAdmissionError.invalid }
                if count > 0 {
                    let span = try AssetBudget.add(
                        try AssetBudget.multiply(count - 1, stride),
                        elementBytes
                    )
                    guard try AssetBudget.add(localOffset, span) <= view.length else {
                        throw MotionAdmissionError.invalid
                    }
                }
                absoluteOffset = try AssetBudget.add(view.offset, localOffset)
            } else {
                absoluteOffset = nil
                stride = elementBytes
            }
            accessors.append(
                MotionAccessor(
                    componentType: componentType,
                    componentCount: componentCount,
                    count: count,
                    offset: absoluteOffset,
                    bufferViewOffset: viewIndex.map { bufferViews[$0].offset },
                    localOffset: localOffset,
                    byteStride: viewIndex.flatMap { bufferViews[$0].stride },
                    stride: stride,
                    normalized: normalized,
                    isSparse: isSparse,
                    bufferView: viewIndex
                )
            )
        }
    }

    private mutating func validateNodesAndScenes() throws {
        guard let values = document["nodes"] as? [Any], !values.isEmpty else {
            throw MotionAdmissionError.invalid
        }
        try AssetBudget.require(UInt64(values.count), maximum: budget.nodes)
        nodes.reserveCapacity(values.count)
        nodeEdges = Array(repeating: [], count: values.count)
        nodeLocalHeights = Array(repeating: 0, count: values.count)
        var parent = Array(repeating: -1, count: values.count)
        for (nodeIndex, value) in values.enumerated() {
            try checkpoint()
            guard let node = value as? [String: Any] else {
                throw MotionAdmissionError.invalid
            }
            if node["matrix"] != nil,
               node["translation"] != nil || node["rotation"] != nil || node["scale"] != nil
            {
                throw MotionAdmissionError.invalid
            }
            if let translation = node["translation"] {
                nodeLocalHeights[nodeIndex] = try finiteVector(translation, count: 3)[1]
            }
            if let rotation = node["rotation"] {
                _ = try finiteVector(rotation, count: 4)
            }
            if let scale = node["scale"] {
                _ = try finiteVector(scale, count: 3)
            }
            if let matrix = node["matrix"] {
                let matrixValues = try finiteVector(matrix, count: 16)
                nodeLocalHeights[nodeIndex] = matrixValues[13]
            }
            if let childrenValue = node["children"] {
                guard let children = childrenValue as? [Any] else {
                    throw MotionAdmissionError.invalid
                }
                for childValue in children {
                    try checkpoint()
                    let child = try index(childValue, count: values.count)
                    guard parent[child] == -1 else { throw MotionAdmissionError.invalid }
                    parent[child] = nodeIndex
                    nodeEdges[nodeIndex].append(child)
                }
            }
            nodes.append(node)
        }

        var state = Array(repeating: UInt8(0), count: values.count)
        func visit(_ node: Int) throws {
            try checkpoint()
            guard state[node] != 1 else { throw MotionAdmissionError.invalid }
            guard state[node] == 0 else { return }
            state[node] = 1
            for child in nodeEdges[node] {
                try visit(child)
            }
            state[node] = 2
        }
        for node in values.indices {
            try visit(node)
        }

        guard let scenes = document["scenes"] as? [Any], !scenes.isEmpty else {
            throw MotionAdmissionError.invalid
        }
        try AssetBudget.require(UInt64(scenes.count), maximum: budget.scenes)
        var sceneRoots = [[Int]]()
        sceneRoots.reserveCapacity(scenes.count)
        for sceneValue in scenes {
            guard let scene = sceneValue as? [String: Any] else {
                throw MotionAdmissionError.invalid
            }
            if let nodesValue = scene["nodes"] {
                guard let nodes = nodesValue as? [Any] else {
                    throw MotionAdmissionError.invalid
                }
                sceneRoots.append(try nodes.map { try index($0, count: values.count) })
            } else {
                sceneRoots.append([])
            }
        }
        let defaultScene = try index(document["scene"], count: scenes.count)
        guard !sceneRoots[defaultScene].isEmpty else {
            throw MotionAdmissionError.invalid
        }
        for root in sceneRoots[defaultScene] {
            guard parent[root] == -1 else { throw MotionAdmissionError.invalid }
            try markReachable(root)
        }

        for node in humanoidNodes {
            guard reachableNodes.contains(node) else { throw MotionAdmissionError.invalid }
        }
        if let lookAtNode {
            guard lookAtNode < values.count, reachableNodes.contains(lookAtNode) else {
                throw MotionAdmissionError.invalid
            }
        }
        for node in expressionNodes {
            guard node < values.count, reachableNodes.contains(node) else {
                throw MotionAdmissionError.invalid
            }
        }
        guard let hipsNode, reachableNodes.contains(hipsNode) else {
            throw MotionAdmissionError.invalid
        }
        var worldHeights = Array<Double?>(repeating: nil, count: values.count)
        func assignHeight(_ node: Int, parentHeight: Double) throws {
            try checkpoint()
            let height = parentHeight + nodeLocalHeights[node]
            if let existing = worldHeights[node] {
                guard abs(existing - height) <= 0.000_000_1 else {
                    throw MotionAdmissionError.invalid
                }
                return
            }
            guard height.isFinite else { throw MotionAdmissionError.invalid }
            worldHeights[node] = height
            for child in nodeEdges[node] {
                try assignHeight(child, parentHeight: height)
            }
        }
        for root in sceneRoots[defaultScene] {
            try assignHeight(root, parentHeight: 0)
        }
        guard let hipsHeight = worldHeights[hipsNode], hipsHeight.isFinite, hipsHeight != 0 else {
            throw MotionAdmissionError.invalid
        }
    }

    private mutating func markReachable(_ node: Int) throws {
        try checkpoint()
        guard reachableNodes.insert(node).inserted else { return }
        for child in nodeEdges[node] {
            try markReachable(child)
        }
    }

    private mutating func validateAnimation() throws -> MotionAnimationMetrics {
        guard let animations = document["animations"] as? [Any], animations.count == 1,
              let animation = animations[0] as? [String: Any],
              let samplerValues = animation["samplers"] as? [Any],
              let channelValues = animation["channels"] as? [Any]
        else {
            throw MotionAdmissionError.invalid
        }
        guard !channelValues.isEmpty else { throw MotionAdmissionError.invalid }
        try AssetBudget.require(UInt64(samplerValues.count), maximum: budget.samplers)
        try AssetBudget.require(UInt64(channelValues.count), maximum: budget.channels)
        for value in samplerValues {
            try checkpoint()
            guard let sampler = value as? [String: Any] else {
                throw MotionAdmissionError.invalid
            }
            _ = try index(sampler["input"], count: accessors.count)
            _ = try index(sampler["output"], count: accessors.count)
            if let interpolation = sampler["interpolation"] {
                let value = try string(interpolation)
                guard ["LINEAR", "STEP", "CUBICSPLINE"].contains(value) else {
                    throw MotionAdmissionError.invalid
                }
            }
        }
        var keyframeScalarValues: UInt64 = 0
        var durationMilliseconds: UInt64 = 0
        var hasExpressionTracks = false
        var hasLookAtTrack = false
        var referencedViews = Set<Int>()
        var channels = Set<MotionChannelKey>()

        for value in channelValues {
            try checkpoint()
            guard let channel = value as? [String: Any],
                  let target = channel["target"] as? [String: Any]
            else {
                throw MotionAdmissionError.invalid
            }
            let node = try index(target["node"], count: nodes.count)
            let path = try string(target["path"])
            guard channels.insert(MotionChannelKey(node: node, path: path)).inserted else {
                throw MotionAdmissionError.invalid
            }
            let samplerIndex = try index(channel["sampler"], count: samplerValues.count)
            guard let sampler = samplerValues[samplerIndex] as? [String: Any] else {
                throw MotionAdmissionError.invalid
            }
            let inputIndex = try index(sampler["input"], count: accessors.count)
            let outputIndex = try index(sampler["output"], count: accessors.count)
            let input = accessors[inputIndex]
            let output = accessors[outputIndex]
            try validateAnimationAccessor(input, type: "SCALAR")
            let inputValues = try readFloatValues(input)
            guard !inputValues.isEmpty else { throw MotionAdmissionError.invalid }
            var previous: Float?
            for time in inputValues {
                try checkpoint()
                guard time.isFinite, time >= 0 else { throw MotionAdmissionError.invalid }
                if let previous {
                    guard time > previous else { throw MotionAdmissionError.invalid }
                }
                previous = time
            }
            let interpolation: String
            if let value = sampler["interpolation"] {
                interpolation = try string(value)
            } else {
                interpolation = "LINEAR"
            }
            guard ["LINEAR", "STEP", "CUBICSPLINE"].contains(interpolation) else {
                throw MotionAdmissionError.invalid
            }

            let expectedComponentCount: UInt64
            if humanoidNodes.contains(node) {
                switch path {
                case "rotation": expectedComponentCount = 4
                case "translation":
                    guard node == hipsNode else { throw MotionAdmissionError.invalid }
                    expectedComponentCount = 3
                default: throw MotionAdmissionError.invalid
                }
            } else if node == lookAtNode {
                guard path == "rotation" else { throw MotionAdmissionError.invalid }
                expectedComponentCount = 4
                hasLookAtTrack = true
            } else if expressionNodes.contains(node) {
                guard path == "translation" else { throw MotionAdmissionError.invalid }
                expectedComponentCount = 3
                hasExpressionTracks = true
            } else if reachableNodes.contains(node) {
                guard path == "rotation" else { throw MotionAdmissionError.invalid }
                expectedComponentCount = 4
            } else {
                throw MotionAdmissionError.invalid
            }
            try validateAnimationAccessor(output, type: expectedComponentCount == 4 ? "VEC4" : "VEC3")
            let outputValues = try readFloatValues(output)
            let expectedCount: UInt64
            if interpolation == "CUBICSPLINE" {
                expectedCount = try AssetBudget.multiply(UInt64(inputValues.count), 3)
            } else {
                expectedCount = UInt64(inputValues.count)
            }
            guard output.count == expectedCount else { throw MotionAdmissionError.invalid }
            let inputScalars = UInt64(inputValues.count)
            let outputScalars = UInt64(outputValues.count)
            keyframeScalarValues = try AssetBudget.add(
                keyframeScalarValues,
                try AssetBudget.add(inputScalars, outputScalars)
            )
            try AssetBudget.require(keyframeScalarValues, maximum: budget.keyframeScalarValues)

            let channelDuration = try durationMillisecondsFor(inputValues.last ?? 0)
            durationMilliseconds = max(durationMilliseconds, channelDuration)
            if let view = input.bufferView { referencedViews.insert(view) }
            if let view = output.bufferView { referencedViews.insert(view) }
        }
        var referencedBufferBytes: UInt64 = 0
        for viewIndex in referencedViews {
            try checkpoint()
            referencedBufferBytes = try AssetBudget.add(
                referencedBufferBytes,
                bufferViews[viewIndex].length
            )
            try AssetBudget.require(
                referencedBufferBytes,
                maximum: budget.referencedBufferBytes
            )
        }
        return MotionAnimationMetrics(
            channelCount: UInt64(channelValues.count),
            keyframeScalarValues: keyframeScalarValues,
            durationMilliseconds: durationMilliseconds,
            hasExpressionTracks: hasExpressionTracks,
            hasLookAtTrack: hasLookAtTrack
        )
    }

    private func validateAnimationAccessor(_ accessor: MotionAccessor, type: String) throws {
        guard accessor.componentType == 5126,
              accessor.componentCount == componentCount(for: type),
              accessor.count > 0,
              accessor.bufferView != nil,
              let bufferViewOffset = accessor.bufferViewOffset,
              bufferViewOffset % 4 == 0,
              accessor.localOffset % 4 == 0,
              let offset = accessor.offset,
              offset % 4 == 0,
              accessor.byteStride == nil,
              !accessor.isSparse,
              !accessor.normalized
        else {
            throw MotionAdmissionError.invalid
        }
    }

    private func readFloatValues(_ accessor: MotionAccessor) throws -> [Float] {
        guard accessor.componentType == 5126,
              let offset = accessor.offset,
              accessor.count <= UInt64(Int.max)
        else {
            throw MotionAdmissionError.invalid
        }
        guard let count = Int(exactly: accessor.count) else {
            throw AssetBudgetError.arithmeticOverflow
        }
        let scalarCount = try AssetBudget.multiply(accessor.count, accessor.componentCount)
        guard scalarCount <= UInt64(Int.max) else {
            throw AssetBudgetError.arithmeticOverflow
        }
        var values = [Float]()
        values.reserveCapacity(Int(scalarCount))
        for index in 0..<count {
            try checkpoint()
            let base = try AssetBudget.add(
                offset,
                try AssetBudget.multiply(UInt64(index), accessor.stride)
            )
            for component in 0..<Int(accessor.componentCount) {
                let byteOffset = try AssetBudget.add(base, UInt64(component * 4))
                guard declaredBufferByteLength >= 4,
                      byteOffset <= declaredBufferByteLength - 4
                else {
                    throw MotionAdmissionError.invalid
                }
                let bits = binary.withUnsafeBytes {
                    UInt32(littleEndian: $0.loadUnaligned(
                        fromByteOffset: Int(byteOffset),
                        as: UInt32.self
                    ))
                }
                let value = Float(bitPattern: bits)
                guard value.isFinite else { throw MotionAdmissionError.invalid }
                values.append(value)
            }
        }
        return values
    }

    private func durationMillisecondsFor(_ seconds: Float) throws -> UInt64 {
        let milliseconds = Double(seconds) * 1_000
        guard milliseconds.isFinite, milliseconds >= 0 else {
            throw MotionAdmissionError.invalid
        }
        let rounded = milliseconds.rounded(.up)
        guard rounded <= Double(budget.durationMilliseconds) else {
            throw AssetBudgetError.limitExceeded
        }
        guard rounded < Double(UInt64.max) else {
            throw AssetBudgetError.arithmeticOverflow
        }
        return UInt64(rounded)
    }

    private func componentCount(for type: String) -> UInt64 {
        type == "SCALAR" ? 1 : type == "VEC3" ? 3 : 4
    }

    private func rejectURIs(in value: Any) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            guard !object.keys.contains("uri") else { throw MotionAdmissionError.invalid }
            for child in object.values {
                try rejectURIs(in: child)
            }
        } else if let array = value as? [Any] {
            for child in array {
                try rejectURIs(in: child)
            }
        } else if let number = value as? NSNumber, !isBoolean(number) {
            guard number.doubleValue.isFinite else { throw MotionAdmissionError.invalid }
        }
    }

    private func finiteVector(_ value: Any?, count: Int) throws -> [Double] {
        guard let values = value as? [Any], values.count == count else {
            throw MotionAdmissionError.invalid
        }
        return try values.map { try finiteDouble($0) }
    }

    private func finiteDouble(_ value: Any?) throws -> Double {
        guard let value, let number = value as? NSNumber, !isBoolean(number) else {
            throw MotionAdmissionError.invalid
        }
        let result = number.doubleValue
        guard result.isFinite else { throw MotionAdmissionError.invalid }
        return result
    }

    private func string(_ value: Any?) throws -> String {
        guard let value, let string = value as? String else {
            throw MotionAdmissionError.invalid
        }
        return string
    }

    private func unsigned(_ value: Any?) throws -> UInt64 {
        guard let value, let number = value as? NSNumber, !isBoolean(number) else {
            throw MotionAdmissionError.invalid
        }
        let type = String(cString: number.objCType)
        if ["c", "C", "s", "S", "i", "I", "l", "L", "q", "Q"].contains(type) {
            guard let exact = UInt64(number.stringValue) else {
                throw MotionAdmissionError.invalid
            }
            return exact
        }
        let result = number.doubleValue
        let maximumExactlyRepresentableInteger = 9_007_199_254_740_992.0
        guard result.isFinite,
              result >= 0,
              result.rounded() == result,
              result <= maximumExactlyRepresentableInteger,
              let exact = UInt64(exactly: result)
        else {
            throw MotionAdmissionError.invalid
        }
        return exact
    }

    private func optionalUnsigned(_ value: Any?) throws -> UInt64? {
        guard let value else { return nil }
        return try unsigned(value)
    }

    private func checkedInt(_ value: UInt64) throws -> Int {
        guard let result = Int(exactly: value) else {
            throw AssetBudgetError.arithmeticOverflow
        }
        return result
    }

    private func index(_ value: Any?, count: Int) throws -> Int {
        let value = try unsigned(value)
        guard value < UInt64(count) else { throw MotionAdmissionError.invalid }
        return try checkedInt(value)
    }

    private func isBoolean(_ number: NSNumber) -> Bool {
        CFGetTypeID(number) == CFBooleanGetTypeID()
    }
}

private struct MotionChannelKey: Hashable {
    let node: Int
    let path: String
}
