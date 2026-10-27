type AppEvents = {
  "auth/signedOut": { reason: "user" | "expired" };
  "order/placed": { orderId: string };
};
type Handler<K extends keyof AppEvents> = (payload: AppEvents[K]) => void;
const handlers: { [K in keyof AppEvents]?: Set<Handler<K>> } = {};
export function on<K extends keyof AppEvents>(name: K, h: Handler<K>): () => void {
  const set = (handlers[name] ??= new Set() as Set<Handler<K>> as never) as Set<Handler<K>>;
  set.add(h);
  return () => set.delete(h);
}
export function t<K extends keyof AppEvents>(name: K, h: Handler<K>) {
  const bag = handlers as { [P in keyof AppEvents]?: Set<Handler<P>> } & Record<K, Set<Handler<K>> | undefined>;
  return bag;
}
