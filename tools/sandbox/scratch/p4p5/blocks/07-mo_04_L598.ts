// packages/orders/src/events.ts  (owned by orders; part of its contract)
export interface OrderEvents {
  "order.statusChanged": { orderId: string; from: string; to: string };
  "order.cancelled": { orderId: string; reason: string };
}
export {};
