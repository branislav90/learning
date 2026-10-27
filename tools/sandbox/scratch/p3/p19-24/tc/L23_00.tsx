export {};
// 🔴
function Cart({ items }: { items: Item[] }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((s, i) => s + i.price * i.qty, 0));
  }, [items]);
  return <p>Total: {total}</p>;
}
