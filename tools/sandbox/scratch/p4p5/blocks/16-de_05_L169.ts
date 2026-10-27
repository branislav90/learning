// services/ports.ts — the interfaces components depend on
export type Clock = { now(): number };
export type KeyValueStore = { get(key: string): string | null; set(key: string, value: string): void };
export type Analytics = { track(event: string, props?: Record<string, unknown>): void };
export type CouponsApi = { apply(code: string, signal?: AbortSignal): Promise<{ ok: boolean }> };

export type Services = {
  readonly clock: Clock;
  readonly storage: KeyValueStore;
  readonly analytics: Analytics;
  readonly coupons: CouponsApi;
};
export {};
