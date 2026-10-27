function Cart({ items }: { items: { price: number; qty: number }[] }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((s, i) => s + i.price * i.qty, 0));
  }, [items]);
  return <p>{total}</p>;
}
export {};
