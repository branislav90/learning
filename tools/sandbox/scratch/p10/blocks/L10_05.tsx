export {};
function Recommendations({ productId }: { productId: string }) {
  const recs = useRecommendations(productId);   // e.g. a query hook with timeout, bounded retry, breaker, stale-while-revalidate
  if (recs.items.length === 0) return null;     // empty is a valid state
  return <RecsCarousel items={recs.items} />;
}
