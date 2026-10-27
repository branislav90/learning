// shared/toasts/toastStore.ts  (owner: application "notifications" module)
import { useSyncExternalStore } from "react";

export type Toast = { id: string; kind: "info" | "error"; message: string };

let toasts: readonly Toast[] = [];                     // private: no export
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); }
const getSnapshot = () => toasts;                       // stable until we reassign
const getServerSnapshot = () => [] as readonly Toast[]; // ⚠ constant reference for SSR

export const toast = {                                  // commands: the ONLY write API
  show(kind: Toast["kind"], message: string) {
    toasts = [...toasts, { id: crypto.randomUUID(), kind, message }];
    emit();
  },
  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
};

export function useToasts(): readonly Toast[] {         // read API
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
export {};
