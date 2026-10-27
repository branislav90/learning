import {
  createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode,
} from "react";

type CartItem = { sku: string; qty: number; price: number };
type CartState = { items: CartItem[] };
type CartAction =
  | { type: "added"; item: CartItem }
  | { type: "removed"; sku: string }
  | { type: "cleared" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "added": {
      const existing = state.items.find((i) => i.sku === action.item.sku);
      return existing
        ? { items: state.items.map((i) => i.sku === existing.sku ? { ...i, qty: i.qty + action.item.qty } : i) }
        : { items: [...state.items, action.item] };
    }
    case "removed":
      return { items: state.items.filter((i) => i.sku !== action.sku) };
    case "cleared":
      return { items: [] };
  }
}

const CartStateContext = createContext<CartState | null>(null);
const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <CartDispatchContext value={dispatch}>
      <CartStateContext value={state}>{children}</CartStateContext>
    </CartDispatchContext>
  );
}

export function useCartState(): CartState {
  const s = useContext(CartStateContext);
  if (!s) throw new Error("useCartState requires <CartProvider>");
  return s;
}

export function useCartDispatch(): Dispatch<CartAction> {
  const d = useContext(CartDispatchContext);
  if (!d) throw new Error("useCartDispatch requires <CartProvider>");
  return d;
}

export function useCartActions() {
  const dispatch = useCartDispatch();
  // dispatch is stable (React guarantee), so this memo never recomputes
  return useMemo(
    () => ({
      add: (item: CartItem) => dispatch({ type: "added", item }),
      remove: (sku: string) => dispatch({ type: "removed", sku }),
      clear: () => dispatch({ type: "cleared" }),
    }),
    [dispatch],
  );
}
export {};
