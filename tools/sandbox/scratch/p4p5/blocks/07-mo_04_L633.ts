import { useEffect } from "react";
import type { OrderEvents } from "@acme/orders/events";   // separate public entry for types
import type { EventBus } from "@acme/platform-events";

export function useOrderEvent<K extends keyof OrderEvents>(
  bus: EventBus<OrderEvents>, type: K, handler: (p: OrderEvents[K]) => void,
) {
  useEffect(() => bus.on(type, handler), [bus, type, handler]);   // handler should be stable (useCallback)
}
export {};
