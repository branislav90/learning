// src/shared/monitoring/reporter.ts
import { BUILD_ID } from "@/shared/config/build";

type Level = "fatal" | "error" | "warning";
interface Extra { source: string; level?: Level; fatal?: boolean; [k: string]: unknown }

interface Breadcrumb { ts: number; category: "nav" | "click" | "http" | "log"; message: string }
const crumbs: Breadcrumb[] = [];
export function addBreadcrumb(b: Omit<Breadcrumb, "ts">) {
  crumbs.push({ ts: Date.now(), ...b });
  if (crumbs.length > 30) crumbs.shift();          // ring buffer: bounded memory
}

const seen = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000, MAX_PER_FINGERPRINT = 3, MAX_TOTAL = 30;
let total = 0;
setInterval(() => { seen.clear(); total = 0; }, WINDOW_MS);   // per-session client-side throttle

let context: { route?: string; sessionId: string } = { sessionId: crypto.randomUUID() };
export function setRouteContext(route: string) { context = { ...context, route }; }

export const reporter = {
  capture(error: unknown, extra: Extra) {
    try {
      const err = error instanceof Error ? error : new Error(String(error));
      if (isNoise(err)) return;

      const key = `${err.name}:${err.message}:${(err.stack ?? "").split("\n")[1] ?? ""}`;
      const entry = seen.get(key) ?? { count: 0, first: Date.now() };
      entry.count += 1; seen.set(key, entry);
      if (entry.count > MAX_PER_FINGERPRINT || ++total > MAX_TOTAL) return;

      const payload = {
        name: err.name,
        message: err.message.slice(0, 500),
        stack: err.stack?.slice(0, 8000),
        release: BUILD_ID,
        level: extra.level ?? (extra.fatal ? "fatal" : "error"),
        tags: { source: extra.source, route: context.route },
        session: context.sessionId,                         // random per-tab ID, not a user identity
        breadcrumbs: crumbs.slice(-20),
        extra: { ...extra, source: undefined, level: undefined },
      };
      const body = JSON.stringify(payload);
      if (!navigator.sendBeacon?.("/telemetry/errors", new Blob([body], { type: "application/json" }))) {
        void fetch("/telemetry/errors", { method: "POST", body, keepalive: true,
          headers: { "content-type": "application/json" } }).catch(() => {});
      }
    } catch { /* the reporter must never throw */ }
  },
};

const NOISE: RegExp[] = [
  /ResizeObserver loop (limit exceeded|completed with undelivered notifications)/i, // benign browser notification
  /^Script error\.?$/i,                                                             // opaque cross-origin; no actionable data
  /chrome-extension:\/\/|moz-extension:\/\/|safari-extension:\/\//i,                // extension code
];
function isNoise(err: Error): boolean {
  const hay = `${err.message}\n${err.stack ?? ""}`;
  return NOISE.some((re) => re.test(hay));
}
