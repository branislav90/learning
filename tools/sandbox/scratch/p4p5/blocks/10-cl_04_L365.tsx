// adapters/react/use-raise-dispute.ts
import { useMutation } from "@tanstack/react-query";
import { useDisputesApp } from "./DisputeAppContext";
import type { DisputeDraft } from "../../core/domain/dispute-draft";

export function useRaiseDispute(transactionId: string) {
  const { raiseDispute } = useDisputesApp();
  return useMutation({
    mutationFn: (draft: DisputeDraft) => raiseDispute(transactionId, draft),
  });
}
export {};
