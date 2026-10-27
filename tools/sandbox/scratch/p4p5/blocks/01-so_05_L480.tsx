// Before: one context, every consumer re-renders on every change
const AppCtx = createContext<{ user: User; theme: Theme; cart: Cart; setTheme(t: Theme): void } | null>(null);

// After: segregated by consumer need and change rate
const UserCtx  = createContext<User | null>(null);
const ThemeCtx = createContext<Theme>("light");
const CartCtx  = createContext<Cart | null>(null);
export {};
