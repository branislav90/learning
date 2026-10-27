import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

type Transaction = { id: string; merchant: string; amountMinor: number; currency: string };

export function TransactionList({ items }: { items: readonly Transaction[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
    getItemKey: (index) => items[index].id,
  });

  return (
    <div
      ref={parentRef}
      role="table"
      aria-label="Transactions"
      aria-rowcount={items.length}
      style={{ height: 480, overflow: "auto" }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((vi) => {
          const tx = items[vi.index];
          return (
            <div
              key={vi.key}
              role="row"
              aria-rowindex={vi.index + 1}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: vi.size,
                transform: `translateY(${vi.start}px)`,
              }}
            >
              <span role="cell">{tx.merchant}</span>
              <span role="cell">{formatMoney(tx.amountMinor, tx.currency)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatMoney(minor: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(minor / 100);
}

export const rx = (v: ReturnType<typeof useVirtualizer>) => v.scrollToIndex(1);
