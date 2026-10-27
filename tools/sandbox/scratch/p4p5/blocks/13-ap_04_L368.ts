// composition.ts
import { makeRaiseDispute } from "./application/raise-dispute";
import { createHttpDisputeGateway } from "./infrastructure/http-dispute-gateway";
import { createEventBus } from "./infrastructure/events";
import type { Analytics } from "./application/ports";

export function createDisputes(env: { apiBaseUrl: string; analytics: Analytics }) {
  const events = createEventBus<{ type: "DisputeRaised"; transactionId: string; disputeId: string }>();
  const gateway = createHttpDisputeGateway({ baseUrl: env.apiBaseUrl });
  const clock = { now: () => new Date() };
  return {
    events,
    raiseDispute: makeRaiseDispute({ gateway, clock, events, analytics: env.analytics }),
  };
}
export type DisputesModule = ReturnType<typeof createDisputes>;
export {};
