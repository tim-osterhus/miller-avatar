import Foundation
@testable import MillerAvatarCore

enum SyntheticGLBFactory {
    static let png1x1 = Data(base64Encoded:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
    )!

    static func minimalDocument(
        extra: [String: Any] = [:],
        binaryByteCount: Int = 4
    ) -> [String: Any] {
        var document: [String: Any] = [
            "asset": ["version": "2.0"],
            "buffers": [["byteLength": binaryByteCount]],
            "extensionsUsed": ["VRMC_vrm"],
            "extensionsRequired": ["VRMC_vrm"],
            "extensions": ["VRMC_vrm": ["specVersion": "1.0"]],
        ]
        for (key, value) in extra {
            document[key] = value
        }
        return document
    }

    static func make(
        document: [String: Any] = minimalDocument(),
        binary: Data = Data(repeating: 0, count: 4)
    ) throws -> Data {
        try make(json: JSONSerialization.data(withJSONObject: document), binary: binary)
    }

    static func make(json: Data, binary: Data? = Data(repeating: 0, count: 4)) throws -> Data {
        var json = json
        while json.count % 4 != 0 {
            json.append(0x20)
        }
        var binary = binary
        if var bytes = binary {
            while bytes.count % 4 != 0 {
                bytes.append(0)
            }
            binary = bytes
        }

        let length = 12 + 8 + json.count + (binary.map { 8 + $0.count } ?? 0)
        var result = Data()
        result.append(littleEndian: 0x4654_6C67)
        result.append(littleEndian: 2)
        result.append(littleEndian: UInt32(length))
        result.append(littleEndian: UInt32(json.count))
        result.append(littleEndian: 0x4E4F_534A)
        result.append(json)
        if let binary {
            result.append(littleEndian: UInt32(binary.count))
            result.append(littleEndian: 0x004E_4942)
            result.append(binary)
        }
        return result
    }

    static func budget(
        capturedBytes: UInt64 = AssetBudget.alpha.capturedBytes,
        jsonBytes: UInt64 = AssetBudget.alpha.jsonBytes,
        jsonValues: UInt64 = AssetBudget.alpha.jsonValues,
        jsonNesting: UInt64 = AssetBudget.alpha.jsonNesting,
        nodes: UInt64 = AssetBudget.alpha.nodes,
        meshes: UInt64 = AssetBudget.alpha.meshes,
        meshPrimitives: UInt64 = AssetBudget.alpha.meshPrimitives,
        materials: UInt64 = AssetBudget.alpha.materials,
        images: UInt64 = AssetBudget.alpha.images,
        textures: UInt64 = AssetBudget.alpha.textures,
        samplers: UInt64 = AssetBudget.alpha.samplers,
        imageDimension: UInt64 = AssetBudget.alpha.imageDimension,
        decodedImagePixels: UInt64 = AssetBudget.alpha.decodedImagePixels,
        decodedRGBA8Bytes: UInt64 = AssetBudget.alpha.decodedRGBA8Bytes,
        mipmappedRGBA8Bytes: UInt64 = AssetBudget.alpha.mipmappedRGBA8Bytes,
        bufferBytes: UInt64 = AssetBudget.alpha.bufferBytes,
        accessorReferencedBytes: UInt64 = AssetBudget.alpha.accessorReferencedBytes,
        vertices: UInt64 = AssetBudget.alpha.vertices,
        indices: UInt64 = AssetBudget.alpha.indices,
        triangles: UInt64 = AssetBudget.alpha.triangles,
        morphTargetsPerPrimitive: UInt64 = AssetBudget.alpha.morphTargetsPerPrimitive,
        morphScalarValues: UInt64 = AssetBudget.alpha.morphScalarValues,
        skins: UInt64 = AssetBudget.alpha.skins,
        jointsPerSkin: UInt64 = AssetBudget.alpha.jointsPerSkin,
        vertexJointInfluences: UInt64 = AssetBudget.alpha.vertexJointInfluences,
        humanoidBoneEntries: UInt64 = AssetBudget.alpha.humanoidBoneEntries,
        expressions: UInt64 = AssetBudget.alpha.expressions,
        springJoints: UInt64 = AssetBudget.alpha.springJoints,
        springColliders: UInt64 = AssetBudget.alpha.springColliders,
        springColliderGroups: UInt64 = AssetBudget.alpha.springColliderGroups,
        nodeConstraints: UInt64 = AssetBudget.alpha.nodeConstraints,
        preflightNanoseconds: UInt64 = AssetBudget.alpha.preflightNanoseconds
    ) -> AssetBudget {
        AssetBudget(
            capturedBytes: capturedBytes,
            jsonBytes: jsonBytes,
            jsonValues: jsonValues,
            jsonNesting: jsonNesting,
            nodes: nodes,
            meshes: meshes,
            meshPrimitives: meshPrimitives,
            materials: materials,
            images: images,
            textures: textures,
            samplers: samplers,
            imageDimension: imageDimension,
            decodedImagePixels: decodedImagePixels,
            decodedRGBA8Bytes: decodedRGBA8Bytes,
            mipmappedRGBA8Bytes: mipmappedRGBA8Bytes,
            bufferBytes: bufferBytes,
            accessorReferencedBytes: accessorReferencedBytes,
            vertices: vertices,
            indices: indices,
            triangles: triangles,
            morphTargetsPerPrimitive: morphTargetsPerPrimitive,
            morphScalarValues: morphScalarValues,
            skins: skins,
            jointsPerSkin: jointsPerSkin,
            vertexJointInfluences: vertexJointInfluences,
            humanoidBoneEntries: humanoidBoneEntries,
            expressions: expressions,
            springJoints: springJoints,
            springColliders: springColliders,
            springColliderGroups: springColliderGroups,
            nodeConstraints: nodeConstraints,
            preflightNanoseconds: preflightNanoseconds
        )
    }
}

extension Data {
    mutating func append(littleEndian value: UInt32) {
        var value = value.littleEndian
        Swift.withUnsafeBytes(of: &value) { append(contentsOf: $0) }
    }
}
