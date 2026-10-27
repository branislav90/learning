// CartProvider decides once per mount and renders the correct implementation as a subtree.
import { createContext, useContext, type ReactNode } from 'react';

const CartContext = createContext<CartApi | null>(null);

function LegacyCartProvider({ children }: { children: ReactNode }) {
  const api = useLegacyReduxCart();
  return <CartContext value={api}>{children}</CartContext>;
}
function ZustandCartProvider({ children }: { children: ReactNode }) {
  const api = useZustandCart();
  return <CartContext value={api}>{children}</CartContext>;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const useNew = useFlag('cart-zustand');
  // Different component types => React unmounts one and mounts the other when the flag flips.
  return useNew
    ? <ZustandCartProvider>{children}</ZustandCartProvider>
    : <LegacyCartProvider>{children}</LegacyCartProvider>;
}

export function useCart(): CartApi {
  const api = useContext(CartContext);
  if (!api) throw new Error('useCart must be used inside <CartProvider>');
  return api;
}
