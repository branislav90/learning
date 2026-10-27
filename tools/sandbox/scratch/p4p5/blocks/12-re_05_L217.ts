// submit.ts
export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; orderId: string }
  | { status: "error"; message: string };

export type SubmitAction =
  | { type: "submitStarted" }
  | { type: "submitSucceeded"; orderId: string }
  | { type: "submitFailed"; message: string }
  | { type: "dismissed" };

export function submitReducer(state: SubmitState, action: SubmitAction): SubmitState {
  switch (action.type) {
    case "submitStarted":
      // Guard: ignore a second start while one is in flight, and don't restart after success.
      return state.status === "idle" || state.status === "error" ? { status: "submitting" } : state;
    case "submitSucceeded":
      return state.status === "submitting" ? { status: "success", orderId: action.orderId } : state;
    case "submitFailed":
      return state.status === "submitting" ? { status: "error", message: action.message } : state;
    case "dismissed":
      return state.status === "success" || state.status === "error" ? { status: "idle" } : state;
    default:
      return assertNever(action);
  }
}
export {};
