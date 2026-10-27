async function fetchRaw(url: string): Promise<unknown> { /* as in loadConfig, throws ConfigError(kind) */ }

export async function loadConfigWithRetry(url = "/config.json") {
  let raw: unknown;
  try {
    raw = await fetchRaw(url);
  } catch (err) {
    if (!(err instanceof TypeError)) throw err;          // fetch network failures are TypeError
    await new Promise((r) => setTimeout(r, 500));
    raw = await fetchRaw(url);
  }
  const parsed = ConfigSchema.safeParse(raw);
  if (!parsed.success) throw new ConfigError(parsed.error.message); // never retried
  return Object.freeze(parsed.data);
}
