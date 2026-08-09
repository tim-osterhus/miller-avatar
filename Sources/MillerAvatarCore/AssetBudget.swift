import Foundation

public enum AssetBudgetError: Error, Equatable, Sendable {
    case limitExceeded
    case arithmeticOverflow
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

    public static let alpha = AssetBudget(
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
        preflightNanoseconds: 5_000_000_000
    )

    package var glbParsingLimits: GLBParsingLimits {
        GLBParsingLimits(
            capturedBytes: capturedBytes,
            jsonBytes: jsonBytes,
            jsonValues: jsonValues,
            jsonNesting: jsonNesting
        )
    }

    public var allCeilings: [AssetCeiling] {
        [
            .init(name: "capturedBytes", limit: capturedBytes),
            .init(name: "jsonBytes", limit: jsonBytes),
            .init(name: "jsonValues", limit: jsonValues),
            .init(name: "jsonNesting", limit: jsonNesting),
            .init(name: "nodes", limit: nodes),
            .init(name: "meshes", limit: meshes),
            .init(name: "meshPrimitives", limit: meshPrimitives),
            .init(name: "materials", limit: materials),
            .init(name: "images", limit: images),
            .init(name: "textures", limit: textures),
            .init(name: "samplers", limit: samplers),
            .init(name: "imageDimension", limit: imageDimension),
            .init(name: "decodedImagePixels", limit: decodedImagePixels),
            .init(name: "decodedRGBA8Bytes", limit: decodedRGBA8Bytes),
            .init(name: "mipmappedRGBA8Bytes", limit: mipmappedRGBA8Bytes),
            .init(name: "bufferBytes", limit: bufferBytes),
            .init(name: "accessorReferencedBytes", limit: accessorReferencedBytes),
            .init(name: "vertices", limit: vertices),
            .init(name: "indices", limit: indices),
            .init(name: "triangles", limit: triangles),
            .init(name: "morphTargetsPerPrimitive", limit: morphTargetsPerPrimitive),
            .init(name: "morphScalarValues", limit: morphScalarValues),
            .init(name: "skins", limit: skins),
            .init(name: "jointsPerSkin", limit: jointsPerSkin),
            .init(name: "vertexJointInfluences", limit: vertexJointInfluences),
            .init(name: "humanoidBoneEntries", limit: humanoidBoneEntries),
            .init(name: "expressions", limit: expressions),
            .init(name: "springJoints", limit: springJoints),
            .init(name: "springColliders", limit: springColliders),
            .init(name: "springColliderGroups", limit: springColliderGroups),
            .init(name: "nodeConstraints", limit: nodeConstraints),
            .init(name: "preflightNanoseconds", limit: preflightNanoseconds),
        ]
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
