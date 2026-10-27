// features/orders/api/endpoints.ts
import { http } from "@/platform/http";                      // the configured client instance
import { orderDtoSchema, orderListDtoSchema } from "./schemas";
import { toOrder } from "./mappers";
import type { Order } from "../model/types";

export interface Page<T> { readonly items: readonly T[]; readonly nextCursor: string | null }

export async function fetchOrder(id: string, o: { signal?: AbortSignal } = {}): Promise<Order> {
  const dto = await http.get(`/orders/${encodeURIComponent(id)}`, { schema: orderDtoSchema, signal: o.signal });
  return toOrder(dto);
}

export async function fetchOrders(
  o: { cursor?: string; status?: Order["status"]; signal?: AbortSignal } = {},
): Promise<Page<Order>> {
  const dto = await http.get("/orders", {
    schema: orderListDtoSchema,
    signal: o.signal,
    query: { cursor: o.cursor, status: o.status?.toUpperCase() },
  });
  return { items: dto.results.map(toOrder), nextCursor: dto.next_cursor };
}
export {};
