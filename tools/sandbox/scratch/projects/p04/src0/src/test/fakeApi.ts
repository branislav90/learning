// src/test/fakeApi.ts
import type { ApplicationPayload, OnboardingApi, SubmitResult } from "../api/onboardingApi";

export interface Deferred<T> { promise: Promise<T>; resolve(v: T): void; reject(e: unknown): void }
export function deferred<T>(): Deferred<T> {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

export function createControllableApi() {
  const checks: { value: string; result: Deferred<boolean>; signal: AbortSignal }[] = [];
  const submits: { payload: ApplicationPayload; result: Deferred<SubmitResult> }[] = [];
  const api: OnboardingApi = {
    isRegistrationAvailable(value, signal) {
      const result = deferred<boolean>();
      checks.push({ value, result, signal });
      return result.promise;
    },
    submitApplication(payload) {
      const result = deferred<SubmitResult>();
      submits.push({ payload, result });
      return result.promise;
    },
  };
  return { api, checks, submits };
}
