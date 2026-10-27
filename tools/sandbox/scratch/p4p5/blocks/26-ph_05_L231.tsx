function Checkout() {
  async function pay() {
    const res = await fetch("/api/pay", { method: "POST" });
    if (!res.ok) throw new Error("payment failed");
  }
  return (
    <ErrorBoundary fallback={({ reset }) => <button onClick={reset}>Try again</button>}>
      <PayButton onClick={pay} />
      <Summary />   {/* throws during render if cart is corrupted */}
    </ErrorBoundary>
  );
}
export {};
