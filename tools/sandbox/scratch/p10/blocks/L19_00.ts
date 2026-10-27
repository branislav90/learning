// src/monitoring/report.ts — vendor-agnostic wrapper; swap internals for your error service SDK
interface ErrorReport {
  message: string; stack?: string; kind: 'uncaught' | 'caught' | 'unhandled-rejection' | 'recoverable';
  release: string; route: string; flags: Record<string, boolean>; ua: string; time: string;
}

const release = import.meta.env.VITE_BUILD_ID as string;     // ⚠ Vite-specific
let getFlags: () => Record<string, boolean> = () => ({});
export function registerFlagSnapshot(fn: () => Record<string, boolean>) { getFlags = fn; }

const sent = new Set<string>();                               // dedupe floods from loops
export function reportError(err: unknown, kind: ErrorReport['kind']) {
  const e = err instanceof Error ? err : new Error(String(err));
  const key = `${kind}:${e.message}:${e.stack?.split('\n')[1] ?? ''}`;
  if (sent.has(key) || sent.size > 50) return;                // cap per page load
  sent.add(key);
  const payload: ErrorReport = {
    message: e.message, stack: e.stack, kind, release,
    route: location.pathname, flags: getFlags(), ua: navigator.userAgent, time: new Date().toISOString(),
  };
  const body = JSON.stringify(payload);
  if (!navigator.sendBeacon?.('/api/client-errors', body)) {  // beacon survives page unload
    void fetch('/api/client-errors', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } });
  }
}

window.addEventListener('error', (ev) => reportError(ev.error ?? ev.message, 'uncaught'));
window.addEventListener('unhandledrejection', (ev) => reportError(ev.reason, 'unhandled-rejection'));
