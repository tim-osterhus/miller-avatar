import Foundation
import ImageIO
import Testing
import UniformTypeIdentifiers
@testable import MillerAvatarCore

@Suite struct AssetAdmissionTests {
    @Test func admitsMinimalSyntheticVRMAndRetainsCapturedBytes() async throws {
        let bytes = try SyntheticGLBFactory.make()
        let result = await AssetAdmission().admit(bytes)
        guard case let .admitted(asset) = result else {
            Issue.record("minimal VRM was rejected")
            return
        }
        #expect(asset.bytes == bytes)
        #expect(asset.summary.nodeCount == 0)
        #expect(asset.summary.imageCount == 0)
    }

    @Test func admitsVRMWhenOptionalExtensionsRequiredArrayIsAbsent() async throws {
        var document = SyntheticGLBFactory.minimalDocument()
        document.removeValue(forKey: "extensionsRequired")
        let result = await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: document)
        )
        guard case .admitted = result else {
            Issue.record("VRM without optional extensionsRequired was rejected")
            return
        }
    }

    @Test func admitsBoundedSparseAccessorWithoutDenseBase() async throws {
        let fixture = sparsePositionDocument(indices: [0, 2])
        let result = await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: fixture.document,
                binary: fixture.binary
            )
        )

        guard case let .admitted(asset) = result else {
            Issue.record("valid sparse POSITION accessor was rejected")
            return
        }
        #expect(asset.summary.accessorReferencedBytes == 62)
    }

    @Test func rejectsMalformedSparseAccessorEnvelopes() async throws {
        for indices: [UInt8] in [[2, 0], [1, 1], [0, 3]] {
            let fixture = sparsePositionDocument(indices: indices)
            #expect(await AssetAdmission().admit(
                try SyntheticGLBFactory.make(
                    document: fixture.document,
                    binary: fixture.binary
                )
            ).isRejected)
        }

        var invalidType = sparsePositionDocument(indices: [0, 2])
        invalidType.document = replacingSparseIndices(
            in: invalidType.document,
            with: [
                "bufferView": 0,
                "componentType": 5122,
            ]
        )
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: invalidType.document,
                binary: invalidType.binary
            )
        ).isRejected)

        var excessiveCount = sparsePositionDocument(indices: [0, 2])
        excessiveCount.document = replacingSparseCount(
            in: excessiveCount.document,
            with: 4
        )
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: excessiveCount.document,
                binary: excessiveCount.binary
            )
        ).isRejected)

        var stridedValues = sparsePositionDocument(indices: [0, 2])
        var views = stridedValues.document["bufferViews"] as! [[String: Any]]
        views[1]["byteStride"] = 12
        stridedValues.document["bufferViews"] = views
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: stridedValues.document,
                binary: stridedValues.binary
            )
        ).isRejected)
    }

    @Test func rejectsNonfiniteSparseValuesAndEnforcesAggregateBudget() async throws {
        let nonfinite = sparsePositionDocument(
            indices: [0, 2],
            values: [
                .infinity, 0, 0,
                0, 1, 0,
            ]
        )
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: nonfinite.document,
                binary: nonfinite.binary
            )
        ).isRejected)

        let valid = sparsePositionDocument(indices: [0, 2])
        #expect(await AssetAdmission(
            budget: SyntheticGLBFactory.budget(accessorReferencedBytes: 62)
        ).admit(
            try SyntheticGLBFactory.make(
                document: valid.document,
                binary: valid.binary
            )
        ).isAdmitted)
        #expect(await AssetAdmission(
            budget: SyntheticGLBFactory.budget(accessorReferencedBytes: 61)
        ).admit(
            try SyntheticGLBFactory.make(
                document: valid.document,
                binary: valid.binary
            )
        ).isRejected)
    }

    @Test func declaresAssetCapabilitiesFromTheValidatedEnvelope() async throws {
        let document = SyntheticGLBFactory.minimalDocument(extra: [
            "extensionsUsed": [
                "VRMC_vrm",
                "VRMC_springBone",
                "VRMC_materials_mtoon",
            ],
            "extensions": [
                "VRMC_vrm": [
                    "specVersion": "1.0",
                    "lookAt": [:],
                ],
                "VRMC_springBone": [:],
            ],
            "materials": [[
                "extensions": ["VRMC_materials_mtoon": [:]],
            ]],
        ])

        let result = await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: document)
        )
        guard case let .admitted(asset) = result else {
            Issue.record("capability-bearing VRM was rejected")
            return
        }
        #expect(asset.summary.capabilities.lookAt)
        #expect(asset.summary.capabilities.springBone)
        #expect(asset.summary.capabilities.mtoonMaterials == 1)
    }

    @Test func rejectsNodeConstraintSourcesOutsideTheAdmittedNodeTable() async throws {
        let document = SyntheticGLBFactory.minimalDocument(extra: [
            "extensionsUsed": ["VRMC_vrm", "VRMC_node_constraint"],
            "nodes": [[
                "extensions": [
                    "VRMC_node_constraint": [
                        "constraint": ["rotation": ["source": 1, "weight": 1]],
                    ],
                ],
            ]],
        ])

        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: document)
        ).isRejected)
    }

    @Test func rejectsClosedEnvelopeViolations() async throws {
        let violations: [[String: Any]] = [
            ["extensionsUsed": ["VRMC_vrm", "UNKNOWN_extension"]],
            ["extensionsRequired": ["UNKNOWN_extension"]],
            ["extensions": ["VRM": [:], "VRMC_vrm": ["specVersion": "1.0"]]],
            ["buffers": [["byteLength": 4, "uri": "avatar.bin"]]],
            ["images": [["uri": "data:image/png;base64,AA=="]]],
            ["animations": []],
            [
                "nodes": [[
                    "matrix": [
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1,
                    ],
                    "translation": [0, 0, 0],
                ]],
            ],
        ]
        for extra in violations {
            let bytes = try SyntheticGLBFactory.make(
                document: SyntheticGLBFactory.minimalDocument(extra: extra)
            )
            #expect(await AssetAdmission().admit(bytes).isRejected)
        }

        let noBinaryDocument = SyntheticGLBFactory.minimalDocument(
            extra: ["buffers": [["byteLength": 0]]],
            binaryByteCount: 0
        )
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                json: JSONSerialization.data(withJSONObject: noBinaryDocument),
                binary: nil
            )
        ).isRejected)
    }

    @Test func rejectsUnknownNestedExtensionObject() async throws {
        let document = SyntheticGLBFactory.minimalDocument(extra: [
            "nodes": [["extensions": ["UNKNOWN_nested": [:]]]],
        ])
        #expect(await AssetAdmission().admit(try SyntheticGLBFactory.make(document: document)).isRejected)
    }

    @Test func rejectsNonfiniteAndExcessiveNodeNumbers() async throws {
        let document = SyntheticGLBFactory.minimalDocument(extra: [
            "nodes": [["translation": [10_001.0, 0, 0]]],
        ])
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: document)
        ).isRejected)

        let nonfinite = Data(
            #"{"asset":{"version":"2.0"},"buffers":[{"byteLength":4}],"extensionsUsed":["VRMC_vrm"],"extensionsRequired":["VRMC_vrm"],"extensions":{"VRMC_vrm":{"specVersion":"1.0"}},"nodes":[{"translation":[NaN,0,0]}]}"#
                .utf8
        )
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(json: nonfinite)
        ).isRejected)
    }

    @Test func validatesImageMIMEAndMetadataAggregates() async throws {
        let png = SyntheticGLBFactory.png1x1
        let paddedCount = (png.count + 3) & ~3
        var binary = png
        binary.append(Data(repeating: 0, count: paddedCount - png.count))
        let document = SyntheticGLBFactory.minimalDocument(
            extra: [
                "buffers": [["byteLength": paddedCount]],
                "bufferViews": [["buffer": 0, "byteOffset": 0, "byteLength": png.count]],
                "images": [["bufferView": 0, "mimeType": "image/png"]],
            ],
            binaryByteCount: paddedCount
        )
        let result = await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: document, binary: binary)
        )
        guard case let .admitted(asset) = result else {
            Issue.record("valid PNG was rejected")
            return
        }
        #expect(asset.summary.imageCount == 1)
        #expect(asset.summary.decodedImagePixels == 1)

        var forged = document
        forged["images"] = [["bufferView": 0, "mimeType": "image/jpeg"]]
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: forged, binary: binary)
        ).isRejected)
    }

    @Test func rejectsHeaderCompletePNGWithoutItsTerminalChunk() async throws {
        let truncated = SyntheticGLBFactory.png1x1.dropLast(12)
        let fixture = imageDocument(Data(truncated), mime: "image/png")

        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: fixture.document, binary: fixture.binary)
        ) == .rejected(.assetRejected))
    }

    @Test func rejectsHeaderCompleteJPEGWithoutItsEndMarker() async throws {
        let jpeg = try jpeg1x1()
        #expect(jpeg.suffix(2) == Data([0xFF, 0xD9]))
        let fixture = imageDocument(Data(jpeg.dropLast(2)), mime: "image/jpeg")

        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: fixture.document, binary: fixture.binary)
        ) == .rejected(.assetRejected))
    }

    @Test func admitsACompleteJPEGFrame() async throws {
        let fixture = imageDocument(try jpeg1x1(), mime: "image/jpeg")

        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: fixture.document, binary: fixture.binary)
        ).isAdmitted)
    }

    @Test func cancellationInterruptsLargeNodeTraversalBeforeLateInvalidData() async throws {
        let probe = CancellationProbe(cancelOnCheck: 40)
        let nodes: [Any] = (0..<300).map { index in
            if index == 299 { return "invalid-node" as Any }
            return [String: Any]() as Any
        }
        let document = SyntheticGLBFactory.minimalDocument(extra: ["nodes": nodes])
        let admission = AssetAdmission(isCancelled: { probe.isCancelled() })

        #expect(await admission.admit(
            try SyntheticGLBFactory.make(document: document)
        ) == .rejected(.resourceLimit))
    }

    @Test func deadlineInterruptsLargeTextureSamplerTraversal() async throws {
        let clock = ExpiringCheckpointClock(expireOnCheck: 40)
        var textures: [[String: Any]] = Array(
            repeating: ["source": 0, "sampler": 0],
            count: 64
        )
        textures[63] = ["source": 0]
        let document = SyntheticGLBFactory.minimalDocument(extra: [
            "images": [[String: Any]()],
            "samplers": Array(repeating: [String: Any](), count: 64),
            "textures": textures,
        ])
        let admission = AssetAdmission(
            timeoutNanoseconds: 1,
            monotonicNow: { clock.now() }
        )

        #expect(await admission.admit(
            try SyntheticGLBFactory.make(document: document)
        ) == .rejected(.resourceLimit))
    }

    @Test func cancellationInterruptsLargeImageTraversalBeforeLateInvalidData() async throws {
        let probe = CancellationProbe(cancelOnCheck: 40)
        let png = SyntheticGLBFactory.png1x1
        var images = Array(
            repeating: ["bufferView": 0, "mimeType": "image/png"],
            count: 64
        )
        images[63] = ["bufferView": 0, "mimeType": "image/gif"]
        let fixture = repeatedImageDocument(imageBytes: png, images: images)
        let admission = AssetAdmission(isCancelled: { probe.isCancelled() })

        #expect(await admission.admit(
            try SyntheticGLBFactory.make(document: fixture.document, binary: fixture.binary)
        ) == .rejected(.resourceLimit))
    }

    @Test func timeoutAndCancellationRejectBeforeTokenCreation() async throws {
        let bytes = try SyntheticGLBFactory.make()
        let timedOut = AssetAdmission(
            timeoutNanoseconds: 0,
            monotonicNow: { 1 }
        )
        #expect(await timedOut.admit(bytes) == .rejected(.resourceLimit))

        let task = Task {
            await AssetAdmission().admit(bytes)
        }
        task.cancel()
        #expect(await task.value == .rejected(.resourceLimit))
    }

    @Test func deadlineExpiringAfterParsingRejectsBeforeTokenCreation() async throws {
        let clock = CheckpointClock(samples: [0, 0, 1])
        let admission = AssetAdmission(
            timeoutNanoseconds: 1,
            monotonicNow: { clock.now() }
        )

        #expect(await admission.admit(
            try SyntheticGLBFactory.make()
        ) == .rejected(.resourceLimit))
        #expect(clock.callCount == 3)
    }

    @Test func cancellationAtALaterSemanticCheckpointRejectsBeforeTokenCreation() async throws {
        let clock = CheckpointClock()
        let admission = AssetAdmission(
            timeoutNanoseconds: 10,
            monotonicNow: { clock.now() },
            isCancelled: { clock.callCount >= 5 }
        )

        #expect(await admission.admit(
            try SyntheticGLBFactory.make()
        ) == .rejected(.resourceLimit))
        #expect(clock.callCount == 5)
    }

    @Test func rejectedAdmissionsDoNotRetainCapturedBytesAfterReturning() async throws {
        let timeoutProbe = CapturedBytesLifetimeProbe()
        var timeoutBytes: Data? = trackedData(
            try SyntheticGLBFactory.make(),
            probe: timeoutProbe
        )
        let timeoutClock = CheckpointClock(samples: [0, 0, 1])
        let timedOut = AssetAdmission(
            timeoutNanoseconds: 1,
            monotonicNow: { timeoutClock.now() }
        )

        let timeoutResult = await timedOut.admit(timeoutBytes!)
        timeoutBytes = nil
        #expect(timeoutResult == .rejected(.resourceLimit))
        #expect(timeoutProbe.releaseCount == 1)

        let cancellationProbe = CapturedBytesLifetimeProbe()
        var cancellationBytes: Data? = trackedData(
            try SyntheticGLBFactory.make(),
            probe: cancellationProbe
        )
        let clock = CheckpointClock()
        let cancelled = AssetAdmission(
            timeoutNanoseconds: 10,
            monotonicNow: { clock.now() },
            isCancelled: { clock.callCount >= 5 }
        )
        let cancellationResult = await cancelled.admit(cancellationBytes!)
        cancellationBytes = nil
        #expect(cancellationResult == .rejected(.resourceLimit))
        #expect(cancellationProbe.releaseCount == 1)
    }

    @Test func enforcesConstraintAndColliderNumericEnvelopes() async throws {
        let constraints: [[String: Any]] = [
            [
                "nodes": [[
                    "extensions": [
                        "VRMC_node_constraint": [
                            "constraint": [
                                "rotation": ["source": 0, "weight": 1.000_001],
                            ],
                        ],
                    ],
                ]],
            ],
            [
                "extensions": [
                    "VRMC_vrm": ["specVersion": "1.0"],
                    "VRMC_springBone": [
                        "colliders": [[
                            "node": 0,
                            "shape": [
                                "sphere": [
                                    "offset": [10_001, 0, 0],
                                    "radius": 1,
                                ],
                            ],
                        ]],
                    ],
                ],
                "extensionsUsed": ["VRMC_vrm", "VRMC_springBone"],
                "nodes": [[:]],
            ],
        ]
        for extra in constraints {
            let document = SyntheticGLBFactory.minimalDocument(extra: extra)
            #expect(await AssetAdmission().admit(
                try SyntheticGLBFactory.make(document: document)
            ).isRejected)
        }
    }

    @Test func rejectsNormalizedSkinWeightsOutsideSumTolerance() async throws {
        var binary = Data()
        for value: Float in [
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
        ] {
            binary.append(littleEndian: value.bitPattern)
        }
        binary.append(contentsOf: [
            128, 0, 0, 0,
            128, 0, 0, 0,
            128, 0, 0, 0,
        ])
        binary.append(Data(repeating: 0, count: 12))

        let document = SyntheticGLBFactory.minimalDocument(
            extra: [
                "buffers": [["byteLength": binary.count]],
                "bufferViews": [
                    ["buffer": 0, "byteOffset": 0, "byteLength": 36],
                    ["buffer": 0, "byteOffset": 36, "byteLength": 12],
                    ["buffer": 0, "byteOffset": 48, "byteLength": 12],
                ],
                "accessors": [
                    [
                        "bufferView": 0, "componentType": 5126,
                        "count": 3, "type": "VEC3",
                    ],
                    [
                        "bufferView": 1, "componentType": 5121,
                        "normalized": true, "count": 3, "type": "VEC4",
                    ],
                    [
                        "bufferView": 2, "componentType": 5121,
                        "count": 3, "type": "VEC4",
                    ],
                ],
                "meshes": [[
                    "primitives": [[
                        "attributes": [
                            "POSITION": 0,
                            "WEIGHTS_0": 1,
                            "JOINTS_0": 2,
                        ],
                    ]],
                ]],
            ],
            binaryByteCount: binary.count
        )
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: document, binary: binary)
        ).isRejected)
    }

    @Test func validatesJointIndicesAgainstEachNodeReferencedSkin() async throws {
        let valid = skinnedDocument(jointIndex: 0)
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: valid.document, binary: valid.binary)
        ).isAdmitted)

        let boundaryPlusOne = skinnedDocument(jointIndex: 1)
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: boundaryPlusOne.document,
                binary: boundaryPlusOne.binary
            )
        ).isRejected)
    }

    @Test func rejectsSkinWithoutAMeshRelationship() async throws {
        let document = SyntheticGLBFactory.minimalDocument(extra: [
            "nodes": [["skin": 0], [:]],
            "skins": [["joints": [1]]],
        ])
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: document)
        ).isRejected)
    }

    @Test func resolvesMaterialTextureReferencesAndClosedTextureTargets() async throws {
        let valid = textureDocument(textureIndex: 0)
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: valid.document, binary: valid.binary)
        ).isAdmitted)

        let boundaryPlusOne = textureDocument(textureIndex: 1)
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: boundaryPlusOne.document,
                binary: boundaryPlusOne.binary
            )
        ).isRejected)

        let noTextures = SyntheticGLBFactory.minimalDocument(extra: [
            "materials": [["normalTexture": ["index": 99]]],
        ])
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: noTextures)
        ).isRejected)

        var missingSampler = valid.document
        missingSampler["textures"] = [["source": 0]]
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: missingSampler, binary: valid.binary)
        ).isRejected)
    }

    @Test func rejectsWrongTypeAtEveryAllowlistedExtensionLocation() async throws {
        let malformedDocuments: [[String: Any]] = [
            SyntheticGLBFactory.minimalDocument(extra: [
                "extensions": ["VRMC_vrm": "not an object"],
            ]),
            SyntheticGLBFactory.minimalDocument(extra: [
                "extensionsUsed": ["VRMC_vrm", "VRMC_materials_mtoon"],
                "materials": [[
                    "extensions": ["VRMC_materials_mtoon": "not an object"],
                ]],
            ]),
            SyntheticGLBFactory.minimalDocument(extra: [
                "extensionsUsed": ["VRMC_vrm", "VRMC_springBone"],
                "extensions": [
                    "VRMC_vrm": ["specVersion": "1.0"],
                    "VRMC_springBone": "not an object",
                ],
            ]),
            SyntheticGLBFactory.minimalDocument(extra: [
                "extensionsUsed": ["VRMC_vrm", "VRMC_node_constraint"],
                "nodes": [[
                    "extensions": ["VRMC_node_constraint": "not an object"],
                ]],
            ]),
            SyntheticGLBFactory.minimalDocument(extra: [
                "extensionsUsed": ["VRMC_vrm", "KHR_materials_unlit"],
                "materials": [[
                    "extensions": ["KHR_materials_unlit": "not an object"],
                ]],
            ]),
            SyntheticGLBFactory.minimalDocument(extra: [
                "extensionsUsed": ["VRMC_vrm", "KHR_texture_transform"],
                "materials": [[
                    "pbrMetallicRoughness": [
                        "baseColorTexture": [
                            "index": 0,
                            "extensions": [
                                "KHR_texture_transform": "not an object",
                            ],
                        ],
                    ],
                ]],
            ]),
            SyntheticGLBFactory.minimalDocument(extra: [
                "extensionsUsed": ["VRMC_vrm", "KHR_materials_emissive_strength"],
                "materials": [[
                    "extensions": [
                        "KHR_materials_emissive_strength": "not an object",
                    ],
                ]],
            ]),
        ]

        for document in malformedDocuments {
            #expect(await AssetAdmission().admit(
                try SyntheticGLBFactory.make(document: document)
            ).isRejected)
        }
    }

    @Test func rejectsWrongTypeTextureTransformAtTextureInfo() async throws {
        var fixture = textureDocument(textureIndex: 0)
        fixture.document["extensionsUsed"] = ["VRMC_vrm", "KHR_texture_transform"]
        fixture.document["materials"] = [[
            "pbrMetallicRoughness": [
                "baseColorTexture": [
                    "index": 0,
                    "extensions": ["KHR_texture_transform": "not an object"],
                ],
            ],
        ]]

        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: fixture.document,
                binary: fixture.binary
            )
        ).isRejected)
    }

    @Test func rejectsAllowlistedExtensionsOutsideTheirSupportedLocations() async throws {
        let misplacedRootExtension = SyntheticGLBFactory.minimalDocument(extra: [
            "extensionsUsed": ["VRMC_vrm", "KHR_materials_unlit"],
            "extensions": [
                "VRMC_vrm": ["specVersion": "1.0"],
                "KHR_materials_unlit": [:],
            ],
        ])
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: misplacedRootExtension)
        ).isRejected)

        let misplacedNodeExtension = SyntheticGLBFactory.minimalDocument(extra: [
            "extensionsUsed": ["VRMC_vrm", "KHR_texture_transform"],
            "nodes": [[
                "extensions": ["KHR_texture_transform": [:]],
            ]],
        ])
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(document: misplacedNodeExtension)
        ).isRejected)
    }

    @Test func enforcesMultiContributorAggregateBoundaries() async throws {
        let images = twoImageDocument()
        let imageBudget = SyntheticGLBFactory.budget(
            images: 2,
            decodedImagePixels: 2,
            decodedRGBA8Bytes: 8,
            mipmappedRGBA8Bytes: 12
        )
        #expect(await admits(images.document, binary: images.binary, budget: imageBudget))
        #expect(await rejects(
            images.document,
            binary: images.binary,
            budget: SyntheticGLBFactory.budget(
                images: 2,
                decodedImagePixels: 1,
                decodedRGBA8Bytes: 8,
                mipmappedRGBA8Bytes: 12
            )
        ))
        #expect(await rejects(
            images.document,
            binary: images.binary,
            budget: SyntheticGLBFactory.budget(
                images: 2,
                decodedImagePixels: 2,
                decodedRGBA8Bytes: 7,
                mipmappedRGBA8Bytes: 12
            )
        ))
        #expect(await rejects(
            images.document,
            binary: images.binary,
            budget: SyntheticGLBFactory.budget(
                images: 2,
                decodedImagePixels: 2,
                decodedRGBA8Bytes: 8,
                mipmappedRGBA8Bytes: 11
            )
        ))

        let accessors = twoAccessorDocument()
        #expect(await admits(
            accessors.document,
            binary: accessors.binary,
            budget: SyntheticGLBFactory.budget(accessorReferencedBytes: 72)
        ))
        #expect(await rejects(
            accessors.document,
            binary: accessors.binary,
            budget: SyntheticGLBFactory.budget(accessorReferencedBytes: 71)
        ))

        let geometry = twoTriangleDocument()
        let geometryBudget = SyntheticGLBFactory.budget(
            meshes: 1,
            meshPrimitives: 2,
            vertices: 6,
            indices: 6,
            triangles: 2
        )
        #expect(await admits(
            geometry.document,
            binary: geometry.binary,
            budget: geometryBudget
        ))
        #expect(await rejects(
            geometry.document,
            binary: geometry.binary,
            budget: SyntheticGLBFactory.budget(
                meshes: 1,
                meshPrimitives: 2,
                vertices: 5,
                indices: 6,
                triangles: 2
            )
        ))
        #expect(await rejects(
            geometry.document,
            binary: geometry.binary,
            budget: SyntheticGLBFactory.budget(
                meshes: 1,
                meshPrimitives: 2,
                vertices: 6,
                indices: 5,
                triangles: 2
            )
        ))
        #expect(await rejects(
            geometry.document,
            binary: geometry.binary,
            budget: SyntheticGLBFactory.budget(
                meshes: 1,
                meshPrimitives: 2,
                vertices: 6,
                indices: 6,
                triangles: 1
            )
        ))

        let morphs = twoMorphDocument()
        #expect(await admits(
            morphs.document,
            binary: morphs.binary,
            budget: SyntheticGLBFactory.budget(
                meshes: 1,
                meshPrimitives: 2,
                vertices: 6,
                triangles: 2,
                morphTargetsPerPrimitive: 1,
                morphScalarValues: 18
            )
        ))
        #expect(await rejects(
            morphs.document,
            binary: morphs.binary,
            budget: SyntheticGLBFactory.budget(
                meshes: 1,
                meshPrimitives: 2,
                vertices: 6,
                triangles: 2,
                morphTargetsPerPrimitive: 1,
                morphScalarValues: 17
            )
        ))

        let spring = multiSpringDocument(count: 2)
        #expect(await admits(
            spring,
            budget: SyntheticGLBFactory.budget(
                springJoints: 2,
                springColliders: 2,
                springColliderGroups: 2
            )
        ))
        #expect(await rejects(
            spring,
            budget: SyntheticGLBFactory.budget(
                springJoints: 1,
                springColliders: 2,
                springColliderGroups: 2
            )
        ))
        #expect(await rejects(
            spring,
            budget: SyntheticGLBFactory.budget(
                springJoints: 2,
                springColliders: 1,
                springColliderGroups: 2
            )
        ))
        #expect(await rejects(
            spring,
            budget: SyntheticGLBFactory.budget(
                springJoints: 2,
                springColliders: 2,
                springColliderGroups: 1
            )
        ))

        let constraints = multiConstraintDocument(count: 2)
        #expect(await admits(
            constraints,
            budget: SyntheticGLBFactory.budget(nodeConstraints: 2)
        ))
        #expect(await rejects(
            constraints,
            budget: SyntheticGLBFactory.budget(nodeConstraints: 1)
        ))
    }

    @Test func enforcesBinaryAndFiniteNumericBoundaries() async throws {
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: floatAccessorDocument(),
                binary: floatBinary([.infinity])
            )
        ).isRejected)

        let positionAtBoundary = positionDocument(component: 10_000)
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: positionAtBoundary.document,
                binary: positionAtBoundary.binary
            )
        ).isAdmitted)
        let positionBeyondBoundary = positionDocument(component: 10_001)
        #expect(await AssetAdmission().admit(
            try SyntheticGLBFactory.make(
                document: positionBeyondBoundary.document,
                binary: positionBeyondBoundary.binary
            )
        ).isRejected)

        for length in [0.99, 1.01] {
            #expect(await admits(rotationDocument(length: length), budget: .alpha))
        }
        for length in [0.989_999, 1.010_001] {
            #expect(await rejects(rotationDocument(length: length), budget: .alpha))
        }
        #expect(await admits(
            rotationComponentDocument(component: 1.000_1),
            budget: .alpha
        ))
        #expect(await rejects(
            rotationComponentDocument(component: 1.000_101),
            budget: .alpha
        ))

        #expect(await admits(springNumericDocument(
            scalar: 1_000,
            gravityComponent: 1.1
        ), budget: .alpha))
        #expect(await rejects(springNumericDocument(
            scalar: 1_001,
            gravityComponent: 1.1
        ), budget: .alpha))
        #expect(await rejects(springNumericDocument(
            scalar: 1_000,
            gravityComponent: 1.100_1
        ), budget: .alpha))
        #expect(await admits(springNumericDocument(
            scalar: 0,
            gravityComponent: -1.1
        ), budget: .alpha))
        #expect(await rejects(springNumericDocument(
            scalar: -0.000_1,
            gravityComponent: 0
        ), budget: .alpha))
        #expect(await rejects(springNumericDocument(
            scalar: 0,
            gravityComponent: -1.100_1
        ), budget: .alpha))

        #expect(await admits(colliderNumericDocument(
            offset: 10_000,
            radius: 1_000
        ), budget: .alpha))
        #expect(await rejects(colliderNumericDocument(
            offset: 10_001,
            radius: 1_000
        ), budget: .alpha))
        #expect(await rejects(colliderNumericDocument(
            offset: 10_000,
            radius: 1_001
        ), budget: .alpha))
        #expect(await admits(colliderNumericDocument(
            offset: -10_000,
            radius: 0
        ), budget: .alpha))
        #expect(await rejects(colliderNumericDocument(
            offset: -10_001,
            radius: 0
        ), budget: .alpha))
        #expect(await rejects(colliderNumericDocument(
            offset: -10_000,
            radius: -0.000_1
        ), budget: .alpha))

        #expect(await admits(constraintWeightDocument(weight: 1), budget: .alpha))
        #expect(await rejects(constraintWeightDocument(weight: 1.000_1), budget: .alpha))
        #expect(await admits(constraintWeightDocument(weight: 0), budget: .alpha))
        #expect(await rejects(constraintWeightDocument(weight: -0.000_1), budget: .alpha))
    }

    @Test func wiresEverySemanticBudgetThroughAdmission() async throws {
        let minimal = SyntheticGLBFactory.minimalDocument()
        #expect(await admits(minimal, budget: SyntheticGLBFactory.budget(bufferBytes: 4)))
        #expect(await rejects(minimal, budget: SyntheticGLBFactory.budget(bufferBytes: 3)))

        #expect(await admits(minimal, budget: SyntheticGLBFactory.budget(nodes: 0)))
        let oneNode = SyntheticGLBFactory.minimalDocument(extra: ["nodes": [[:]]])
        #expect(await rejects(oneNode, budget: SyntheticGLBFactory.budget(nodes: 0)))

        let triangle = triangleDocument()
        #expect(await admits(triangle.document, binary: triangle.binary, budget: SyntheticGLBFactory.budget(
            meshes: 1, meshPrimitives: 1, vertices: 3, triangles: 1
        )))
        #expect(await rejects(triangle.document, binary: triangle.binary, budget: SyntheticGLBFactory.budget(meshes: 0)))
        #expect(await rejects(triangle.document, binary: triangle.binary, budget: SyntheticGLBFactory.budget(meshPrimitives: 0)))
        #expect(await rejects(triangle.document, binary: triangle.binary, budget: SyntheticGLBFactory.budget(vertices: 2)))
        #expect(await rejects(triangle.document, binary: triangle.binary, budget: SyntheticGLBFactory.budget(triangles: 0)))

        let textured = textureDocument(textureIndex: 0)
        #expect(await admits(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(
            materials: 1,
            images: 1,
            textures: 1,
            samplers: 1,
            imageDimension: 1,
            decodedImagePixels: 1,
            decodedRGBA8Bytes: 4,
            mipmappedRGBA8Bytes: 6
        )))
        #expect(await rejects(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(materials: 0)))
        #expect(await rejects(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(images: 0)))
        #expect(await rejects(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(textures: 0)))
        #expect(await rejects(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(samplers: 0)))
        #expect(await rejects(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(imageDimension: 0)))
        #expect(await rejects(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(decodedImagePixels: 0)))
        #expect(await rejects(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(decodedRGBA8Bytes: 3)))
        #expect(await rejects(textured.document, binary: textured.binary, budget: SyntheticGLBFactory.budget(mipmappedRGBA8Bytes: 5)))

        let skinned = skinnedDocument(jointIndex: 0)
        #expect(await admits(skinned.document, binary: skinned.binary, budget: SyntheticGLBFactory.budget(
            accessorReferencedBytes: 60,
            skins: 2,
            jointsPerSkin: 3,
            vertexJointInfluences: 4
        )))
        #expect(await rejects(skinned.document, binary: skinned.binary, budget: SyntheticGLBFactory.budget(accessorReferencedBytes: 59)))
        #expect(await rejects(skinned.document, binary: skinned.binary, budget: SyntheticGLBFactory.budget(skins: 1)))
        #expect(await rejects(skinned.document, binary: skinned.binary, budget: SyntheticGLBFactory.budget(jointsPerSkin: 2)))
        #expect(await rejects(skinned.document, binary: skinned.binary, budget: SyntheticGLBFactory.budget(vertexJointInfluences: 3)))

        let indexed = triangleDocument(indexed: true)
        #expect(await admits(indexed.document, binary: indexed.binary, budget: SyntheticGLBFactory.budget(indices: 3)))
        #expect(await rejects(indexed.document, binary: indexed.binary, budget: SyntheticGLBFactory.budget(indices: 2)))

        let morph = triangleDocument(morphTarget: true)
        #expect(await admits(morph.document, binary: morph.binary, budget: SyntheticGLBFactory.budget(
            morphTargetsPerPrimitive: 1, morphScalarValues: 9
        )))
        #expect(await rejects(morph.document, binary: morph.binary, budget: SyntheticGLBFactory.budget(morphTargetsPerPrimitive: 0)))
        #expect(await rejects(morph.document, binary: morph.binary, budget: SyntheticGLBFactory.budget(morphScalarValues: 8)))

        let humanoid = SyntheticGLBFactory.minimalDocument(extra: [
            "nodes": [[:]],
            "extensions": [
                "VRMC_vrm": [
                    "specVersion": "1.0",
                    "humanoid": ["humanBones": ["hips": ["node": 0]]],
                ],
            ],
        ])
        #expect(await admits(humanoid, budget: SyntheticGLBFactory.budget(humanoidBoneEntries: 1)))
        #expect(await rejects(humanoid, budget: SyntheticGLBFactory.budget(humanoidBoneEntries: 0)))

        let expressions = SyntheticGLBFactory.minimalDocument(extra: [
            "extensions": [
                "VRMC_vrm": [
                    "specVersion": "1.0",
                    "expressions": ["preset": ["happy": [:]]],
                ],
            ],
        ])
        #expect(await admits(expressions, budget: SyntheticGLBFactory.budget(expressions: 1)))
        #expect(await rejects(expressions, budget: SyntheticGLBFactory.budget(expressions: 0)))

        let spring = springDocument()
        #expect(await admits(spring, budget: SyntheticGLBFactory.budget(
            springJoints: 1, springColliders: 1, springColliderGroups: 1
        )))
        #expect(await rejects(spring, budget: SyntheticGLBFactory.budget(springJoints: 0)))
        #expect(await rejects(spring, budget: SyntheticGLBFactory.budget(springColliders: 0)))
        #expect(await rejects(spring, budget: SyntheticGLBFactory.budget(springColliderGroups: 0)))

        let constrained = SyntheticGLBFactory.minimalDocument(extra: [
            "extensionsUsed": ["VRMC_vrm", "VRMC_node_constraint"],
            "nodes": [[
                "extensions": ["VRMC_node_constraint": ["constraint": [:]]],
            ]],
        ])
        #expect(await admits(constrained, budget: SyntheticGLBFactory.budget(nodeConstraints: 1)))
        #expect(await rejects(constrained, budget: SyntheticGLBFactory.budget(nodeConstraints: 0)))

        let bytes = try SyntheticGLBFactory.make()
        #expect(await AssetAdmission(
            budget: SyntheticGLBFactory.budget(preflightNanoseconds: 1),
            monotonicNow: { 0 }
        ).admit(bytes).isAdmitted)
        #expect(await AssetAdmission(
            budget: SyntheticGLBFactory.budget(preflightNanoseconds: 0),
            monotonicNow: { 0 }
        ).admit(bytes).isRejected)
    }
}

