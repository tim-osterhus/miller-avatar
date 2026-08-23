import Foundation

public enum AssetBudgetError: Error, Equatable, Sendable {
    case limitExceeded
    case arithmeticOverflow
}

public enum AvatarAssetQualityMode: String, Codable, Sendable {
    case lightweight
    case highQuality = "high_quality"
}

public struct AssetCeiling: Equatable, Sendable {
    public let name: String
    public let limit: UInt64
}

public struct AssetBudget: Equatable, Sendable {
    public let capturedBytes: UInt64
    public let jsonBytes: UInt64
    public let jsonValues: UInt64
    public let jsonNesting: UInt64
    public let nodes: UInt64
    public let meshes: UInt64
    public let meshPrimitives: UInt64
    public let materials: UInt64
    public let images: UInt64
    public let textures: UInt64
    public let samplers: UInt64
    public let imageDimension: UInt64
    public let decodedImagePixels: UInt64
    public let decodedRGBA8Bytes: UInt64
    public let mipmappedRGBA8Bytes: UInt64
    public let bufferBytes: UInt64
    public let accessorReferencedBytes: UInt64
    public let vertices: UInt64
    public let indices: UInt64
    public let triangles: UInt64
    public let morphTargetsPerPrimitive: UInt64
    public let morphScalarValues: UInt64
    public let skins: UInt64
    public let jointsPerSkin: UInt64
    public let vertexJointInfluences: UInt64
    public let humanoidBoneEntries: UInt64
    public let expressions: UInt64
    public let springJoints: UInt64
    public let springColliders: UInt64
    public let springColliderGroups: UInt64
    public let nodeConstraints: UInt64
    public let preflightNanoseconds: UInt64
    public let qualityMode: AvatarAssetQualityMode

    public init(
        capturedBytes: UInt64,
        jsonBytes: UInt64,
        jsonValues: UInt64,
        jsonNesting: UInt64,
        nodes: UInt64,
        meshes: UInt64,
        meshPrimitives: UInt64,
        materials: UInt64,
        images: UInt64,
        textures: UInt64,
        samplers: UInt64,
        imageDimension: UInt64,
        decodedImagePixels: UInt64,
        decodedRGBA8Bytes: UInt64,
        mipmappedRGBA8Bytes: UInt64,
        bufferBytes: UInt64,
        accessorReferencedBytes: UInt64,
        vertices: UInt64,
        indices: UInt64,
        triangles: UInt64,
        morphTargetsPerPrimitive: UInt64,
        morphScalarValues: UInt64,
        skins: UInt64,
        jointsPerSkin: UInt64,
        vertexJointInfluences: UInt64,
        humanoidBoneEntries: UInt64,
        expressions: UInt64,
        springJoints: UInt64,
        springColliders: UInt64,
        springColliderGroups: UInt64,
        nodeConstraints: UInt64,
        preflightNanoseconds: UInt64,
        qualityMode: AvatarAssetQualityMode = .lightweight
    ) {
        self.capturedBytes = capturedBytes
        self.jsonBytes = jsonBytes
        self.jsonValues = jsonValues
        self.jsonNesting = jsonNesting
        self.nodes = nodes
        self.meshes = meshes
        self.meshPrimitives = meshPrimitives
        self.materials = materials
        self.images = images
        self.textures = textures
        self.samplers = samplers
        self.imageDimension = imageDimension
        self.decodedImagePixels = decodedImagePixels
        self.decodedRGBA8Bytes = decodedRGBA8Bytes
        self.mipmappedRGBA8Bytes = mipmappedRGBA8Bytes
        self.bufferBytes = bufferBytes
        self.accessorReferencedBytes = accessorReferencedBytes
        self.vertices = vertices
        self.indices = indices
        self.triangles = triangles
        self.morphTargetsPerPrimitive = morphTargetsPerPrimitive
        self.morphScalarValues = morphScalarValues
        self.skins = skins
        self.jointsPerSkin = jointsPerSkin
        self.vertexJointInfluences = vertexJointInfluences
        self.humanoidBoneEntries = humanoidBoneEntries
        self.expressions = expressions
        self.springJoints = springJoints
        self.springColliders = springColliders
        self.springColliderGroups = springColliderGroups
        self.nodeConstraints = nodeConstraints
        self.preflightNanoseconds = preflightNanoseconds
        self.qualityMode = qualityMode
    }

