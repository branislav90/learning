// Server Component: critical data awaited, slow data streamed
export default async function ProductPage({ id }: { id: string }) {
  const productPromise = getProduct(id);              // start now
  const reviewsPromise = getReviews(id);              // start now, don't await
  const recsPromise = getRecommendations(id);         // start now, don't await

  const product = await productPromise;               // critical: price, title, hero
  return (
    <>
      <ProductHero product={product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews reviewsPromise={reviewsPromise} />   {/* client or server component using use() */}
      </Suspense>
      <Suspense fallback={<RecsSkeleton />}>
        <Recommendations recsPromise={recsPromise} />
      </Suspense>
    </>
  );
}
export {};
