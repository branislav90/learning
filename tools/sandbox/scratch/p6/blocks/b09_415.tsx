// api/ordersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Order { id: number; status: 'open' | 'shipped'; note: string }

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Order'],
  endpoints: build => ({
    getOrders: build.query<Order[], { status?: Order['status'] } | void>({
      query: args => ({ url: 'orders', params: args ?? undefined }),
      providesTags: result =>
        result
          ? [...result.map(o => ({ type: 'Order' as const, id: o.id })),
             { type: 'Order' as const, id: 'LIST' }]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),
    getOrder: build.query<Order, number>({
      query: id => `orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Order', id }],
    }),
    updateNote: build.mutation<Order, { id: number; note: string }>({
      query: ({ id, ...body }) => ({ url: `orders/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Order', id }],
      async onQueryStarted({ id, note }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          ordersApi.util.updateQueryData('getOrder', id, draft => { draft.note = note; }),
        );
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderQuery, useUpdateNoteMutation } = ordersApi;
export {};
