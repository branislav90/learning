type HOC<Injected> = <P extends Injected>(
  Component: React.ComponentType<P>
) => React.ComponentType<Omit<P, keyof Injected>>;
export {};
