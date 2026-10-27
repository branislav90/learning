function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeCtx value={value}>{children}</ThemeCtx>;
}
// <ThemeProvider><Page /></ThemeProvider>  — Page's element is created by the parent of ThemeProvider
export {};
