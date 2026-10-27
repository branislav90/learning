// core/use-cases/raise-dispute.ts   (violations)
import axios from "axios";                         // framework in the core
import { toast } from "react-hot-toast";           // UI in the core
import { useQueryClient } from "@tanstack/react-query"; // hook in a non-component

export async function raiseDispute(txId: string, draft: Draft) {
  const res = await axios.post(`/api/tx/${txId}/disputes`, draft);   // DTO = domain
  toast.success("Dispute raised");
  return res.data;                                  // wire type escapes
}
export {};