private extension AssetAdmissionResult {
    var isRejected: Bool {
        if case .rejected = self { return true }
        return false
    }

    var isAdmitted: Bool {
        if case .admitted = self { return true }
        return false
    }
}

private func skinnedDocument(jointIndex: UInt8) -> (
    document: [String: Any], binary: Data
) {
    var binary = Data()
    for value: Float in [
        0, 0, 0,
        1, 0, 0,
        0, 1, 0,
    ] {
        binary.append(littleEndian: value.bitPattern)
    }
    binary.append(contentsOf: Array(repeating: [jointIndex, 0, 0, 0], count: 3).flatMap { $0 })
    binary.append(contentsOf: Array(repeating: [255, 0, 0, 0], count: 3).flatMap { $0 })

    let document = SyntheticGLBFactory.minimalDocument(
        extra: [
            "buffers": [["byteLength": binary.count]],
            "bufferViews": [
                ["buffer": 0, "byteOffset": 0, "byteLength": 36],
                ["buffer": 0, "byteOffset": 36, "byteLength": 12],
                ["buffer": 0, "byteOffset": 48, "byteLength": 12],
            ],
            "accessors": [
                ["bufferView": 0, "componentType": 5126, "count": 3, "type": "VEC3"],
                ["bufferView": 1, "componentType": 5121, "count": 3, "type": "VEC4"],
                [
                    "bufferView": 2, "componentType": 5121,
                    "normalized": true, "count": 3, "type": "VEC4",
                ],
            ],
            "meshes": [[
                "primitives": [[
                    "attributes": ["POSITION": 0, "JOINTS_0": 1, "WEIGHTS_0": 2],
                ]],
            ]],
            "nodes": [
                ["mesh": 0, "skin": 0],
                [:],
                [:],
                [:],
            ],
            "skins": [
                ["joints": [1]],
                ["joints": [1, 2, 3]],
            ],
        ],
        binaryByteCount: binary.count
    )
    return (document, binary)
}

