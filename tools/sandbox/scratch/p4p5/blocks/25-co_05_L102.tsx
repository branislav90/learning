type Product = { id: string; name: string; price: number; category: string };

export function ProductsPage({ category }: { category: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "price">("name");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=${category}`)
      .then((r) => r.json())
      .then((data: Product[]) => { setProducts(data); setLoading(false); })
      .catch((e) => { setError(String(e)); setLoading(false); });
  }, [category]);

  useEffect(() => {
    const q = query.toLowerCase();
    const filtered = products.filter((p) => p.name.toLowerCase().includes(q));
    filtered.sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : a.price - b.price));
    setVisible(filtered.slice((page - 1) * 20, page * 20));
  }, [products, query, sort, page]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p role="alert">{error}</p>;
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <select value={sort} onChange={(e) => setSort(e.target.value as "name" | "price")}>
        <option value="name">Name</option><option value="price">Price</option>
      </select>
      <ul>{visible.map((p) => <li key={p.id}>{p.name} — {p.price}</li>)}</ul>
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>Prev</button>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
export {};
