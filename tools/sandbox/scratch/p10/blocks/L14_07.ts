// tools/ownership-report.ts — fail CI if any package lacks required metadata
import { globSync } from 'node:fs';
import { readFileSync } from 'node:fs';

const missing: string[] = [];
for (const file of globSync('packages/**/package.json', { exclude: (f) => f.includes('node_modules') })) {
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  if (pkg.private === false || pkg.name?.startsWith('@acme/')) {
    const meta = pkg.acme;
    if (!meta?.owner || !meta?.oncall) missing.push(file);
  }
}
if (missing.length) {
  console.error('Packages missing ownership metadata:\n' + missing.join('\n'));
  process.exit(1);
}
