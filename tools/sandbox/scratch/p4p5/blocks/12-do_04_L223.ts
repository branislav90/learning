// orders/domain.ts   (OrderStatus and canCancel are the definitions from §2.5, living in this same module)
import { money, add, type Money } from "../shared-kernel/money";   // see lesson 08

export interface Line { readonly sku: string; readonly qty: number; readonly unit: Money }
export interface Order { readonly id: string; readonly status: OrderStatus; readonly lines: readonly Line[]; readonly currency: Money["currency"] }

export function orderTotal(order: Order): Money {
  return order.lines.reduce(
    (sum, l) => add(sum, money(l.unit.minor * l.qty, l.unit.currency)),
    money(0, order.currency),
  );
}

export function cancelled(order: Order): Order {
  const verdict = canCancel(order);
  if (!verdict.allowed) throw new Error(`Cannot cancel: ${verdict.reason}`);
  return { ...order, status: "cancelled" };
}
export {};
