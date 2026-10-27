import { describe, it, expect } from "vitest";
import { defaultRedact } from "./logger";

describe("defaultRedact", () => {
  it("redacts nested sensitive keys", () => {
    expect(defaultRedact({ user: { email: "a@b.c", id: 1 }, ok: true }))
      .toEqual({ user: { email: "[redacted]", id: 1 }, ok: true });
  });
});
