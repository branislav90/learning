// widgets/transactions-table/ui/TransactionsTable.tsx
import { useQuery } from "@tanstack/react-query";
import { getTransactions, TransactionRow } from "@/entities/transaction";
import { DisputeButton } from "@/features/dispute-transaction";

export function TransactionsTable({ from, to }: { from: string; to: string }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["transactions", from, to],
    queryFn: ({ signal }) => getTransactions({ from, to }, signal),
  });
  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">Could not load transactions.</p>;
  return (
    <table>
      <tbody>
        {data.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} actions={<DisputeButton tx={tx} />} />
        ))}
      </tbody>
    </table>
  );
}
export {};
