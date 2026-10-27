function Filters({ onChange }: { onChange(f: Filter): void }) { /* ... */ }

function Page() {
  const [filter, setFilter] = useState<Filter>(initial);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Item[]>([]);

  useEffect(() => { setPage(1); }, [filter]);                  // when filter changes, reset page
  useEffect(() => { search(filter, page).then(setResults); }, [filter, page]);   // fetch
  useEffect(() => { if (results.length === 0 && page > 1) setPage(1); }, [results, page]); // fix
  // ...
}
export {};
