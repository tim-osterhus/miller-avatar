import Foundation

public struct MotionBudget: Equatable, Sendable {
    public let capturedBytes: UInt64
    public let jsonBytes: UInt64
    public let jsonValues: UInt64
    public let jsonNesting: UInt64
    public let nodes: UInt64
    public let scenes: UInt64
    public let bufferViews: UInt64
    public let accessors: UInt64
    public let samplers: UInt64
    public let channels: UInt64
    public let referencedBufferBytes: UInt64
    public let keyframeScalarValues: UInt64
    public let durationMilliseconds: UInt64
    public let preflightNanoseconds: UInt64

    public static let lightweight = MotionBudget(
        capturedBytes: 8 * 1_024 * 1_024,
        jsonBytes: 1 * 1_024 * 1_024,
        jsonValues: 65_536,
        jsonNesting: 32,
        nodes: 512,
        scenes: 8,
        bufferViews: 2_048,
        accessors: 2_048,
        samplers: 512,
        channels: 512,
        referencedBufferBytes: 8 * 1_024 * 1_024,
        keyframeScalarValues: 1_000_000,
        durationMilliseconds: 300_000,
        preflightNanoseconds: 5_000_000_000
    )

    public var allCeilings: [AssetCeiling] {
        [
            .init(name: "capturedBytes", limit: capturedBytes),
            .init(name: "jsonBytes", limit: jsonBytes),
            .init(name: "jsonValues", limit: jsonValues),
            .init(name: "jsonNesting", limit: jsonNesting),
            .init(name: "nodes", limit: nodes),
            .init(name: "scenes", limit: scenes),
            .init(name: "bufferViews", limit: bufferViews),
            .init(name: "accessors", limit: accessors),
            .init(name: "samplers", limit: samplers),
            .init(name: "channels", limit: channels),
            .init(name: "referencedBufferBytes", limit: referencedBufferBytes),
            .init(name: "keyframeScalarValues", limit: keyframeScalarValues),
            .init(name: "durationMilliseconds", limit: durationMilliseconds),
            .init(name: "preflightNanoseconds", limit: preflightNanoseconds),
        ]
    }
}
