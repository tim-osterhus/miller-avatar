export const bridgeContract = {
  commandSchema: "miller-avatar.presentation-command/v1",
  observationSchema: "miller-avatar.presentation-observation/v1",
  maximumMessageBytes: 16_384,
  maximumContainerDepth: 8,
  maximumArrayLength: 64,
  maximumSafeInteger: Number.MAX_SAFE_INTEGER,
} as const;

export const presentationPhases = [
  "idle",
  "listening",
  "transcribing",
  "thinking",
  "responding",
  "speaking",
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

export type PresentationPhase = (typeof presentationPhases)[number];
export type PresentationVisibility = (typeof presentationVisibilities)[number];
export type ResetReason = (typeof resetReasons)[number];
export type DisposalReason = (typeof disposalReasons)[number];
export type FailureCode = (typeof failureCodes)[number];
export type FailureOperation = (typeof failureOperations)[number];

export type PresentationCommand =
  | { type: "configure"; payload: { profile: "lightweight"; reduced_motion: boolean } }
  | { type: "load_asset"; payload: { asset_token: string } }
  | {
      type: "project_phase";
      payload: {
        projection_sequence: number;
        generation_id: string | null;
        phase: PresentationPhase;
        playback_id: string | null;
      };
    }
  | { type: "set_visibility"; payload: { visibility: PresentationVisibility } }
  | { type: "set_policy"; payload: { reduced_motion: boolean } }
  | {
      type: "set_mouth";
      payload: {
        generation_id: string;
        playback_id: string;
        cue_index: number;
        playback_offset_ms: number;
        scalar: number;
      };
    }
  | { type: "reset"; payload: { generation_id: string | null; reason: ResetReason } }
  | { type: "dispose"; payload: { reason: DisposalReason } };

export type PresentationObservation =
  | { type: "wrapper_ready"; payload: { bridge_version: 1 } }
  | { type: "renderer_ready"; payload: { webgl: "webgl2" } }
  | {
      type: "asset_loaded";
      payload: {
        asset_token: string;
        capabilities: {
          aa: boolean;
          look_at: boolean;
          spring_bone: boolean;
          mtoon_materials: number;
        };
      };
    }
  | {
      type: "first_frame";
      payload: {
        asset_token: string;
        viewport_width: number;
        viewport_height: number;
        visible_meshes: number;
        decoded_textures: number;
        material_bindings: number;
        alpha_probe_pixels: number;
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
