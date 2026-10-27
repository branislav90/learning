function HeaderContainer() {
  const theme = use(ThemeContext);
  const auth = use(AuthContext);
  const locale = use(LocaleContext);
  return <Header theme={theme} user={auth.user} locale={locale} />;
}
export {};
