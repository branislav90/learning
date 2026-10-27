// packages/platform-events/src/index.ts
export type Unsubscribe = () => void;

export interface EventBus<E extends Record<string, unknown>> {
  emit<K extends keyof E>(type: K, payload: E[K]): void;
  on<K extends keyof E>(type: K, handler: (payload: E[K]) => void): Unsubscribe;
}

export function createEventBus<E extends Record<string, unknown>>(): EventBus<E> {
  const handlers = new Map<keyof E, Set<(p: never) => void>>();
  return {
    emit(type, payload) {
      handlers.get(type)?.forEach((h) => (h as (p: typeof payload) => void)(payload));
    },
    on(type, handler) {
      const set = handlers.get(type) ?? new Set();
      set.add(handler as (p: never) => void);
      handlers.set(type, set);
      return () => set.delete(handler as (p: never) => void);
    },
  };
}
export {};
