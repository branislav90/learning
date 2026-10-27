import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventBus } from "@acme/portal-shell-api"; // hypothetical shell-provided hook package

export function useRefreshOnCardBlocked() {
  const bus = useEventBus();
  const qc = useQueryClient();
  useEffect(() => bus.on("card.blocked", () => qc.invalidateQueries({ queryKey: ["billing", "cards"] })), [bus, qc]);
}
export {};
