// features/order/api/getOrder.ts  (data access + anti-corruption mapping)
import type { Order } from "../model/types";

interface ApiOrder { id: string; line_items: { sku: string; unit_price: number; qty: number }[] }

export async function getOrder(orderId: string, signal?: AbortSignal): Promise<Order> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { signal });
  if (!res.ok) throw new Error(`getOrder failed: ${res.status}`);
  const raw = (await res.json()) as ApiOrder;
  return {
    id: raw.id,
    lines: raw.line_items.map((l) => ({ sku: l.sku, unitPriceMinor: l.unit_price, qty: l.qty })),
  };
}
export {};
