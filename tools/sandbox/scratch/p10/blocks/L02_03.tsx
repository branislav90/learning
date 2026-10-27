import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "chunk-reload-at";

function isChunkLoadError(err: unknown): boolean {
  // Messages differ per browser/bundler: verify against the browsers you support.
  const msg = err instanceof Error ? err.message : String(err);
  return (
    /Failed to fetch dynamically imported module/i.test(msg) || // Chromium, Safari variants
    /error loading dynamically imported module/i.test(msg) ||    // Firefox
    /Importing a module script failed/i.test(msg) ||             // Safari
    /Loading chunk [\w-]+ failed/i.test(msg)                     // webpack
  );
}

export function lazyWithRecovery<T extends ComponentType<any>>(
  load: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      return await load();
    } catch (err) {
      if (!isChunkLoadError(err)) throw err;

      // At most one automatic reload per 30 seconds to avoid reload loops.
      let last = 0;
      try { last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0); } catch { /* storage may throw */ }
      if (Date.now() - last > 30_000) {
        try { sessionStorage.setItem(RELOAD_KEY, String(Date.now())); } catch { /* ignore */ }
        window.location.reload();
        return new Promise<never>(() => {});  // never resolves; the page is going away
      }
      throw err;   // second failure: let an error boundary show a "reload" UI
    }
  });
}
