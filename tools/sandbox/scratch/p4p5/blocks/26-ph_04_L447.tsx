function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const handleError = useErrorHandler();
  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/orders", { signal: ac.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<Order[]>; })
      .then(setOrders)
      .catch(e => { if (!ac.signal.aborted) handleError(e); });
    return () => ac.abort();
  }, [handleError]);
  return <ul>{orders.map(o => <li key={o.id}>{o.title}</li>)}</ul>;
}
export {};