private func sparsePositionDocument(
    indices: [UInt8],
    values: [Float] = [
        0, 0, 0,
        0, 1, 0,
    ]
) -> (document: [String: Any], binary: Data) {
    var binary = Data(indices)
    while binary.count < 4 {
        binary.append(0)
    }
    for value in values {
        binary.append(littleEndian: value.bitPattern)
    }
    let valuesLength = values.count * MemoryLayout<Float>.size
    let document = SyntheticGLBFactory.minimalDocument(
        extra: [
            "buffers": [["byteLength": binary.count]],
            "bufferViews": [
                ["buffer": 0, "byteOffset": 0, "byteLength": indices.count],
                ["buffer": 0, "byteOffset": 4, "byteLength": valuesLength],
            ],
            "accessors": [[
                "componentType": 5126,
                "count": 3,
                "type": "VEC3",
                "sparse": [
                    "count": indices.count,
                    "indices": [
                        "bufferView": 0,
                        "componentType": 5121,
                    ],
                    "values": ["bufferView": 1],
                ],
            ]],
            "meshes": [[
                "primitives": [[
                    "attributes": ["POSITION": 0],
                ]],
            ]],
        ],
        binaryByteCount: binary.count
    )
    return (document, binary)
}

private func replacingSparseIndices(
    in document: [String: Any],
    with indices: [String: Any]
) -> [String: Any] {
    var document = document
    var accessors = document["accessors"] as! [[String: Any]]
    var sparse = accessors[0]["sparse"] as! [String: Any]
    sparse["indices"] = indices
    accessors[0]["sparse"] = sparse
    document["accessors"] = accessors
    return document
}

