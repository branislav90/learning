export function ProjectDetailPage({ id }: { id: string }) {
  const q = useProject(id);

  if (q.data === undefined) {
    return q.isError ? <InlineError error={q.error} onRetry={() => void q.refetch()} /> : <DetailSkeleton />;
  }
  return (
    <>
      {q.isError && <StaleBanner onRetry={() => void q.refetch()} />}
      <ProjectEditor project={q.data} isRefreshing={q.isFetching} />
    </>
  );
}
export {};
