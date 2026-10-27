// ❌ Everything in one context; value rebuilt on every render
function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [theme, setTheme] = useState<Theme>("light");
  const [notifications, setNotifications] = useState<Note[]>([]);

  return (
    <AppContext value={{ user, setUser, cart, setCart, theme, setTheme, notifications, setNotifications }}>
      {children}
    </AppContext>
  );
}
export {};
