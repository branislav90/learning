// features/transactions/ui/TransactionsPage.tsx
import { useTransactionsPage } from "../model/useTransactionsPage";
import { TransactionsTable } from "./TransactionsTable";

export function TransactionsPage({ accountId }: { accountId: string }) {
  const { rows, total, loading, error, selected, onToggle } = useTransactionsPage(accountId);
  if (loading) return <Spinner />;
  if (error) return <p>Error</p>;
  return (
    <div>
      <h2>Total selected: {total.toFixed(2)}</h2>
      <TransactionsTable rows={rows} selected={selected} onToggle={onToggle} />
    </div>
  );
}
export {};
