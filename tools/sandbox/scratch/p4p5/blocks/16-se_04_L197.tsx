function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then(setOrders).catch(setError);
  }, []);
  if (error) return <p>Failed</p>;
  if (!orders) return <p>Loading…</p>;
  return <ul>{orders.map((o) => <li key={o.id}>{o.id}</li>)}</ul>;
}
export {};
