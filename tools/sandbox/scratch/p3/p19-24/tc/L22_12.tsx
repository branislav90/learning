import { memo, useDeferredValue, useState } from 'react';

interface Product { id: string; name: string }

const ProductList = memo(function ProductList({
  products,
  query,
}: {
  products: readonly Product[];
  query: string;
}) {
  const q = query.trim().toLowerCase();
  const visible = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  return (
    <ul>
      {visible.map((p) => (
        <li key={p.id}><ExpensiveRow product={p} /></li>
      ))}
    </ul>
  );
});

export function ProductSearch({ products }: { products: readonly Product[] }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery; // derived: no extra state

  return (
    <>
      <label>
        Search
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div style={{ opacity: isStale ? 0.5 : 1 }} aria-busy={isStale}>
        <ProductList products={products} query={deferredQuery} />
      </div>
    </>
  );
}
