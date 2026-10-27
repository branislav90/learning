// scripts/adr-check.ts — validates structure; generates docs/adr/README.md index
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'docs/adr';
const files = readdirSync(dir).filter((f) => /^\d{4}-.+\.md$/.test(f)).sort();
const required = ['## Context', '## Decision', '## Consequences'];
const statuses = ['Proposed', 'Accepted', 'Rejected', 'Deprecated', 'Superseded'];
const rows: string[] = [];
let errors = 0;

files.forEach((f, i) => {
  const text = readFileSync(join(dir, f), 'utf8');
  const n = Number(f.slice(0, 4));
  if (n !== i + 1) { console.error(`${f}: expected sequence number ${i + 1}`); errors++; }
  for (const h of required) if (!text.includes(h)) { console.error(`${f}: missing "${h}"`); errors++; }
  const statusLine = /^- Status:\s*(\w+)/m.exec(text)?.[1];
  if (!statusLine || !statuses.includes(statusLine)) { console.error(`${f}: invalid/missing Status`); errors++; }
  const title = /^# (ADR-\d{4}:.*)$/m.exec(text)?.[1] ?? f;
  rows.push(`| [${title}](./${f}) | ${statusLine ?? '?'} |`);
});

writeFileSync(join(dir, 'README.md'), `# Architecture Decision Records\n\n| ADR | Status |\n|---|---|\n${rows.join('\n')}\n`);
process.exit(errors ? 1 : 0);
