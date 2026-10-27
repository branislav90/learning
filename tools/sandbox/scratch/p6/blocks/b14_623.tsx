// shared
export function createClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
}
// server.tsx (per request)
const queryClient = createClient();
await queryClient.prefetchQuery(ordersOptions(user.id));
const state = dehydrate(queryClient);
const html = renderToString(
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={state}><App /></HydrationBoundary>
  </QueryClientProvider>,
);
// embed `state` with an escaping serialiser: window.__RQ__ = serialize(state, { isJSON: true })

// client.tsx (singleton in browser)
const queryClient = createClient();
const state = (window as any).__RQ__;
hydrateRoot(
  document.getElementById('root')!,
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={state}><App /></HydrationBoundary>
  </QueryClientProvider>,
);
export {};
