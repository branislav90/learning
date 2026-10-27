// app/orders/OrdersTable.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { ordersOptions } from '@/lib/orders';

export function OrdersTable({ userId }: { userId: string }) {
  const { data, isFetching } = useQuery(ordersOptions(userId));
  if (!data) return <p>Loading…</p>;                          // only if prefetch failed
  return (
    <table aria-busy={isFetching}>
      {/* rows */}
    </table>
  );
}
export {};
