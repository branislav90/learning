// scripts/fan-in.ts — run with: npx tsx scripts/fan-in.ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";

const root = resolve("src");
const fanIn = new Map<string, number>();

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|jsx?)$/.test(p) ? [p] : [];
  });
}

const importRe = /from\s+["'](\.{1,2}\/[^"']+)["']/g; // relative imports only (teaching simplification)

for (const file of walk(root)) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(importRe)) {
    const target = resolve(dirname(file), m[1]);
    fanIn.set(target, (fanIn.get(target) ?? 0) + 1);
  }
}

[...fanIn.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .forEach(([p, n]) => console.log(String(n).padStart(4), p.replace(root, "src")));
export {};
