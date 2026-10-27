// ui/DisputeForm.tsx
"use client"; // only relevant in frameworks that use this directive; omit for plain SPA
import { useActionState } from "react";
import { useDisputes } from "./DisputesContext";
import { messageFor } from "./messages";
import { draftFromFormData } from "./form-mapping";

type FormState = { status: "idle" } | { status: "error"; message: string; issues?: string[] } | { status: "done"; disputeId: string };

export function DisputeForm({ transaction }: { transaction: TransactionSummary }) {
  const { raiseDispute } = useDisputes();
  const [state, submit, pending] = useActionState<FormState, FormData>(
    async (_prev, formData) => {
      const outcome = await raiseDispute({
        transaction,
        draft: draftFromFormData(formData, transaction),
        idempotencyKey: String(formData.get("idempotencyKey")),
      });
      switch (outcome.kind) {
        case "raised": return { status: "done", disputeId: outcome.disputeId };
        case "invalid": return { status: "error", message: messageFor("invalid"), issues: outcome.issues.map(i => i.code) };
        default: return { status: "error", message: messageFor(outcome.kind) };
      }
    },
    { status: "idle" },
  );

  return (
    <form action={submit}>
      <input type="hidden" name="idempotencyKey" defaultValue={/* generated once per form mount */ crypto.randomUUID()} />
      {/* fields… */}
      <button disabled={pending}>Submit</button>
      {state.status === "error" && <p role="alert">{state.message}</p>}
    </form>
  );
}
export {};
