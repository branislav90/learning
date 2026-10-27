// Post-login redirect: only same-origin relative paths
export function safeRedirectTarget(next: string | null): string {
  if (!next) return "/";
  try {
    const u = new URL(next, window.location.origin);
    if (u.origin !== window.location.origin) return "/";
    return u.pathname + u.search + u.hash;               // normalized, same-origin only
  } catch { return "/"; }
}
