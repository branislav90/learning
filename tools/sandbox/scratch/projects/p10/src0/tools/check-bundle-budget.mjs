// tools/check-bundle-budget.mjs  (run after `vite build` with manifest enabled)
import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const dist = 'apps/web/dist';
const manifest = JSON.parse(readFileSync(join(dist, '.vite/manifest.json'), 'utf8')); // ⚠ path varies by Vite version
const budgets = { 'index.html': 170 * 1024 };           // gzip bytes for the INITIAL graph; per-module chunks have own budgets

function initialGraph(entryKey) {
  const seen = new Set(); const files = new Set();
  const visit = (k) => { if (seen.has(k)) return; seen.add(k); const c = manifest[k]; files.add(c.file); (c.imports ?? []).forEach(visit); };
  visit(entryKey); return [...files];
}
const entry = Object.keys(manifest).find((k) => manifest[k].isEntry);
const size = initialGraph(entry).filter((f) => f.endsWith('.js')).reduce((n, f) => n + gzipSync(readFileSync(join(dist, f))).length, 0);
if (size > budgets['index.html']) { console.error(`Initial JS ${size} > budget ${budgets['index.html']}`); process.exit(1); }
console.log(`Initial JS gzip: ${(size / 1024).toFixed(1)} kB`);
