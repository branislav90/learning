type RowVM = {
  id: string;
  title: string;
  statusLabel: string;
  statusTone: "ok" | "warn" | "bad";
  canCancel: boolean;
};

function toRowVM(o: Order, now: number): RowVM {
  const late = isLate(o, now);             // domain rule from Lesson 02
  return {
    id: o.id,
    title: `#${o.number} · ${o.customer}`,
    statusLabel: o.cancelledAt ? "Cancelled" : late ? "Late" : o.shippedAt ? "Shipped" : "Processing",
    statusTone: o.cancelledAt ? "bad" : late ? "warn" : "ok",
    canCancel: !o.cancelledAt && !o.shippedAt,
  };
}

export function useOrderRows(orders: readonly Order[]): RowVM[] {
  // Evaluate "now" once per orders change, not per row; purity: Date.now() in render is
  // non-deterministic, so it's captured by a lazy state initialiser or passed from outside
  // in production code (see note).
  const [now] = useState(() => Date.now());
  return orders.map((o) => toRowVM(o, now));
}
export {};
