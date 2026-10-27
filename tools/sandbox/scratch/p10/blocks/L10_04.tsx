// Route-level: only the essentials are awaited
export async function loader({ params }: LoaderArgs) {
  const [product, inventory] = await Promise.all([getProduct(params.id), getInventory(params.id)]);
  return { product, inventory };
}

// Page: optional widgets own their data and failure
function ProductPage({ id }: { id: string }) {
  return (
    <>
      <ProductDetails id={id} />
      <ErrorBoundary fallback={() => <Reserved height={240} />}>
        <Suspense fallback={<Skeleton height={240} />}>
          <Recommendations productId={id} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={({ reset }) => <ReviewsUnavailable onRetry={reset} />}>
        <Suspense fallback={<Skeleton height={320} />}>
          <Reviews productId={id} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
