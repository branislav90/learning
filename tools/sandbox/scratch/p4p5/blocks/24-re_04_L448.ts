// scripts/ratchet.ts — fail CI if deprecated usage increases
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const BASELINE_FILE = "ratchet-baseline.json";
const count = Number(
  execSync(`git grep -E "<Modal[^>]*\\bvisible=" -- "src/**/*.tsx" | wc -l`, { encoding: "utf8" }).trim()
);
const baseline: { modalVisible: number } = JSON.parse(readFileSync(BASELINE_FILE, "utf8"));

if (count > baseline.modalVisible) {
  console.error(`Deprecated <Modal visible> usages increased: ${baseline.modalVisible} -> ${count}`);
  process.exit(1);
}
if (count < baseline.modalVisible) {
  writeFileSync(BASELINE_FILE, JSON.stringify({ modalVisible: count }, null, 2) + "\n");
  console.log(`Ratchet lowered to ${count}. Commit the updated baseline.`);
}
export {};
