// features/orders/routes.tsx
import type { RouteObject } from "react-router";            // verify type name per version
import { ordersLoader, orderLoader } from "./loaders";

export const ordersRoutes: RouteObject = {
  path: "orders",
  lazy: () => import("./ui/OrdersLayout"),                  // verify lazy-route API/shape
  loader: ordersLoader,
  children: [
    { index: true, lazy: () => import("./ui/OrdersList") },
    { path: ":orderId", lazy: () => import("./ui/OrderDetail"), loader: orderLoader },
  ],
};

// features/orders/routes.paths.ts
export const ordersPaths = {
  list: (q?: { status?: "open" | "shipped" }) => `/orders${q?.status ? `?status=${q.status}` : ""}`,
  detail: (id: string) => `/orders/${encodeURIComponent(id)}`,
};
export {};
