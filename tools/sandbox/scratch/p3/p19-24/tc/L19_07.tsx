export {};
function Shop() {
  const [items, setItems] = useState<CartItem[]>([]);
  return (
    <>
      <Header count={items.length} />
      <Products onAdd={(i) => setItems((xs) => [...xs, i])} />
    </>
  );
}
