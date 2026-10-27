export function usePrice(symbol: string): number | undefined {
  return useSyncExternalStore(
    (cb) => priceHub.subscribe(symbol, cb),   // new function per render => resubscribe per render; see note
    () => priceHub.getLatest(symbol),
    () => undefined,
  );
}
export {};
