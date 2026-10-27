import { ESLint } from "eslint";
import { expect, it } from "vitest";

const lint = async (code: string, filePath: string) => {
  const eslint = new ESLint({ cwd: process.cwd() });
  const [res] = await eslint.lintText(code, { filePath });
  return res.messages.filter((m) => m.ruleId === "no-restricted-imports");
};

it("domain cannot import react", async () => {
  expect(await lint(`import { useState } from "react"; export const a = useState;`, "src/domain/x.ts")).toHaveLength(1);
});
it("domain cannot import axios", async () => {
  expect(await lint(`import axios from "axios"; export default axios;`, "src/domain/y.ts")).toHaveLength(1);
});
it("domain can import other domain code", async () => {
  expect(await lint(`import { z } from "./z"; export default z;`, "src/domain/w.ts")).toHaveLength(0);
});
export {};
