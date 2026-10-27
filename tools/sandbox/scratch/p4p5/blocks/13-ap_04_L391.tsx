// ui/use-raise-dispute.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useDisputes } from "./DisputesContext";          // provides DisputesModule (see lesson 11)
import { disputeKeys } from "../keys";
import type { RaiseDisputeInput } from "../application/raise-dispute";

export function useRaiseDispute() {
  const { raiseDispute } = useDisputes();
  const qc = useQueryClient();
  const keyRef = useRef<string>(crypto.randomUUID());      // one idempotency key per intent (per mounted form)

  return useMutation({
    mutationFn: async (input: Omit<RaiseDisputeInput, "idempotencyKey">) => {
      const outcome = await raiseDispute({ ...input, idempotencyKey: keyRef.current });
      if (outcome.kind === "unavailable" && outcome.retryable) throw new Error("unavailable");  // let the mutation library own retry/error UI if desired
      return outcome;                                     // other outcomes are values
    },
    onSuccess: (outcome, vars) => {
      if (outcome.kind === "raised") {
        qc.invalidateQueries({ queryKey: disputeKeys.all });
        qc.invalidateQueries({ queryKey: ["transactions", vars.transaction.id] });
        keyRef.current = crypto.randomUUID();              // intent completed: next submission is a new intent
      }
    },
  });
}
export {};
