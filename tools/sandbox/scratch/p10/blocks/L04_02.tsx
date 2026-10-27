export {};
function CheckoutForm({ order, user }: Props) {
  console.log("rendering checkout", order, user);              // ❌ every render, PII, large objects
  const submit = async () => {
    try {
      await api.post("/orders", order);
    } catch (e) {
      console.error("failed " + JSON.stringify(order) + " " + user.email, e);   // ❌ PII; unstructured
      fetch("/log", { method: "POST", body: JSON.stringify({ e: String(e) }) }); // ❌ no batching/keepalive; unhandled promise
    }
  };
  // ...
}
