// scripts/docs-freshness.ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
}

const now = Date.now();
let stale = 0;
for (const file of walk('docs')) {
  const fm = /^---\n([\s\S]*?)\n---/.exec(readFileSync(file, 'utf8'))?.[1];
  if (!fm) continue;
  const get = (k: string) => new RegExp(`^${k}:\\s*(.+)$`, 'm').exec(fm)?.[1]?.trim();
  const reviewed = get('last_reviewed');
  const every = Number(get('review_every_days') ?? 180);
  const owner = get('owner');
  if (!owner || !reviewed) { console.error(`${file}: missing owner/last_reviewed`); stale++; continue; }
  const ageDays = (now - Date.parse(reviewed)) / 86_400_000;
  if (ageDays > every) { console.warn(`${file}: review overdue by ${Math.round(ageDays - every)} days (owner ${owner})`); stale++; }
}
process.exit(0); // report-only; fail CI only for missing metadata if desired
console.log(`${stale} docs need attention`);
