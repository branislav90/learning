export type OrderStatus = "draft" | "placed" | "dispatched" | "delivered" | "cancelled";
export interface Order { readonly id: string; readonly status: OrderStatus; readonly placedAt: Date; readonly lines: readonly Line[] }

export type CancelVerdict =
  | { allowed: true }
  | { allowed: false; reason: "already-dispatched" | "already-cancelled" | "not-placed" };

export function canCancel(order: Order): CancelVerdict {
  switch (order.status) {
    case "placed": return { allowed: true };
    case "draft": return { allowed: false, reason: "not-placed" };
    case "cancelled": return { allowed: false, reason: "already-cancelled" };
    case "dispatched":
    case "delivered": return { allowed: false, reason: "already-dispatched" };
  }
}
export {};
