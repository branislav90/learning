import { it, expect } from "vitest";
import * as rules from "../form/validation/rules";
import { validateVehicle } from "../form/validation/vehicle";
it("iban vectors", () => {
  console.log(Object.keys(rules));
  const f = (rules as any).isValidIban;
  expect(f("GB82 WEST 1234 5698 7654 32")).toBe(true);
  expect(f("DE89 3704 0044 0532 0130 00")).toBe(true);
  expect(f("gb82west12345698765432")).toBe(true);
  expect(f("GB82 WEST 1234 5698 7654 33")).toBe(false);
  expect(f("DE89 3704 0044 0532 0130 01")).toBe(false);
  expect(f("GB82 WEST 1234 5698 7654")).toBe(false);
});
it("vehicle year boundaries", () => {
  const cy = 2026;
  const base = { id: "1", registration: "AB123", type: "van", year: "2020", hasFuelCard: false, cardContactEmail: "" } as any;
  const y = (year: string) => validateVehicle({ ...base, year }, { currentYear: cy, isDuplicate: false }).year;
  console.log({ y1979: y("1979"), y1980: y("1980"), cur: y("2026"), next: y("2027"), after: y("2028"), dec: y("19.5"), abc: y("abc") });
});
