function ProductList<T extends { id: string }>({ products, renderProduct }: {
  products: readonly T[]; renderProduct: (p: T) => ReactNode;
}) {
  return <ul className="grid">{products.map((p) => <li key={p.id}>{renderProduct(p)}</li>)}</ul>;
}
export {};
