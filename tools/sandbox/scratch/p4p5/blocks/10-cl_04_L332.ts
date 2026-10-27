// composition/create-disputes-app.ts
import { makeRaiseDispute } from "../core/use-cases/raise-dispute";
import { createHttpDisputeGateway } from "../adapters/http/http-dispute-gateway";

export function createDisputesApp(config: { apiBaseUrl: string }) {
  const clock = { now: () => new Date() };
  const gateway = createHttpDisputeGateway(config.apiBaseUrl);
  return { raiseDispute: makeRaiseDispute({ gateway, clock }) };
}
export type DisputesApp = ReturnType<typeof createDisputesApp>;
export {};
