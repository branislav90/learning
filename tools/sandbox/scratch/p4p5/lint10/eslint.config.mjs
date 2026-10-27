import { defineConfig } from "eslint/config";
export default defineConfig(
  { files: ["src/shared/**/*.{ts,tsx}"], rules: { "no-restricted-imports": ["error", { patterns: [{ group: ["@/features/*","../features/*"], message: "shared no" }] }] } },
);
