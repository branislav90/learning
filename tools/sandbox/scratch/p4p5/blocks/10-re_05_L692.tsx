<ThemeContext.Consumer>{(t) => <UserContext.Consumer>{(u) => <Header theme={t} user={u} />}</UserContext.Consumer>}</ThemeContext.Consumer>
export {};
