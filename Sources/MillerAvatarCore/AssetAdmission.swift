import Dispatch
import Foundation
import ImageIO
import UniformTypeIdentifiers

public struct AssetAdmissionSummary: Equatable, Sendable {
    public let nodeCount: UInt64
    public let meshCount: UInt64
    public let materialCount: UInt64
    public let imageCount: UInt64
    public let decodedImagePixels: UInt64
    public let accessorReferencedBytes: UInt64
    public let capabilities: AssetAdmissionCapabilities

    package init(
        nodeCount: UInt64,
        meshCount: UInt64,
        materialCount: UInt64,
        imageCount: UInt64,
        decodedImagePixels: UInt64,
        accessorReferencedBytes: UInt64,
        capabilities: AssetAdmissionCapabilities
    ) {
        self.nodeCount = nodeCount
        self.meshCount = meshCount
        self.materialCount = materialCount
        self.imageCount = imageCount
        self.decodedImagePixels = decodedImagePixels
        self.accessorReferencedBytes = accessorReferencedBytes
        self.capabilities = capabilities
    }
}

public struct AssetAdmissionCapabilities: Equatable, Sendable {
    public let lookAt: Bool
    public let springBone: Bool
    public let mtoonMaterials: UInt64

    package init(
        lookAt: Bool,
        springBone: Bool,
        mtoonMaterials: UInt64
    ) {
        self.lookAt = lookAt
        self.springBone = springBone
        self.mtoonMaterials = mtoonMaterials
    }
}

package struct AdmittedAsset: Equatable, Sendable {
    package let token: UUID
    package let bytes: Data
    package let summary: AssetAdmissionSummary

    package init(
        token: UUID,
        bytes: Data,
        summary: AssetAdmissionSummary
    ) {
        self.token = token
        self.bytes = bytes
        self.summary = summary
    }
}

package enum AssetAdmissionResult: Equatable, Sendable {
    case admitted(AdmittedAsset)
    case rejected(FailureCode)
}

package struct AssetAdmission: Sendable {
    private let budget: AssetBudget
    private let timeoutNanoseconds: UInt64?
    private let monotonicNow: @Sendable () -> UInt64
    private let isCancelled: @Sendable () -> Bool

    package init(
        budget: AssetBudget = .alpha,
        timeoutNanoseconds: UInt64? = nil,
        monotonicNow: @escaping @Sendable () -> UInt64 = {
            DispatchTime.now().uptimeNanoseconds
        },
        isCancelled: @escaping @Sendable () -> Bool = {
            Task.isCancelled
        }
    ) {
        self.budget = budget
        self.timeoutNanoseconds = timeoutNanoseconds ?? budget.preflightDeadlineNanoseconds
        self.monotonicNow = monotonicNow
        self.isCancelled = isCancelled
    }

    package init(
        mode: AvatarAssetQualityMode,
        timeoutNanoseconds: UInt64? = nil,
        monotonicNow: @escaping @Sendable () -> UInt64 = {
            DispatchTime.now().uptimeNanoseconds
        },
        isCancelled: @escaping @Sendable () -> Bool = {
            Task.isCancelled
        }
    ) {
        self.init(
            budget: .budget(for: mode),
            timeoutNanoseconds: timeoutNanoseconds,
            monotonicNow: monotonicNow,
            isCancelled: isCancelled
        )
    }

    package init(
        qualityMode: AvatarAssetQualityMode,
        timeoutNanoseconds: UInt64? = nil,
        monotonicNow: @escaping @Sendable () -> UInt64 = {
            DispatchTime.now().uptimeNanoseconds
        },
        isCancelled: @escaping @Sendable () -> Bool = {
            Task.isCancelled
        }
    ) {
        self.init(
            mode: qualityMode,
            timeoutNanoseconds: timeoutNanoseconds,
            monotonicNow: monotonicNow,
            isCancelled: isCancelled
        )
    }

    package func admit(_ capturedBytes: Data) async -> AssetAdmissionResult {
        await withTaskGroup(
            of: AssetAdmissionResult.self,
            returning: AssetAdmissionResult.self
        ) { group in
            group.addTask {
                admitSynchronously(capturedBytes)
            }
            return await group.next()!
        }
    }

    package func admitSynchronously(_ capturedBytes: Data) -> AssetAdmissionResult {
        let deadline: UInt64?
        if let timeoutNanoseconds {
            let start = monotonicNow()
            let (value, overflow) = start.addingReportingOverflow(timeoutNanoseconds)
            guard !overflow else { return .rejected(.resourceLimit) }
            deadline = value
        } else {
            deadline = nil
        }

        do {
            try checkpoint(deadline: deadline)
            let parsed = try GLBParser.parse(
                capturedBytes,
                budget: budget,
                checkpoint: { try self.checkpoint(deadline: deadline) }
            )
            try checkpoint(deadline: deadline)
            let object = try JSONSerialization.jsonObject(with: parsed.json)
            guard let document = object as? [String: Any] else {
                throw AdmissionError.invalid
            }
            var validator = SemanticValidator(
                document: document,
                binary: parsed.binary,
                hasBinaryChunk: parsed.hasBinaryChunk,
                budget: budget,
                checkpoint: { try self.checkpoint(deadline: deadline) }
            )
            let summary = try validator.validate()
            try checkpoint(deadline: deadline)
            return .admitted(
                AdmittedAsset(
                    token: UUID(),
                    bytes: capturedBytes,
                    summary: summary
                )
            )
        } catch is DeadlineError {
            return .rejected(.resourceLimit)
        } catch is AssetBudgetError {
            return .rejected(.resourceLimit)
        } catch let error as GLBParserError {
            switch error {
            case .fileTooLarge, .jsonTooComplex:
                return .rejected(.resourceLimit)
            default:
                return .rejected(.assetRejected)
            }
        } catch {
            return .rejected(.assetRejected)
        }
    }

    private func checkpoint(deadline: UInt64?) throws {
        guard !isCancelled() else {
            throw DeadlineError.exceeded
        }
        if let deadline {
            guard monotonicNow() < deadline else {
                throw DeadlineError.exceeded
            }
        }
    }
}

private enum DeadlineError: Error {
    case exceeded
}

private enum AdmissionError: Error {
    case invalid
}

private struct BufferViewInfo {
    let offset: UInt64
    let length: UInt64
    let stride: UInt64?
}

private struct AccessorInfo {
    let componentType: UInt64
    let componentBytes: UInt64
    let componentCount: UInt64
    let count: UInt64
    let offset: UInt64?
    let stride: UInt64
    let normalized: Bool
    let sparse: SparseAccessorInfo?

    var elementBytes: UInt64 {
        componentBytes * componentCount
    }
}

private struct SparseAccessorInfo {
    let count: UInt64
    let indicesOffset: UInt64
    let indexComponentType: UInt64
    let indexBytes: UInt64
    let valuesOffset: UInt64
}

private struct SemanticValidator {
    private static let allowedExtensions: Set<String> = [
        "VRMC_vrm",
        "VRMC_materials_mtoon",
        "VRMC_springBone",
        "VRMC_node_constraint",
        "KHR_materials_unlit",
        "KHR_texture_transform",
        "KHR_materials_emissive_strength",
    ]

    let document: [String: Any]
    let binary: Data
    let hasBinaryChunk: Bool
    let budget: AssetBudget
    let checkpoint: @Sendable () throws -> Void
    private var bufferViews: [BufferViewInfo] = []
    private var accessors: [AccessorInfo] = []
    private var accessorBytes: UInt64 = 0
    private var decodedPixels: UInt64 = 0
    private var vertices: UInt64 = 0
    private var indices: UInt64 = 0
    private var triangles: UInt64 = 0
    private var morphValues: UInt64 = 0

    init(
        document: [String: Any],
        binary: Data,
        hasBinaryChunk: Bool,
        budget: AssetBudget,
        checkpoint: @escaping @Sendable () throws -> Void
    ) {
        self.document = document
        self.binary = binary
        self.hasBinaryChunk = hasBinaryChunk
        self.budget = budget
        self.checkpoint = checkpoint
    }

