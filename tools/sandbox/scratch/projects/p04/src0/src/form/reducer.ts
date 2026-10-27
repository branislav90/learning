// src/form/reducer.ts
import {
  STEPS, MAX_VEHICLES,
  type FieldChange, type FormAction, type FormState, type StepId,
} from "./types";
import { collectStepErrors } from "./validation/steps";

function setField<T extends object>(obj: T, change: FieldChange<T>): T {
  return { ...obj, [change.field]: change.value };
}

function omit<V>(record: Record<string, V>, key: string): Record<string, V> {
  const { [key]: _removed, ...rest } = record;
  return rest;
}

/** Remove one key from a FieldMap, returning the same object if absent. */
function withoutKey<T extends object>(map: T, key: keyof T): T {
  if (!(key in map)) return map;
  const { [key]: _removed, ...rest } = map;
  return rest as T;
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "company/changed": {
      const { field, value } = action;
      if (state.values.company[field] === value) return state; // no actual change
      const company = setField(state.values.company, action);
      return {
        ...state,
        dirty: true,
        values: { ...state.values, company },
        serverErrors: {
          ...state.serverErrors,
          company: withoutKey(state.serverErrors.company, field), // editing clears that field's server error
        },
        // A changed registration number invalidates the previous async result.
        registration:
          field === "registrationNumber"
            ? { status: "idle", value: String(value) }
            : state.registration,
        submit: state.submit.status === "failed" ? { status: "idle" } : state.submit,
      };
    }

    case "billing/changed": {
      return {
        ...state,
        dirty: true,
        values: { ...state.values, billing: setField(state.values.billing, action) },
        serverErrors: {
          ...state.serverErrors,
          billing: withoutKey(state.serverErrors.billing, action.field),
        },
        submit: state.submit.status === "failed" ? { status: "idle" } : state.submit,
      };
    }

    case "vehicle/changed": {
      let found = false;
      const vehicles = state.values.vehicles.map((v) => {
        if (v.id !== action.id) return v; // identity preserved for every other row
        found = true;
        return setField(v, action);
      });
      if (!found) return state;
      const rowServer = state.serverErrors.vehicles[action.id];
      return {
        ...state,
        dirty: true,
        values: { ...state.values, vehicles },
        serverErrors: rowServer
          ? {
              ...state.serverErrors,
              vehicles: { ...state.serverErrors.vehicles, [action.id]: withoutKey(rowServer, action.field) },
            }
          : state.serverErrors,
      };
    }

    case "vehicle/added": {
      if (state.values.vehicles.length >= MAX_VEHICLES) return state;
      return {
        ...state,
        dirty: true,
        values: { ...state.values, vehicles: [...state.values.vehicles, action.vehicle] },
      };
    }

    case "vehicle/removed": {
      if (state.values.vehicles.length <= 1) return state; // invariant: at least one
      return {
        ...state,
        dirty: true,
        values: { ...state.values, vehicles: state.values.vehicles.filter((v) => v.id !== action.id) },
        touched: { ...state.touched, vehicles: omit(state.touched.vehicles, action.id) },
        serverErrors: { ...state.serverErrors, vehicles: omit(state.serverErrors.vehicles, action.id) },
      };
    }

    case "company/blurred":
      if (state.touched.company[action.field]) return state;
      return { ...state, touched: { ...state.touched, company: { ...state.touched.company, [action.field]: true } } };

    case "billing/blurred":
      if (state.touched.billing[action.field]) return state;
      return { ...state, touched: { ...state.touched, billing: { ...state.touched.billing, [action.field]: true } } };

    case "vehicle/blurred": {
      const row = state.touched.vehicles[action.id];
      if (row?.[action.field]) return state;
      return {
        ...state,
        touched: {
          ...state.touched,
          vehicles: { ...state.touched.vehicles, [action.id]: { ...row, [action.field]: true } },
        },
      };
    }

    case "step/next": {
      const items = collectStepErrors(state.values, state.step, state.registration);
      if (items.length > 0) {
        return { ...state, attempted: { ...state.attempted, [state.step]: true } };
      }
      const nextIndex = Math.min(STEPS.indexOf(state.step) + 1, STEPS.length - 1);
      return {
        ...state,
        step: STEPS[nextIndex] ?? state.step,
        furthest: Math.max(state.furthest, nextIndex),
      };
    }

    case "step/back": {
      const prev = Math.max(STEPS.indexOf(state.step) - 1, 0);
      return { ...state, step: STEPS[prev] ?? state.step };
    }

    case "step/goto": {
      const target = STEPS.indexOf(action.step);
      if (target > state.furthest) return state; // F5: cannot skip ahead
      return { ...state, step: action.step };
    }

    case "step/blocked":
      return {
        ...state,
        step: action.step,
        attempted: { ...state.attempted, [action.step]: true },
      };

    case "registration/checking": {
      if (action.value !== state.values.company.registrationNumber) return state; // stale
      return { ...state, registration: { status: "checking", value: action.value } };
    }

    case "registration/checked": {
      // The invariant that makes out-of-order responses harmless:
      if (action.value !== state.values.company.registrationNumber) return state;
      return { ...state, registration: { status: action.result, value: action.value } };
    }

    case "submit/started": {
      if (state.submit.status === "submitting" || state.submit.status === "succeeded") return state; // F11, defense in depth
      return { ...state, submit: { status: "submitting" } };
    }

    case "submit/succeeded":
      return { ...state, submit: { status: "succeeded", reference: action.reference }, dirty: false };

    case "submit/failed": {
      const serverErrors = action.serverErrors ?? state.serverErrors;
      return {
        ...state,
        serverErrors,
        submit: { status: "failed", kind: action.kind, message: action.message },
      };
    }

    case "form/reset":
      return action.state;

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export type { StepId };
