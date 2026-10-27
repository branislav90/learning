// src/shared/telemetry/beaconTransport.ts
import type { LogEvent, Transport } from "./logger";

export function createBeaconTransport(opts: {
  endpoint: string;
  maxBatch?: number;          // events per request
  flushMs?: number;
  sampleRate: number;         // 0..1 for non-error events
  maxBytes?: number;          // stay under browser limits for keepalive/beacon (64 KiB limit for `sendBeacon` payloads per MDN; `fetch` `keepalive` has a similar in-flight body quota)
}): Transport {
  const maxBatch = opts.maxBatch ?? 20;
  const flushMs = opts.flushMs ?? 5000;
  const maxBytes = opts.maxBytes ?? 60_000;
  // Decide once per session so a session's logs are complete or absent (not random holes).
  const sessionSampled = Math.random() < opts.sampleRate;
  let buffer: LogEvent[] = [];
  let timer: number | undefined;

  function flush() {
    if (timer !== undefined) { clearTimeout(timer); timer = undefined; }
    if (buffer.length === 0) return;
    const batch = buffer; buffer = [];
    const body = JSON.stringify({ events: batch });
    if (body.length > maxBytes) {            // too big: drop oldest half rather than fail silently
      const half = batch.slice(Math.floor(batch.length / 2));
      buffer = []; send(JSON.stringify({ events: half }));
      return;
    }
    send(body);
  }

  function send(body: string) {
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (!navigator.sendBeacon?.(opts.endpoint, blob)) {
        void fetch(opts.endpoint, { method: "POST", body, keepalive: true,
          headers: { "content-type": "application/json" } }).catch(() => {});
      }
    } catch { /* telemetry must never throw into app code */ }
  }

  // Flush when the page is hidden: the last reliable moment on mobile and desktop.
  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  addEventListener("pagehide", flush);

  return {
    send(events) {
      for (const e of events) {
        const keep = e.level === "error" || e.level === "warn" || sessionSampled;
        if (!keep) continue;
        buffer.push(e);
      }
      if (buffer.length >= maxBatch) flush();
      else if (timer === undefined) timer = window.setTimeout(flush, flushMs);
    },
  };
}
