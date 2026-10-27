// adapters/react/DisputeAppContext.tsx
import { createContext, use, type ReactNode } from "react";
import type { DisputesApp } from "../../composition/create-disputes-app";

const DisputeAppContext = createContext<DisputesApp | null>(null);

export function DisputeAppProvider({ app, children }: { app: DisputesApp; children: ReactNode }) {
  return <DisputeAppContext value={app}>{children}</DisputeAppContext>;   // React 19: context object usable as provider
}

export function useDisputesApp(): DisputesApp {
  const app = use(DisputeAppContext);
  if (!app) throw new Error("DisputeAppProvider missing");
  return app;
}
export {};
