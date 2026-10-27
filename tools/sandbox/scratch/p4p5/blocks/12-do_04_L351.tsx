function Basket({ items }: { items: Item[] }) {
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {                                        // derived state via effect
    setTotal(items.reduce((s, i) => s + i.price * i.qty, 0));
  }, [items]);

  useEffect(() => {
    if (total > 100) setDiscount(total * 0.1);             // rule hidden in an effect
    else setDiscount(0);
  }, [total]);

  return <p>{(total - discount).toFixed(2)}</p>;
}
export {};
