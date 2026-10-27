export {};
function RenameButton({ id, current }: { id: string; current: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function rename(next: string) {
    setError(null);
    startTransition(async () => {
      try {
        await api.rename(id, next);
        // the cache/state update after `await` must be wrapped to remain a transition
        startTransition(() => {
          cache.updateName(id, next);
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Rename failed');
      }
    });
  }

  return (
    <>
      <button disabled={isPending} onClick={() => rename(prompt('New name', current) ?? current)}>
        {isPending ? 'Renaming…' : 'Rename'}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
