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
