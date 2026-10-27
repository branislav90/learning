// ❌ Many bugs in one component
function ProductsPage() {
  const [sp, setSp] = useSearchParams();
  const [page, setPage] = useState(Number(sp.get('page')));     // (1) copy of URL into state; NaN if missing
  const [q, setQ] = useState(sp.get('q') ?? '');

  useEffect(() => { setSp({ page: String(page), q }); }, [page, q]);  // (2) effect syncing state -> URL

  const filters = JSON.parse(sp.get('filters')!);                 // (3) throws on missing/malformed

  return (
    <input value={q} onChange={(e) => { setQ(e.target.value); setSp({ q: e.target.value }, { replace: false }); }} /> // (4) push per keystroke
  );
}
export {};
