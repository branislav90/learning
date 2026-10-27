// packages/orders/src/env.ts
import { createContext, use } from "react";

export type OrdersEvent = { type: "order.opened"; orderId: string };
export interface OrdersEnv { readonly onEvent: (e: OrdersEvent) => void }

export const OrdersEnvContext = createContext<OrdersEnv | null>(null);
export function useOrdersEnv(): OrdersEnv {
  const v = use(OrdersEnvContext);
  if (!v) throw new Error("OrdersEnvContext missing: wrap in <OrdersEnvProvider> (see @acme/orders)");
  return v;
}
export {};
