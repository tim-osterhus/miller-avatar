import Testing
@testable import MillerAvatarCore

@Suite struct AssetBudgetTests {
    @Test func everyCeilingIsInclusive() {
        #expect(Set(AssetBudget.alpha.allCeilings.map(\.name)) == [
            "capturedBytes", "jsonBytes", "jsonValues", "jsonNesting",
            "nodes", "meshes", "meshPrimitives", "materials", "images",
            "textures", "samplers", "imageDimension", "decodedImagePixels",
            "decodedRGBA8Bytes", "mipmappedRGBA8Bytes", "bufferBytes",
            "accessorReferencedBytes", "vertices", "indices", "triangles",
            "morphTargetsPerPrimitive", "morphScalarValues", "skins",
            "jointsPerSkin", "vertexJointInfluences", "humanoidBoneEntries",
            "expressions", "springJoints", "springColliders",
            "springColliderGroups", "nodeConstraints", "preflightNanoseconds",
        ])
        for ceiling in AssetBudget.alpha.allCeilings {
            #expect(AssetBudget.allows(ceiling.limit, maximum: ceiling.limit))
            #expect(!AssetBudget.allows(ceiling.limit + 1, maximum: ceiling.limit))
        }
    }

    @Test func checkedArithmeticFailsClosed() throws {
        #expect(throws: AssetBudgetError.self) {
            try AssetBudget.add(UInt64.max, 1)
        }
        #expect(throws: AssetBudgetError.self) {
            try AssetBudget.multiply(UInt64.max, 2)
        }
        #expect(try AssetBudget.mipmappedRGBA8Bytes(pixelCount: 1) == 6)
        #expect(try AssetBudget.mipmappedRGBA8Bytes(pixelCount: 3) == 16)
        #expect(throws: AssetBudgetError.self) {
            try AssetBudget.mipmappedRGBA8Bytes(pixelCount: UInt64.max)
        }
    }

    @Test func alphaTextureCeilingsRemainInternallyCoupled() throws {
        #expect(AssetBudget.alpha.decodedImagePixels == 27 * 1_024 * 1_024)
        #expect(
            AssetBudget.alpha.decodedRGBA8Bytes
                == AssetBudget.alpha.decodedImagePixels * 4
        )
        let mipmappedBytes = try AssetBudget.mipmappedRGBA8Bytes(
            pixelCount: AssetBudget.alpha.decodedImagePixels
        )
        #expect(AssetBudget.alpha.mipmappedRGBA8Bytes == mipmappedBytes)
    }

    @Test func qualityModesKeepLightweightAliasAndDeriveFiniteHighQualityCeilings() {
        #expect(AssetBudget.alpha == AssetBudget.lightweight)
        #expect(AssetBudget.budget(for: .lightweight) == AssetBudget.alpha)

        let highQuality = AssetBudget.budget(for: .highQuality)
        #expect(highQuality.qualityMode == .highQuality)
        let lightweight = AssetBudget.lightweight
        let twentyTimes: [(UInt64, UInt64)] = [
            (lightweight.jsonBytes, highQuality.jsonBytes),
            (lightweight.jsonValues, highQuality.jsonValues),
            (lightweight.nodes, highQuality.nodes),
            (lightweight.meshes, highQuality.meshes),
            (lightweight.meshPrimitives, highQuality.meshPrimitives),
            (lightweight.materials, highQuality.materials),
            (lightweight.images, highQuality.images),
            (lightweight.textures, highQuality.textures),
            (lightweight.samplers, highQuality.samplers),
            (lightweight.decodedImagePixels, highQuality.decodedImagePixels),
            (lightweight.decodedRGBA8Bytes, highQuality.decodedRGBA8Bytes),
            (lightweight.mipmappedRGBA8Bytes, highQuality.mipmappedRGBA8Bytes),
            (lightweight.vertices, highQuality.vertices),
            (lightweight.indices, highQuality.indices),
            (lightweight.triangles, highQuality.triangles),
            (lightweight.morphTargetsPerPrimitive, highQuality.morphTargetsPerPrimitive),
            (lightweight.morphScalarValues, highQuality.morphScalarValues),
            (lightweight.skins, highQuality.skins),
            (lightweight.jointsPerSkin, highQuality.jointsPerSkin),
            (lightweight.humanoidBoneEntries, highQuality.humanoidBoneEntries),
            (lightweight.expressions, highQuality.expressions),
            (lightweight.springJoints, highQuality.springJoints),
            (lightweight.springColliders, highQuality.springColliders),
            (lightweight.springColliderGroups, highQuality.springColliderGroups),
            (lightweight.nodeConstraints, highQuality.nodeConstraints),
        ]
        for (light, high) in twentyTimes {
            #expect(high == light * 20)
        }
        let twoPointFiveGiB: UInt64 = 2_684_354_560
        #expect(highQuality.capturedBytes == twoPointFiveGiB)
        #expect(highQuality.bufferBytes == twoPointFiveGiB)
        #expect(highQuality.accessorReferencedBytes == twoPointFiveGiB)
        #expect(highQuality.imageDimension == lightweight.imageDimension * 4)
        #expect(highQuality.jsonNesting == lightweight.jsonNesting)
        #expect(highQuality.vertexJointInfluences == lightweight.vertexJointInfluences)
        #expect(highQuality.preflightDeadlineNanoseconds == nil)
        #expect(
            highQuality.allCeilings.map(\.name)
                == lightweight.allCeilings.map(\.name)
                    .filter { $0 != "preflightNanoseconds" }
        )
        for ceiling in highQuality.allCeilings {
            #expect(ceiling.limit < UInt64.max)
        }
    }
}
