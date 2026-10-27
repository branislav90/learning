interface Order { id: string; total: number; placedAt: Date }

async function getOrderBad(id: string): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`);
  return (await res.json()) as Order;     // compiles; wire has total:"1999", placed_at:"…"
}
// Later: order.placedAt.getFullYear()  -> TypeError: not a function (a string has no such method)
export {};
