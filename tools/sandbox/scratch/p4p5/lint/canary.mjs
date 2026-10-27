import { ESLint } from "eslint";
const eslint = new ESLint({ cwd: process.cwd() });
let [r] = await eslint.lintText(`import { x } from "@/features/cards"; export const y = x;`, { filePath: "src/shared/ui/fake.ts" });
console.log(r.messages.map(m=>m.ruleId));
[r] = await eslint.lintText(`import { z } from "@/shared/lib/z"; export const y = z;`, { filePath: "src/shared/ui/fake.ts" });
console.log(r.messages.map(m=>m.ruleId));
