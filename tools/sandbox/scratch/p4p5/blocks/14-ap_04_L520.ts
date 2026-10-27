// features/orders/api/queries.ts   (adapter to TanStack Query v5)
import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { fetchOrder, fetchOrders } from "./endpoints";
import type { Order } from "../model/types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (f: { status?: Order["status"] }) => [...orderKeys.lists(), f] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const orderQueries = {
  detail: (id: string) =>
    queryOptions({
      queryKey: orderKeys.detail(id),
      queryFn: ({ signal }) => fetchOrder(id, { signal }),
      staleTime: 30_000,
    }),
  list: (f: { status?: Order["status"] } = {}) =>
    infiniteQueryOptions({
      queryKey: orderKeys.list(f),
      queryFn: ({ pageParam, signal }) => fetchOrders({ cursor: pageParam, status: f.status, signal }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (last) => last.nextCursor ?? undefined,
    }),
};
export {};
