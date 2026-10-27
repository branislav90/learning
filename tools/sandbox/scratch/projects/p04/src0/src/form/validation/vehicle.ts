// src/form/validation/vehicle.ts
import type { FieldMap, VehicleValues } from "../types";
import { EMAIL_RE, firstError, matches, required } from "./rules";

export type Errors<T> = FieldMap<T, string>;

export const normalizePlate = (s: string) => s.replace(/\s+/g, "").toUpperCase();

export function validateVehicle(
  v: VehicleValues,
  { currentYear, isDuplicate }: { currentYear: number; isDuplicate: boolean },
): Errors<VehicleValues> {
  const errors: Errors<VehicleValues> = {};

  errors.registration = isDuplicate
    ? "This plate is already in the list."
    : firstError(
        v.registration,
        required("Enter the registration plate."),
        matches(/^[A-Za-z0-9 -]{2,12}$/, "Use 2 to 12 letters, digits, spaces or hyphens."),
      );

  if (v.type === "") errors.type = "Choose a vehicle type.";

  const year = Number(v.year);
  if (v.year.trim() === "") errors.year = "Enter the year of first registration.";
  else if (!Number.isInteger(year) || year < 1980 || year > currentYear) {
    errors.year = `Enter a year between 1980 and ${currentYear}.`;
  }

  if (v.hasFuelCard) {
    errors.cardContactEmail = firstError(
      v.cardContactEmail,
      required("Enter an email for the fuel card."),
      matches(EMAIL_RE, "Enter a valid email address."),
    );
  }
  return stripUndefined(errors);
}

export function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/** Cross-row rule, computed once per render by the parent. */
export function findDuplicatePlateIds(vehicles: readonly VehicleValues[]): ReadonlySet<string> {
  const byPlate = new Map<string, string[]>();
  for (const v of vehicles) {
    const key = normalizePlate(v.registration);
    if (key === "") continue;
    byPlate.set(key, [...(byPlate.get(key) ?? []), v.id]);
  }
  const dupes = new Set<string>();
  for (const ids of byPlate.values()) if (ids.length > 1) ids.forEach((id) => dupes.add(id));
  return dupes;
}
