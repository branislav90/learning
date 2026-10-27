export {};
const CartContext = createContext<{ items: CartItem[]; add(i: CartItem): void } | null>(null);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const value = useMemo(
    () => ({ items, add: (i: CartItem) => setItems((xs) => [...xs, i]) }),
    [items],
  );
  return <CartContext value={value}>{children}</CartContext>;
}
