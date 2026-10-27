export {};
function OrderSummary({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`).then(r => r.json()).then(setOrder).catch(e => setError(String(e)));
  }, [orderId]);

  useEffect(() => {                        // derived state synchronized via an effect
    if (order) setTotal(order.items.reduce((s, i) => s + i.price * i.qty, 0) - discount);
  }, [order, discount]);

  // ... 900 more lines: promo validation, shipping, tax, rendering
}
