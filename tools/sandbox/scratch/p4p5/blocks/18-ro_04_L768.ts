export function safeNext(next: string | null, fallback = "/"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  try {
    const u = new URL(next, "http://placeholder.invalid");   // parse relative to a dummy origin
    if (u.origin !== "http://placeholder.invalid") return fallback;
    return u.pathname + u.search + u.hash;
  } catch { return fallback; }
}
export {};
