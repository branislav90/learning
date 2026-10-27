function ThemedUserHeader() {
  const theme = use(ThemeContext);
  const user = use(UserContext);
  return <Header theme={theme} user={user} />;
}
export {};
