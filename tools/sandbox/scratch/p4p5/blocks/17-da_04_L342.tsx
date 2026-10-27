function Page() {
  const [{ filter, page }, setQuery] = useState({ filter: initial, page: 1 });

  const changeFilter = (f: Filter) => setQuery({ filter: f, page: 1 });  // one atomic transition
  const changePage = (p: number) => setQuery((q) => ({ ...q, page: p }));

  const results = useSearch(filter, page);   // key = [filter, page]; stale responses are ignored by key identity
  // ...
}
export {};
