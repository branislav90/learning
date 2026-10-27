// store.ts
let value = 0;
const listeners = new Set<() => void>();
export const store = {
  get: () => value,
  set(next: number) { value = next; listeners.forEach((l) => l()); },
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
};

// ❌ Reads the store directly in render (no subscription, torn reads possible in sliced renders)
function RawView({ label }: { label: string }) {
  return <span>{label}: {store.get()}</span>;
}

// ✅ Tear-free
import { useSyncExternalStore } from "react";
function SafeView({ label }: { label: string }) {
  const v = useSyncExternalStore(store.subscribe, store.get);
  return <span>{label}: {v}</span>;
}
