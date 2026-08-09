public enum MotionFailureCode: String, Codable, CaseIterable, Equatable, Sendable {
    case motionRejected = "motion_rejected"
    case resourceLimit = "resource_limit"
    case bookmarkUnavailable = "bookmark_unavailable"
    case quarantined = "quarantined"
    case motionLoadFailed = "motion_load_failed"
    case motionLoadTimeout = "motion_load_timeout"
    case motionRuntimeFailed = "motion_runtime_failed"
    case cancelled
}
