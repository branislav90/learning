// src/features/cart/useCart.ts
import { useLegacyReduxCart } from './impl/legacy-redux';
import { useZustandCart } from './impl/zustand';
import { useFlag } from '../../flags';

export function useCart(): CartApi {
  // ⚠ Both hooks must not be called conditionally in the same render (Rules of Hooks).
  // Choose the implementation at a stable boundary, e.g. module level or via a provider, not per-render.
  const useImpl = useFlag('cart-zustand') ? useZustandCart : useLegacyReduxCart;
  return useImpl();
}
