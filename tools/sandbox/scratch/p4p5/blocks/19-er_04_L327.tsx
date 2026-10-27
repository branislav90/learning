function OrderPanel({ id }: { id: string }) {
  const { reset: resetQueries } = useQueryErrorResetBoundary();   // TanStack Query; ⚠ verify name/version
  return (
    <Boundary
      resetKeys={[id]}
      onError={(e, info) => captureError(e, { feature: "orders", widget: "OrderPanel", stack: info.componentStack })}
      fallback={({ error, reset }) => (
        <PanelError
          title="We couldn't load this order"
          error={error}
          onRetry={() => { resetQueries(); reset(); }}   // clear cached error, then re-render
        />
      )}
    >
      <Suspense fallback={<PanelSkeleton />}>
        <OrderDetails id={id} />
      </Suspense>
    </Boundary>
  );
}
export {};
