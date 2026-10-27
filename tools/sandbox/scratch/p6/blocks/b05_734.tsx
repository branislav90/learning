function LikeForm({ postId, liked }: { postId: string; liked: boolean }) {
  const [base, setBase] = useState(liked);
  const [view, setView] = useOptimistic(base, (_cur, next: boolean) => next);
  const [error, setError] = useState<string | null>(null);

  async function action() {
    const target = !view;                    // intent captured at event time from the *displayed* value
    setView(target);
    try {
      await api.setLike(postId, target);
      startTransition(() => setBase(target));
      setError(null);
    } catch {
      startTransition(() => setError('Could not update. Reverted.'));
    }
  }
  return (
    <form action={action}>
      <button aria-pressed={view}>♥</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
export {};
