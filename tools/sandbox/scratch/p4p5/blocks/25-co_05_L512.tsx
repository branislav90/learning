type AppState = {
  user: User; theme: Theme; cart: CartItem[];
  setTheme: (t: Theme) => void; addToCart: (i: CartItem) => void;
};
const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [cart, setCart] = useState<CartItem[]>([]);
  const user = useUser();
  return (
    <AppContext value={{ user, theme, cart, setTheme, addToCart: (i) => setCart((c) => [...c, i]) }}>
      {children}
    </AppContext>
  );
}

function Header() { const { theme } = useApp(); return <header data-theme={theme} />; }
function CartBadge() { const { cart } = useApp(); return <span>{cart.length}</span>; }
function Layout({ user }: { user: User }) { return <Sidebar user={user} />; }
function Sidebar({ user }: { user: User }) { return <UserMenu user={user} />; }
function UserMenu({ user }: { user: User }) { return <Avatar user={user} />; }
export {};
