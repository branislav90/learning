function PayButton() {
  const [state, setState] = useState<{ status: "idle" | "paying" | "error"; message?: string }>({ status: "idle" });
  async function pay() {
    setState({ status: "paying" });
    try {
      const res = await fetch("/api/pay", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState({ status: "idle" });
    } catch (e) {
      setState({ status: "error", message: e instanceof Error ? e.message : "Payment failed" });
    }
  }
  return <>
    <button onClick={pay} disabled={state.status === "paying"}>Pay</button>
    {state.status === "error" && <p role="alert">{state.message}</p>}
  </>;
}

<>
  <PayButton />
  <ErrorBoundary
    resetKeys={[cartVersion]}
    fallback={({ reset }) => <CartProblem onReload={() => { clearCorruptedCart(); reset(); }} />}>
    <Summary />
  </ErrorBoundary>
</>
export {};