private func replacingSparseCount(
    in document: [String: Any],
    with count: Int
) -> [String: Any] {
    var document = document
    var accessors = document["accessors"] as! [[String: Any]]
    var sparse = accessors[0]["sparse"] as! [String: Any]
    sparse["count"] = count
    accessors[0]["sparse"] = sparse
    document["accessors"] = accessors
    return document
}

private func textureDocument(textureIndex: UInt64) -> (
    document: [String: Any], binary: Data
) {
    let png = SyntheticGLBFactory.png1x1
    let paddedCount = (png.count + 3) & ~3
    var binary = png
    binary.append(Data(repeating: 0, count: paddedCount - png.count))
    let document = SyntheticGLBFactory.minimalDocument(
        extra: [
            "buffers": [["byteLength": paddedCount]],
            "bufferViews": [["buffer": 0, "byteOffset": 0, "byteLength": png.count]],
            "images": [["bufferView": 0, "mimeType": "image/png"]],
            "samplers": [[:]],
            "textures": [["source": 0, "sampler": 0]],
            "materials": [[
                "pbrMetallicRoughness": [
                    "baseColorTexture": ["index": textureIndex],
                ],
            ]],
        ],
        binaryByteCount: paddedCount
    )
    return (document, binary)
}

private func imageDocument(
    _ imageBytes: Data,
    mime: String
) -> (document: [String: Any], binary: Data) {
    repeatedImageDocument(
        imageBytes: imageBytes,
        images: [["bufferView": 0, "mimeType": mime]]
    )
}

