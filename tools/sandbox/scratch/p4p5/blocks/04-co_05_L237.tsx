import { useCallback, useEffect, useState } from "react";

type Order = { id: string; customer: string; total: number; shipped: boolean };

type OrdersState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; orders: Order[] };

export function useOrdersPage() {
  const [state, setState] = useState<OrdersState>({ status: "loading" });
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/orders", { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<Order[]>; })
      .then((orders) => setState({ status: "ready", orders }))
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Unknown error" });
      });
    return () => ctrl.abort();
  }, []);

  const markShipped = useCallback(async (id: string) => {
    setPendingId(id);
    try {
      const r = await fetch(`/api/orders/${id}/ship`, { method: "POST" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setState((s) =>
        s.status === "ready"
          ? { status: "ready", orders: s.orders.map((o) => (o.id === id ? { ...o, shipped: true } : o)) }
          : s,
      );
    } finally {
      setPendingId(null);
    }
  }, []);

  return { state, pendingId, markShipped } as const;
}
export {};
