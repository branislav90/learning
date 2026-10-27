// order-service.ts — plain TypeScript, no React
import type { Clock } from './services/ports';

export type Http = { get<T>(url: string, init?: { signal?: AbortSignal }): Promise<T> };

export function createOrderService(deps: { http: Http; clock: Clock }) {
  return {
    async listRecent(signal?: AbortSignal) {
      const orders = await deps.http.get<Array<{ id: string; placedAt: number }>>('/api/orders', { signal });
      const cutoff = deps.clock.now() - 30 * 24 * 60 * 60 * 1000;
      return orders.filter((o) => o.placedAt >= cutoff);
    },
  };
}
export type OrderService = ReturnType<typeof createOrderService>;
export {};