private func repeatedImageDocument(
    imageBytes: Data,
    images: [[String: Any]]
) -> (document: [String: Any], binary: Data) {
    let paddedCount = (imageBytes.count + 3) & ~3
    var binary = imageBytes
    binary.append(Data(repeating: 0, count: paddedCount - imageBytes.count))
    return (
        SyntheticGLBFactory.minimalDocument(
            extra: [
                "buffers": [["byteLength": paddedCount]],
                "bufferViews": [[
                    "buffer": 0,
                    "byteOffset": 0,
                    "byteLength": imageBytes.count,
                ]],
                "images": images,
            ],
            binaryByteCount: paddedCount
        ),
        binary
    )
}

private func jpeg1x1() throws -> Data {
    guard let source = CGImageSourceCreateWithData(
        SyntheticGLBFactory.png1x1 as CFData,
        nil
    ), let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw TestFixtureError.imageEncoding
    }
    let data = NSMutableData()
    guard let destination = CGImageDestinationCreateWithData(
        data,
        UTType.jpeg.identifier as CFString,
        1,
        nil
    ) else {
        throw TestFixtureError.imageEncoding
    }
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else {
        throw TestFixtureError.imageEncoding
    }
    return data as Data
}

private enum TestFixtureError: Error {
    case imageEncoding
}

