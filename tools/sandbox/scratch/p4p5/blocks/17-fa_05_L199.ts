// checkout-service.ts
import type { Clock } from './services/ports';

export type CheckoutDeps = {
  payments: { charge(amount: number, country: string, idempotencyKey: string): Promise<{ id: string }>; refund(chargeId: string): Promise<void> };
  orders: { create(input: { items: readonly CartItem[]; chargeId: string }): Promise<{ id: string }> };
  tax: { compute(items: readonly CartItem[], country: string): number };
  ids: { next(): string };
};
export type CartItem = { sku: string; price: number; qty: number };
export type Address = { country: string; line1: string };

export type PlaceOrderResult =
  | { ok: true; orderId: string; total: number }
  | { ok: false; reason: 'no-address' | 'payment-failed' | 'order-failed-refunded' | 'order-failed-refund-failed'; message: string };

export function createCheckoutService(deps: CheckoutDeps) {
  async function placeOrder(items: readonly CartItem[], address: Address | null): Promise<PlaceOrderResult> {
    if (!address) return { ok: false, reason: 'no-address', message: 'Address required' };

    const total = items.reduce((s, i) => s + i.price * i.qty, 0) + deps.tax.compute(items, address.country);
    const idempotencyKey = deps.ids.next();

    let chargeId: string;
    try {
      chargeId = (await deps.payments.charge(total, address.country, idempotencyKey)).id;
    } catch (e) {
      return { ok: false, reason: 'payment-failed', message: errorMessage(e) };
    }

    try {
      const order = await deps.orders.create({ items, chargeId });
      return { ok: true, orderId: order.id, total };
    } catch (e) {
      try {
        await deps.payments.refund(chargeId);
        return { ok: false, reason: 'order-failed-refunded', message: errorMessage(e) };
      } catch {
        // surfaces to ops; the facade must not hide a customer-impacting partial failure
        return { ok: false, reason: 'order-failed-refund-failed', message: 'Order failed and refund needs manual action' };
      }
    }
  }
  return { placeOrder };
}

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : 'Unknown error');
export {};
