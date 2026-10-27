// api-client.tsx
import { createContext, useContext, type ReactNode } from "react";

export interface ApiClient {
  getOrders(signal?: AbortSignal): Promise<Order[]>;
  cancelOrder(id: string): Promise<void>;
}

export type Order = { id: string; total: number; status: "open" | "cancelled" };

const ApiClientContext = createContext<ApiClient | null>(null);

export function ApiClientProvider({
  client,
  children,
}: {
  client: ApiClient;
  children: ReactNode;
}) {
  return <ApiClientContext value={client}>{children}</ApiClientContext>;
}

export function useApiClient(): ApiClient {
  const client = useContext(ApiClientContext);
  if (!client) throw new Error("useApiClient requires <ApiClientProvider>");
  return client;
}
export {};
