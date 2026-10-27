// features/orders/OrderList.tsx (WRONG)
import { useEffect, useState } from "react";

export function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders", { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
      .then((r) => r.json())
      .then((data) => { setOrders(data.results); setLoading(false); });
  }, []);

  if (loading) return <p>Loading…</p>;
  return (
    <ul>
      {orders.map((o) => (
        <li key={o.order_id}>
          {o.order_id}: {(o.total_amount * 1).toFixed(2)} {o.currency} — {new Date(o.created).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
}
export {};
