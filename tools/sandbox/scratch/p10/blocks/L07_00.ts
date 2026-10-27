// scripts/check-new-deps.ts  — a lightweight guard run on PRs (conceptual)
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

type Pkg = { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };

const base = JSON.parse(execSync("git show origin/main:package.json", { encoding: "utf8" })) as Pkg;
const head = JSON.parse(readFileSync("package.json", "utf8")) as Pkg;

const names = (p: Pkg) => new Set([...Object.keys(p.dependencies ?? {}), ...Object.keys(p.devDependencies ?? {})]);
const added = [...names(head)].filter((n) => !names(base).has(n));

const violations: string[] = [];
for (const name of added) {
  const spec = { ...head.dependencies, ...head.devDependencies }[name]!;
  if (/^(\*|latest|x)$/.test(spec)) violations.push(`${name}: unbounded range "${spec}"`);
  if (/^(git|github:|https?:)/.test(spec)) violations.push(`${name}: non-registry source "${spec}"`);
}
if (added.length) console.log("New dependencies requiring review:", added.join(", "));
if (violations.length) { console.error(violations.join("\n")); process.exit(1); }
