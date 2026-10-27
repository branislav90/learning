const CartStateContext = createContext<CartState | null>(null);
const CartDispatchContext = createContext<React.Dispatch<CartAction> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartDispatchContext value={dispatch}>
      <CartStateContext value={state}>{children}</CartStateContext>
    </CartDispatchContext>
  );
}
export function useCart() { const s = use(CartStateContext); if (!s) throw new Error("Missing <CartProvider>"); return s; }
export function useCartDispatch() { const d = use(CartDispatchContext); if (!d) throw new Error("Missing <CartProvider>"); return d; }
export {};
