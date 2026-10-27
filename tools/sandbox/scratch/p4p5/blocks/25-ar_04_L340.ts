import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

describe("architecture lint rules (canaries)", () => {
  it("flags shared -> feature imports", async () => {
    const eslint = new ESLint({ cwd: process.cwd() });
    const [result] = await eslint.lintText(
      `import { x } from "@/features/cards"; export const y = x;`,
      { filePath: "src/shared/ui/fake.ts" } // path decides which config block applies
    );
    const ids = result.messages.map((m) => m.ruleId);
    expect(ids).toContain("no-restricted-imports");
  });

  it("allows shared -> shared imports", async () => {
    const eslint = new ESLint({ cwd: process.cwd() });
    const [result] = await eslint.lintText(
      `import { z } from "@/shared/lib/z"; export const y = z;`,
      { filePath: "src/shared/ui/fake.ts" }
    );
    expect(result.messages.filter((m) => m.ruleId === "no-restricted-imports")).toHaveLength(0);
  });
});
export {};
