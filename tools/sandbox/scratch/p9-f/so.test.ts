import { test, expect, vi } from "vitest";
test("server-only default import throws, mock works", async () => {
  await expect(import("./so/node_modules/server-only/index.js")).rejects.toThrow();
  vi.mock("server-only", () => ({}));
  const m = await import("server-only");
  console.log("mocked import ok", typeof m);
});
