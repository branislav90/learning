import { useReducer } from 'react';
type Cart={}; declare function placeOrder(c:Cart):Promise<{orderId:string}>;
function assertNever(x:never):never{throw new Error('x')}
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

function CheckoutButton({ cart }: { cart: Cart }) {
  const [state, dispatch] = useReducer(submitReducer, { status: "idle" });

  async function onClick() {
    dispatch({ type: "submitStarted" });
    try {
      const { orderId } = await placeOrder(cart);      // side effect lives in the handler
      dispatch({ type: "submitSucceeded", orderId });
    } catch (e) {
      dispatch({ type: "submitFailed", message: e instanceof Error ? e.message : "Unknown error" });
    }
  }

  return (
    <>
      <button onClick={onClick} disabled={state.status === "submitting"}>Place order</button>
      {state.status === "error" && <p role="alert">{state.message}</p>}
      {state.status === "success" && <p>Order {state.orderId} placed</p>}
    </>
  );
}

export {};
