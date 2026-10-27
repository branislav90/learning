interface OrderDto {
  order_id: number;
  items: { sku: string; qty: number; unit_price_cents: number }[];
  status: 'P' | 'S' | 'C';
}
interface OrderLine { sku: string; quantity: number; unitPriceMinor: number }
interface Order {
  id: string; lines: OrderLine[];
  status: 'pending' | 'shipped' | 'cancelled'; totalMinor: number;
}
const statusByCode = {
  P: 'pending', S: 'shipped', C: 'cancelled',
} as const satisfies Record<OrderDto['status'], Order['status']>;

export function toOrder(dto: OrderDto): Order {
  const lines = dto.items.map((i) => ({
    sku: i.sku, quantity: i.qty, unitPriceMinor: i.unit_price_cents,
  }));
  return {
    id: String(dto.order_id),
    lines,
    status: statusByCode[dto.status],
    totalMinor: lines.reduce((sum, l) => sum + l.quantity * l.unitPriceMinor, 0),
  };
}
export {};
