// contexts/disputes/domain/dispute-draft.ts
import { type Money, lte } from "../../../shared-kernel/money";

export type Reason = "not-my-transaction" | "wrong-amount" | "duplicate" | "other";

export interface DisputeDraft {
  readonly transactionAmount: Money;
  readonly reason?: Reason;
  readonly claimedAmount?: Money;
  readonly evidence: readonly { name: string; sizeBytes: number }[];
  readonly note: string;
}

export type DraftIssue =
  | { code: "reason-required" }
  | { code: "amount-exceeds-transaction" }
  | { code: "note-required-for-other" }
  | { code: "too-many-files"; max: number };

const MAX_FILES = 5;

export function validate(d: DisputeDraft): DraftIssue[] {
  const issues: DraftIssue[] = [];
  if (!d.reason) issues.push({ code: "reason-required" });
  if (d.claimedAmount && !lte(d.claimedAmount, d.transactionAmount)) issues.push({ code: "amount-exceeds-transaction" });
  if (d.reason === "other" && d.note.trim() === "") issues.push({ code: "note-required-for-other" });
  if (d.evidence.length > MAX_FILES) issues.push({ code: "too-many-files", max: MAX_FILES });
  return issues;
}

export function addEvidence(d: DisputeDraft, file: { name: string; sizeBytes: number }): DisputeDraft {
  // Aggregate root controls the invariant: returns a new draft, never mutates.
  return d.evidence.length >= MAX_FILES ? d : { ...d, evidence: [...d.evidence, file] };
}
export {};
