declare const requireUser: any; type requireUser<T=any,U=any,V=any> = any;
// app/orders/page.tsx  (Server Component)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { ordersOptions } from '@/lib/orders';
import { OrdersTable } from './OrdersTable';

export default async function OrdersPage() {
  const user = await requireUser();
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(ordersOptions(user.id));   // runs on the server

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersTable userId={user.id} />
    </HydrationBoundary>
  );
}
export {};