    public init(qualityMode: AvatarAssetQualityMode) {
        self = Self.budget(for: qualityMode)
    }

    public static let lightweight = AssetBudget(
        capturedBytes: 128 * 1_024 * 1_024,
        jsonBytes: 8 * 1_024 * 1_024,
        jsonValues: 262_144,
        jsonNesting: 64,
        nodes: 4_096,
        meshes: 1_024,
        meshPrimitives: 2_048,
        materials: 512,
        images: 64,
        textures: 64,
        samplers: 64,
        imageDimension: 8_192,
        decodedImagePixels: 27 * 1_024 * 1_024,
        decodedRGBA8Bytes: 108 * 1_024 * 1_024,
        mipmappedRGBA8Bytes: 144 * 1_024 * 1_024,
        bufferBytes: 64 * 1_024 * 1_024,
        accessorReferencedBytes: 64 * 1_024 * 1_024,
        vertices: 1_000_000,
        indices: 3_000_000,
        triangles: 1_000_000,
        morphTargetsPerPrimitive: 64,
        morphScalarValues: 16_000_000,
        skins: 64,
        jointsPerSkin: 256,
        vertexJointInfluences: 8,
        humanoidBoneEntries: 128,
        expressions: 128,
        springJoints: 512,
        springColliders: 512,
        springColliderGroups: 512,
        nodeConstraints: 512,
        preflightNanoseconds: 5_000_000_000,
        qualityMode: .lightweight
    )

    public static let alpha = lightweight

    private static let highQualityByteCeiling: UInt64 = 2_684_354_560

    public static let highQuality = AssetBudget.highQualityBudget

    private static let highQualityBudget: AssetBudget = {
        let light = lightweight
        return AssetBudget(
            capturedBytes: highQualityByteCeiling,
            jsonBytes: scaled(light.jsonBytes),
            jsonValues: scaled(light.jsonValues),
            jsonNesting: light.jsonNesting,
            nodes: scaled(light.nodes),
            meshes: scaled(light.meshes),
            meshPrimitives: scaled(light.meshPrimitives),
            materials: scaled(light.materials),
            images: scaled(light.images),
            textures: scaled(light.textures),
            samplers: scaled(light.samplers),
            imageDimension: light.imageDimension * 4,
            decodedImagePixels: scaled(light.decodedImagePixels),
            decodedRGBA8Bytes: scaled(light.decodedRGBA8Bytes),
            mipmappedRGBA8Bytes: scaled(light.mipmappedRGBA8Bytes),
            bufferBytes: highQualityByteCeiling,
            accessorReferencedBytes: highQualityByteCeiling,
            vertices: scaled(light.vertices),
            indices: scaled(light.indices),
            triangles: scaled(light.triangles),
            morphTargetsPerPrimitive: scaled(light.morphTargetsPerPrimitive),
            morphScalarValues: scaled(light.morphScalarValues),
            skins: scaled(light.skins),
            jointsPerSkin: scaled(light.jointsPerSkin),
            vertexJointInfluences: light.vertexJointInfluences,
            humanoidBoneEntries: scaled(light.humanoidBoneEntries),
            expressions: scaled(light.expressions),
            springJoints: scaled(light.springJoints),
            springColliders: scaled(light.springColliders),
            springColliderGroups: scaled(light.springColliderGroups),
            nodeConstraints: scaled(light.nodeConstraints),
            preflightNanoseconds: light.preflightNanoseconds,
            qualityMode: .highQuality
        )
    }()

    private static func scaled(_ value: UInt64) -> UInt64 {
        value * 20
    }

    public static func budget(for mode: AvatarAssetQualityMode) -> AssetBudget {
        switch mode {
        case .lightweight: return .lightweight
        case .highQuality: return .highQuality
        }
    }

