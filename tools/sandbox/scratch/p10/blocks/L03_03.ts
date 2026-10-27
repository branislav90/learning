// src/shared/config/load.ts
import { ConfigSchema, type AppConfig } from "./schema";

export class ConfigError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "ConfigError";
  }
}

export async function loadConfig(url = "/config.json"): Promise<AppConfig> {
  let raw: unknown;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new ConfigError(`config.json responded ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("json")) {
      // SPA fallback returned index.html: a classic misdeploy
      throw new ConfigError(`config.json has unexpected content-type: ${contentType}`);
    }
    raw = await res.json();
  } catch (err) {
    if (err instanceof ConfigError) throw err;
    throw new ConfigError("Could not load config.json", err);
  }

  const parsed = ConfigSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ConfigError(`Invalid config: ${parsed.error.message}`);
  }
  return Object.freeze(parsed.data);
}
