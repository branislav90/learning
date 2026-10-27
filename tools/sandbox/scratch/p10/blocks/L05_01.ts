// src/shared/monitoring/globalHandlers.ts
import { reporter } from "./reporter";

export function installGlobalHandlers() {
  window.addEventListener("error", (event) => {
    // Resource load errors (img/script/link) arrive here only because we listen in the capture phase.
    if (event.target && event.target !== window && event.target instanceof HTMLElement) {
      const el = event.target as HTMLElement & { src?: string; href?: string };
      reporter.capture(new Error(`Resource failed: <${el.tagName.toLowerCase()}>`), {
        source: "resource",
        level: "warning",
        resource: sanitizeUrl(el.src ?? el.href ?? ""),
      });
      return;
    }
    reporter.capture(event.error ?? new Error(event.message || "Unknown error"), {
      source: "window.onerror",
      filename: event.filename ? sanitizeUrl(event.filename) : undefined,
    });
  }, { capture: true });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    reporter.capture(reason instanceof Error ? reason : new Error(`Unhandled rejection: ${safeStringify(reason)}`), {
      source: "unhandledrejection",
    });
  });
}

function sanitizeUrl(raw: string): string {
  try { const u = new URL(raw, location.href); return u.origin + u.pathname; }   // drop query/hash: may hold tokens/PII
  catch { return "[invalid-url]"; }
}
function safeStringify(v: unknown): string {
  try { return typeof v === "string" ? v : JSON.stringify(v)?.slice(0, 200) ?? String(v); }
  catch { return "[unserializable]"; }
}
