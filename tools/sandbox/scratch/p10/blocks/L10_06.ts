// src/shared/resilience/circuitBreaker.ts
type State = "closed" | "open" | "half-open";

export class CircuitBreaker {
  private state: State = "closed";
  private failures: number[] = [];       // timestamps in window
  private openedAt = 0;
  constructor(private opts: { failureThreshold: number; windowMs: number; coolDownMs: number }) {}

  async exec<T>(op: () => Promise<T>): Promise<T> {
    const now = Date.now();
    if (this.state === "open") {
      if (now - this.openedAt < this.opts.coolDownMs) throw new CircuitOpenError();
      this.state = "half-open";
    }
    try {
      const result = await op();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      throw err;
    }
  }

  private onSuccess() { this.failures = []; this.state = "closed"; }
  private onFailure(err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") return;   // user-initiated cancels are not failures
    const now = Date.now();
    this.failures = [...this.failures.filter((t) => now - t < this.opts.windowMs), now];
    if (this.state === "half-open" || this.failures.length >= this.opts.failureThreshold) {
      this.state = "open"; this.openedAt = now;
    }
  }
  get current(): State { return this.state; }
}
export class CircuitOpenError extends Error { constructor() { super("Circuit open"); this.name = "CircuitOpenError"; } }
