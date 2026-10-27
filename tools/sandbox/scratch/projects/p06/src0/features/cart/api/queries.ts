import { queryOptions } from '@tanstack/react-query'
import { cartApi } from '../../../stubs'
// features/cart/api/queries.ts
export const cartKeys = { cart: (userId: string) => ['cart', userId] as const }
export const cartOptions = (userId: string) =>
  queryOptions({
    queryKey: cartKeys.cart(userId),
    queryFn: ({ signal }) => cartApi.get(signal),
    staleTime: 30_000,
  })
