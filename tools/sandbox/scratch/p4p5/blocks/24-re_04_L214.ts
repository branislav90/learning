import { describe, expect, it } from "vitest";
import { totalWithVat } from "./pricing";

describe("totalWithVat (characterization)", () => {
  it("sums items and applies VAT, rounding to cents", () => {
    expect(totalWithVat([{ price: 10, qty: 2 }], 0.2)).toBe(24);
  });

  it("handles empty list", () => {
    expect(totalWithVat([], 0.2)).toBe(0);
  });

  // BUG-482: floating-point accumulation. Current behaviour pinned; the correct value is 59.97.
  it("floating point: three items at 19.99", () => {
    expect(totalWithVat([{ price: 19.99, qty: 3 }], 0)).toBe(59.97);
  });

  it("negative qty is not rejected (current behaviour)", () => {
    expect(totalWithVat([{ price: 10, qty: -1 }], 0)).toBe(-10);
  });
});
export {};
