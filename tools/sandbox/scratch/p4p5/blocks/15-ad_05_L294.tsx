type SortKey = 'price-asc' | 'price-desc' | 'rating' | 'newest';

function ProductList({ products, sort }: { products: Product[]; sort: SortKey }) {
  const sorted = [...products];
  if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  else if (sort === 'newest') sorted.sort((a, b) => +b.createdAt - +a.createdAt);
  return <ul>{sorted.map((p) => <ProductRow key={p.id} product={p} />)}</ul>;
}
export {};
