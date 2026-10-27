function Page({ user }: { user: User }) {
  const SearchBox = withAnalytics(Search);          // HOC applied in render
  const value = { user, theme: "dark" };
  return (
    <ThemeContext value={value}>
      <SearchBox />
    </ThemeContext>
  );
}
export {};
