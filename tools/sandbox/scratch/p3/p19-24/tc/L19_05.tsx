export {};
function SearchBox() {
  const committed = useSearchParam('q') ?? '';
  const [draft, setDraft] = useState(committed);

  // Sync draft when the URL changes from elsewhere (back button, link).
  // Compare during render, not in an effect (see 17 — derived state).
  const [prevCommitted, setPrevCommitted] = useState(committed);
  if (committed !== prevCommitted) {
    setPrevCommitted(committed);
    setDraft(committed);
  }

  useEffect(() => {
    if (draft === committed) return;
    const id = setTimeout(() => setSearchParam('q', draft, 'replace'), 300);
    return () => clearTimeout(id);
  }, [draft, committed]);

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      aria-label="Search invoices"
    />
  );
}
