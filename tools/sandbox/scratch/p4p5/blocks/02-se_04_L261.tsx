// features/order/model/useOrderPage.ts  (orchestration: state + effect + calls into core)
import { useEffect, useMemo, useState } from "react";
import { getOrder } from "../api/getOrder";
import { calcTotals } from "./pricing";
import type { Order } from "./types";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; order: Order };

export function useOrderPage(orderId: string) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: "loading" });
    getOrder(orderId, ctrl.signal)
      .then((order) => setState({ status: "ready", order }))
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Unknown error" });
      });
    return () => ctrl.abort();
  }, [orderId]);

  const totals = useMemo(
    () => (state.status === "ready" ? calcTotals(state.order.lines, coupon) : null),
    [state, coupon],
  );

  return { state, totals, coupon, setCoupon };
}
export {};
