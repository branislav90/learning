function useRecentOrders(orders: OrderService) {            // parameter injection
  const [data, setData] = useState<Awaited<ReturnType<OrderService['listRecent']>> | null>(null);
  useEffect(() => {
    const c = new AbortController();
    orders.listRecent(c.signal).then(setData).catch(() => { /* handle: see Lesson 21 */ });
    return () => c.abort();
  }, [orders]);               // stable because `orders` is created once at the composition root
  return data;
}
export {};
