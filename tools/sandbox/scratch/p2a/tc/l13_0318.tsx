import { memo, useMemo, useState, useTransition } from "react";

interface Product { id: string; name: string }

const ProductGrid = memo(function ProductGrid({
  products,
  query,
}: {
  products: readonly Product[];
  query: string;
}) {
  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => (q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products),
    [products, q],
  );
  return (
    <ul aria-live="polite">
      {visible.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
});

export function ProductSearch({ products }: { products: readonly Product[] }) {
  const [text, setText] = useState("");     // drives the input: must be urgent
  const [query, setQuery] = useState("");   // drives the expensive list: may lag
  const [isPending, startTransition] = useTransition();

  return (
    <section aria-busy={isPending}>
      <label>
        Search
        <input
          value={text}
          onChange={(e) => {
            const v = e.target.value;
            setText(v);
            startTransition(() => setQuery(v));
          }}
        />
      </label>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <ProductGrid products={products} query={query} />
      </div>
    </section>
  );
}
