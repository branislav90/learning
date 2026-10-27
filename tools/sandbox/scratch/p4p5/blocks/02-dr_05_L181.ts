// DRY: one authoritative representation
// orders/rules.ts
export const LATE_AFTER_DAYS = 3;
const DAY_MS = 86_400_000;

export function isLate(o: Pick<Order, "shippedAt" | "paidAt">, now: number = Date.now()): boolean {
  return o.shippedAt == null && now - o.paidAt > LATE_AFTER_DAYS * DAY_MS;
}
export {};
