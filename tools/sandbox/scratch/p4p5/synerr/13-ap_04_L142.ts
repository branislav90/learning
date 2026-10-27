// Exceptions for expected outcomes: invisible in the signature
async function raise(...): Promise<Receipt> { /* throws DuplicateError | WindowClosedError | ... */ }

// Outcome union: visible, exhaustively checkable
type RaiseOutcome =
  | { kind: "raised"; receipt: Receipt }
  | { kind: "invalid"; issues: DraftIssue[] }
  | { kind: "duplicate" }
  | { kind: "window-closed" }
  | { kind: "unavailable"; retryable: boolean };
export {};
