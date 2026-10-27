function SearchForm() {
  const [results, setResults] = useState<Product[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q');
    if (typeof q !== 'string' || q.trim() === '') return;
    setPending(true);
    setError(null);
    try {
      const raw = await fetchJson(`/api/search?q=${encodeURIComponent(q)}`);
      setResults(parseProducts(raw));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setPending(false);
    }
  }
  /* … render form, results, error … */
}
export {};
