// application/ports.ts
export interface Clock { now(): Date }
export interface DisputeGateway {
  raise(cmd: RaiseDisputeRequest, signal?: AbortSignal): Promise<GatewayOutcome>;
}
export interface RaiseDisputeRequest { transactionId: string; draft: DisputeDraft; idempotencyKey: string }
export type GatewayOutcome =
  | { kind: "created"; disputeId: string }
  | { kind: "conflict" }
  | { kind: "rejected-window" }
  | { kind: "unavailable"; retryable: boolean };

export interface Events { publish(e: { type: "DisputeRaised"; transactionId: string; disputeId: string }): void }
export interface Analytics { track(event: string, props?: Record<string, string | number | boolean>): void }
export {};
