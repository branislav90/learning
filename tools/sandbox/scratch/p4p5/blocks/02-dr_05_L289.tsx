// shop/ProductCard.tsx
export function ProductCard({ product, qty, onQtyChange, onAdd }: {
  product: { title: string; price: number; imageUrl: string; onSale: boolean };
  qty: number;
  onQtyChange(q: number): void;
  onAdd(): void;
}) {
  return (
    <CardFrame media={<><img src={product.imageUrl} alt="" />{product.onSale && <span className="card__ribbon">Sale</span>}</>}>
      <h3>{product.title}</h3>
      <p>${product.price.toFixed(2)}</p>
      <Stepper value={qty} onChange={onQtyChange} />
      <button onClick={onAdd}>Add to cart</button>
    </CardFrame>
  );
}
export {};
