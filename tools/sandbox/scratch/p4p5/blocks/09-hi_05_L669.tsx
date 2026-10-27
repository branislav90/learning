type Injected = { theme: Theme };
export function withTheme<P extends Injected>(Component: ComponentType<P>): ComponentType<Omit<P, "theme">> {
  function WithTheme(props: Omit<P, "theme">) {
    const { theme } = useTheme();
    return <Component {...(props as P)} theme={theme} />;
  }
  WithTheme.displayName = `WithTheme(${Component.displayName ?? Component.name})`;
  return WithTheme;
}
export {};
