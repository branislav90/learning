// packages/orders/src/testing.tsx
import type { ReactNode } from "react";
import { OrdersEnvContext, type OrdersEnv, type OrdersEvent } from "./env";

export function createFakeOrdersEnv() {
  const events: OrdersEvent[] = [];
  const env: OrdersEnv = { onEvent: (e) => events.push(e) };
  return { env, events };
}

export function OrdersTestProvider({ env, children }: { env: OrdersEnv; children: ReactNode }) {
  return <OrdersEnvContext value={env}>{children}</OrdersEnvContext>;
}
export {};