    mutating func validate() throws -> AssetAdmissionSummary {
        try checkpoint()
        try validateClosedEnvelope()
        try checkpoint()
        try validateBuffers()
        try checkpoint()
        try validateBufferViews()
        try checkpoint()
        try validateAccessors()
        try checkpoint()
        try validateNodesAndScenes()
        try checkpoint()
        try validateMeshes()
        try checkpoint()
        try validateSkins()
        try checkpoint()
        try validateMaterialsAndTextures()
        try checkpoint()
        try validateImages()
        try checkpoint()
        try validateVRMExtensions()
        try checkpoint()

        let nodes = try count("nodes", maximum: budget.nodes)
        let meshes = try count("meshes", maximum: budget.meshes)
        let materials = try count("materials", maximum: budget.materials)
        let images = try count("images", maximum: budget.images)
        let capabilities = try declaredCapabilities()
        return AssetAdmissionSummary(
            nodeCount: nodes,
            meshCount: meshes,
            materialCount: materials,
            imageCount: images,
            decodedImagePixels: decodedPixels,
            accessorReferencedBytes: accessorBytes,
            capabilities: capabilities
        )
    }

    private func declaredCapabilities() throws -> AssetAdmissionCapabilities {
        guard let rootExtensions = document["extensions"] as? [String: Any],
              let vrm = rootExtensions["VRMC_vrm"] as? [String: Any]
        else {
            throw AdmissionError.invalid
        }
        let mtoonMaterials = try optionalArray("materials").reduce(into: UInt64(0)) {
            count, value in
            try checkpoint()
            guard let material = value as? [String: Any] else {
                throw AdmissionError.invalid
            }
            if let extensions = material["extensions"] as? [String: Any],
               extensions["VRMC_materials_mtoon"] != nil
            {
                count = try AssetBudget.add(count, 1)
            }
        }
        return AssetAdmissionCapabilities(
            lookAt: vrm["lookAt"] != nil,
            springBone: rootExtensions["VRMC_springBone"] != nil,
            mtoonMaterials: mtoonMaterials
        )
    }

    private func validateClosedEnvelope() throws {
        guard let asset = document["asset"] as? [String: Any],
              asset["version"] as? String == "2.0",
              document["animations"] == nil
        else {
            throw AdmissionError.invalid
        }
        guard let rootExtensions = document["extensions"] as? [String: Any],
              rootExtensions["VRM"] == nil,
              let vrm = rootExtensions["VRMC_vrm"] as? [String: Any],
              vrm["specVersion"] as? String == "1.0"
        else {
            throw AdmissionError.invalid
        }

        for key in ["extensionsUsed", "extensionsRequired"] {
            try checkpoint()
            guard let value = document[key] else {
                if key == "extensionsRequired" { continue }
                throw AdmissionError.invalid
            }
            guard let names = value as? [Any] else {
                throw AdmissionError.invalid
            }
            var uniqueNames = Set<String>()
            for name in names {
                try checkpoint()
                guard let name = name as? String,
                      Self.allowedExtensions.contains(name),
                      uniqueNames.insert(name).inserted
                else {
                    throw AdmissionError.invalid
                }
            }
        }
        let used = Set((document["extensionsUsed"] as? [String]) ?? [])
        let required = Set((document["extensionsRequired"] as? [String]) ?? [])
        guard required.isSubset(of: used),
              try extensionNames(in: document).isSubset(of: used)
        else {
            throw AdmissionError.invalid
        }
        try scanClosedValues(document)
        try validateSparseLocations()
        try validateAllowlistedExtensionObjects(in: document)
        try validateExtensionLocations()
    }

    private func extensionNames(in value: Any) throws -> Set<String> {
        try checkpoint()
        if let object = value as? [String: Any] {
            var names = Set<String>()
            if let extensions = object["extensions"] as? [String: Any] {
                names.formUnion(extensions.keys)
            }
            for child in object.values {
                names.formUnion(try extensionNames(in: child))
            }
            return names
        }
        if let array = value as? [Any] {
            var names = Set<String>()
            for child in array {
                names.formUnion(try extensionNames(in: child))
            }
            return names
        }
        return []
    }

