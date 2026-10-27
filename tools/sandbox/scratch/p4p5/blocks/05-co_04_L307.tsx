// features/orders/model/OrdersApiContext.tsx
import { createContext, use, type ReactNode } from "react";
import type { OrdersApi } from "./ports";

const OrdersApiContext = createContext<OrdersApi | null>(null);

export function OrdersApiProvider({ api, children }: { api: OrdersApi; children: ReactNode }) {
  return <OrdersApiContext value={api}>{children}</OrdersApiContext>;
}
export function useOrdersApi(): OrdersApi {
  const api = use(OrdersApiContext);
  if (!api) throw new Error("useOrdersApi must be used within <OrdersApiProvider>");
  return api;
}
export {};
