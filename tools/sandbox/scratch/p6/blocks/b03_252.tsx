interface ResourceView<T> {
  data: T | undefined;
  error: Error | null;
  isInitialLoading: boolean;   // no data yet and a request is in flight
  isRefreshing: boolean;       // data present and a request is in flight
  updatedAt: number | null;
  refetch: () => void;
}

export function MembersPanel({ r }: { r: ResourceView<Member[]> }) {
  const showSkeleton = r.isInitialLoading;
  const showBlockingError = r.data === undefined && r.error !== null && !r.isInitialLoading;
  const showStaleBanner = r.data !== undefined && r.error !== null;

  if (showSkeleton) return <MembersSkeleton />;
  if (showBlockingError) {
    return <InlineError message={describe(r.error!)} onRetry={r.refetch} />;
  }

  const members = r.data!; // narrowed by the two checks above (a type predicate would be cleaner)
  return (
    <section aria-busy={r.isRefreshing} aria-labelledby="members-heading">
      <header>
        <h2 id="members-heading">Team members</h2>
        {r.isRefreshing && <SmallSpinner label="Refreshing" />}
      </header>

      {showStaleBanner && (
        <div role="alert" className="banner">
          Couldn't refresh. Showing data from {formatTime(r.updatedAt)}.
          <button onClick={r.refetch}>Retry</button>
        </div>
      )}

      {members.length === 0 ? <p>No members yet.</p> : <MemberList members={members} />}
    </section>
  );
}
export {};
