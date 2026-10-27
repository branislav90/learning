// modules/notifications/useNotify.ts
import { use } from "react";
import { NotifierContext } from "./NotificationProvider";
import type { Notifier } from "./internal/types";

export function useNotify(): Notifier {
  const n = use(NotifierContext);
  if (!n) throw new Error("useNotify must be used inside <NotificationProvider> (module: notifications)");
  return n;
}
export {};
