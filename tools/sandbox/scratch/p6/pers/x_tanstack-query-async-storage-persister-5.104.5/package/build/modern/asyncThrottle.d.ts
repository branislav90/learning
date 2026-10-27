//#region src/asyncThrottle.d.ts
interface AsyncThrottleOptions {
  interval?: number;
  onError?: (error: unknown) => void;
}
/**
 * Wraps an async function so it runs at most once per `interval`, never concurrently, and with the
 * arguments of the latest call. Calls made while a run is scheduled only update those arguments.
 * @param func - The async function to throttle.
 * @param options - The `interval` between runs in milliseconds, and `onError`, called when `func`
 * rejects.
 * @returns The throttled function.
 * @throws {Error} If `func` is not a function.
 */
export declare function asyncThrottle<TArgs extends ReadonlyArray<unknown>>(func: (...args: TArgs) => Promise<void>, { interval, onError }?: AsyncThrottleOptions): (...args: TArgs) => Promise<void>;
//#endregion
//# sourceMappingURL=asyncThrottle.d.ts.map