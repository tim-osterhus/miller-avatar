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
}
