<ThemeContext.Consumer>
  {(theme) => (
    <AuthContext.Consumer>
      {(auth) => (
        <LocaleContext.Consumer>
          {(locale) => <Header theme={theme} user={auth.user} locale={locale} />}
        </LocaleContext.Consumer>
      )}
    </AuthContext.Consumer>
  )}
</ThemeContext.Consumer>
export {};
