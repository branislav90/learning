// @vitest-environment jsdom
import React from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { render, screen, waitFor, act } from '@testing-library/react';
import { it, expect } from 'vitest';
type Order = { id: string; status: string; total: number };
type OrdersFilter = { s?: string };
const ordersKeys = { all: ['orders'] as const, lists: () => [...ordersKeys.all, 'list'] as const, list: (f: OrdersFilter) => [...ordersKeys.lists(), f] as const };
let server: Order[] = [{ id: 'a', status: 'open', total: 5 }];
const fetchOrders = async (_f: OrdersFilter) => structuredClone(server);
let fail = false;
const api = { cancel: async (id: string) => { await new Promise(r => setTimeout(r, 30)); if (fail) throw new Error('x'); server = server.map(o => o.id === id ? { ...o, status: 'cancelled' } : o); } };
const seen: string[] = [];
function P() {
  const qc = useQueryClient(); const filter = {};
  const { data: orders = [] } = useQuery({ queryKey: ordersKeys.list(filter), queryFn: () => fetchOrders(filter) });
  const cancel = useMutation({
    mutationFn: (id: string) => api.cancel(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ordersKeys.all });
      const prev = qc.getQueriesData<Order[]>({ queryKey: ordersKeys.lists() });
      qc.setQueriesData<Order[]>({ queryKey: ordersKeys.lists() }, (os) => os?.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)));
      return { prev };
    },
    onError: (_e, _id, ctx) => ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data)),
    onSettled: () => qc.invalidateQueries({ queryKey: ordersKeys.all }),
  });
  seen.push(orders[0]?.status ?? 'none');
  return <button onClick={() => cancel.mutate('a')}>{orders[0]?.status ?? 'none'}</button>;
}
it('optimistic ok + rollback', async () => {
  const qc = new QueryClient(); 
  render(<QueryClientProvider client={qc}><P /></QueryClientProvider>);
  await screen.findByText('open');
  console.log('defaults: gcTime', qc.getQueryCache().getAll()[0].options.gcTime, 'staleTime', qc.getQueryCache().getAll()[0].options.staleTime, 'isStale', qc.getQueryCache().getAll()[0].isStale());
  act(() => screen.getByRole('button').click());
  await screen.findByText('cancelled'); console.log('optimistic shown, seen', seen.join(','));
  await act(async () => { await new Promise(r => setTimeout(r, 80)); });
  expect(screen.getByRole('button').textContent).toBe('cancelled');
  fail = true; server = [{ id: 'a', status: 'open', total: 5 }]; await act(async () => { await qc.invalidateQueries({ queryKey: ordersKeys.all }); });
  await screen.findByText('open'); act(() => screen.getByRole('button').click()); await screen.findByText('cancelled');
  await waitFor(() => expect(screen.getByRole('button').textContent).toBe('open')); console.log('rollback ok');
});
