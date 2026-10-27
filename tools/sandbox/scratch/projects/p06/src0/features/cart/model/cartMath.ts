import type { Cart } from '../../../stubs'
interface SetQtyVars { productId: string; variantId: string; quantity: number }
// features/cart/model/cartMath.ts
export function applyQuantity(cart: Cart, v: SetQtyVars): Cart {
  const lines = v.quantity === 0
    ? cart.lines.filter((l) => !(l.productId === v.productId && l.variantId === v.variantId))
    : cart.lines.map((l) => (l.productId === v.productId && l.variantId === v.variantId ? { ...l, quantity: v.quantity } : l))
  return {
    ...cart,
    lines,
    itemCount: lines.reduce((n, l) => n + l.quantity, 0),
    // Totals are marked provisional until the server answers.
    totals: { ...cart.totals, provisional: true },
  }
}
