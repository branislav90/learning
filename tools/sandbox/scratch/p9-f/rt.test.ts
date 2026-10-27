import { test, vi } from "vitest";
export function safeReturnTo(raw: string | null, base = "https://app.example.com"): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/";
  try {
    const u = new URL(raw, base);
    if (u.origin !== new URL(base).origin) return "/";
    const out = u.pathname + u.search + u.hash;
    return out.startsWith("//") ? "/" : out;   // normalisation can turn "/..//evil.com" into "//evil.com"
  } catch { return "/"; }
}
test("rt", () => {
  for (const x of ["/dashboard?a=1#x","//evil.com","/\\evil.com","https://evil.com","javascript:alert(1)","/\t/evil.com","/%09/evil.com","/\n/evil.com","///evil.com","/ /evil.com"," //evil.com","/..//evil.com"]) console.log(JSON.stringify(x),"=>",JSON.stringify(safeReturnTo(x)));
});
