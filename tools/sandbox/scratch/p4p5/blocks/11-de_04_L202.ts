// services/ports.ts   (consumer-owned abstractions)
export interface Clock { now(): Date }
export interface Analytics {
  track(event: string, props?: Record<string, string | number | boolean>): void;
}
export interface Services { clock: Clock; analytics: Analytics }
export {};
