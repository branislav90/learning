import { useMemo } from 'react';

function ProductList({ products, sort }: { products: Product[]; sort: SortKey }) {
  const sorted = useMemo(
    () => products.toSorted(productSorts[sort].compare),
    [products, sort],
  );
  return <ul>{sorted.map((p) => <ProductRow key={p.id} product={p} />)}</ul>;
}

function SortMenu({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  return (
    <select value={value} onChange={(e) => {
      const next = e.target.value;
      if (isSortKey(next)) onChange(next);
    }}>
      {(Object.keys(productSorts) as SortKey[]).map((k) => (
        <option key={k} value={k}>{productSorts[k].label}</option>
      ))}
    </select>
  );
}
export {};
