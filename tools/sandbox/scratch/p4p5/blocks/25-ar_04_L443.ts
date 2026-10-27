// scripts/check-bundle-budget.ts
import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const dist = "dist/assets";
const BUDGET_BYTES = 180 * 1024; // initial JS budget, gzip; set from your own measured baseline
const entry = readdirSync(dist).find((f) => /^index-.*\.js$/.test(f));
if (!entry) throw new Error("entry chunk not found; check the build output naming");

const gz = gzipSync(readFileSync(join(dist, entry))).length;
console.log(`entry ${entry}: ${(gz / 1024).toFixed(1)} kB gzip (budget ${(BUDGET_BYTES / 1024).toFixed(0)} kB)`);
if (gz > BUDGET_BYTES) {
  console.error("Initial bundle exceeds budget. See lesson Phase 7 / 16 for investigating.");
  process.exit(1);
}
export {};
