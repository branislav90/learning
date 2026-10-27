// (1) stable source
const user = useSuspenseQuery(userOptions(id)).data;           // or: promise passed from a server component / loader

// (2) boundaries at UX-unit granularity + transitions on navigation
<Layout>
  <Suspense fallback={<SidebarSkeleton />}><Sidebar /></Suspense>
  <main><Suspense fallback={<ContentSkeleton />}><Outlet /></Suspense></main>
</Layout>

// (3) pair with an error boundary and a reset
<QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => (
      <div role="alert">Something failed. <button onClick={resetErrorBoundary}>Retry</button></div>
    )}>
      <Suspense fallback={<Spinner />}><Profile id={id} /></Suspense>
    </ErrorBoundary>
  )}
</QueryErrorResetBoundary>

// (4) parallel
const [a, b] = useSuspenseQueries({ queries: [aOptions(), bOptions()] }).map((q) => q.data) as [A, B];
export {};
