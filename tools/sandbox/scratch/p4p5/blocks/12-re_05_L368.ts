type AppState = { cart: CartState; ui: UiState };
type AppAction =
  | { scope: "cart"; action: CartAction }
  | { scope: "ui"; action: UiAction };

export function appReducer(state: AppState, a: AppAction): AppState {
  switch (a.scope) {
    case "cart": {
      const cart = cartReducer(state.cart, a.action);
      return cart === state.cart ? state : { ...state, cart };   // preserve identity when nothing changed
    }
    case "ui": {
      const ui = uiReducer(state.ui, a.action);
      return ui === state.ui ? state : { ...state, ui };
    }
    default:
      return assertNever(a);
  }
}
export {};
