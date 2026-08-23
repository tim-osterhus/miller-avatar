export const bridgeContract = {
  commandSchema: "miller-avatar.presentation-command/v2",
  observationSchema: "miller-avatar.presentation-observation/v2",
  maximumMessageBytes: 16_384,
  maximumContainerDepth: 8,
  maximumArrayLength: 64,
  maximumSafeInteger: Number.MAX_SAFE_INTEGER,
} as const;

export const avatarMotionRoles = [
  "idle",
  "listening",
  "thinking",
  "speaking",
  "success",
  "failure",
] as const;

export const steadyMotionRoles = ["idle", "listening", "thinking", "speaking"] as const;
export const terminalMotionRoles = ["success", "failure"] as const;
export const motionBindingStatuses = ["ready", "missing", "rejected"] as const;
export const motionStatuses = [
  "ready",
  "missing",
  "rejected",
  "load_failed",
  "timed_out",
  "runtime_failed",
] as const;
export const motionActiveModes = ["loop", "one_shot", "rest"] as const;
export const motionFailureCodes = [
  "motion_rejected",
  "resource_limit",
  "bookmark_unavailable",
  "quarantined",
  "motion_load_failed",
  "motion_load_timeout",
  "motion_runtime_failed",
  "cancelled",
] as const;

export const presentationPhases = [
  "idle",
  "listening",
  "transcribing",
  "thinking",
  "responding",
  "speaking",
  "succeeded",
  "stopped",
  "failed",
] as const;

export const presentationVisibilities = ["visible", "occluded", "hidden"] as const;
export const resetReasons = ["stopped", "cancelled", "replaced", "operator"] as const;
export const disposalReasons = [
  "operator",
  "hidden_before_live",
  "failure",
  "retry",
  "termination",
] as const;
export const failureCodes = [
  "bridge_invalid",
  "renderer_unavailable",
  "webgl_unavailable",
  "wrapper_timeout",
  "asset_rejected",
  "asset_load_failed",
  "asset_load_timeout",
  "render_failed",
  "context_lost",
  "scheme_rejected",
  "policy_violation",
  "resource_limit",
  "disposed_during_operation",
] as const;
export const failureOperations = [
  "startup",
  "configure",
  "load",
  "render",
  "suspend",
  "resume",
  "dispose",
  "scheme",
  "policy",
] as const;

export type AvatarMotionRole = (typeof avatarMotionRoles)[number];
export type SteadyMotionRole = (typeof steadyMotionRoles)[number];
export type TerminalMotionRole = (typeof terminalMotionRoles)[number];
export type MotionBindingStatus = (typeof motionBindingStatuses)[number];
export type MotionStatus = (typeof motionStatuses)[number];
export type MotionActiveMode = (typeof motionActiveModes)[number];
export type MotionFailureCode = (typeof motionFailureCodes)[number];
export type PresentationPhase = (typeof presentationPhases)[number];
export type PresentationVisibility = (typeof presentationVisibilities)[number];
export type ResetReason = (typeof resetReasons)[number];
export type DisposalReason = (typeof disposalReasons)[number];
export type FailureCode = (typeof failureCodes)[number];
export type FailureOperation = (typeof failureOperations)[number];

export interface MotionBindingPayload {
  status: MotionBindingStatus;
  token: string | null;
}

export type MotionBindings = {
  [Role in AvatarMotionRole]: MotionBindingPayload;
};

export interface LoadProfilePayload {
  profile_revision: number;
  model_token: string;
  motion_bindings: MotionBindings;
}

export const mouthVowelKeys = ["aa", "ih", "ou", "ee", "oh"] as const;

export type MouthVowelWeights = {
  readonly [Vowel in typeof mouthVowelKeys[number]]: number;
};

export type MouthVowelCapabilities = {
  readonly [Vowel in typeof mouthVowelKeys[number]]: boolean;
};

export interface SetMouthPayload {
  generation_id: string;
  playback_id: string;
  cue_index: number;
  playback_offset_ms: number;
  scalar: number;
}

export interface EnrichedSetMouthPayload extends SetMouthPayload {
  vowels: MouthVowelWeights;
}

export interface LegacyModelCapabilities {
  aa: boolean;
  look_at: boolean;
  spring_bone: boolean;
  mtoon_materials: number;
}

export interface EnrichedModelCapabilities extends LegacyModelCapabilities {
  vowels: MouthVowelCapabilities;
}

export type PresentationCommand =
  | {
      type: "configure";
      payload: { profile: "lightweight"; reduced_motion: boolean; mouth_cues_enabled: boolean };
    }
  | { type: "load_profile"; payload: LoadProfilePayload }
  | {
      type: "project_phase";
      payload: {
        projection_sequence: number;
        generation_id: string | null;
        phase: PresentationPhase;
        playback_id: string | null;
      };
    }
  | {
      type: "reconcile_presentation";
      payload: {
        last_projection_sequence: number | null;
        generation_id: string | null;
        phase: PresentationPhase;
        playback_id: string | null;
        reduced_motion: boolean;
        mouth_cues_enabled: boolean;
      };
    }
  | { type: "set_visibility"; payload: { visibility: PresentationVisibility } }
  | { type: "set_policy"; payload: { reduced_motion: boolean; mouth_cues_enabled: boolean } }
  | { type: "set_mouth"; payload: SetMouthPayload | EnrichedSetMouthPayload }
  | { type: "reset"; payload: { generation_id: string | null; reason: ResetReason } }
  | { type: "dispose"; payload: { reason: DisposalReason } };

export type PresentationObservation =
  | { type: "wrapper_ready"; payload: { bridge_version: 2 } }
  | { type: "renderer_ready"; payload: { webgl: "webgl2" } }
  | {
      type: "profile_model_loaded";
      payload: {
        profile_revision: number;
        model_token: string;
        capabilities: LegacyModelCapabilities | EnrichedModelCapabilities;
      };
    }
  | {
      type: "first_frame";
      payload: {
        profile_revision: number;
        model_token: string;
        viewport_width: number;
        viewport_height: number;
        visible_meshes: number;
        decoded_textures: number;
        material_bindings: number;
        alpha_probe_pixels: number;
      };
    }
  | {
      type: "motion_status";
      payload: {
        profile_revision: number;
        model_token: string;
        motion_token: string | null;
        role: AvatarMotionRole;
        status: MotionStatus;
        motion_code: MotionFailureCode | null;
      };
    }
  | {
      type: "motion_active";
      payload: {
        profile_revision: number;
        model_token: string;
        motion_token: string | null;
        role: AvatarMotionRole | null;
        mode: MotionActiveMode;
      };
    }
  | {
      type: "suspended";
      payload: {
        visibility: "occluded" | "hidden";
        frames: number;
        updates: number;
        renders: number;
      };
    }
  | { type: "resumed"; payload: { frames: number; updates: number; renders: number } }
  | { type: "disposed"; payload: { reason: DisposalReason } }
  | { type: "failed"; payload: { code: FailureCode; operation: FailureOperation } };

export interface PresentationCommandEnvelope {
  session_id: string;
  sequence: number;
  command: PresentationCommand;
}

export interface PresentationObservationEnvelope {
  session_id: string;
  sequence: number;
  caused_by_sequence: number | null;
  observation: PresentationObservation;
}
