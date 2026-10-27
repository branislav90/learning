function Feed() {
  const [items, setItems] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPosts(page);
      setItems((prev) => [...prev, ...res.posts]);
      setPage((p) => p + 1);
      setHasMore(res.hasMore);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }
  …
}
export {};
