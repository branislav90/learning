const SearchBox = withAnalytics(Search);          // module scope, created once

function Page({ user }: { user: User }) {
  const value = useMemo(() => ({ user, theme: "dark" as const }), [user]);
  return <ThemeContext value={value}><SearchBox /></ThemeContext>;
}
export {};
