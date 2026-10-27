// INCORRECT (as an architectural choice): every place order screen repeats this
function CartPage() {
  const { items, clear } = useCart();
  const { address } = useAddress();
  const taxes = useTaxes(items, address);
  const pay = usePayment();                 // vendor SDK hook
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function placeOrder() {
    setBusy(true); setError(null);
    try {
      if (!address) throw new Error('Address required');
      const total = items.reduce((s, i) => s + i.price * i.qty, 0) + taxes.amount;
      const charge = await pay.charge(total, address.country);
      const order = await createOrder({ items, chargeId: charge.id });
      clear();
      analytics.track('order_placed', { id: order.id, total });
      navigate(`/orders/${order.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }
  // ...render
}
export {};