    private func scanClosedValues(_ value: Any) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            if object["uri"] != nil {
                throw AdmissionError.invalid
            }
            if let extensions = object["extensions"] as? [String: Any] {
                guard extensions.keys.allSatisfy(Self.allowedExtensions.contains) else {
                    throw AdmissionError.invalid
                }
            } else if object["extensions"] != nil {
                throw AdmissionError.invalid
            }
            for child in object.values {
                try scanClosedValues(child)
            }
        } else if let array = value as? [Any] {
            for child in array {
                try scanClosedValues(child)
            }
        } else if let number = value as? NSNumber {
            guard number.doubleValue.isFinite else { throw AdmissionError.invalid }
        }
    }

    private func validateSparseLocations() throws {
        for (key, value) in document {
            try checkpoint()
            if key == "accessors" {
                guard let accessors = value as? [Any] else {
                    throw AdmissionError.invalid
                }
                for accessor in accessors {
                    try validateSparseLocations(in: accessor, allowedHere: true)
                }
            } else {
                try validateSparseLocations(in: value, allowedHere: false)
            }
        }
    }

    private func validateSparseLocations(
        in value: Any,
        allowedHere: Bool
    ) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            if object["sparse"] != nil, !allowedHere {
                throw AdmissionError.invalid
            }
            for child in object.values {
                try validateSparseLocations(in: child, allowedHere: false)
            }
        } else if let array = value as? [Any] {
            for child in array {
                try validateSparseLocations(in: child, allowedHere: false)
            }
        }
    }

    private func validateAllowlistedExtensionObjects(in value: Any) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            if let extensionValue = object["extensions"] {
                guard let extensions = extensionValue as? [String: Any] else {
                    throw AdmissionError.invalid
                }
                for (name, payload) in extensions {
                    try checkpoint()
                    guard Self.allowedExtensions.contains(name),
                          payload is [String: Any]
                    else {
                        throw AdmissionError.invalid
                    }
                }
            }
            for child in object.values {
                try validateAllowlistedExtensionObjects(in: child)
            }
        } else if let array = value as? [Any] {
            for child in array {
                try validateAllowlistedExtensionObjects(in: child)
            }
        }
    }

    private func validateExtensionLocations() throws {
        let rootExtensions = try extensionMap(
            in: document,
            allowing: ["VRMC_vrm", "VRMC_springBone"]
        )
        for payload in rootExtensions.values {
            try checkpoint()
            try validateNoNestedExtensions(in: payload)
        }

        for (key, value) in document where !["extensions", "materials", "nodes"].contains(key) {
            try checkpoint()
            try validateNoNestedExtensions(in: value)
        }

        for value in try optionalArray("nodes") {
            try checkpoint()
            guard let node = value as? [String: Any] else { throw AdmissionError.invalid }
            let extensions = try extensionMap(
                in: node,
                allowing: ["VRMC_node_constraint"]
            )
            for payload in extensions.values {
                try checkpoint()
                try validateNoNestedExtensions(in: payload)
            }
            for (key, child) in node where key != "extensions" {
                try checkpoint()
                try validateNoNestedExtensions(in: child)
            }
        }

        for value in try optionalArray("materials") {
            try checkpoint()
            guard let material = value as? [String: Any] else { throw AdmissionError.invalid }
            let extensions = try extensionMap(
                in: material,
                allowing: [
                    "VRMC_materials_mtoon",
                    "KHR_materials_unlit",
                    "KHR_materials_emissive_strength",
                ]
            )
            for (name, payload) in extensions {
                try checkpoint()
                if name == "VRMC_materials_mtoon" {
                    try validateMToonExtensionLocations(in: payload)
                } else {
                    try validateNoNestedExtensions(in: payload)
                }
            }

            if let pbr = material["pbrMetallicRoughness"] {
                guard let object = pbr as? [String: Any] else { throw AdmissionError.invalid }
                try validateTextureInfoExtensionLocation(object["baseColorTexture"])
                try validateTextureInfoExtensionLocation(object["metallicRoughnessTexture"])
                for (key, child) in object where ![
                    "baseColorTexture", "metallicRoughnessTexture",
                ].contains(key) {
                    try checkpoint()
                    try validateNoNestedExtensions(in: child)
                }
            }
            for key in ["normalTexture", "occlusionTexture", "emissiveTexture"] {
                try checkpoint()
                try validateTextureInfoExtensionLocation(material[key])
            }
            for (key, child) in material where ![
                "extensions", "pbrMetallicRoughness", "normalTexture", "occlusionTexture", "emissiveTexture",
            ].contains(key) {
                try checkpoint()
                try validateNoNestedExtensions(in: child)
            }
        }
    }

    private func extensionMap(
        in object: [String: Any],
        allowing names: Set<String>
    ) throws -> [String: Any] {
        guard let value = object["extensions"] else { return [:] }
        guard let extensions = value as? [String: Any],
              extensions.keys.allSatisfy(names.contains)
        else {
            throw AdmissionError.invalid
        }
        return extensions
    }

    private func validateTextureInfoExtensionLocation(_ value: Any?) throws {
        guard let value else { return }
        try checkpoint()
        guard let textureInfo = value as? [String: Any] else {
            throw AdmissionError.invalid
        }
        let extensions = try extensionMap(
            in: textureInfo,
            allowing: ["KHR_texture_transform"]
        )
        for payload in extensions.values {
            try checkpoint()
            try validateNoNestedExtensions(in: payload)
        }
        for (key, child) in textureInfo where key != "extensions" {
            try checkpoint()
            try validateNoNestedExtensions(in: child)
        }
    }

    private func validateMToonExtensionLocations(in value: Any) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            if object["extensions"] != nil {
                guard object["index"] != nil else { throw AdmissionError.invalid }
                let extensions = try extensionMap(
                    in: object,
                    allowing: ["KHR_texture_transform"]
                )
                for payload in extensions.values {
                    try checkpoint()
                    try validateNoNestedExtensions(in: payload)
                }
            }
            for (key, child) in object where key != "extensions" {
                try validateMToonExtensionLocations(in: child)
            }
        } else if let array = value as? [Any] {
            for child in array {
                try validateMToonExtensionLocations(in: child)
            }
        }
    }

    private func validateNoNestedExtensions(in value: Any) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            guard object["extensions"] == nil else { throw AdmissionError.invalid }
            for child in object.values {
                try validateNoNestedExtensions(in: child)
            }
        } else if let array = value as? [Any] {
            for child in array {
                try validateNoNestedExtensions(in: child)
            }
        }
    }

    private func validateBuffers() throws {
        guard let buffers = document["buffers"] as? [Any],
              buffers.count == 1,
              hasBinaryChunk,
              let buffer = buffers[0] as? [String: Any]
        else {
            throw AdmissionError.invalid
        }
        let declared = try uint(buffer["byteLength"])
        try AssetBudget.require(declared, maximum: budget.bufferBytes)
        guard declared <= binary.count,
              binary.count - Int(declared) <= 3
        else {
            throw AdmissionError.invalid
        }
        guard binary[Int(declared)...].allSatisfy({ $0 == 0 }) else {
            throw AdmissionError.invalid
        }
    }

    mutating private func validateBufferViews() throws {
        let values = try optionalArray("bufferViews")
        var ranges: [(UInt64, UInt64)] = []
        for value in values {
            try checkpoint()
            guard let view = value as? [String: Any],
                  try uint(view["buffer"]) == 0
            else {
                throw AdmissionError.invalid
            }
            let offset = try optionalUInt(view["byteOffset"]) ?? 0
            let length = try uint(view["byteLength"])
            let end = try AssetBudget.add(offset, length)
            guard end <= binary.count else { throw AdmissionError.invalid }
            let stride = try optionalUInt(view["byteStride"])
            if let stride {
                guard (4...252).contains(stride), stride % 4 == 0 else {
                    throw AdmissionError.invalid
                }
            }
            ranges.append((offset, end))
            bufferViews.append(.init(offset: offset, length: length, stride: stride))
        }
        let sorted = ranges.sorted { $0.0 < $1.0 }
        for pair in zip(sorted, sorted.dropFirst()) {
            try checkpoint()
            guard pair.0.1 <= pair.1.0 else { throw AdmissionError.invalid }
        }
    }

    mutating private func validateAccessors() throws {
        let values = try optionalArray("accessors")
        for value in values {
            try checkpoint()
            guard let accessor = value as? [String: Any] else {
                throw AdmissionError.invalid
            }
            let componentType = try uint(accessor["componentType"])
            let componentBytes: UInt64
            switch componentType {
            case 5120, 5121: componentBytes = 1
            case 5122, 5123: componentBytes = 2
            case 5125, 5126: componentBytes = 4
            default: throw AdmissionError.invalid
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
            default: throw AdmissionError.invalid
            }
            let count = try uint(accessor["count"])
            guard count > 0 else { throw AdmissionError.invalid }
            let elementBytes = try AssetBudget.multiply(componentBytes, componentCount)
            _ = try checkedScalarCount(count: count, componentCount: componentCount)

            let denseOffset: UInt64?
            let stride: UInt64
            if let viewValue = accessor["bufferView"] {
                let view = bufferViews[try index(viewValue, count: bufferViews.count)]
                let localOffset = try optionalUInt(accessor["byteOffset"]) ?? 0
                stride = view.stride ?? elementBytes
                guard stride >= elementBytes,
                      localOffset % componentBytes == 0
                else {
                    throw AdmissionError.invalid
                }
                let span = try AssetBudget.add(
                    try AssetBudget.multiply(count - 1, stride),
                    elementBytes
                )
                guard try AssetBudget.add(localOffset, span) <= view.length else {
                    throw AdmissionError.invalid
                }
                denseOffset = try AssetBudget.add(view.offset, localOffset)
            } else {
                guard accessor["byteOffset"] == nil else {
                    throw AdmissionError.invalid
                }
                denseOffset = nil
                stride = elementBytes
            }

            let logicalBytes = try AssetBudget.multiply(count, elementBytes)
            let logicalTotal = try AssetBudget.add(accessorBytes, logicalBytes)
            let accessorCeiling = budget.accessorReferencedBytes
            try AssetBudget.require(logicalTotal, maximum: accessorCeiling)
            let sparse = try validateSparseAccessor(
                accessor["sparse"],
                accessorCount: count,
                componentBytes: componentBytes,
                elementBytes: elementBytes,
                remainingReferencedBytes: accessorCeiling - logicalTotal
            )
            guard denseOffset != nil || sparse != nil else {
                throw AdmissionError.invalid
            }

            let referenced = try AssetBudget.add(
                logicalBytes,
                sparse?.referencedBytes ?? 0
            )
            accessorBytes = try AssetBudget.add(accessorBytes, referenced)
            try AssetBudget.require(accessorBytes, maximum: accessorCeiling)
            let info = AccessorInfo(
                componentType: componentType,
                componentBytes: componentBytes,
                componentCount: componentCount,
                count: count,
                offset: denseOffset,
                stride: stride,
                normalized: (accessor["normalized"] as? Bool) ?? false,
                sparse: sparse?.info
            )
            try validateFiniteValues(info)
            accessors.append(info)
        }
    }

    private struct ValidatedSparseAccessor {
        let info: SparseAccessorInfo
        let referencedBytes: UInt64
    }

    private func validateSparseAccessor(
        _ value: Any?,
        accessorCount: UInt64,
        componentBytes: UInt64,
        elementBytes: UInt64,
        remainingReferencedBytes: UInt64
    ) throws -> ValidatedSparseAccessor? {
        guard let value else { return nil }
        guard let sparse = value as? [String: Any],
              let indicesObject = sparse["indices"] as? [String: Any],
              let valuesObject = sparse["values"] as? [String: Any]
        else {
            throw AdmissionError.invalid
        }
        let sparseCount = try uint(sparse["count"])
        guard sparseCount > 0, sparseCount <= accessorCount else {
            throw AdmissionError.invalid
        }

        let indexComponentType = try uint(indicesObject["componentType"])
        let indexBytes: UInt64
        switch indexComponentType {
        case 5121: indexBytes = 1
        case 5123: indexBytes = 2
        case 5125: indexBytes = 4
        default: throw AdmissionError.invalid
        }
        let indicesView = bufferViews[
            try index(indicesObject["bufferView"], count: bufferViews.count)
        ]
        let valuesView = bufferViews[
            try index(valuesObject["bufferView"], count: bufferViews.count)
        ]
        guard indicesView.stride == nil, valuesView.stride == nil else {
            throw AdmissionError.invalid
        }

        let indicesLocalOffset = try optionalUInt(indicesObject["byteOffset"]) ?? 0
        let valuesLocalOffset = try optionalUInt(valuesObject["byteOffset"]) ?? 0
        let indicesLength = try AssetBudget.multiply(sparseCount, indexBytes)
        let valuesLength = try AssetBudget.multiply(sparseCount, elementBytes)
        let referencedBytes = try AssetBudget.add(indicesLength, valuesLength)
        try AssetBudget.require(referencedBytes, maximum: remainingReferencedBytes)
        guard indicesLocalOffset % indexBytes == 0,
              valuesLocalOffset % componentBytes == 0,
              try AssetBudget.add(indicesLocalOffset, indicesLength) <= indicesView.length,
              try AssetBudget.add(valuesLocalOffset, valuesLength) <= valuesView.length
        else {
            throw AdmissionError.invalid
        }

        let indicesOffset = try AssetBudget.add(indicesView.offset, indicesLocalOffset)
        let valuesOffset = try AssetBudget.add(valuesView.offset, valuesLocalOffset)
        guard indicesOffset % indexBytes == 0,
              valuesOffset % componentBytes == 0
        else {
            throw AdmissionError.invalid
        }

        var previousIndex: UInt64?
        for position in 0..<sparseCount {
            if position % 256 == 0 { try checkpoint() }
            let offset = try AssetBudget.add(
                indicesOffset,
                try AssetBudget.multiply(position, indexBytes)
            )
            let indexValue: UInt64
            switch indexComponentType {
            case 5121: indexValue = UInt64(binary[Int(offset)])
            case 5123: indexValue = UInt64(readUInt16(at: offset))
            case 5125: indexValue = UInt64(readUInt32(at: offset))
            default: throw AdmissionError.invalid
            }
            guard indexValue < accessorCount,
                  previousIndex.map({ $0 < indexValue }) ?? true
            else {
                throw AdmissionError.invalid
            }
            previousIndex = indexValue
        }

        return ValidatedSparseAccessor(
            info: SparseAccessorInfo(
                count: sparseCount,
                indicesOffset: indicesOffset,
                indexComponentType: indexComponentType,
                indexBytes: indexBytes,
                valuesOffset: valuesOffset
            ),
            referencedBytes: referencedBytes
        )
    }

    private func validateFiniteValues(_ accessor: AccessorInfo) throws {
        guard accessor.componentType == 5126 else { return }
        _ = try checkedScalarCount(
            count: accessor.count,
            componentCount: accessor.componentCount
        )
        var sparsePosition = 0
        for element in 0..<accessor.count {
            if element % 256 == 0 { try checkpoint() }
            guard let base = try elementOffset(
                accessor,
                element: element,
                sparsePosition: &sparsePosition
            ) else { continue }
            for component in 0..<accessor.componentCount {
                let offset = try AssetBudget.add(
                    base,
                    try AssetBudget.multiply(component, 4)
                )
                guard float32(at: offset).isFinite else {
                    throw AdmissionError.invalid
                }
            }
        }
    }

    private func validateNodesAndScenes() throws {
        let nodes = try optionalArray("nodes")
        try AssetBudget.require(UInt64(nodes.count), maximum: budget.nodes)
        var edges = Array(repeating: [Int](), count: nodes.count)
        for (nodeIndex, value) in nodes.enumerated() {
            try checkpoint()
            guard let node = value as? [String: Any] else {
                throw AdmissionError.invalid
            }
            if node["matrix"] != nil,
               node["translation"] != nil
                    || node["rotation"] != nil
                    || node["scale"] != nil
            {
                throw AdmissionError.invalid
            }
            try vector(node["translation"], count: 3, minimum: -10_000, maximum: 10_000)
            try vector(node["scale"], count: 3, absoluteMinimum: 0.000_001, maximum: 1_000)
            if let rotation = node["rotation"] {
                let values = try finiteVector(rotation, count: 4)
                guard values.allSatisfy({ abs($0) <= 1.0001 }) else {
                    throw AdmissionError.invalid
                }
                let length = sqrt(values.reduce(0) { $0 + $1 * $1 })
                guard (0.99...1.01).contains(length) else {
                    throw AdmissionError.invalid
                }
            }
            try vector(node["matrix"], count: 16, minimum: -1_000_000, maximum: 1_000_000)
            if let mesh = node["mesh"] { _ = try index(mesh, count: try optionalArray("meshes").count) }
            if let skin = node["skin"] { _ = try index(skin, count: try optionalArray("skins").count) }
            for child in try optionalArray(node["children"]) {
                try checkpoint()
                edges[nodeIndex].append(try index(child, count: nodes.count))
            }
        }
        var marks = Array(repeating: UInt8(0), count: nodes.count)
        for node in nodes.indices {
            guard marks[node] == 0 else { continue }
            var stack: [(node: Int, nextChild: Int)] = [(node, 0)]
            marks[node] = 1
            while let frame = stack.last {
                try checkpoint()
                if frame.nextChild == edges[frame.node].count {
                    marks[frame.node] = 2
                    stack.removeLast()
                    continue
                }

                let child = edges[frame.node][frame.nextChild]
                stack[stack.count - 1].nextChild += 1
                try checkpoint()
                switch marks[child] {
                case 0:
                    marks[child] = 1
                    stack.append((child, 0))
                case 1:
                    throw AdmissionError.invalid
                default:
                    continue
                }
            }
        }

        let scenes = try optionalArray("scenes")
        for value in scenes {
            try checkpoint()
            guard let scene = value as? [String: Any] else { throw AdmissionError.invalid }
            for node in try optionalArray(scene["nodes"]) {
                try checkpoint()
                _ = try index(node, count: nodes.count)
            }
        }
        if let scene = document["scene"] { _ = try index(scene, count: scenes.count) }
    }

    mutating private func validateMeshes() throws {
        let meshes = try optionalArray("meshes")
        try AssetBudget.require(UInt64(meshes.count), maximum: budget.meshes)
        var primitiveCount: UInt64 = 0
        for value in meshes {
            try checkpoint()
            guard let mesh = value as? [String: Any],
                  let primitives = mesh["primitives"] as? [Any]
            else {
                throw AdmissionError.invalid
            }
            primitiveCount = try AssetBudget.add(primitiveCount, UInt64(primitives.count))
            try AssetBudget.require(primitiveCount, maximum: budget.meshPrimitives)
            for value in primitives {
                try checkpoint()
                guard let primitive = value as? [String: Any],
                      let attributes = primitive["attributes"] as? [String: Any],
                      let positionValue = attributes["POSITION"]
                else {
                    throw AdmissionError.invalid
                }
                let positionIndex = try index(positionValue, count: accessors.count)
                let position = accessors[positionIndex]
                guard position.componentType == 5126, position.componentCount == 3 else {
                    throw AdmissionError.invalid
                }
                vertices = try AssetBudget.add(vertices, position.count)
                try AssetBudget.require(vertices, maximum: budget.vertices)
                try validateAttribute(position, semantic: "POSITION", jointLimit: nil)

                for (semantic, accessorValue) in attributes {
                    try checkpoint()
                    let accessor = accessors[try index(accessorValue, count: accessors.count)]
                    guard accessor.count == position.count else { throw AdmissionError.invalid }
                    try validateAttribute(accessor, semantic: semantic, jointLimit: nil)
                }
                let jointSets = Set(
                    attributes.keys.compactMap {
                        $0.hasPrefix("JOINTS_") ? String($0.dropFirst(7)) : nil
                    }
                )
                let weightSets = Set(
                    attributes.keys.compactMap {
                        $0.hasPrefix("WEIGHTS_") ? String($0.dropFirst(8)) : nil
                    }
                )
                guard jointSets == weightSets,
                      jointSets.isEmpty || jointSets == ["0"]
                else {
                    throw AdmissionError.invalid
                }
                try AssetBudget.require(
                    try AssetBudget.multiply(UInt64(jointSets.count), 4),
                    maximum: budget.vertexJointInfluences
                )
                let primitiveElementCount: UInt64
                if let indexValue = primitive["indices"] {
                    let accessor = accessors[try index(indexValue, count: accessors.count)]
                    guard accessor.componentCount == 1,
                          [5121, 5123, 5125].contains(accessor.componentType)
                    else {
                        throw AdmissionError.invalid
                    }
                    indices = try AssetBudget.add(indices, accessor.count)
                    try AssetBudget.require(indices, maximum: budget.indices)
                    for value in try integerValues(accessor) {
                        try checkpoint()
                        guard value < position.count else { throw AdmissionError.invalid }
                    }
                    primitiveElementCount = accessor.count
                } else {
                    primitiveElementCount = position.count
                }
                let mode = try optionalUInt(primitive["mode"]) ?? 4
                let triangleCount: UInt64
                switch mode {
                case 4:
                    guard primitiveElementCount % 3 == 0 else {
                        throw AdmissionError.invalid
                    }
                    triangleCount = primitiveElementCount / 3
                case 5, 6:
                    triangleCount = primitiveElementCount > 2
                        ? primitiveElementCount - 2
                        : 0
                default:
                    throw AdmissionError.invalid
                }
                triangles = try AssetBudget.add(triangles, triangleCount)
                try AssetBudget.require(triangles, maximum: budget.triangles)
                let targets = try optionalArray(primitive["targets"])
                try AssetBudget.require(
                    UInt64(targets.count),
                    maximum: budget.morphTargetsPerPrimitive
                )
                for value in targets {
                    try checkpoint()
                    guard let target = value as? [String: Any] else {
                        throw AdmissionError.invalid
                    }
                    for (semantic, accessorValue) in target {
                        try checkpoint()
                        guard ["POSITION", "NORMAL", "TANGENT"].contains(semantic) else {
                            throw AdmissionError.invalid
                        }
                        let accessor = accessors[
                            try index(accessorValue, count: accessors.count)
                        ]
                        guard accessor.count == position.count else {
                            throw AdmissionError.invalid
                        }
                        let scalars = try AssetBudget.multiply(
                            accessor.count,
                            accessor.componentCount
                        )
                        morphValues = try AssetBudget.add(morphValues, scalars)
                        try AssetBudget.require(
                            morphValues,
                            maximum: budget.morphScalarValues
                        )
                        try validateMorphTargetAttribute(accessor, semantic: semantic)
                    }
                }
                if let material = primitive["material"] {
                    _ = try index(material, count: try optionalArray("materials").count)
                }
            }
        }
    }

    private func validateAttribute(
        _ accessor: AccessorInfo,
        semantic: String,
        jointLimit: UInt64?
    ) throws {
        if semantic.hasPrefix("JOINTS_") {
            guard [5121, 5123].contains(accessor.componentType),
                  accessor.componentCount == 4
            else {
                throw AdmissionError.invalid
            }
            if let jointLimit {
                for (index, value) in try integerValues(accessor).enumerated() {
                    try checkpoint(at: UInt64(index))
                    guard value < jointLimit else { throw AdmissionError.invalid }
                }
            }
            return
        }
        let expectedComponents: Set<UInt64>
        if semantic == "POSITION" || semantic == "NORMAL" {
            expectedComponents = [3]
        } else if semantic == "TANGENT" || semantic.hasPrefix("WEIGHTS_") {
            expectedComponents = [4]
        } else if semantic.hasPrefix("TEXCOORD_") {
            expectedComponents = [2]
        } else if semantic.hasPrefix("COLOR_") {
            expectedComponents = [3, 4]
        } else {
            return
        }
        guard expectedComponents.contains(accessor.componentCount) else {
            throw AdmissionError.invalid
        }
        if semantic == "POSITION", accessor.componentType != 5126 {
            throw AdmissionError.invalid
        }
        let values = try attributeFloatingValues(accessor)
        let range: ClosedRange<Double>
        if semantic == "POSITION" { range = -10_000...10_000 }
        else if semantic == "NORMAL" || semantic == "TANGENT" { range = -1.1...1.1 }
        else if semantic.hasPrefix("TEXCOORD_") { range = -1_000...1_000 }
        else if semantic.hasPrefix("COLOR_") || semantic.hasPrefix("WEIGHTS_") {
            range = 0...1
        } else {
            return
        }
        for (index, value) in values.enumerated() {
            try checkpoint(at: UInt64(index))
            guard range.contains(value) else { throw AdmissionError.invalid }
        }
        if semantic.hasPrefix("WEIGHTS_") {
            for (group, start) in stride(
                from: 0,
                to: values.count,
                by: Int(accessor.componentCount)
            ).enumerated() {
                try checkpoint(at: UInt64(group))
                let sum = values[start..<min(start + Int(accessor.componentCount), values.count)]
                    .reduce(0, +)
                if sum != 0, !(0.99...1.01).contains(sum) {
                    throw AdmissionError.invalid
                }
            }
        }
    }

    private func validateMorphTargetAttribute(
        _ accessor: AccessorInfo,
        semantic: String
    ) throws {
        guard accessor.componentType == 5126,
              accessor.componentCount == 3
        else {
            throw AdmissionError.invalid
        }
        switch semantic {
        case "POSITION":
            try validateAttribute(accessor, semantic: semantic, jointLimit: nil)
        case "NORMAL", "TANGENT":
            return
        default:
            throw AdmissionError.invalid
        }
    }

    private func attributeFloatingValues(_ accessor: AccessorInfo) throws -> [Double] {
        if accessor.componentType == 5126 {
            return try floatingValues(accessor)
        }
        guard accessor.normalized else { throw AdmissionError.invalid }
        var result: [Double] = []
        result.reserveCapacity(try checkedScalarCount(
            count: accessor.count,
            componentCount: accessor.componentCount
        ))
        var sparsePosition = 0
        for element in 0..<accessor.count {
            try checkpoint(at: element)
            let base = try elementOffset(
                accessor,
                element: element,
                sparsePosition: &sparsePosition
            )
            for component in 0..<accessor.componentCount {
                guard let base else {
                    result.append(0)
                    continue
                }
                let offset = try AssetBudget.add(
                    base,
                    try AssetBudget.multiply(component, accessor.componentBytes)
                )
                switch accessor.componentType {
                case 5120:
                    let signed = Int8(bitPattern: binary[Int(offset)])
                    result.append(max(Double(signed) / 127, -1))
                case 5121:
                    result.append(Double(binary[Int(offset)]) / 255)
                case 5122:
                    let signed = Int16(bitPattern: readUInt16(at: offset))
                    result.append(max(Double(signed) / 32_767, -1))
                case 5123:
                    result.append(Double(readUInt16(at: offset)) / 65_535)
                default:
                    throw AdmissionError.invalid
                }
            }
        }
        return result
    }

    private func validateSkins() throws {
        let skins = try optionalArray("skins")
        let nodes = try optionalArray("nodes")
        try AssetBudget.require(UInt64(skins.count), maximum: budget.skins)
        var jointCounts: [UInt64] = []
        for value in skins {
            try checkpoint()
            guard let skin = value as? [String: Any],
                  let joints = skin["joints"] as? [Any]
            else {
                throw AdmissionError.invalid
            }
            try AssetBudget.require(
                UInt64(joints.count),
                maximum: budget.jointsPerSkin
            )
            jointCounts.append(UInt64(joints.count))
            for joint in joints {
                try checkpoint()
                _ = try index(joint, count: nodes.count)
            }
            if let skeleton = skin["skeleton"] { _ = try index(skeleton, count: nodes.count) }
            if let inverse = skin["inverseBindMatrices"] {
                let accessor = accessors[try index(inverse, count: accessors.count)]
                guard accessor.componentType == 5126,
                      accessor.componentCount == 16,
                      accessor.count == joints.count
                else {
                    throw AdmissionError.invalid
                }
                for (index, value) in try floatingValues(accessor).enumerated() {
                    try checkpoint(at: UInt64(index))
                    guard abs(value) <= 1_000_000 else {
                        throw AdmissionError.invalid
                    }
                }
            }
        }

        for value in nodes {
            try checkpoint()
            guard let node = value as? [String: Any] else {
                throw AdmissionError.invalid
            }
            guard let skinValue = node["skin"] else { continue }
            let skinIndex = try index(skinValue, count: skins.count)
            guard let meshValue = node["mesh"] else {
                throw AdmissionError.invalid
            }
            try validateMeshJointIndices(
                mesh: try index(meshValue, count: try optionalArray("meshes").count),
                jointLimit: jointCounts[skinIndex]
            )
        }
    }

    private func validateMeshJointIndices(mesh meshIndex: Int, jointLimit: UInt64) throws {
        let meshes = try optionalArray("meshes")
        guard let mesh = meshes[meshIndex] as? [String: Any],
              let primitives = mesh["primitives"] as? [Any]
        else {
            throw AdmissionError.invalid
        }
        for value in primitives {
            try checkpoint()
            guard let primitive = value as? [String: Any],
                  let attributes = primitive["attributes"] as? [String: Any]
            else {
                throw AdmissionError.invalid
            }
            for (semantic, value) in attributes where semantic.hasPrefix("JOINTS_") {
                try checkpoint()
                try validateAttribute(
                    accessors[try index(value, count: accessors.count)],
                    semantic: semantic,
                    jointLimit: jointLimit
                )
            }
        }
    }

    private func validateMaterialsAndTextures() throws {
        let textures = try optionalArray("textures")
        let images = try optionalArray("images")
        let samplers = try optionalArray("samplers")
        try AssetBudget.require(UInt64(textures.count), maximum: budget.textures)
        try AssetBudget.require(UInt64(samplers.count), maximum: budget.samplers)
        for value in textures {
            try checkpoint()
            guard let texture = value as? [String: Any],
                  let source = texture["source"],
                  let sampler = texture["sampler"]
            else {
                throw AdmissionError.invalid
            }
            _ = try index(source, count: images.count)
            _ = try index(sampler, count: samplers.count)
        }
        for sampler in samplers {
            try checkpoint()
            guard sampler is [String: Any] else { throw AdmissionError.invalid }
        }

        let materials = try optionalArray("materials")
        try AssetBudget.require(UInt64(materials.count), maximum: budget.materials)
        for material in materials {
            try checkpoint()
            guard let object = material as? [String: Any] else {
                throw AdmissionError.invalid
            }
            try validateMaterialTextureInfos(object, textureCount: textures.count)
            try validateMaterialNumbers(object, textureCount: textures.count)
        }
    }

    private func validateMaterialTextureInfos(
        _ material: [String: Any],
        textureCount: Int
    ) throws {
        if let pbr = material["pbrMetallicRoughness"] {
            guard let object = pbr as? [String: Any] else { throw AdmissionError.invalid }
            for key in ["baseColorTexture", "metallicRoughnessTexture"] {
                try checkpoint()
                if let textureInfo = object[key] {
                    try validateTextureInfo(textureInfo, textureCount: textureCount)
                }
            }
        }
        for key in ["normalTexture", "occlusionTexture", "emissiveTexture"] {
            try checkpoint()
            if let textureInfo = material[key] {
                try validateTextureInfo(textureInfo, textureCount: textureCount)
            }
        }
    }

    private func validateTextureInfo(_ value: Any, textureCount: Int) throws {
        guard let textureInfo = value as? [String: Any] else { throw AdmissionError.invalid }
        _ = try index(textureInfo["index"], count: textureCount)
        if let texCoord = textureInfo["texCoord"] { _ = try uint(texCoord) }
    }

    private func validateMaterialNumbers(_ value: Any, textureCount: Int) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            for (key, child) in object {
                try checkpoint()
                if key == "index" {
                    _ = try index(child, count: textureCount)
                } else if key == "texCoord" {
                    _ = try uint(child)
                } else {
                    try validateMaterialNumbers(child, textureCount: textureCount)
                }
            }
        } else if let array = value as? [Any] {
            for child in array {
                try checkpoint()
                try validateMaterialNumbers(child, textureCount: textureCount)
            }
        } else if let number = value as? NSNumber, !isBoolean(number) {
            guard abs(number.doubleValue) <= 1_000 else { throw AdmissionError.invalid }
        }
    }

    mutating private func validateImages() throws {
        let images = try optionalArray("images")
        try AssetBudget.require(UInt64(images.count), maximum: budget.images)
        var baseBytes: UInt64 = 0
        var mipBytes: UInt64 = 0
        for value in images {
            try checkpoint()
            guard let image = value as? [String: Any],
                  let mime = image["mimeType"] as? String,
                  ["image/png", "image/jpeg"].contains(mime)
            else {
                throw AdmissionError.invalid
            }
            let view = bufferViews[try index(image["bufferView"], count: bufferViews.count)]
            let start = Int(view.offset)
            let end = Int(try AssetBudget.add(view.offset, view.length))
            let bytes = binary.subdata(in: start..<end)
            guard Self.signature(of: bytes) == mime,
                  try hasCompleteFrame(bytes, mime: mime),
                  let source = CGImageSourceCreateWithData(bytes as CFData, nil),
                  CGImageSourceGetCount(source) == 1,
                  CGImageSourceGetStatus(source) == .statusComplete,
                  CGImageSourceGetStatusAtIndex(source, 0) == .statusComplete,
                  let type = CGImageSourceGetType(source) as String?,
                  type == (mime == "image/png" ? UTType.png.identifier : UTType.jpeg.identifier),
                  let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil)
                    as? [CFString: Any],
                  let width = properties[kCGImagePropertyPixelWidth] as? NSNumber,
                  let height = properties[kCGImagePropertyPixelHeight] as? NSNumber
            else {
                throw AdmissionError.invalid
            }
            try checkpoint()
            let widthValue = try uint(width)
            let heightValue = try uint(height)
            guard widthValue > 0, heightValue > 0 else { throw AdmissionError.invalid }
            try AssetBudget.require(widthValue, maximum: budget.imageDimension)
            try AssetBudget.require(heightValue, maximum: budget.imageDimension)
            let pixels = try AssetBudget.multiply(widthValue, heightValue)
            decodedPixels = try AssetBudget.add(decodedPixels, pixels)
            try AssetBudget.require(
                decodedPixels,
                maximum: budget.decodedImagePixels
            )
            baseBytes = try AssetBudget.add(baseBytes, try AssetBudget.multiply(pixels, 4))
            mipBytes = try AssetBudget.add(
                mipBytes,
                try AssetBudget.mipmappedRGBA8Bytes(pixelCount: pixels)
            )
            try AssetBudget.require(
                baseBytes,
                maximum: budget.decodedRGBA8Bytes
            )
            try AssetBudget.require(
                mipBytes,
                maximum: budget.mipmappedRGBA8Bytes
            )
        }
    }

    private func validateVRMExtensions() throws {
        guard let extensions = document["extensions"] as? [String: Any],
              let vrm = extensions["VRMC_vrm"] as? [String: Any]
        else {
            throw AdmissionError.invalid
        }
        if let humanoid = vrm["humanoid"] as? [String: Any],
           let bones = humanoid["humanBones"] as? [String: Any]
        {
            try AssetBudget.require(
                UInt64(bones.count),
                maximum: budget.humanoidBoneEntries
            )
            for value in bones.values {
                try checkpoint()
                guard let bone = value as? [String: Any] else { throw AdmissionError.invalid }
                _ = try index(bone["node"], count: try optionalArray("nodes").count)
            }
        }
        if let expressions = vrm["expressions"] as? [String: Any] {
            var count: UInt64 = 0
            for group in ["preset", "custom"] {
                try checkpoint()
                if let entries = expressions[group] as? [String: Any] {
                    count = try AssetBudget.add(count, UInt64(entries.count))
                }
            }
            try AssetBudget.require(count, maximum: budget.expressions)
        }
        if let spring = extensions["VRMC_springBone"] as? [String: Any] {
            let springs = try optionalArray(spring["springs"])
            let colliders = try optionalArray(spring["colliders"])
            let groups = try optionalArray(spring["colliderGroups"])
            try AssetBudget.require(
                UInt64(colliders.count),
                maximum: budget.springColliders
            )
            try AssetBudget.require(
                UInt64(groups.count),
                maximum: budget.springColliderGroups
            )
            let nodeCount = try optionalArray("nodes").count
            for value in colliders {
                try checkpoint()
                guard let collider = value as? [String: Any],
                      let shape = collider["shape"] as? [String: Any]
                else {
                    throw AdmissionError.invalid
                }
                _ = try index(collider["node"], count: nodeCount)
                if let sphere = shape["sphere"] as? [String: Any] {
                    try validateColliderShape(sphere, hasTail: false)
                } else if let capsule = shape["capsule"] as? [String: Any] {
                    try validateColliderShape(capsule, hasTail: true)
                } else {
                    throw AdmissionError.invalid
                }
            }
            for value in groups {
                try checkpoint()
                guard let group = value as? [String: Any] else {
                    throw AdmissionError.invalid
                }
                for collider in try optionalArray(group["colliders"]) {
                    try checkpoint()
                    _ = try index(collider, count: colliders.count)
                }
            }
            var joints: UInt64 = 0
            for value in springs {
                try checkpoint()
                guard let object = value as? [String: Any] else {
                    throw AdmissionError.invalid
                }
                for group in try optionalArray(object["colliderGroups"]) {
                    try checkpoint()
                    _ = try index(group, count: groups.count)
                }
                let values = try optionalArray(object["joints"])
                joints = try AssetBudget.add(joints, UInt64(values.count))
                for joint in values {
                    try checkpoint()
                    guard let object = joint as? [String: Any] else {
                        throw AdmissionError.invalid
                    }
                    _ = try index(object["node"], count: nodeCount)
                    for key in ["hitRadius", "stiffness", "gravityPower", "dragForce"] {
                        try checkpoint()
                        if let value = object[key] {
                            try scalar(value, minimum: 0, maximum: 1_000)
                        }
                    }
                    try vector(
                        object["gravityDir"],
                        count: 3,
                        minimum: -1.1,
                        maximum: 1.1
                    )
                }
            }
            try AssetBudget.require(joints, maximum: budget.springJoints)
        }
        let constraints = try countExtension(named: "VRMC_node_constraint", in: document)
        try AssetBudget.require(constraints, maximum: budget.nodeConstraints)
        try validateConstraintNumbers(
            in: document,
            nodeCount: try optionalArray("nodes").count
        )
    }

    private func validateColliderShape(
        _ shape: [String: Any],
        hasTail: Bool
    ) throws {
        try vector(shape["offset"], count: 3, minimum: -10_000, maximum: 10_000)
        if hasTail {
            try vector(shape["tail"], count: 3, minimum: -10_000, maximum: 10_000)
        } else if shape["tail"] != nil {
            throw AdmissionError.invalid
        }
        guard let radius = shape["radius"] else { throw AdmissionError.invalid }
        try scalar(radius, minimum: 0, maximum: 1_000)
    }

    private func validateConstraintNumbers(in value: Any, nodeCount: Int) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            if let extensions = object["extensions"] as? [String: Any],
               let constraint = extensions["VRMC_node_constraint"] as? [String: Any]
            {
                try validateConstraintObject(constraint, nodeCount: nodeCount)
            }
            for child in object.values {
                try validateConstraintNumbers(in: child, nodeCount: nodeCount)
            }
        } else if let array = value as? [Any] {
            for child in array {
                try validateConstraintNumbers(in: child, nodeCount: nodeCount)
            }
        }
    }

    private func validateConstraintObject(_ value: Any, nodeCount: Int) throws {
        try checkpoint()
        if let object = value as? [String: Any] {
            for (key, child) in object {
                if key == "weight" {
                    try scalar(child, minimum: 0, maximum: 1)
                } else if key == "source" {
                    _ = try index(child, count: nodeCount)
                } else {
                    try validateConstraintObject(child, nodeCount: nodeCount)
                }
            }
        } else if let array = value as? [Any] {
            for child in array {
                try validateConstraintObject(child, nodeCount: nodeCount)
            }
        }
    }

    private func countExtension(named name: String, in value: Any) throws -> UInt64 {
        try checkpoint()
        if let object = value as? [String: Any] {
            let own: UInt64
            if let extensions = object["extensions"] as? [String: Any],
               extensions[name] != nil
            {
                own = 1
            } else {
                own = 0
            }
            var count = own
            for child in object.values {
                count = try AssetBudget.add(
                    count,
                    try countExtension(named: name, in: child)
                )
            }
            return count
        }
        if let array = value as? [Any] {
            var count: UInt64 = 0
            for child in array {
                count = try AssetBudget.add(
                    count,
                    try countExtension(named: name, in: child)
                )
            }
            return count
        }
        return 0
    }

    private func floatingValues(_ accessor: AccessorInfo) throws -> [Double] {
        guard accessor.componentType == 5126 else { throw AdmissionError.invalid }
        var result: [Double] = []
        result.reserveCapacity(try checkedScalarCount(
            count: accessor.count,
            componentCount: accessor.componentCount
        ))
        var sparsePosition = 0
        for element in 0..<accessor.count {
            try checkpoint(at: element)
            let base = try elementOffset(
                accessor,
                element: element,
                sparsePosition: &sparsePosition
            )
            for component in 0..<accessor.componentCount {
                if let base {
                    result.append(
                        Double(float32(at: try AssetBudget.add(
                            base,
                            try AssetBudget.multiply(component, 4)
                        )))
                    )
                } else {
                    result.append(0)
                }
            }
        }
        return result
    }

    private func integerValues(_ accessor: AccessorInfo) throws -> [UInt64] {
        var result: [UInt64] = []
        result.reserveCapacity(try checkedScalarCount(
            count: accessor.count,
            componentCount: accessor.componentCount
        ))
        var sparsePosition = 0
        for element in 0..<accessor.count {
            try checkpoint(at: element)
            let base = try elementOffset(
                accessor,
                element: element,
                sparsePosition: &sparsePosition
            )
            for component in 0..<accessor.componentCount {
                guard let base else {
                    result.append(0)
                    continue
                }
                let offset = try AssetBudget.add(
                    base,
                    try AssetBudget.multiply(component, accessor.componentBytes)
                )
                switch accessor.componentType {
                case 5121:
                    result.append(UInt64(binary[Int(offset)]))
                case 5123:
                    result.append(UInt64(readUInt16(at: offset)))
                case 5125:
                    result.append(UInt64(readUInt32(at: offset)))
                default:
                    throw AdmissionError.invalid
                }
            }
        }
        return result
    }

    private func checkedScalarCount(
        count: UInt64,
        componentCount: UInt64
    ) throws -> Int {
        let scalarCount = try AssetBudget.multiply(count, componentCount)
        guard count <= UInt64(Int.max),
              scalarCount <= UInt64(Int.max),
              let represented = Int(exactly: scalarCount)
        else {
            throw AdmissionError.invalid
        }
        return represented
    }

    private func elementOffset(
        _ accessor: AccessorInfo,
        element: UInt64,
        sparsePosition: inout Int
    ) throws -> UInt64? {
        if let sparse = accessor.sparse,
           UInt64(sparsePosition) < sparse.count,
           try sparseIndex(sparse, position: UInt64(sparsePosition)) == element
        {
            let offset = try AssetBudget.add(
                sparse.valuesOffset,
                try AssetBudget.multiply(
                    UInt64(sparsePosition),
                    accessor.elementBytes
                )
            )
            sparsePosition += 1
            return offset
        }
        guard let offset = accessor.offset else { return nil }
        return try AssetBudget.add(
            offset,
            try AssetBudget.multiply(element, accessor.stride)
        )
    }

    private func sparseIndex(
        _ sparse: SparseAccessorInfo,
        position: UInt64
    ) throws -> UInt64 {
        let offset = try AssetBudget.add(
            sparse.indicesOffset,
            try AssetBudget.multiply(position, sparse.indexBytes)
        )
        switch sparse.indexComponentType {
        case 5121: return UInt64(binary[Int(offset)])
        case 5123: return UInt64(readUInt16(at: offset))
        case 5125: return UInt64(readUInt32(at: offset))
        default: throw AdmissionError.invalid
        }
    }

    private func float32(at offset: UInt64) -> Float {
        let bits = readUInt32(at: offset)
        return Float(bitPattern: bits)
    }

    private func readUInt16(at offset: UInt64) -> UInt16 {
        binary.withUnsafeBytes {
            UInt16(littleEndian: $0.loadUnaligned(
                fromByteOffset: Int(offset),
                as: UInt16.self
            ))
        }
    }

    private func readUInt32(at offset: UInt64) -> UInt32 {
        binary.withUnsafeBytes {
            UInt32(littleEndian: $0.loadUnaligned(
                fromByteOffset: Int(offset),
                as: UInt32.self
            ))
        }
    }

    private static func signature(of data: Data) -> String? {
        if data.starts(with: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) {
            return "image/png"
        }
        if data.starts(with: [0xFF, 0xD8, 0xFF]) {
            return "image/jpeg"
        }
        return nil
    }

    private func hasCompleteFrame(_ data: Data, mime: String) throws -> Bool {
        if mime == "image/png" {
            return try hasCompletePNGFrame(data)
        }
        if mime == "image/jpeg" {
            return try hasCompleteJPEGFrame(data)
        }
        return false
    }

    private func hasCompletePNGFrame(_ data: Data) throws -> Bool {
        guard data.count >= 20,
              data.starts(with: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
        else {
            return false
        }
        let bytes = [UInt8](data)
        var offset = 8
        var isFirstChunk = true
        while offset <= bytes.count - 12 {
            try checkpoint()
            let length = Int(Self.readBigEndianUInt32(bytes, at: offset))
            let (chunkEnd, overflow) = offset.addingReportingOverflow(12 + length)
            guard !overflow, chunkEnd <= bytes.count else { return false }
            let type = Array(bytes[(offset + 4)..<(offset + 8)])
            if isFirstChunk {
                guard type == Array("IHDR".utf8), length == 13 else { return false }
                isFirstChunk = false
            }
            if type == Array("IEND".utf8) {
                return length == 0 && chunkEnd == bytes.count
            }
            offset = chunkEnd
        }
        return false
    }

    private func hasCompleteJPEGFrame(_ data: Data) throws -> Bool {
        let bytes = [UInt8](data)
        guard bytes.count >= 4, bytes[0] == 0xFF, bytes[1] == 0xD8 else {
            return false
        }
        var offset = 2
        var sawScan = false
        while offset < bytes.count {
            try checkpoint()
            guard bytes[offset] == 0xFF else { return false }
            while offset < bytes.count, bytes[offset] == 0xFF { offset += 1 }
            guard offset < bytes.count else { return false }
            let marker = bytes[offset]
            offset += 1
            if marker == 0xD9 {
                return sawScan && offset == bytes.count
            }
            if marker == 0x01 { continue }
            if marker == 0x00 || marker == 0xD8 || (0xD0...0xD7).contains(marker) {
                return false
            }
            guard offset <= bytes.count - 2 else { return false }
            let segmentLength = Int(bytes[offset]) << 8 | Int(bytes[offset + 1])
            guard segmentLength >= 2 else { return false }
            let (segmentEnd, overflow) = offset.addingReportingOverflow(segmentLength)
            guard !overflow, segmentEnd <= bytes.count else { return false }
            offset = segmentEnd
            guard marker == 0xDA else { continue }
            sawScan = true

            var foundNextMarker = false
            var scannedBytes = 0
            while offset < bytes.count {
                scannedBytes += 1
                if scannedBytes.isMultiple(of: 4_096) { try checkpoint() }
                guard bytes[offset] == 0xFF else {
                    offset += 1
                    continue
                }
                let candidate = offset
                while offset < bytes.count, bytes[offset] == 0xFF { offset += 1 }
                guard offset < bytes.count else { return false }
                let next = bytes[offset]
                if next == 0x00 || (0xD0...0xD7).contains(next) {
                    offset += 1
                    continue
                }
                offset = candidate
                foundNextMarker = true
                break
            }
            guard foundNextMarker else { return false }
        }
        return false
    }

    private static func readBigEndianUInt32(_ bytes: [UInt8], at offset: Int) -> UInt32 {
        UInt32(bytes[offset]) << 24
            | UInt32(bytes[offset + 1]) << 16
            | UInt32(bytes[offset + 2]) << 8
            | UInt32(bytes[offset + 3])
    }

    private func count(_ key: String, maximum: UInt64) throws -> UInt64 {
        let value = UInt64(try optionalArray(key).count)
        try AssetBudget.require(value, maximum: maximum)
        return value
    }

    private func optionalArray(_ key: String) throws -> [Any] {
        try optionalArray(document[key])
    }

    private func optionalArray(_ value: Any?) throws -> [Any] {
        guard let value else { return [] }
        guard let array = value as? [Any] else { throw AdmissionError.invalid }
        return array
    }

    private func checkpoint(at iteration: UInt64) throws {
        if iteration > 0, iteration.isMultiple(of: 256) {
            try checkpoint()
        }
    }

    private func index(_ value: Any?, count: Int) throws -> Int {
        let value = try uint(value)
        guard value < count, value <= UInt64(Int.max) else {
            throw AdmissionError.invalid
        }
        return Int(value)
    }

    private func optionalUInt(_ value: Any?) throws -> UInt64? {
        guard let value else { return nil }
        return try uint(value)
    }

    private func uint(_ value: Any?) throws -> UInt64 {
        guard let number = value as? NSNumber,
              !isBoolean(number)
        else {
            throw AdmissionError.invalid
        }
        let double = number.doubleValue
        guard double.isFinite,
              double >= 0,
              double.rounded(.towardZero) == double,
              double <= Double(UInt64.max)
        else {
            throw AdmissionError.invalid
        }
        return number.uint64Value
    }

    private func scalar(_ value: Any, minimum: Double, maximum: Double) throws {
        guard let number = value as? NSNumber,
              !isBoolean(number),
              number.doubleValue.isFinite,
              (minimum...maximum).contains(number.doubleValue)
        else {
            throw AdmissionError.invalid
        }
    }

    private func vector(
        _ value: Any?,
        count: Int,
        minimum: Double,
        maximum: Double
    ) throws {
        guard let value else { return }
        let values = try finiteVector(value, count: count)
        guard values.allSatisfy({ (minimum...maximum).contains($0) }) else {
            throw AdmissionError.invalid
        }
    }

    private func vector(
        _ value: Any?,
        count: Int,
        absoluteMinimum: Double,
        maximum: Double
    ) throws {
        guard let value else { return }
        let values = try finiteVector(value, count: count)
        guard values.allSatisfy({
            abs($0) >= absoluteMinimum && abs($0) <= maximum
        }) else {
            throw AdmissionError.invalid
        }
    }

    private func finiteVector(_ value: Any, count: Int) throws -> [Double] {
        guard let values = value as? [Any], values.count == count else {
            throw AdmissionError.invalid
        }
        return try values.map {
            guard let number = $0 as? NSNumber,
                  !isBoolean(number),
                  number.doubleValue.isFinite
            else {
                throw AdmissionError.invalid
            }
            return number.doubleValue
        }
    }

    private func isBoolean(_ number: NSNumber) -> Bool {
        CFGetTypeID(number) == CFBooleanGetTypeID()
    }
}
