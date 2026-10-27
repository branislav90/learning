const Checkout = lazy(() => import("./features/checkout/CheckoutPage"));

export function Routes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Checkout />
    </Suspense>
  );
}
