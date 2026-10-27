function ProductsView(props: {
  view: View;
  products: Product[];
  onQuery: (q: string) => void;
  onSort: (s: Sort) => void;
  onPage: (d: 1 | -1) => void;
}) { /* inputs + list + pager; no fetching */ }

export function ProductsPage({ category }: { category: string }) {
  const data = useProducts(category);
  const [view, dispatch] = useReducer(viewReducer, { query: "", sort: "name", page: 1 });

  if (data.status === "loading") return <p>Loading…</p>;
  if (data.status === "error") return <p role="alert">{data.message}</p>;
  return (
    <ProductsView
      view={view}
      products={selectVisible(data.products, view)}
      onQuery={(value) => dispatch({ type: "query", value })}
      onSort={(value) => dispatch({ type: "sort", value })}
      onPage={(delta) => dispatch({ type: "page", delta })}
    />
  );
}
export {};
