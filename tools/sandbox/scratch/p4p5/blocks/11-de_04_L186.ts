// invoice-rules.test.ts
import { expect, it } from "vitest";
import { isOverdue } from "./invoice-rules";

it("is overdue after the due date", () => {
  const inv = { id: "i1", dueDate: new Date("2025-03-01T00:00:00Z"), paid: false };
  expect(isOverdue(inv, new Date("2025-03-02T00:00:00Z"))).toBe(true);
  expect(isOverdue(inv, new Date("2025-02-28T00:00:00Z"))).toBe(false);
});
export {};
