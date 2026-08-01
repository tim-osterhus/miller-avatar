import Foundation
import Testing
@testable import MillerAvatarCore

@Suite struct GLBParserTests {
    @Test func parsesMinimalGLB() throws {
        let parsed = try GLBParser.parse(SyntheticGLBFactory.make())
        #expect(parsed.binary.count == 4)
        #expect(parsed.json.count > 0)
    }

    @Test(arguments: [
        (0, UInt32(0)),
        (4, UInt32(1)),
        (8, UInt32(999)),
    ])
    func rejectsInvalidHeader(offset: Int, replacement: UInt32) throws {
        var bytes = try SyntheticGLBFactory.make()
        bytes.replaceSubrange(offset..<(offset + 4), with: replacement.littleEndianBytes)
        #expect(throws: GLBParserError.self) {
            try GLBParser.parse(bytes)
        }
    }

    @Test func rejectsTruncationAndTrailingBytes() throws {
        var truncated = try SyntheticGLBFactory.make()
        truncated.removeLast()
        #expect(throws: GLBParserError.self) { try GLBParser.parse(truncated) }

        var trailing = try SyntheticGLBFactory.make()
        trailing.append(0)
        #expect(throws: GLBParserError.self) { try GLBParser.parse(trailing) }
    }

    @Test func rejectsDuplicateJSONAndUnknownChunks() throws {
        let base = try SyntheticGLBFactory.make(binary: Data())
        let jsonLength = Int(base.uint32(at: 12))
        let json = base.subdata(in: 20..<(20 + jsonLength))

        for type: UInt32 in [0x4E4F_534A, 0x1234_5678] {
            var bytes = base
            bytes.append(littleEndian: UInt32(json.count))
            bytes.append(littleEndian: type)
            bytes.append(json)
            bytes.replaceSubrange(8..<12, with: UInt32(bytes.count).littleEndianBytes)
            #expect(throws: GLBParserError.self) { try GLBParser.parse(bytes) }
        }
    }

    @Test func rejectsMisalignedChunkLengthAndDuplicateJSONKeys() throws {
        var misaligned = try SyntheticGLBFactory.make()
        misaligned.replaceSubrange(12..<16, with: UInt32(3).littleEndianBytes)
        #expect(throws: GLBParserError.self) { try GLBParser.parse(misaligned) }

        let duplicate = Data(#"{"asset":{"version":"2.0"},"asset":{"version":"2.0"}}"#.utf8)
        let bytes = try SyntheticGLBFactory.make(json: duplicate, binary: nil)
        #expect(throws: GLBParserError.self) { try GLBParser.parse(bytes) }
    }

    @Test func wiresFramingAndJSONComplexityBudgets() throws {
        let bytes = try SyntheticGLBFactory.make()
        let parsed = try GLBParser.parse(bytes)
        let exactSizeBudget = SyntheticGLBFactory.budget(
            capturedBytes: UInt64(bytes.count),
            jsonBytes: UInt64(parsed.json.count)
        )
        #expect(try GLBParser.parse(bytes, budget: exactSizeBudget) == parsed)
        #expect(throws: GLBParserError.self) {
            try GLBParser.parse(
                bytes,
                budget: SyntheticGLBFactory.budget(
                    capturedBytes: UInt64(bytes.count - 1)
                )
            )
        }
        #expect(throws: GLBParserError.self) {
            try GLBParser.parse(
                bytes,
                budget: SyntheticGLBFactory.budget(
                    jsonBytes: UInt64(parsed.json.count - 1)
                )
            )
        }

        let scalar = try SyntheticGLBFactory.make(json: Data("null".utf8), binary: nil)
        #expect(try GLBParser.parse(
            scalar,
            budget: SyntheticGLBFactory.budget(jsonValues: 1, jsonNesting: 1)
        ).json == Data("null".utf8))
        #expect(throws: GLBParserError.self) {
            try GLBParser.parse(
                scalar,
                budget: SyntheticGLBFactory.budget(jsonValues: 0)
            )
        }

        let nested = try SyntheticGLBFactory.make(json: Data("[null]".utf8), binary: nil)
        #expect(throws: GLBParserError.self) {
            try GLBParser.parse(
                nested,
                budget: SyntheticGLBFactory.budget(jsonNesting: 1)
            )
        }
    }
}

private extension UInt32 {
    var littleEndianBytes: Data {
        var value = littleEndian
        return Swift.withUnsafeBytes(of: &value) { Data($0) }
    }
}

private extension Data {
    func uint32(at offset: Int) -> UInt32 {
        subdata(in: offset..<(offset + 4)).withUnsafeBytes {
            UInt32(littleEndian: $0.loadUnaligned(as: UInt32.self))
        }
    }
}
