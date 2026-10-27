// orders/OrderCard.tsx
import { useState } from "react";
import { formatMoney } from "../shared/lib/format-money";
import { useCancelOrder, useOrder } from "./use-order";

export function OrderCard({ orderId }: { orderId: string }) {
  const { data: order, isPending, cancelVerdict, total } = useOrder(orderId);
  const cancel = useCancelOrder(orderId);
  const [confirming, setConfirming] = useState(false);          // interaction logic stays local

  if (isPending || !order || !cancelVerdict || !total) return <p>Loading…</p>;

  return (
    <article>
      <h2>Order {order.id}</h2>
      <p>{formatMoney(total, "en-GB")}</p>
      {cancelVerdict.allowed ? (
        <button onClick={() => setConfirming(true)}>Cancel order</button>
      ) : (
        <p>{cancelReasonCopy[cancelVerdict.reason]}</p>
      )}
      {confirming && (
        <ConfirmDialog
          onConfirm={() => cancel.mutate(undefined, { onSuccess: () => setConfirming(false) })}
          onClose={() => setConfirming(false)}
          pending={cancel.isPending}
          error={cancel.isError ? "Could not cancel the order." : undefined}
        />
      )}
    </article>
  );
}

const cancelReasonCopy = {
  "already-dispatched": "This order has been dispatched and can't be cancelled.",
  "already-cancelled": "This order is already cancelled.",
  "not-placed": "This order has not been placed yet.",
} as const;                                                    // presentation: copy lives in UI (and would be i18n'd)
export {};
