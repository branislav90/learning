// src/form/reducer.test.ts
import { describe, expect, it } from "vitest";
import { formReducer } from "./reducer";
import { createInitialState, emptyVehicle } from "./initialState";
import type { FormState } from "./types";

const base = (): FormState => createInitialState();

describe("formReducer", () => {
  it("keystroke in one vehicle preserves identity of the other vehicles", () => {
    let s = base();
    const second = emptyVehicle();
    s = formReducer(s, { type: "vehicle/added", vehicle: second });
    const [first] = s.values.vehicles;
    const next = formReducer(s, { type: "vehicle/changed", id: second.id, field: "registration", value: "AB 123" });
    expect(next.values.vehicles[0]).toBe(first);
    expect(next.values.vehicles[1]).not.toBe(s.values.vehicles[1]);
  });

  it("enforces vehicle limits as invariants", () => {
    let s = base();
    expect(formReducer(s, { type: "vehicle/removed", id: s.values.vehicles[0]!.id })).toBe(s); // min 1
    for (let i = 0; i < 20; i++) s = formReducer(s, { type: "vehicle/added", vehicle: emptyVehicle() });
    expect(s.values.vehicles).toHaveLength(10); // max 10
  });

  it("refuses to leave an invalid step and reveals errors instead", () => {
    const s = formReducer(base(), { type: "step/next" });
    expect(s.step).toBe("company");
    expect(s.attempted.company).toBe(true);
  });

  it("refuses to skip ahead via goto", () => {
    expect(formReducer(base(), { type: "step/goto", step: "billing" }).step).toBe("company");
  });

  it("ignores stale registration results", () => {
    let s = base();
    s = formReducer(s, { type: "company/changed", field: "registrationNumber", value: "ABC1234" });
    const afterStale = formReducer(s, { type: "registration/checked", value: "ABC123", result: "taken" });
    expect(afterStale).toBe(s);
    const afterCurrent = formReducer(s, { type: "registration/checked", value: "ABC1234", result: "available" });
    expect(afterCurrent.registration).toEqual({ status: "available", value: "ABC1234" });
  });

  it("editing a field invalidates the previous async result", () => {
    let s = base();
    s = formReducer(s, { type: "company/changed", field: "registrationNumber", value: "ABC1234" });
    s = formReducer(s, { type: "registration/checked", value: "ABC1234", result: "available" });
    s = formReducer(s, { type: "company/changed", field: "registrationNumber", value: "ABC12345" });
    expect(s.registration.status).toBe("idle");
  });

  it("rejects a second submit/started while submitting", () => {
    const once = formReducer(base(), { type: "submit/started" });
    expect(formReducer(once, { type: "submit/started" })).toBe(once);
  });

  it("clears the server error for a field when that field is edited", () => {
    let s = base();
    s = formReducer(s, {
      type: "submit/failed", kind: "validation", message: "x",
      serverErrors: { company: { name: "Taken" }, vehicles: {}, billing: {} },
    });
    s = formReducer(s, { type: "company/changed", field: "name", value: "New" });
    expect(s.serverErrors.company.name).toBeUndefined();
  });
});
