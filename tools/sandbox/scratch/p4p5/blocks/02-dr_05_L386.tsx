function Cart({ items }: { items: readonly { price: number; qty: number }[] }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return <p>{total}</p>;
}
export {};
