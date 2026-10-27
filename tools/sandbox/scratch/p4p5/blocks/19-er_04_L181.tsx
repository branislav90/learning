<ErrorBoundary FallbackComponent={PanelError} resetKeys={[id]}>
  <Suspense fallback={<PanelSkeleton />}>
    <Panel id={id} />
  </Suspense>
</ErrorBoundary>
export {};
