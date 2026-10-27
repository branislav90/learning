// OrderPage.tsx — MIXED
import { useEffect, useState } from "react";

type ApiOrder = { id: string; line_items: { sku: string; unit_price: number; qty: number }[]; coupon?: string };

export function OrderPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then(setOrder)
      .catch(() => setError("Failed"));
  }, [orderId]);

  if (error) return <p>{error}</p>;
  if (!order) return <p>Loading…</p>;

  const subtotal = order.line_items.reduce((s, l) => s + l.unit_price * l.qty, 0);
  const discount = coupon === "SAVE10" ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.2;
  const total = subtotal - discount + tax;

  return (
    <div>
      {order.line_items.map((l) => (
        <div key={l.sku}>{l.sku} × {l.qty}: £{(l.unit_price * l.qty / 100).toFixed(2)}</div>
      ))}
      <input value={coupon} onChange={(e) => setCoupon(e.target.value)} />
      <p>Total: £{(total / 100).toFixed(2)}</p>
    </div>
  );
}
export {};
