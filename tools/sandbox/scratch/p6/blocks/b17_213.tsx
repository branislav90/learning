// ❌ Three bugs
const socket = new WebSocket('wss://example.com/live'); // module-level, never closed, no reconnect

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    socket.addEventListener('message', (e) => {
      const o = JSON.parse(e.data) as Order;
      setOrders([...orders, o]);          // (1) stale closure: `orders` captured at effect creation
    });
  }, []);                                  // (2) no cleanup: listener added on every mount, never removed
  // (3) messages before mount are lost; socket never reconnects after drop
  return <ul>{orders.map(o => <li key={o.id}>{o.id}</li>)}</ul>;
}
export {};