private func triangleDocument(
    indexed: Bool = false,
    morphTarget: Bool = false
) -> (document: [String: Any], binary: Data) {
    var binary = Data()
    for value: Float in [
        0, 0, 0,
        1, 0, 0,
        0, 1, 0,
    ] {
        binary.append(littleEndian: value.bitPattern)
    }

    var bufferViews: [[String: Any]] = [
        ["buffer": 0, "byteOffset": 0, "byteLength": 36],
    ]
    var accessors: [[String: Any]] = [
        ["bufferView": 0, "componentType": 5126, "count": 3, "type": "VEC3"],
    ]
    var primitive: [String: Any] = ["attributes": ["POSITION": 0]]
    if indexed {
        binary.append(contentsOf: [0, 1, 2, 0])
        bufferViews.append(["buffer": 0, "byteOffset": 36, "byteLength": 3])
        accessors.append(["bufferView": 1, "componentType": 5121, "count": 3, "type": "SCALAR"])
        primitive["indices"] = 1
    }
    if morphTarget {
        for value: Float in [
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
        ] {
            binary.append(littleEndian: value.bitPattern)
        }
        bufferViews.append(["buffer": 0, "byteOffset": 36, "byteLength": 36])
        accessors.append(["bufferView": 1, "componentType": 5126, "count": 3, "type": "VEC3"])
        primitive["targets"] = [["POSITION": 1]]
    }

    let document = SyntheticGLBFactory.minimalDocument(
        extra: [
            "buffers": [["byteLength": binary.count]],
            "bufferViews": bufferViews,
            "accessors": accessors,
            "meshes": [["primitives": [primitive]]],
        ],
        binaryByteCount: binary.count
    )
    return (document, binary)
}

