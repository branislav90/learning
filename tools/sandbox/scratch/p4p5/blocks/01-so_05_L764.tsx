function Stats({ orders }: { orders: { id: string; total: number; status: "open" | "closed"; customer: { name: string; email: string } }[] }) {
  const open = orders.filter(o => o.status === "open");
  const sum = open.reduce((a, o) => a + o.total, 0);
  return <div><h2>{open.length} open orders</h2><p>Value: {sum}</p><p>Biggest: {open.sort((a,b)=>b.total-a.total)[0]?.customer.name}</p></div>;
}
export {};
