function OrderCard({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);              // infra/app state
  const [dialogOpen, setDialogOpen] = useState(false);                  // interaction
  const [error, setError] = useState<string | null>(null);             // app/UI

  useEffect(() => {
    fetch(`/api/orders/${orderId}`).then(r => r.json()).then(setOrder); // infra (+ no cancellation, no error handling)
  }, [orderId]);

  if (!order) return <p>Loading…</p>;

  const cancellable =                                                   // DOMAIN
    order.status === "placed" ||
    (order.status === "draft" && false);                                // dead branch, domain rule rot
  const total = order.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0); // DOMAIN (money as float!)
  const label = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(total / 100); // PRESENTATION

  async function confirmCancel() {                                      // APPLICATION
    const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" }); // infra
    if (!res.ok) { setError("Could not cancel"); return; }
    setOrder({ ...order!, status: "cancelled" });                      // domain transition done ad hoc
    setDialogOpen(false);                                               // interaction
  }

  return (/* … JSX … */ null);
}
export {};
