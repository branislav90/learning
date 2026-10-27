import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const BASELINE = 'ts-nocheck-baseline.json';
const out = execSync(`grep -rl "@ts-nocheck" src || true`, { encoding: 'utf8' });
const current = out.split('\n').filter(Boolean).length;
const baseline = existsSync(BASELINE) ? (JSON.parse(readFileSync(BASELINE, 'utf8')) as { count: number }).count : Infinity;

if (current > baseline) {
  console.error(`@ts-nocheck files increased: ${baseline} -> ${current}`);
  process.exit(1);
}
if (current < baseline) {
  writeFileSync(BASELINE, JSON.stringify({ count: current }) + '\n');
  console.log(`Ratchet lowered to ${current}. Commit ${BASELINE}.`);
}
