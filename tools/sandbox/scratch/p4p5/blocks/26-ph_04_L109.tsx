function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return { theme, toggle: () => setTheme(t => (t === "light" ? "dark" : "light")) };
}
function Header()  { const { theme, toggle } = useTheme(); return <button onClick={toggle}>{theme}</button>; }
function Sidebar() { const { theme } = useTheme(); return <aside>{theme}</aside>; }
export {};
