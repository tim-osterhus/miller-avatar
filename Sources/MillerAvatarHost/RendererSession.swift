import Foundation

/// A serialized gate that preserves the caller's executor and permits
/// reentrancy from admitted callbacks. It is deliberately recursive: client
/// and WebKit callbacks may synchronously invalidate or release a session.
final class SerializedCallbackGate: @unchecked Sendable {
    private let lock = NSRecursiveLock()

    init(label: String = "miller-avatar.renderer-session") {}

    func sync<Value>(_ operation: () throws -> Value) rethrows -> Value {
        lock.lock()
        defer { lock.unlock() }
        return try operation()
    }
}

public struct RendererSessionLeaseIdentity: Equatable, Hashable, Sendable {
    public let id: UUID
    public let generation: UInt64

    public init(id: UUID, generation: UInt64) {
        self.id = id
        self.generation = generation
    }
}

public final class RendererSessionLease: @unchecked Sendable {
    public let id: UUID
    public let generation: UInt64

    public var identity: RendererSessionLeaseIdentity {
        RendererSessionLeaseIdentity(id: id, generation: generation)
    }

    private let gate: SerializedCallbackGate
    private var valid = true

    public init(id: UUID = UUID(), generation: UInt64 = 0) {
        self.id = id
        self.generation = generation
        gate = SerializedCallbackGate()
    }

    fileprivate init(
        id: UUID,
        generation: UInt64,
        gate: SerializedCallbackGate
    ) {
        self.id = id
        self.generation = generation
        self.gate = gate
    }

    public var isValid: Bool {
        gate.sync { valid }
    }

    public func invalidate() {
        gate.sync {
            valid = false
        }
    }

    @discardableResult
    public func performIfValid(_ operation: () -> Void) -> Bool {
        gate.sync {
            guard valid else { return false }
            operation()
            return true
        }
    }
}

public final class RendererSessionController: @unchecked Sendable {
    private let gate = SerializedCallbackGate()
    private var activeLease: RendererSessionLease?
    private var nextGeneration: UInt64 = 0

    public init() {}

    /// Runs work while holding the serialized session gate, including after
    /// the active lease has been invalidated. Scheme cancellation uses this
    /// to drain queued delivery state during teardown.
    @discardableResult
    func synchronize<Value>(_ operation: () -> Value) -> Value {
        gate.sync(operation)
    }

    @discardableResult
    public func begin(id: UUID = UUID()) -> RendererSessionLease {
        gate.sync {
            activeLease?.invalidate()
            precondition(nextGeneration < UInt64.max, "Renderer session generation exhausted")
            nextGeneration += 1
            let lease = RendererSessionLease(
                id: id,
                generation: nextGeneration,
                gate: gate
            )
            activeLease = lease
            return lease
        }
    }

    public func invalidateActive() {
        gate.sync {
            activeLease?.invalidate()
            activeLease = nil
        }
    }

    /// Atomically releases only the active matching lease. This prevents an
    /// older teardown from invalidating a replacement session with the same ID.
    public func release(_ lease: RendererSessionLease) {
        gate.sync {
            guard activeLease?.identity == lease.identity else { return }
            lease.invalidate()
            activeLease = nil
        }
    }

    public func isCurrent(_ lease: RendererSessionLease) -> Bool {
        gate.sync {
            activeLease?.identity == lease.identity && lease.isValid
        }
    }

    public func isCurrent(_ identity: RendererSessionLeaseIdentity) -> Bool {
        gate.sync {
            activeLease?.identity == identity && activeLease?.isValid == true
        }
    }

    @discardableResult
    public func perform(
        for lease: RendererSessionLease,
        _ operation: () -> Void
    ) -> Bool {
        gate.sync {
            guard activeLease?.identity == lease.identity,
                  lease.isValid
            else {
                return false
            }
            operation()
            return true
        }
    }
}
