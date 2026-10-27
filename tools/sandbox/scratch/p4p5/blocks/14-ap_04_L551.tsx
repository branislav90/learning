// features/orders/ui/OrderList.tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { orderQueries } from "../api/queries";
import { isApiException } from "@/platform/http";

export function OrderList({ status }: { status?: "paid" | "pending" | "cancelled" }) {
  const q = useInfiniteQuery(orderQueries.list({ status }));

  if (q.isPending) return <p>Loading…</p>;
  if (q.isError) return <OrderListError error={q.error} onRetry={() => q.refetch()} />;

  return (
    <>
      <ul>
        {q.data.pages.flatMap((p) => p.items).map((o) => (
          <li key={o.id}>
            {o.id} — {formatMoney(o.total)} — {o.createdAt.toLocaleDateString()}
          </li>
        ))}
      </ul>
      {q.hasNextPage && <button onClick={() => q.fetchNextPage()} disabled={q.isFetchingNextPage}>More</button>}
    </>
  );
}

function OrderListError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  if (isApiException(error)) {
    switch (error.error.kind) {
      case "unauthenticated": return <p>Please sign in again.</p>;
      case "forbidden": return <p>You do not have access to orders.</p>;
      case "contract": return <p>Something went wrong (ref: {error.error.requestId ?? "n/a"}).</p>;
      default: return <button onClick={onRetry}>Retry</button>;
    }
  }
  return <button onClick={onRetry}>Retry</button>;
}
declare function formatMoney(m: { amountMinor: number; currency: string }): string;
export {};
