function Remote<T>({ q, isEmpty, children }: {
  q: { status: "pending" | "error" | "success"; data?: T; error: unknown; isFetching: boolean; refetch(): void };
  isEmpty?: (d: T) => boolean;
  children: (d: T) => React.ReactNode;
}) {
  if (q.status === "pending") return <Skeleton />;
  if (q.status === "error") return <ErrorState error={q.error} onRetry={q.refetch} />;
  const d = q.data as T;
  if (isEmpty?.(d)) return <EmptyState />;
  return <>{q.isFetching && <RefreshingBadge />}{children(d)}</>;
}
export {};
