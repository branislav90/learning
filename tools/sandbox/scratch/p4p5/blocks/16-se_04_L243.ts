// api/ordersApi.ts  (no React, no cache library)
export type Order = { id: string; status: "open" | "shipped"; address: Address; updatedAt: string };
export type OrdersFilter = { status?: Order["status"]; page: number };

async function http<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) throw new HttpError(res.status, await safeText(res)); // fetch doesn't reject on 4xx/5xx
  return (await res.json()) as T; // ⚠ validate at the boundary in real code (see §5.5)
}

export const ordersApi = {
  list: (f: OrdersFilter, signal?: AbortSignal) =>
    http<{ items: Order[]; total: number }>(`/api/orders?${toSearch(f)}`, { signal }),
  get: (id: string, signal?: AbortSignal) => http<Order>(`/api/orders/${id}`, { signal }),
  updateAddress: (id: string, address: Address) =>
    http<Order>(`/api/orders/${id}/address`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    }),
};
export {};