private func springDocument() -> [String: Any] {
    SyntheticGLBFactory.minimalDocument(extra: [
        "extensionsUsed": ["VRMC_vrm", "VRMC_springBone"],
        "extensions": [
            "VRMC_vrm": ["specVersion": "1.0"],
            "VRMC_springBone": [
                "colliders": [[
                    "node": 0,
                    "shape": ["sphere": ["offset": [0, 0, 0], "radius": 1]],
                ]],
                "colliderGroups": [["colliders": [0]]],
                "springs": [["colliderGroups": [0], "joints": [["node": 0]]]],
            ],
        ],
        "nodes": [[:]],
    ])
}

private func twoImageDocument() -> (document: [String: Any], binary: Data) {
    let png = SyntheticGLBFactory.png1x1
    let paddedCount = (png.count + 3) & ~3
    var binary = Data()
    var bufferViews: [[String: Any]] = []
    var images: [[String: Any]] = []
    for _ in 0..<2 {
        let offset = binary.count
        binary.append(png)
        binary.append(Data(repeating: 0, count: paddedCount - png.count))
        bufferViews.append([
            "buffer": 0,
            "byteOffset": offset,
            "byteLength": png.count,
        ])
        images.append(["bufferView": bufferViews.count - 1, "mimeType": "image/png"])
    }
    return (
        SyntheticGLBFactory.minimalDocument(
            extra: [
                "buffers": [["byteLength": binary.count]],
                "bufferViews": bufferViews,
                "images": images,
            ],
            binaryByteCount: binary.count
        ),
        binary
    )
}

private func twoAccessorDocument() -> (document: [String: Any], binary: Data) {
    let binary = Data(repeating: 0, count: 72)
    return (
        SyntheticGLBFactory.minimalDocument(
            extra: [
                "buffers": [["byteLength": binary.count]],
                "bufferViews": [
                    ["buffer": 0, "byteOffset": 0, "byteLength": 36],
                    ["buffer": 0, "byteOffset": 36, "byteLength": 36],
                ],
                "accessors": [
                    ["bufferView": 0, "componentType": 5126, "count": 3, "type": "VEC3"],
                    ["bufferView": 1, "componentType": 5126, "count": 3, "type": "VEC3"],
                ],
            ],
            binaryByteCount: binary.count
        ),
        binary
    )
}

private func twoTriangleDocument() -> (document: [String: Any], binary: Data) {
    let binary = Data(repeating: 0, count: 80)
    return (
        SyntheticGLBFactory.minimalDocument(
            extra: [
                "buffers": [["byteLength": binary.count]],
                "bufferViews": [
                    ["buffer": 0, "byteOffset": 0, "byteLength": 36],
                    ["buffer": 0, "byteOffset": 36, "byteLength": 3],
                    ["buffer": 0, "byteOffset": 40, "byteLength": 36],
                    ["buffer": 0, "byteOffset": 76, "byteLength": 3],
                ],
                "accessors": [
                    ["bufferView": 0, "componentType": 5126, "count": 3, "type": "VEC3"],
                    ["bufferView": 1, "componentType": 5121, "count": 3, "type": "SCALAR"],
                    ["bufferView": 2, "componentType": 5126, "count": 3, "type": "VEC3"],
                    ["bufferView": 3, "componentType": 5121, "count": 3, "type": "SCALAR"],
                ],
                "meshes": [[
                    "primitives": [
                        ["attributes": ["POSITION": 0], "indices": 1],
                        ["attributes": ["POSITION": 2], "indices": 3],
                    ],
                ]],
            ],
            binaryByteCount: binary.count
        ),
        binary
    )
}

private func twoMorphDocument() -> (document: [String: Any], binary: Data) {
    let binary = Data(repeating: 0, count: 144)
    return (
        SyntheticGLBFactory.minimalDocument(
            extra: [
                "buffers": [["byteLength": binary.count]],
                "bufferViews": [
                    ["buffer": 0, "byteOffset": 0, "byteLength": 36],
                    ["buffer": 0, "byteOffset": 36, "byteLength": 36],
                    ["buffer": 0, "byteOffset": 72, "byteLength": 36],
                    ["buffer": 0, "byteOffset": 108, "byteLength": 36],
                ],
                "accessors": [
                    ["bufferView": 0, "componentType": 5126, "count": 3, "type": "VEC3"],
                    ["bufferView": 1, "componentType": 5126, "count": 3, "type": "VEC3"],
                    ["bufferView": 2, "componentType": 5126, "count": 3, "type": "VEC3"],
                    ["bufferView": 3, "componentType": 5126, "count": 3, "type": "VEC3"],
                ],
                "meshes": [[
                    "primitives": [
                        ["attributes": ["POSITION": 0], "targets": [["POSITION": 1]]],
                        ["attributes": ["POSITION": 2], "targets": [["POSITION": 3]]],
                    ],
                ]],
            ],
            binaryByteCount: binary.count
        ),
        binary
    )
}

