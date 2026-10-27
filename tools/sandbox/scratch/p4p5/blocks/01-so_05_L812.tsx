type OrderRow = { id: string; total: number; status: "open" | "closed"; customerName: string };

export function summarise(orders: readonly OrderRow[]) {
  const open = orders.filter((o) => o.status === "open");
  const value = open.reduce((a, o) => a + o.total, 0);
  const biggest = open.reduce<OrderRow | undefined>(
    (best, o) => (!best || o.total > best.total ? o : best),
    undefined,
  );
  return { openCount: open.length, value, biggestCustomer: biggest?.customerName };
}

function StatsView({ openCount, value, biggestCustomer }: ReturnType<typeof summarise>) {
  return (
    <div>
      <h2>{openCount} open orders</h2>
      <p>Value: {value}</p>
      {biggestCustomer && <p>Biggest: {biggestCustomer}</p>}
    </div>
  );
}

function Stats({ orders }: { orders: readonly OrderRow[] }) {
  return <StatsView {...summarise(orders)} />;
}
export {};
