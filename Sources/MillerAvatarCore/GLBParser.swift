import Foundation

package enum GLBParserError: Error, Equatable, Sendable {
    case fileTooLarge
    case invalidHeader
    case invalidLength
    case invalidChunk
    case invalidJSON
    case jsonTooComplex
}

package struct ParsedGLB: Equatable, Sendable {
    package let json: Data
    package let binary: Data
    package let hasBinaryChunk: Bool
}

package struct GLBParsingLimits: Equatable, Sendable {
    package let capturedBytes: UInt64
    package let jsonBytes: UInt64
    package let jsonValues: UInt64
    package let jsonNesting: UInt64
}

package enum GLBParser {
    private static let magic: UInt32 = 0x4654_6C67
    private static let jsonChunk: UInt32 = 0x4E4F_534A
    private static let binaryChunk: UInt32 = 0x004E_4942

    package static func parse(
        _ data: Data,
        budget: AssetBudget = .alpha,
        checkpoint: (() throws -> Void)? = nil
    ) throws -> ParsedGLB {
        try parse(
            data,
            limits: budget.glbParsingLimits,
            checkpoint: checkpoint
        )
    }

    package static func parse(
        _ data: Data,
        mode: AvatarAssetQualityMode,
        checkpoint: (() throws -> Void)? = nil
    ) throws -> ParsedGLB {
        try parse(data, budget: .budget(for: mode), checkpoint: checkpoint)
    }

    package static func parse(
        _ data: Data,
        qualityMode: AvatarAssetQualityMode,
        checkpoint: (() throws -> Void)? = nil
    ) throws -> ParsedGLB {
        try parse(data, mode: qualityMode, checkpoint: checkpoint)
    }

    package static func parse(
        _ data: Data,
        limits: GLBParsingLimits,
        checkpoint: (() throws -> Void)? = nil
    ) throws -> ParsedGLB {
        guard UInt64(data.count) <= limits.capturedBytes else {
            throw GLBParserError.fileTooLarge
        }
        guard data.count >= 20,
              readUInt32(data, at: 0) == magic,
              readUInt32(data, at: 4) == 2
        else {
            throw GLBParserError.invalidHeader
        }
        guard Self.isRepresentableGLBLength(data.count),
              readUInt32(data, at: 8) == UInt32(data.count)
        else {
            throw GLBParserError.invalidLength
        }

        var offset = 12
        let json = try readChunk(data, offset: &offset, expectedType: jsonChunk)
        guard UInt64(json.count) <= limits.jsonBytes else {
            throw GLBParserError.fileTooLarge
        }
        let binary: Data
        let hasBinaryChunk: Bool
        if offset == data.count {
            binary = Data()
            hasBinaryChunk = false
        } else {
            binary = try readChunk(data, offset: &offset, expectedType: binaryChunk)
            hasBinaryChunk = true
        }
        guard offset == data.count else {
            throw GLBParserError.invalidChunk
        }
        do {
            var validator = StrictJSONValidator(
                data: json,
                maximumDepth: limits.jsonNesting,
                maximumValues: limits.jsonValues,
                checkpoint: checkpoint
            )
            try validator.validate()
        } catch let error as GLBParserError {
            throw error
        } catch {
            throw error
        }
        return ParsedGLB(
            json: json,
            binary: binary,
            hasBinaryChunk: hasBinaryChunk
        )
    }

    package static func isRepresentableGLBLength(_ count: Int) -> Bool {
        count >= 0 && UInt64(count) <= UInt64(UInt32.max)
    }

    private static func readChunk(
        _ data: Data,
        offset: inout Int,
        expectedType: UInt32
    ) throws -> Data {
        guard offset <= data.count - 8 else {
            throw GLBParserError.invalidChunk
        }
        let length = Int(readUInt32(data, at: offset))
        let type = readUInt32(data, at: offset + 4)
        guard type == expectedType, length % 4 == 0 else {
            throw GLBParserError.invalidChunk
        }
        let start = offset + 8
        let (end, overflow) = start.addingReportingOverflow(length)
        guard !overflow, end <= data.count else {
            throw GLBParserError.invalidChunk
        }
        offset = end
        return data.subdata(in: start..<end)
    }

    private static func readUInt32(_ data: Data, at offset: Int) -> UInt32 {
        data.withUnsafeBytes {
            UInt32(littleEndian: $0.loadUnaligned(fromByteOffset: offset, as: UInt32.self))
        }
    }
}

private struct StrictJSONValidator {
    let bytes: [UInt8]
    let maximumDepth: UInt64
    let maximumValues: UInt64
    let checkpoint: (() throws -> Void)?
    var index = 0
    var valueCount: UInt64 = 0
    var checkpointCount = 0

    init(
        data: Data,
        maximumDepth: UInt64,
        maximumValues: UInt64,
        checkpoint: (() throws -> Void)?
    ) {
        bytes = Array(data)
        self.maximumDepth = maximumDepth
        self.maximumValues = maximumValues
        self.checkpoint = checkpoint
    }

    mutating func validate() throws {
        try parseValue(depth: 1)
        skipWhitespace()
        guard index == bytes.count else { throw GLBParserError.invalidJSON }
    }

