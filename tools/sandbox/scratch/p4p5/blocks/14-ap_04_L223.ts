import { z } from "zod";

const orderDtoSchema = z.object({
  order_id: z.string(),
  total_amount: z.string(),       // decimal string from the API
  currency: z.string().length(3),
  created: z.string(),            // ISO timestamp as string
  state: z.enum(["PAID", "PENDING", "CANCELLED"]),
});
type OrderDto = z.infer<typeof orderDtoSchema>;

type Money = { readonly amountMinor: number; readonly currency: string };
export type OrderStatus = "paid" | "pending" | "cancelled";
export interface Order {
  readonly id: string;
  readonly total: Money;
  readonly createdAt: Date;
  readonly status: OrderStatus;
}

function toMoney(amount: string, currency: string): Money {
  const [whole, frac = ""] = amount.split(".");
  const minor = Number(whole) * 100 + Number((frac + "00").slice(0, 2));
  return { amountMinor: minor, currency };
}

const statusMap: Record<OrderDto["state"], OrderStatus> = {
  PAID: "paid", PENDING: "pending", CANCELLED: "cancelled",
};

export function toOrder(dto: OrderDto): Order {
  return {
    id: dto.order_id,
    total: toMoney(dto.total_amount, dto.currency),
    createdAt: new Date(dto.created),
    status: statusMap[dto.state],
  };
}

export async function fetchOrder(id: string, signal?: AbortSignal): Promise<Order> {
  const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body: unknown = await res.json();
  return toOrder(orderDtoSchema.parse(body));      // throws ZodError on mismatch
}
export {};
