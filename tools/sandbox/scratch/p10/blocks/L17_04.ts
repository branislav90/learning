import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

function walk(d: string): string[] {
  return readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
}

let broken = 0;
for (const file of walk('docs')) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;     // external and in-page anchors
    const path = resolve(dirname(file), target.split('#')[0]);
    if (!existsSync(path)) { console.error(`${file}: broken link -> ${target}`); broken++; }
  }
}
process.exit(broken ? 1 : 0);
