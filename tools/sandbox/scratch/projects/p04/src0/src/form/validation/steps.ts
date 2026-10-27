// src/form/validation/steps.ts
import type { FormValues, RegistrationCheck, StepId } from "../types";
import { validateCompany } from "./company";
import { validateBilling } from "./billing";
import { findDuplicatePlateIds, validateVehicle } from "./vehicle";

export interface SummaryItem {
  path: string; // e.g. "company.name" or "vehicles.<id>.registration"
  message: string;
  step: StepId;
}

export const CURRENT_YEAR = new Date().getFullYear();

export function collectStepErrors(
  values: FormValues,
  step: StepId,
  registration: RegistrationCheck,
  currentYear: number = CURRENT_YEAR,
): SummaryItem[] {
  const items: SummaryItem[] = [];
  const push = (path: string, message: string | undefined) => {
    if (message !== undefined) items.push({ path, message, step });
  };

  if (step === "company") {
    const errors = validateCompany(values.company);
    for (const [field, message] of Object.entries(errors)) push(`company.${field}`, message);

    if (errors.registrationNumber === undefined) {
      const current = registration.value === values.company.registrationNumber;
      if (current && registration.status === "taken") {
        push("company.registrationNumber", "This registration number is already registered.");
      } else if (!current || registration.status === "idle" || registration.status === "checking") {
        push("company.registrationNumber", "Still verifying the registration number. Try again in a moment.");
      }
      // "available" and "error" (network) do not block.
    }
  }

  if (step === "vehicles") {
    const dupes = findDuplicatePlateIds(values.vehicles);
    values.vehicles.forEach((v, index) => {
      const errors = validateVehicle(v, { currentYear, isDuplicate: dupes.has(v.id) });
      for (const [field, message] of Object.entries(errors)) {
        push(`vehicles.${v.id}.${field}`, `Vehicle ${index + 1}: ${message}`);
      }
    });
  }

  if (step === "billing") {
    const errors = validateBilling(values.billing);
    for (const [field, message] of Object.entries(errors)) push(`billing.${field}`, message);
  }
  return items;
}

/** The first step (in order) that currently has errors, or null. */
export function firstInvalidStep(
  values: FormValues,
  registration: RegistrationCheck,
): StepId | null {
  for (const step of ["company", "vehicles", "billing"] as const) {
    if (collectStepErrors(values, step, registration).length > 0) return step;
  }
  return null;
}
