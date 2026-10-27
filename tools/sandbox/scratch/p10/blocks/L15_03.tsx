export {};
function OrderSummary({ orderId }: { orderId: string }) {
  const { data: order, error } = useOrder(orderId);   // step 4 later; stub with the existing fetch effect meanwhile
  const [discount, setDiscount] = useState(0);
  const total = order ? calculateTotal(order, discount) : 0;   // derived during render
  // ...
}
