import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const BASELINE = 'type-escapes.baseline.json';
const count = (pattern: string) => {
  const out = execSync(`git grep -E -c "${pattern}" -- "src/**/*.ts" "src/**/*.tsx" || true`, { encoding: 'utf8' });
  return out.split('\n').filter(Boolean).reduce((n, line) => n + Number(line.split(':').pop()), 0);
};

const current = { tsIgnore: count('@ts-ignore'), asAny: count('as any') };
const baseline = existsSync(BASELINE)
  ? (JSON.parse(readFileSync(BASELINE, 'utf8')) as typeof current)
  : { tsIgnore: Infinity, asAny: Infinity };

let failed = false;
for (const k of Object.keys(current) as (keyof typeof current)[]) {
  if (current[k] > baseline[k]) { console.error(`${k} rose ${baseline[k]} -> ${current[k]}`); failed = true; }
}
if (!failed) writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
process.exit(failed ? 1 : 0);
