let inFlight: Promise<string> | null = null;

export function refreshToken(doRefresh: () => Promise<string>): Promise<string> {
  inFlight ??= doRefresh().finally(() => { inFlight = null; });
  return inFlight;
}
export {};