private func multiSpringDocument(count: Int) -> [String: Any] {
    let colliders: [[String: Any]] = (0..<count).map { _ in
        [
            "node": 0,
            "shape": ["sphere": ["offset": [0, 0, 0], "radius": 1]],
        ]
    }
    let groups: [[String: Any]] = (0..<count).map { ["colliders": [$0]] }
    let springs: [[String: Any]] = (0..<count).map {
        ["colliderGroups": [$0], "joints": [["node": 0]]]
    }
    return SyntheticGLBFactory.minimalDocument(extra: [
        "extensionsUsed": ["VRMC_vrm", "VRMC_springBone"],
        "extensions": [
            "VRMC_vrm": ["specVersion": "1.0"],
            "VRMC_springBone": [
                "colliders": colliders,
                "colliderGroups": groups,
                "springs": springs,
            ],
        ],
        "nodes": [[:]],
    ])
}

private func multiConstraintDocument(count: Int) -> [String: Any] {
    SyntheticGLBFactory.minimalDocument(extra: [
        "extensionsUsed": ["VRMC_vrm", "VRMC_node_constraint"],
        "nodes": (0..<count).map { _ in
            ["extensions": ["VRMC_node_constraint": ["constraint": [:]]]]
        },
    ])
}

private func floatAccessorDocument() -> [String: Any] {
    SyntheticGLBFactory.minimalDocument(extra: [
        "buffers": [["byteLength": 4]],
        "bufferViews": [["buffer": 0, "byteOffset": 0, "byteLength": 4]],
        "accessors": [[
            "bufferView": 0,
            "componentType": 5126,
            "count": 1,
            "type": "SCALAR",
        ]],
    ])
}

private func positionDocument(component: Float) -> (
    document: [String: Any], binary: Data
) {
    let binary = floatBinary([
        component, 0, 0,
        component, 0, 0,
        component, 0, 0,
    ])
    return (
        SyntheticGLBFactory.minimalDocument(
            extra: [
                "buffers": [["byteLength": binary.count]],
                "bufferViews": [["buffer": 0, "byteOffset": 0, "byteLength": binary.count]],
                "accessors": [[
                    "bufferView": 0,
                    "componentType": 5126,
                    "count": 3,
                    "type": "VEC3",
                ]],
                "meshes": [["primitives": [["attributes": ["POSITION": 0]]]]],
            ],
            binaryByteCount: binary.count
        ),
        binary
    )
}

private func rotationDocument(length: Double) -> [String: Any] {
    let component = length / 2
    return SyntheticGLBFactory.minimalDocument(extra: [
        "nodes": [["rotation": [component, component, component, component]]],
    ])
}

private func rotationComponentDocument(component: Double) -> [String: Any] {
    SyntheticGLBFactory.minimalDocument(extra: [
        "nodes": [["rotation": [component, 0, 0, 0]]],
    ])
}

private func springNumericDocument(
    scalar: Double,
    gravityComponent: Double
) -> [String: Any] {
    SyntheticGLBFactory.minimalDocument(extra: [
        "extensionsUsed": ["VRMC_vrm", "VRMC_springBone"],
        "extensions": [
            "VRMC_vrm": ["specVersion": "1.0"],
            "VRMC_springBone": [
                "springs": [[
                    "joints": [[
                        "node": 0,
                        "hitRadius": scalar,
                        "gravityDir": [gravityComponent, 0, 0],
                    ]],
                ]],
            ],
        ],
        "nodes": [[:]],
    ])
}

private func colliderNumericDocument(offset: Double, radius: Double) -> [String: Any] {
    SyntheticGLBFactory.minimalDocument(extra: [
        "extensionsUsed": ["VRMC_vrm", "VRMC_springBone"],
        "extensions": [
            "VRMC_vrm": ["specVersion": "1.0"],
            "VRMC_springBone": [
                "colliders": [[
                    "node": 0,
                    "shape": [
                        "sphere": [
                            "offset": [offset, 0, 0],
                            "radius": radius,
                        ],
                    ],
                ]],
            ],
        ],
        "nodes": [[:]],
    ])
}

private func constraintWeightDocument(weight: Double) -> [String: Any] {
    SyntheticGLBFactory.minimalDocument(extra: [
        "extensionsUsed": ["VRMC_vrm", "VRMC_node_constraint"],
        "nodes": [[
            "extensions": [
                "VRMC_node_constraint": [
                    "constraint": ["rotation": ["weight": weight]],
                ],
            ],
        ]],
    ])
}

private func floatBinary(_ values: [Float]) -> Data {
    var data = Data()
    for value in values {
        data.append(littleEndian: value.bitPattern)
    }
    return data
}

private func trackedData(_ source: Data, probe: CapturedBytesLifetimeProbe) -> Data {
    let storage = UnsafeMutableRawPointer.allocate(byteCount: source.count, alignment: 1)
    source.copyBytes(to: storage.assumingMemoryBound(to: UInt8.self), count: source.count)
    return Data(bytesNoCopy: storage, count: source.count, deallocator: .custom { pointer, _ in
        pointer.deallocate()
        probe.recordRelease()
    })
}

private func admits(
    _ document: [String: Any],
    binary: Data = Data(repeating: 0, count: 4),
    budget: AssetBudget
) async -> Bool {
    guard let bytes = try? SyntheticGLBFactory.make(document: document, binary: binary) else {
        return false
    }
    return await AssetAdmission(budget: budget).admit(bytes).isAdmitted
}

private func rejects(
    _ document: [String: Any],
    binary: Data = Data(repeating: 0, count: 4),
    budget: AssetBudget
) async -> Bool {
    guard let bytes = try? SyntheticGLBFactory.make(document: document, binary: binary) else {
        return false
    }
    return await AssetAdmission(budget: budget).admit(bytes).isRejected
}

private final class CheckpointClock: @unchecked Sendable {
    private(set) var callCount = 0
    private let samples: [UInt64]

    init(samples: [UInt64] = []) {
        self.samples = samples
    }

    func now() -> UInt64 {
        callCount += 1
        guard !samples.isEmpty else { return 0 }
        return samples[min(callCount - 1, samples.count - 1)]
    }
}

private final class CancellationProbe: @unchecked Sendable {
    private var checkCount = 0
    private let cancelOnCheck: Int

    init(cancelOnCheck: Int) {
        self.cancelOnCheck = cancelOnCheck
    }

    func isCancelled() -> Bool {
        checkCount += 1
        return checkCount >= cancelOnCheck
    }
}

private final class ExpiringCheckpointClock: @unchecked Sendable {
    private var checkCount = 0
    private let expireOnCheck: Int

    init(expireOnCheck: Int) {
        self.expireOnCheck = expireOnCheck
    }

    func now() -> UInt64 {
        checkCount += 1
        return checkCount >= expireOnCheck ? 1 : 0
    }
}

private final class CapturedBytesLifetimeProbe: @unchecked Sendable {
    private(set) var releaseCount = 0

    func recordRelease() {
        releaseCount += 1
    }
}
