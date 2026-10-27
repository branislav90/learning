// scripts/hotspots.ts — run with tsx: churn from git history, size as complexity proxy
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const since = process.argv[2] ?? '12 months ago';
const log = execSync(
  `git log --since="${since}" --name-only --pretty=format: -- "src/**/*.ts" "src/**/*.tsx"`,
  { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
);

const churn = new Map<string, number>();
for (const file of log.split('\n').filter(Boolean)) churn.set(file, (churn.get(file) ?? 0) + 1);

const rows = [...churn.entries()]
  .filter(([f]) => existsSync(f))                      // skip deleted/renamed files
  .map(([file, changes]) => {
    const loc = readFileSync(file, 'utf8').split('\n').length;
    return { file, changes, loc, score: changes * Math.log2(loc + 1) };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 15);

console.table(rows);
