export {};
function CartSummary({ items, total }: { items: Item[]; total: number }) {
  return (
    <div style={{ width: 200, marginLeft: 16, float: "left" }}>
      <p>You have {items.length} item{items.length !== 1 ? "s" : ""} in your cart.</p>
      <p>Total: ${total.toFixed(2)}</p>
      <p>Delivery: {new Date(order.deliverBy).toLocaleDateString()}</p>
      <button style={{ width: 80 }}>Checkout →</button>
    </div>
  );
}