    mutating private func parseValue(depth: Int) throws {
        try checkpointIfNeeded()
        guard UInt64(depth) <= maximumDepth else { throw GLBParserError.jsonTooComplex }
        valueCount = try AssetBudget.add(valueCount, 1)
        guard valueCount <= maximumValues else {
            throw GLBParserError.jsonTooComplex
        }
        skipWhitespace()
        guard index < bytes.count else { throw GLBParserError.invalidJSON }
        switch bytes[index] {
        case 0x7B: try parseObject(depth: depth)
        case 0x5B: try parseArray(depth: depth)
        case 0x22: _ = try parseString()
        case 0x74: try consume("true")
        case 0x66: try consume("false")
        case 0x6E: try consume("null")
        case 0x2D, 0x30...0x39: try parseNumber()
        default: throw GLBParserError.invalidJSON
        }
    }

    mutating private func parseObject(depth: Int) throws {
        index += 1
        skipWhitespace()
        var keys = Set<String>()
        if consumeIf(0x7D) { return }
        while true {
            try checkpointIfNeeded()
            skipWhitespace()
            let key = try parseString()
            guard keys.insert(key).inserted else { throw GLBParserError.invalidJSON }
            skipWhitespace()
            guard consumeIf(0x3A) else { throw GLBParserError.invalidJSON }
            try parseValue(depth: depth + 1)
            skipWhitespace()
            if consumeIf(0x7D) { return }
            guard consumeIf(0x2C) else { throw GLBParserError.invalidJSON }
        }
    }

    mutating private func parseArray(depth: Int) throws {
        index += 1
        skipWhitespace()
        if consumeIf(0x5D) { return }
        while true {
            try checkpointIfNeeded()
            try parseValue(depth: depth + 1)
            skipWhitespace()
            if consumeIf(0x5D) { return }
            guard consumeIf(0x2C) else { throw GLBParserError.invalidJSON }
        }
    }

    mutating private func parseString() throws -> String {
        guard consumeIf(0x22) else { throw GLBParserError.invalidJSON }
        let start = index - 1
        while index < bytes.count {
            try checkpointIfNeeded()
            let byte = bytes[index]
            index += 1
            if byte == 0x22 {
                let encoded = Data(bytes[start..<index])
                guard let decoded = try JSONSerialization.jsonObject(
                    with: encoded,
                    options: [.fragmentsAllowed]
                ) as? String else {
                    throw GLBParserError.invalidJSON
                }
                return decoded
            }
            if byte < 0x20 { throw GLBParserError.invalidJSON }
            if byte == 0x5C {
                guard index < bytes.count else { throw GLBParserError.invalidJSON }
                let escaped = bytes[index]
                index += 1
                if escaped == 0x75 {
                    guard index <= bytes.count - 4,
                          bytes[index..<(index + 4)].allSatisfy(Self.isHex)
                    else {
                        throw GLBParserError.invalidJSON
                    }
                    index += 4
                } else if ![0x22, 0x5C, 0x2F, 0x62, 0x66, 0x6E, 0x72, 0x74]
                    .contains(escaped)
                {
                    throw GLBParserError.invalidJSON
                }
            }
        }
        throw GLBParserError.invalidJSON
    }

    mutating private func parseNumber() throws {
        let start = index
        _ = consumeIf(0x2D)
        if consumeIf(0x30) {
            if index < bytes.count, (0x30...0x39).contains(bytes[index]) {
                throw GLBParserError.invalidJSON
            }
        } else {
            try consumeDigits()
        }
        if consumeIf(0x2E) { try consumeDigits() }
        if index < bytes.count, bytes[index] == 0x65 || bytes[index] == 0x45 {
            index += 1
            if index < bytes.count, bytes[index] == 0x2B || bytes[index] == 0x2D {
                index += 1
            }
            try consumeDigits()
        }
        guard let string = String(bytes: bytes[start..<index], encoding: .utf8),
              let number = Double(string),
              number.isFinite
        else {
            throw GLBParserError.invalidJSON
        }
    }

    mutating private func consumeDigits() throws {
        let start = index
        while index < bytes.count, (0x30...0x39).contains(bytes[index]) {
            try checkpointIfNeeded()
            index += 1
        }
        guard index > start else { throw GLBParserError.invalidJSON }
    }

    mutating private func consume(_ text: StaticString) throws {
        let target = Array("\(text)".utf8)
        guard index <= bytes.count - target.count,
              Array(bytes[index..<(index + target.count)]) == target
        else {
            throw GLBParserError.invalidJSON
        }
        index += target.count
    }

    mutating private func skipWhitespace() {
        while index < bytes.count, [0x20, 0x09, 0x0A, 0x0D].contains(bytes[index]) {
            index += 1
        }
    }

    mutating private func consumeIf(_ byte: UInt8) -> Bool {
        guard index < bytes.count, bytes[index] == byte else { return false }
        index += 1
        return true
    }

    mutating private func checkpointIfNeeded() throws {
        checkpointCount += 1
        if checkpointCount % 256 == 0 {
            try checkpoint?()
        }
    }

    private static func isHex(_ byte: UInt8) -> Bool {
        (0x30...0x39).contains(byte)
            || (0x41...0x46).contains(byte)
            || (0x61...0x66).contains(byte)
    }
}
