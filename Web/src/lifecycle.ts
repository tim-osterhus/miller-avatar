import type { DisposalReason, FailureCode } from "./contract.js";

export type RendererState =
  | "booting"
  | "ready"
  | "loading"
  | "live"
  | "suspended"
  | "disposing"
  | "disposed"
  | "failed";

export type LifecycleInput =
  | { type: "configured" }
  | { type: "load_started" }
  | { type: "first_frame" }
  | { type: "suspend" }
  | { type: "resume" }
  | { type: "fail"; code: FailureCode }
  | { type: "dispose"; reason: DisposalReason }
  | { type: "disposed" };

export interface LifecycleResult {
  state: RendererState;
  effect?: "begin_disposal" | "rejected";
}

export function reduceLifecycle(state: RendererState, input: LifecycleInput): LifecycleResult {
  if (input.type === "dispose" && (state === "disposing" || state === "disposed")) {
    return { state };
  }
  if (input.type === "dispose" && state !== "disposed") {
    return { state: "disposing", effect: "begin_disposal" };
  }
  if (input.type === "fail" && !["disposing", "disposed", "failed"].includes(state)) {
    return { state: "failed" };
  }
  if (state === "booting" && input.type === "configured") return { state: "ready" };
  if (state === "ready" && input.type === "load_started") return { state: "loading" };
  if (state === "loading" && input.type === "first_frame") return { state: "live" };
  if (state === "live" && input.type === "suspend") return { state: "suspended" };
  if (state === "suspended" && input.type === "resume") return { state: "live" };
  if (state === "disposing" && input.type === "disposed") return { state: "disposed" };
  return { state, effect: "rejected" };
}
