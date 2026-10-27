// src/api/onboardingApi.ts
import type { ServerErrors } from "../form/types";

export interface ApplicationPayload {
  idempotencyKey: string;
  company: { name: string; registrationNumber: string; country: string; contactEmail: string; phone: string };
  vehicles: { registration: string; type: "truck" | "van" | "car"; year: number; fuelCardContactEmail: string | null }[];
  billing:
    | { method: "invoice"; address: string | null }
    | { method: "direct-debit"; iban: string; address: string | null };
}

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; kind: "validation"; message: string; serverErrors: ServerErrors };

export interface OnboardingApi {
  isRegistrationAvailable(value: string, signal: AbortSignal): Promise<boolean>;
  /** Throws on network failure; returns `ok:false` for business-rule rejections. */
  submitApplication(payload: ApplicationPayload, signal: AbortSignal): Promise<SubmitResult>;
}
