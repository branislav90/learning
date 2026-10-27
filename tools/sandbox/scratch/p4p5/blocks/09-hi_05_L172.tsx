import type { ComponentType } from "react";

export function withLogging<P extends object>(Component: ComponentType<P>) {
  function WithLogging(props: P) {
    console.log(`render ${Component.displayName ?? Component.name}`, props);
    return <Component {...props} />;
  }
  WithLogging.displayName = `WithLogging(${Component.displayName ?? Component.name ?? "Component"})`;
  return WithLogging;
}

const LoggedButton = withLogging(Button);
export {};
