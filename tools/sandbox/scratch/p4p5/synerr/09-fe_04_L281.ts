// entities/transaction/ui/TransactionRow.tsx
import type { ReactNode } from "react";
import { formatMoney } from "@/shared/lib/format-money";
import type { Transaction } from "../model/types";

export function TransactionRow({ tx, actions }: { tx: Transaction; actions?: ReactNode }) {
  return (
    <tr>
      <td>{tx.merchantName}</td>
      <td>{formatMoney(tx.amountMinor, tx.currency)}</td>
      <td>{tx.status}</td>
      <td>{actions}</td>
    </tr>
  );
}
export {};
