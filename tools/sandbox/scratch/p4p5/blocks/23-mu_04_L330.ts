import type { DomainEvents, EventName } from "./events";

type Handler<K extends EventName> = (payload: DomainEvents[K]) => void;

export function createEventBus() {
  const handlers = new Map<EventName, Set<Handler<EventName>>>();
  return {
    on<K extends EventName>(name: K, handler: Handler<K>): () => void {
      const set = handlers.get(name) ?? new Set();
      set.add(handler as Handler<EventName>);
      handlers.set(name, set);
      return () => set.delete(handler as Handler<EventName>);
    },
    emit<K extends EventName>(name: K, payload: DomainEvents[K]): void {
      handlers.get(name)?.forEach((h) => h(payload));
    },
  };
}
export type EventBus = ReturnType<typeof createEventBus>;
export {};
