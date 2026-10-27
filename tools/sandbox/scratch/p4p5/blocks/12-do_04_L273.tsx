// orders/use-order.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "./api";
import { canCancel, orderTotal } from "./domain";

export function useOrder(orderId: string) {
  const query = useQuery({
    queryKey: ["orders", orderId],
    queryFn: ({ signal }) => ordersApi.get(orderId, signal),
  });
  const order = query.data;
  return {
    ...query,
    // derived, not stored:
    cancelVerdict: order ? canCancel(order) : undefined,
    total: order ? orderTotal(order) : undefined,
  };
}

export function useCancelOrder(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ordersApi.cancel(orderId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders", orderId] }),
  });
}
export {};
