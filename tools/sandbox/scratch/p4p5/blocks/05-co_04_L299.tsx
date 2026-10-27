// features/orders/model/ports.ts — the consumer owns the interface
export interface OrdersApi {
  list(params: { status?: string; signal?: AbortSignal }): Promise<Order[]>;
  refund(orderId: string): Promise<void>;
}
export {};
