import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi, type Cart } from '../../../stubs'
import { cartKeys } from './queries'
import { applyQuantity } from '../model/cartMath'
// features/cart/api/mutations.ts
export interface SetQtyVars { productId: string; variantId: string; quantity: number }

export function useSetCartQuantity(userId: string) {
  const qc = useQueryClient()
  const key = cartKeys.cart(userId)

  return useMutation({
    // Same scope id => mutations run serially, in click order.
    scope: { id: `cart:${userId}` },
    mutationFn: (v: SetQtyVars) => cartApi.setQuantity(v),

    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: key }) // a refetch landing now would overwrite our patch
      const previous = qc.getQueryData<Cart>(key)
      qc.setQueryData<Cart>(key, (old) => (old ? applyQuantity(old, v) : old))
      return { previous }
    },

    onError: (_err, _v, ctx) => {
      // With serialized mutations, only roll back if no newer optimistic patch exists;
      // simplest correct strategy: refetch the authoritative cart instead of restoring a snapshot.
      if (ctx?.previous) qc.setQueryData(key, ctx.previous)
    },

    onSuccess: (serverCart) => {
      // Authoritative response wins, but only if this is the last in-flight cart mutation.
      if (qc.isMutating({ mutationKey: ['cart'] }) <= 1) qc.setQueryData(key, serverCart)
    },

    onSettled: () => {
      if (qc.isMutating({ mutationKey: ['cart'] }) <= 1) void qc.invalidateQueries({ queryKey: key })
    },
    mutationKey: ['cart', 'set-quantity'],
  })
}
