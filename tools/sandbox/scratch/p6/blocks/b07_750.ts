export const orderKeys = { /* from lesson 06 C2 */ };
export const ordersApi = {
  list: async (f: OrderFilters, signal: AbortSignal) => parseOrderPage(await fetchJson(`/api/orders?${toSearch(f)}`, signal)),
  detail: async (id: string, signal: AbortSignal) => parseOrder(await fetchJson(`/api/orders/${encodeURIComponent(id)}`, signal)),
  cancel: async (id: string) => parseOrder(await sendJson(`/api/orders/${encodeURIComponent(id)}/cancel`, 'POST', {})),
};
export const orderQueries = { list: (f) => queryOptions({ queryKey: orderKeys.list(f), queryFn: ({ signal }) => ordersApi.list(f, signal), staleTime: 15_000 }),
                              detail: (id) => queryOptions({ queryKey: orderKeys.detail(id), queryFn: ({ signal }) => ordersApi.detail(id, signal), staleTime: 60_000 }) };
export function useCancelOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ordersApi.cancel(id),
    onSuccess: (o) => qc.setQueryData(orderKeys.detail(id), o),
    onSettled: () => { void qc.invalidateQueries({ queryKey: orderKeys.lists() }); },
  });
}
export {};
