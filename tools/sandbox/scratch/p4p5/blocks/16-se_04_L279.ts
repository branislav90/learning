// queries/useOrders.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
export function useOrders(filter: OrdersFilter) {
  return useQuery({
    queryKey: ordersKeys.list(filter),
    queryFn: ({ signal }) => ordersApi.list(filter, signal),   // signal enables cancellation
    placeholderData: keepPreviousData,                         // avoid flash when paging
  });
}

// queries/useUpdateOrderAddress.ts — mutation owns invalidation policy
import { useMutation, useQueryClient } from "@tanstack/react-query";
export function useUpdateOrderAddress(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (address: Address) => ordersApi.updateAddress(id, address),
    onSuccess: (order) => {
      qc.setQueryData(ordersKeys.detail(id), order);           // authoritative response → patch
      qc.invalidateQueries({ queryKey: ordersKeys.lists() });  // lists may be affected → refetch
    },
  });
}
export {};
