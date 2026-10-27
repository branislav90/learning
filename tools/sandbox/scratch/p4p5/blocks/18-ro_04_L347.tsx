// features/orders/loaders.ts (conceptual; verify signature in docs)
export async function orderLoader({ params, request }: LoaderArgs) {
  const id = params.orderId!;
  // Start both in parallel, with the shared client cache as the single source (lesson 16)
  const [order] = await Promise.all([
    queryClient.ensureQueryData(orderQuery(id)),
    queryClient.ensureQueryData(orderItemsQuery(id)),
  ]);
  return null;                       // components read from the cache via useSuspenseQuery / useQuery
}
export {};
