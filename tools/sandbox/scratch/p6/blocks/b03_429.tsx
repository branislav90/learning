function Orders() {
  const q = useOrders();   // returns a discriminated view: see §5.2 for the two-axis variant

  if (q.data === undefined) {
    if (q.error) return <InlineError message={describe(q.error)} onRetry={q.refetch} />;
    return <OrdersSkeleton />;                  // no data and no error => initial load
  }
  return (
    <>
      {q.error && <StaleBanner onRetry={q.refetch} />}
      {q.data.length === 0 ? <EmptyOrders /> : <OrderTable rows={q.data} dimmed={q.isFetching} />}
    </>
  );
}
export {};
