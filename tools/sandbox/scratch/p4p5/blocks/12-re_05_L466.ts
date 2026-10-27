export type CartItem = { sku: string; name: string; unitPriceCents: number; quantity: number };
export type CartState = { items: readonly CartItem[]; coupon: string | null };
export type CartAction =
  | { type: "itemAdded"; item: Omit<CartItem, "quantity"> }
  | { type: "quantityChanged"; sku: string; quantity: number }
  | { type: "itemRemoved"; sku: string }
  | { type: "couponApplied"; code: string }
  | { type: "couponCleared" }
  | { type: "cartCleared" };

export const initialCart: CartState = { items: [], coupon: null };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "itemAdded": {
      const existing = state.items.find((i) => i.sku === action.item.sku);
      return existing
        ? { ...state, items: state.items.map((i) => (i.sku === existing.sku ? { ...i, quantity: i.quantity + 1 } : i)) }
        : { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case "quantityChanged": {
      const quantity = Math.floor(action.quantity);
      if (!Number.isFinite(quantity)) return state;                              // reject NaN/Infinity
      if (quantity <= 0) return { ...state, items: state.items.filter((i) => i.sku !== action.sku) };
      if (!state.items.some((i) => i.sku === action.sku)) return state;          // unknown sku: no-op
      return { ...state, items: state.items.map((i) => (i.sku === action.sku ? { ...i, quantity } : i)) };
    }
    case "itemRemoved":
      return state.items.some((i) => i.sku === action.sku)
        ? { ...state, items: state.items.filter((i) => i.sku !== action.sku) }
        : state;
    case "couponApplied":
      return state.coupon === action.code ? state : { ...state, coupon: action.code };
    case "couponCleared":
      return state.coupon === null ? state : { ...state, coupon: null };
    case "cartCleared":
      return state.items.length === 0 && state.coupon === null ? state : initialCart;
    default:
      return assertNever(action);
  }
}
export {};
