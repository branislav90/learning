export {};
function LikeButton({ id, liked, count }: { id: string; liked: boolean; count: number }) {
  const [real, setReal] = useState({ liked, count });
  const [error, setError] = useState<string | null>(null);
  const [optimistic, setOptimistic] = useOptimistic(
    real,
    (cur, nextLiked: boolean) => ({ liked: nextLiked, count: cur.count + (nextLiked ? 1 : -1) }),
  );

  function toggle() {
    const next = !optimistic.liked;
    setError(null);
    startTransition(async () => {
      setOptimistic(next);
      try {
        await api.like(id, next);
        startTransition(() => setReal((r) => ({ liked: next, count: r.count + (next ? 1 : -1) })));
      } catch {
        setError('Could not update like.');
      }
    });
  }
  return (
    <>
      <button aria-pressed={optimistic.liked} onClick={toggle}>♥ {optimistic.count}</button>
      {error && <span role="alert">{error}</span>}
    </>
  );
}
