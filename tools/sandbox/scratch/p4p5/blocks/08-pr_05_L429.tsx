import type { ComponentType, ReactNode } from "react";

type ProviderEntry = readonly [ComponentType<{ children: ReactNode }>, Record<string, unknown>?];

export function ComposeProviders({
  providers,
  children,
}: {
  providers: ProviderEntry[];
  children: ReactNode;
}) {
  return providers.reduceRight<ReactNode>(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children,
  );
}
export {};
