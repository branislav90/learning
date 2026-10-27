type Props<S> = { children: ReactNode | ((state: S) => ReactNode); };

function Stateful<S>({ children, state }: Props<S> & { state: S }) {
  return <>{typeof children === "function" ? children(state) : children}</>;
}
export {};
