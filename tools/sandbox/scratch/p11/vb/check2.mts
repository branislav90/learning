// tools/check-budgets.ts
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

type ManifestChunk = {
  file: string;
  imports?: string[];          // static imports: part of the initial load
  dynamicImports?: string[];   // lazy: NOT part of initial load
  isEntry?: boolean;
};
type Manifest = Record<string, ManifestChunk>;

const dist = 'dist';
const manifest: Manifest = JSON.parse(readFileSync(join(dist, '.vite/manifest.json'), 'utf8'));
const budgets = JSON.parse(readFileSync('budgets.json', 'utf8')) as {
  routes: Record<string, { owner: string; initialJs: number }>;
};

// Route -> manifest key of its entry module. In a real app, generate this
// from your router config rather than hand-maintaining it.
const routeEntries: Record<string, string> = {
  '/': 'src/routes/home.ts',
  
  '/checkout': 'src/routes/checkout.ts',
};

const gzipCache = new Map<string, number>();
function gzSize(file: string): number {
  const hit = gzipCache.get(file);
  if (hit !== undefined) return hit;
  const size = gzipSync(readFileSync(join(dist, file))).length;
  gzipCache.set(file, size);
  return size;
}

/** Transitive closure of STATIC imports = what the browser must fetch up-front. */
function initialChunks(entryKey: string, seen = new Set<string>()): Set<string> {
  if (seen.has(entryKey)) return seen;
  seen.add(entryKey);
  for (const dep of manifest[entryKey]?.imports ?? []) initialChunks(dep, seen);
  return seen;
}

let failed = false;
for (const [route, { owner, initialJs }] of Object.entries(budgets.routes)) {
  const keys = initialChunks(routeEntries[route]);
  // The app entry is also loaded on every route:
  if (manifest['index.html']) initialChunks('index.html', keys);
  const files = [...new Set([...keys].map((k) => manifest[k].file))];
  const total = files.reduce((sum, f) => sum + gzSize(f), 0);
  const over = total - initialJs;
  const status = over > 0 ? 'FAIL' : 'ok  ';
  console.log(`${status} ${route.padEnd(16)} ${total} / ${initialJs} B  owner ${owner}`);
  if (over > 0) failed = true;
}
process.exit(failed ? 1 : 0);
