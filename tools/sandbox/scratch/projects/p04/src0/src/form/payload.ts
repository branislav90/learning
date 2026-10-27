// src/form/payload.ts
import type { ApplicationPayload } from "../api/onboardingApi";
import type { FormValues } from "./types";

export function toPayload(values: FormValues, idempotencyKey: string): ApplicationPayload {
  const { company, vehicles, billing } = values;
  const address = billing.sameAsCompany ? null : billing.billingAddress.trim();
  return {
    idempotencyKey,
    company: {
      name: company.name.trim(),
      registrationNumber: company.registrationNumber.trim().toUpperCase(),
      country: company.country,
      contactEmail: company.contactEmail.trim(),
      phone: company.phone.trim(),
    },
    vehicles: vehicles.map((v) => {
      if (v.type === "") throw new Error("invariant: vehicle type validated before toPayload");
      return {
        registration: v.registration.replace(/\s+/g, "").toUpperCase(),
        type: v.type,
        year: Number(v.year),
        fuelCardContactEmail: v.hasFuelCard ? v.cardContactEmail.trim() : null,
      };
    }),
    billing:
      billing.method === "direct-debit"
        ? { method: "direct-debit", iban: billing.iban.replace(/\s+/g, "").toUpperCase(), address }
        : { method: "invoice", address },
  };
}
