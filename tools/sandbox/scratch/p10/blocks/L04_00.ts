// src/shared/telemetry/logger.ts
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEvent {
  level: LogLevel;
  message: string;                 // stable, low-cardinality string: "checkout_failed", not "Order 123 failed"
  ts: number;                      // epoch ms
  context: Record<string, unknown>;
}

export interface Transport {
  send(events: LogEvent[]): void;
}

const ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export function createLogger(opts: {
  minLevel: LogLevel;
  base: Record<string, unknown>;     // buildId, env, appVersion...
  transport: Transport;
  redact?: (ctx: Record<string, unknown>) => Record<string, unknown>;
}) {
  const redact = opts.redact ?? defaultRedact;
  function log(level: LogLevel, message: string, ctx: Record<string, unknown> = {}) {
    if (ORDER[level] < ORDER[opts.minLevel]) return;
    opts.transport.send([
      { level, message, ts: Date.now(), context: redact({ ...opts.base, ...ctx }) },
    ]);
  }
  return {
    debug: (m: string, c?: Record<string, unknown>) => log("debug", m, c),
    info: (m: string, c?: Record<string, unknown>) => log("info", m, c),
    warn: (m: string, c?: Record<string, unknown>) => log("warn", m, c),
    error: (m: string, c?: Record<string, unknown>) => log("error", m, c),
    child: (extra: Record<string, unknown>) =>
      createLogger({ ...opts, base: { ...opts.base, ...extra } }),
  };
}

const SENSITIVE_KEY = /pass(word)?|token|secret|authorization|cookie|card|cvv|ssn|email|phone|iban/i;

export function defaultRedact(ctx: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(ctx)) {
    if (SENSITIVE_KEY.test(k)) out[k] = "[redacted]";
    else if (v && typeof v === "object" && !Array.isArray(v)) out[k] = defaultRedact(v as Record<string, unknown>);
    else out[k] = v;
  }
  return out;
}
