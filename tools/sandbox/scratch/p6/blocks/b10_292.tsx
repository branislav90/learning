function CartSummary() {
  const count = useCart(selectCount);          // number: stable
  const total = useCart(selectTotalCents);     // number: stable
  return <p>{count} items, {(total / 100).toFixed(2)}</p>;
}
export {};
