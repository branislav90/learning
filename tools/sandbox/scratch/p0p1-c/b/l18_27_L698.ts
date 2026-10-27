export {};
function parseJsonSafely(text: string): unknown {
  try { return JSON.parse(text); } catch { return undefined; }
}
function getString(obj: unknown, key: string): string | undefined {
  if (typeof obj !== "object" || obj === null) return undefined;
  const v = (obj as Record<string, unknown>)[key];   // contained cast: obj is a non-null object here
  return typeof v === "string" ? v : undefined;
}
