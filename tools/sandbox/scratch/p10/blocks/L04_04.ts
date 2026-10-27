// src/shared/http/tracedFetch.ts
function randomHex(bytes: number): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function createTracedFetch(opts: { apiOrigin: string; log: { info: (m: string, c?: Record<string, unknown>) => void } }) {
  return async function tracedFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const url = new URL(input, opts.apiOrigin);
    const sameApi = url.origin === opts.apiOrigin;            // never attach to third parties
    const traceId = randomHex(16);
    const headers = new Headers(init.headers);
    if (sameApi) {
      headers.set("traceparent", `00-${traceId}-${randomHex(8)}-01`);
      headers.set("x-request-id", traceId.slice(0, 16));
    }
    const started = performance.now();
    try {
      const res = await fetch(url, { ...init, headers });
      opts.log.info("http_request", {
        route: url.pathname.replace(/\d+/g, ":id"),            // low-cardinality route template, not raw IDs
        method: init.method ?? "GET",
        status: res.status,
        durationMs: Math.round(performance.now() - started),
        traceId,
      });
      return res;
    } catch (err) {
      opts.log.info("http_network_error", { route: url.pathname.replace(/\d+/g, ":id"), traceId,
        durationMs: Math.round(performance.now() - started) });
      throw err;
    }
  };
}
