// Presentational view: a typed contract, every state is a prop value
type OrdersViewProps = {
  state: OrdersState;
  pendingId: string | null;
  onShip(id: string): void;
};

export function OrdersView({ state, pendingId, onShip }: OrdersViewProps) {
  if (state.status === "loading") return <p aria-busy="true">Loading orders…</p>;
  if (state.status === "error") return <p role="alert">Could not load orders: {state.message}</p>;
  if (state.orders.length === 0) return <p>No orders yet.</p>;
  return (
    <table>
      <thead><tr><th scope="col">Customer</th><th scope="col">Total</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
      <tbody>
        {state.orders.map((o) => (
          <tr key={o.id}>
            <td>{o.customer}</td>
            <td>{o.total.toFixed(2)}</td>
            <td>
              {o.shipped ? "Shipped" : (
                <button disabled={pendingId === o.id} onClick={() => onShip(o.id)}>
                  {pendingId === o.id ? "Shipping…" : "Mark shipped"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function OrdersPage() {
  const { state, pendingId, markShipped } = useOrdersPage();
  return <OrdersView state={state} pendingId={pendingId} onShip={markShipped} />;
}
export {};
