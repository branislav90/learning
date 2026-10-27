// platform/auth-session/refresh.ts
export function createRefresher(doRefresh: () => Promise<boolean>) {
  let inFlight: Promise<boolean> | null = null;
  return function refresh(): Promise<boolean> {
    inFlight ??= doRefresh().finally(() => { inFlight = null; });
    return inFlight;
  };
}
export {};
