// reducer: pure
case "checkoutCompleted":
  return { ...state, items: [], completedAtMs: action.completedAtMs };

// handler
async function onCheckout() {
  const total = totalOf(state);
  await placeOrder(state);
  dispatch({ type: "checkoutCompleted", completedAtMs: Date.now() });
  analytics.track("purchase", { total });
}

// navigation: effect or router call after success
useEffect(() => { if (state.completedAtMs !== null) router.push("/thanks"); }, [state.completedAtMs, router]);
export {};
