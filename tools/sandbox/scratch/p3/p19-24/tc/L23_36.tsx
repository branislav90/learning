export {};
function Products({ products, minPrice }: { products: Product[]; minPrice: number }) {
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [empty, setEmpty] = useState(false);
  useEffect(() => { setFiltered(products.filter((p) => p.price >= minPrice)); }, [products, minPrice]);
  useEffect(() => { setCount(filtered.length); }, [filtered]);
  useEffect(() => { setEmpty(filtered.length === 0); }, [filtered]);
  return empty ? <p>No products</p> : <p>{count} products</p>;
}
