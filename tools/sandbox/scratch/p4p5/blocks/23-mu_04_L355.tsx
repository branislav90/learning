import { createContext, use, useMemo, type ReactNode } from "react";
import { createEventBus, type EventBus } from "@acme/contracts";

const EventBusContext = createContext<EventBus | null>(null);

export function EventBusProvider({ children }: { children: ReactNode }) {
  const bus = useMemo(() => createEventBus(), []);
  return <EventBusContext value={bus}>{children}</EventBusContext>;
}

export function useEventBus(): EventBus {
  const bus = use(EventBusContext);
  if (!bus) throw new Error("useEventBus must be used inside <EventBusProvider>");
  return bus;
}
export {};
