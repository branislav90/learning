function Basket({ items }: { items: readonly Line[] }) {
  const priced = priceBasket(items);                 // derived during render: one pass, no extra renders
  return <p>{formatMoney(priced.total, "en-GB")}</p>;
}
export {};
