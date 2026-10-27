<ErrorBoundary fallback={<PageError />}>
  <Suspense fallback={<PageSkeleton />}>
    <UserPage id={1} />          // useSuspenseQuery(user)
  </Suspense>
</ErrorBoundary>
export {};
