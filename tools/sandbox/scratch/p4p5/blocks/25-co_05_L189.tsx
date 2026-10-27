type ProductsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; products: Product[] };

export function useProducts(category: string): ProductsState {
  const [state, setState] = useState<ProductsState>({ status: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: "loading" });
    fetch(`/api/products?category=${encodeURIComponent(category)}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Product[]>;
      })
      .then((products) => setState({ status: "ready", products }))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Failed" });
      });
    return () => ctrl.abort();
  }, [category]);

  return state;
}
export {};
