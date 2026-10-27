// src/form/draft.ts
import type { FormValues } from "./types";

const KEY = "fleet-onboarding:draft:v1";

/** Allow-list: what we are willing to write to disk. IBAN is deliberately absent. */
function toPersistable(values: FormValues): FormValues {
  return { ...values, billing: { ...values.billing, iban: "" } };
}

export function saveDraft(values: FormValues): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, values: toPersistable(values) }));
  } catch {
    /* best effort */
  }
}

export function clearDraft(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function loadDraft(): FormValues | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    const data: unknown = JSON.parse(raw);
    return isDraft(data) ? data.values : null;
  } catch {
    return null;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

const isString = (v: unknown): v is string => typeof v === "string";

function isVehicle(v: unknown): boolean {
  return (
    isRecord(v) &&
    isString(v.id) && v.id !== "" &&
    isString(v.registration) &&
    (v.type === "" || v.type === "truck" || v.type === "van" || v.type === "car") &&
    isString(v.year) &&
    typeof v.hasFuelCard === "boolean" &&
    isString(v.cardContactEmail)
  );
}

function isDraft(data: unknown): data is { v: 1; values: FormValues } {
  if (!isRecord(data) || data.v !== 1 || !isRecord(data.values)) return false;
  const { company, vehicles, billing } = data.values;
  if (!isRecord(company) || !isRecord(billing) || !Array.isArray(vehicles)) return false;
  if (!["name", "registrationNumber", "country", "contactEmail", "phone"].every((k) => isString(company[k]))) return false;
  if (!(isString(billing.method) && isString(billing.iban) && isString(billing.billingAddress) && typeof billing.sameAsCompany === "boolean")) return false;
  if (vehicles.length < 1 || vehicles.length > 10 || !vehicles.every(isVehicle)) return false; // invariant: 1..10 rows
  const ids = vehicles.map((x) => (x as { id: string }).id);
  return new Set(ids).size === ids.length; // unique ids, or the keys would collide
}
