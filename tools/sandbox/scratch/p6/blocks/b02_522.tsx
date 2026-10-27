let refreshInFlight: Promise<string> | null = null;
export function refreshToken(): Promise<string> {
  refreshInFlight ??= doRefresh().finally(() => { refreshInFlight = null; });
  return refreshInFlight;
}
export {};
