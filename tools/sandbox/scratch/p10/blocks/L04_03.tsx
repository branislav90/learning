import { useCallback } from "react";
import { useLogger } from "@/shared/telemetry/LoggerContext";

function CheckoutForm({ order }: { order: Order }) {
  const log = useLogger().child({ feature: "checkout" });

  const submit = useCallback(async () => {
    const started = performance.now();
    try {
      const res = await api.post("/orders", order);
      log.info("order_submitted", { durationMs: Math.round(performance.now() - started), itemCount: order.items.length });
      return res;
    } catch (err) {
      log.error("order_submit_failed", {
        durationMs: Math.round(performance.now() - started),
        errorName: err instanceof Error ? err.name : "unknown",
        status: err instanceof HttpError ? err.status : undefined,
      });
      throw err;                       // let UI/boundary handle it; logging is not handling
    }
  }, [log, order]);
  // ...
}