    public var preflightDeadlineNanoseconds: UInt64? {
        qualityMode == .highQuality ? nil : preflightNanoseconds
    }

    package var glbParsingLimits: GLBParsingLimits {
        GLBParsingLimits(
            capturedBytes: capturedBytes,
            jsonBytes: jsonBytes,
            jsonValues: jsonValues,
            jsonNesting: jsonNesting
        )
    }

    public var allCeilings: [AssetCeiling] {
        var ceilings = [
            AssetCeiling(name: "capturedBytes", limit: capturedBytes),
            AssetCeiling(name: "jsonBytes", limit: jsonBytes),
            AssetCeiling(name: "jsonValues", limit: jsonValues),
            AssetCeiling(name: "jsonNesting", limit: jsonNesting),
            AssetCeiling(name: "nodes", limit: nodes),
            AssetCeiling(name: "meshes", limit: meshes),
            AssetCeiling(name: "meshPrimitives", limit: meshPrimitives),
            AssetCeiling(name: "materials", limit: materials),
            AssetCeiling(name: "images", limit: images),
            AssetCeiling(name: "textures", limit: textures),
            AssetCeiling(name: "samplers", limit: samplers),
            AssetCeiling(name: "imageDimension", limit: imageDimension),
            AssetCeiling(name: "decodedImagePixels", limit: decodedImagePixels),
            AssetCeiling(name: "decodedRGBA8Bytes", limit: decodedRGBA8Bytes),
            AssetCeiling(name: "mipmappedRGBA8Bytes", limit: mipmappedRGBA8Bytes),
            AssetCeiling(name: "bufferBytes", limit: bufferBytes),
            AssetCeiling(name: "accessorReferencedBytes", limit: accessorReferencedBytes),
            AssetCeiling(name: "vertices", limit: vertices),
            AssetCeiling(name: "indices", limit: indices),
            AssetCeiling(name: "triangles", limit: triangles),
            AssetCeiling(name: "morphTargetsPerPrimitive", limit: morphTargetsPerPrimitive),
            AssetCeiling(name: "morphScalarValues", limit: morphScalarValues),
            AssetCeiling(name: "skins", limit: skins),
            AssetCeiling(name: "jointsPerSkin", limit: jointsPerSkin),
            AssetCeiling(name: "vertexJointInfluences", limit: vertexJointInfluences),
            AssetCeiling(name: "humanoidBoneEntries", limit: humanoidBoneEntries),
            AssetCeiling(name: "expressions", limit: expressions),
            AssetCeiling(name: "springJoints", limit: springJoints),
            AssetCeiling(name: "springColliders", limit: springColliders),
            AssetCeiling(name: "springColliderGroups", limit: springColliderGroups),
            AssetCeiling(name: "nodeConstraints", limit: nodeConstraints),
        ]
        if qualityMode == .lightweight {
            ceilings.append(.init(name: "preflightNanoseconds", limit: preflightNanoseconds))
        }
        return ceilings
    }

    public static func allows(_ value: UInt64, maximum: UInt64) -> Bool {
        value <= maximum
    }

    public static func require(_ value: UInt64, maximum: UInt64) throws {
        guard allows(value, maximum: maximum) else {
            throw AssetBudgetError.limitExceeded
        }
    }

    public static func add(_ lhs: UInt64, _ rhs: UInt64) throws -> UInt64 {
        let (value, overflow) = lhs.addingReportingOverflow(rhs)
        guard !overflow else { throw AssetBudgetError.arithmeticOverflow }
        return value
    }

    public static func multiply(_ lhs: UInt64, _ rhs: UInt64) throws -> UInt64 {
        let (value, overflow) = lhs.multipliedReportingOverflow(by: rhs)
        guard !overflow else { throw AssetBudgetError.arithmeticOverflow }
        return value
    }

    public static func mipmappedRGBA8Bytes(pixelCount: UInt64) throws -> UInt64 {
        let base = try multiply(pixelCount, 4)
        let fourThirds = try multiply(base, 4)
        return try add(fourThirds, 2) / 3
    }
}
