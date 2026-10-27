// domain/cart.ts
export type Line = { sku: string; quantity: number; unitPriceMinor: number };
export type Cart = { currency: string; lines: readonly Line[] };
export type CartIssue = "empty" | "invalid-quantity" | "invalid-price";

export function validateCart(cart: Cart): { ok: true } | { ok: false; issue: CartIssue } {
  if (cart.lines.length === 0) return { ok: false, issue: "empty" };
  for (const l of cart.lines) {
    if (!Number.isInteger(l.quantity) || l.quantity < 1) return { ok: false, issue: "invalid-quantity" };
    if (!Number.isInteger(l.unitPriceMinor) || l.unitPriceMinor < 0) return { ok: false, issue: "invalid-price" };
  }
  return { ok: true };
}

// application/placeOrder.ts
import { validateCart, type Cart } from "../domain/cart";

export type OrderGateway = {
  create(input: { cart: Cart; idempotencyKey: string }): Promise<{ orderId: string }>;
};
export class GatewayRejected extends Error {}   // adapter throws this for 4xx business rejections

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; reason: "empty" | "invalid" | "rejected" | "network" };

export type PlaceOrderDeps = { orders: OrderGateway; newKey: () => string };

export const makePlaceOrder = ({ orders, newKey }: PlaceOrderDeps) =>
  async (cart: Cart, key: string = newKey()): Promise<PlaceOrderResult> => {
    const v = validateCart(cart);
    if (!v.ok) return { ok: false, reason: v.issue === "empty" ? "empty" : "invalid" };
    try {
      const { orderId } = await orders.create({ cart, idempotencyKey: key });
      return { ok: true, orderId };
    } catch (e) {
      return { ok: false, reason: e instanceof GatewayRejected ? "rejected" : "network" };
    }
  };

// ui/PlaceOrderProvider.tsx (composition root supplies the real service)
import { createContext, use, useCallback, useRef, useState, type ReactNode } from "react";
type Service = ReturnType<typeof makePlaceOrder>;
const Ctx = createContext<Service | null>(null);
export const PlaceOrderProvider = ({ service, children }: { service: Service; children: ReactNode }) =>
  <Ctx value={service}>{children}</Ctx>;

export function usePlaceOrder() {
  const service = use(Ctx);
  if (!service) throw new Error("PlaceOrderProvider missing");
  const [status, setStatus] = useState<"idle" | "pending" | PlaceOrderResult>("idle");
  const keyRef = useRef<string | undefined>(undefined);   // reuse key across retries of the same attempt
  const run = useCallback(async (cart: Cart) => {
    setStatus("pending");
    keyRef.current ??= crypto.randomUUID();               // created once per attempt, kept across failed retries
    const result = await service(cart, keyRef.current);
    if (result.ok) keyRef.current = undefined;            // success consumes the key
    setStatus(result);
    return result;
  }, [service]);
  return { run, status };
}
export {};
