// features/dispute-transaction/ui/DisputeButton.tsx
import { useState } from "react";
import type { Transaction } from "@/entities/transaction";
import { Button } from "@/shared/ui";
import { DisputeDialog } from "./DisputeDialog";

export function DisputeButton({ tx }: { tx: Transaction }) {
  const [open, setOpen] = useState(false);
  if (tx.status === "disputed") return null;           // simple rule; richer rules → model/ segment
  return (
    <>
      <Button onClick={() => setOpen(true)}>Dispute</Button>
      {open && <DisputeDialog tx={tx} onClose={() => setOpen(false)} />}
    </>
  );
}
export {};
