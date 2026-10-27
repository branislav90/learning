// src/form/initialState.ts
import type { FormState, VehicleValues } from "./types";

export function emptyVehicle(): VehicleValues {
  return {
    id: crypto.randomUUID(),
    registration: "",
    type: "",
    year: "",
    hasFuelCard: false,
    cardContactEmail: "",
  };
}

export function createInitialState(): FormState {
  return {
    step: "company",
    furthest: 0,
    values: {
      company: { name: "", registrationNumber: "", country: "", contactEmail: "", phone: "" },
      vehicles: [emptyVehicle()],
      billing: { method: "", iban: "", sameAsCompany: true, billingAddress: "" },
    },
    touched: { company: {}, vehicles: {}, billing: {} },
    serverErrors: { company: {}, vehicles: {}, billing: {} },
    attempted: { company: false, vehicles: false, billing: false, review: false },
    registration: { status: "idle", value: "" },
    submit: { status: "idle" },
    idempotencyKey: crypto.randomUUID(),
    dirty: false,
  };
}
