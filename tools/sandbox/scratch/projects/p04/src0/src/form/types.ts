// src/form/types.ts
export const STEPS = ["company", "vehicles", "billing", "review"] as const;
export type StepId = (typeof STEPS)[number];

export const MAX_VEHICLES = 10;

export type VehicleType = "truck" | "van" | "car";
export type PaymentMethod = "invoice" | "direct-debit";

/** Form values are what inputs produce: strings and booleans. */
export interface CompanyValues {
  name: string;
  registrationNumber: string;
  country: string; // "" until chosen
  contactEmail: string;
  phone: string;
}

export interface VehicleValues {
  id: string; // stable identity, created in the handler that adds the row
  registration: string;
  type: VehicleType | "";
  year: string;
  hasFuelCard: boolean;
  cardContactEmail: string;
}

export interface BillingValues {
  method: PaymentMethod | "";
  iban: string;
  sameAsCompany: boolean;
  billingAddress: string;
}

export interface FormValues {
  company: CompanyValues;
  vehicles: VehicleValues[];
  billing: BillingValues;
}

/** Map of field -> something, mirroring an entity's shape. */
export type FieldMap<T, V> = { [K in keyof T]?: V };
export type FieldChange<T> = { [K in keyof T]: { field: K; value: T[K] } }[keyof T];

export interface TouchedState {
  company: FieldMap<CompanyValues, true>;
  vehicles: Record<string, FieldMap<VehicleValues, true> | undefined>;
  billing: FieldMap<BillingValues, true>;
}

export interface ServerErrors {
  company: FieldMap<CompanyValues, string>;
  vehicles: Record<string, FieldMap<VehicleValues, string> | undefined>;
  billing: FieldMap<BillingValues, string>;
  form?: string; // non-field message
}

export type RegistrationCheck =
  | { status: "idle"; value: string }
  | { status: "checking"; value: string }
  | { status: "available"; value: string }
  | { status: "taken"; value: string }
  | { status: "error"; value: string }; // network failure: non-blocking

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "succeeded"; reference: string }
  | { status: "failed"; kind: "validation" | "network"; message: string };

export interface FormState {
  readonly step: StepId;
  readonly furthest: number;
  readonly values: FormValues;
  readonly touched: TouchedState;
  readonly serverErrors: ServerErrors;
  readonly attempted: Readonly<Record<StepId, boolean>>;
  readonly registration: RegistrationCheck;
  readonly submit: SubmitState;
  readonly idempotencyKey: string;
  readonly dirty: boolean;
}

export type FormAction =
  | ({ type: "company/changed" } & FieldChange<CompanyValues>)
  | ({ type: "billing/changed" } & FieldChange<BillingValues>)
  | ({ type: "vehicle/changed"; id: string } & FieldChange<VehicleValues>)
  | { type: "vehicle/added"; vehicle: VehicleValues }
  | { type: "vehicle/removed"; id: string }
  | { type: "company/blurred"; field: keyof CompanyValues }
  | { type: "billing/blurred"; field: keyof BillingValues }
  | { type: "vehicle/blurred"; id: string; field: keyof VehicleValues }
  | { type: "step/next" }
  | { type: "step/back" }
  | { type: "step/goto"; step: StepId }
  | { type: "step/blocked"; step: StepId }
  | { type: "registration/checking"; value: string }
  | { type: "registration/checked"; value: string; result: "available" | "taken" | "error" }
  | { type: "submit/started" }
  | { type: "submit/succeeded"; reference: string }
  | { type: "submit/failed"; kind: "validation" | "network"; message: string; serverErrors?: ServerErrors }
  | { type: "form/reset"; state: FormState };
