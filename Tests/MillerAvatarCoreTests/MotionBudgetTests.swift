import Testing
@testable import MillerAvatarCore

@Suite struct MotionBudgetTests {
    @Test func lightweightExposesTheFrozenInclusiveCeilings() {
        let budget = MotionBudget.lightweight
        #expect(Set(budget.allCeilings.map(\.name)) == [
            "capturedBytes", "jsonBytes", "jsonValues", "jsonNesting", "nodes",
            "scenes", "bufferViews", "accessors", "samplers", "channels",
            "referencedBufferBytes", "keyframeScalarValues", "durationMilliseconds",
            "preflightNanoseconds",
        ])
        #expect(budget.capturedBytes == 8 * 1_024 * 1_024)
        #expect(budget.jsonBytes == 1 * 1_024 * 1_024)
        #expect(budget.jsonValues == 65_536)
        #expect(budget.jsonNesting == 32)
        #expect(budget.nodes == 512)
        #expect(budget.scenes == 8)
        #expect(budget.bufferViews == 2_048)
        #expect(budget.accessors == 2_048)
        #expect(budget.samplers == 512)
        #expect(budget.channels == 512)
        #expect(budget.referencedBufferBytes == 8 * 1_024 * 1_024)
        #expect(budget.keyframeScalarValues == 1_000_000)
        #expect(budget.durationMilliseconds == 300_000)
        #expect(budget.preflightNanoseconds == 5_000_000_000)

        for ceiling in budget.allCeilings {
            #expect(AssetBudget.allows(ceiling.limit, maximum: ceiling.limit))
            #expect(!AssetBudget.allows(ceiling.limit + 1, maximum: ceiling.limit))
        }
    }

    @Test func checkedArithmeticAndDeadlineOverflowFailClosed() throws {
        #expect(throws: AssetBudgetError.self) {
            try AssetBudget.add(UInt64.max, 1)
        }
        #expect(throws: AssetBudgetError.self) {
            try AssetBudget.multiply(UInt64.max, 2)
        }

        let admission = MotionAdmission(
            budget: .lightweight,
            monotonicNow: { UInt64.max },
            isCancelled: { false }
        )
        let result = admission.admitSynchronously(
            try SyntheticGLBFactory.makeMotion()
        )
        #expect(result == .rejected(.resourceLimit))
    }
    @Test func defaultAdmissionDeadlineUsesFiveSeconds() throws {
        let clock = MotionTestClock(values: [0, MotionBudget.lightweight.preflightNanoseconds])
        let result = MotionAdmission(
            monotonicNow: { clock.now() },
            isCancelled: { false }
        ).admitSynchronously(try SyntheticGLBFactory.makeMotion())
        #expect(result == .rejected(.resourceLimit))
    }
}

private final class MotionTestClock: @unchecked Sendable {
    private var values: [UInt64]
    private var index = 0

    init(values: [UInt64]) {
        self.values = values
    }

    func now() -> UInt64 {
        defer { index = min(index + 1, values.count - 1) }
        return values[index]
    }
}
