// src/api/fakeOnboardingApi.ts (excerpt)
import type { OnboardingApi } from "./onboardingApi";

const TAKEN = new Set(["TAKEN123", "ACME0001"]);

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { clearTimeout(t); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
  });
}

export function createFakeOnboardingApi({ latency = 400 } = {}): OnboardingApi {
  const seenKeys = new Map<string, string>(); // idempotency: key -> reference
  return {
    async isRegistrationAvailable(value, signal) {
      await delay(latency + Math.random() * 600, signal); // random latency provokes out-of-order responses
      return !TAKEN.has(value.toUpperCase());
    },
    async submitApplication(payload, signal) {
      await delay(latency, signal);
      const existing = seenKeys.get(payload.idempotencyKey);
      if (existing) return { ok: true, reference: existing };
      if (TAKEN.has(payload.company.registrationNumber)) {
        return {
          ok: false, kind: "validation", message: "Some answers need attention.",
          serverErrors: { company: { registrationNumber: "This registration number was just registered." }, vehicles: {}, billing: {} },
        };
      }
      const reference = `FA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      seenKeys.set(payload.idempotencyKey, reference);
      return { ok: true, reference };
    },
  };
}
