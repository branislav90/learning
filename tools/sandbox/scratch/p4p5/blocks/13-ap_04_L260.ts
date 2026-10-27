// application/outcomes.ts
import type { DraftIssue } from "../domain/dispute-draft";
export type RaiseDisputeOutcome =
  | { kind: "raised"; disputeId: string }
  | { kind: "invalid"; issues: DraftIssue[] }
  | { kind: "window-closed" }
  | { kind: "duplicate" }
  | { kind: "unavailable"; retryable: boolean };

export function assertNever(x: never): never { throw new Error(`Unhandled: ${JSON.stringify(x)}`); }
export {};
