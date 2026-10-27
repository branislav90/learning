type Column<T> = { key: string; header: string; cell: (row: T) => React.ReactNode };

function Table<T>({ rows, columns, getKey }: {
  rows: readonly T[]; columns: readonly Column<T>[]; getKey: (r: T) => string;
}) {
  return (
    <table>
      <thead><tr>{columns.map((c) => <th key={c.key} scope="col">{c.header}</th>)}</tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={getKey(r)}>{columns.map((c) => <td key={c.key}>{c.cell(r)}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

function usePaged<T>(rows: readonly T[], pageSize: number) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const slice = rows.slice(safePage * pageSize, (safePage + 1) * pageSize);
  return { slice, page: safePage, pageCount, setPage };
}

function Pager({ page, pageCount, onPage }: { page: number; pageCount: number; onPage(p: number): void }) {
  return (
    <nav aria-label="Pagination">
      <button disabled={page === 0} onClick={() => onPage(page - 1)}>Previous</button>
      <span>{page + 1} / {pageCount}</span>
      <button disabled={page >= pageCount - 1} onClick={() => onPage(page + 1)}>Next</button>
    </nav>
  );
}

function ProductsView({ products }: { products: readonly Product[] }) {
  const { query, setQuery, results } = useSearch(products, (p, q) => p.title.toLowerCase().includes(q.toLowerCase()));
  const paged = usePaged(results, 20);
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search products" />
      <Table
        rows={paged.slice}
        getKey={(p) => p.id}
        columns={[
          { key: "title", header: "Title", cell: (p) => p.title },
          { key: "price", header: "Price", cell: (p) => `$${p.price.toFixed(2)}` },
        ]}
      />
      <Pager page={paged.page} pageCount={paged.pageCount} onPage={paged.setPage} />
    </>
  );
}
export {};
