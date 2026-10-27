const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void } | null>(null);
const CartStateContext = createContext<CartItem[] | null>(null);
const CartActionsContext = createContext<{ add: (i: CartItem) => void } | null>(null);
const UserContext = createContext<User | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const actions = useMemo(() => ({ add: (i: CartItem) => setCart((c) => [...c, i]) }), []);
  return (
    <CartActionsContext value={actions}>
      <CartStateContext value={cart}>{children}</CartStateContext>
    </CartActionsContext>
  );
}
export {};
