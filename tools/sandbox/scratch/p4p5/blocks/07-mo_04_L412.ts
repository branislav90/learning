// src/modules/orders/index.ts (contract, excerpt)
import type { ReactNode } from "react";
import type { AppModule, ExtensionPoint } from "@/platform/module-system";

export interface OrderAction { readonly id: string; readonly render: (orderId: string) => ReactNode }
export const OrderActions: ExtensionPoint<OrderAction> = { id: "orders.actions" };

export const ordersModule: AppModule = {
  id: "orders",
  routes: [{ path: "/orders/*", load: () => import("./routes") }],
  nav: [{ id: "orders", label: "Orders", to: "/orders", order: 20 }],
};
export {};
