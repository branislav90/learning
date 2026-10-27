// app/composition-root.tsx — the only place that knows the concrete adapter
import { httpOrdersApi } from "@/features/orders/api/httpOrdersApi";
import { OrdersApiProvider } from "@/features/orders";

const ordersApi = httpOrdersApi({ baseUrl: import.meta.env.VITE_API_URL });   // created once, stable identity

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <OrdersApiProvider api={ordersApi}>{children}</OrdersApiProvider>;
}
export {};
