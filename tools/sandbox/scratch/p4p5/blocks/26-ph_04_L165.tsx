function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(setOrders);
  }, []);
  return <ul>{orders.map(o => <li key={o.id}>{o.title}</li>)}</ul>;
}

<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Orders />
</ErrorBoundary>
export {};
