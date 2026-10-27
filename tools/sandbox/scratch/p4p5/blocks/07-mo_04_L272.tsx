// modules/notifications/NotificationProvider.tsx
import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { Toast } from "./internal/Toast";
import type { NotificationInput, Notifier } from "./internal/types";

export const NotifierContext = createContext<Notifier | null>(null);

interface Item extends NotificationInput { readonly id: number }

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<readonly Item[]>([]);

  const notify = useCallback((input: NotificationInput) => {
    setItems((prev) => [...prev, { ...input, id: Date.now() + prev.length }]);
  }, []);

  const notifier = useMemo<Notifier>(() => ({ notify }), [notify]);

  return (
    <NotifierContext value={notifier}>
      {children}
      {items.map((i) => (
        <Toast key={i.id} item={i} onDone={() => setItems((p) => p.filter((x) => x.id !== i.id))} />
      ))}
    </NotifierContext>
  );
}
export {};
