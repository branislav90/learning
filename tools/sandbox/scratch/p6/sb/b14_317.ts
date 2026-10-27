declare const fetchOrders: any; type fetchOrders<T=any,U=any,V=any> = any;
// lib/orders.ts
import { queryOptions } from '@tanstack/react-query';

export const ordersOptions = (userId: string) =>
  queryOptions({
    queryKey: ['orders', userId, 'list'] as const,           // user-identifying key
    queryFn: ({ signal }) => fetchOrders(userId, { signal }),
  });
export {};
