import { execSync } from 'node:child_process';

const base = process.env.BASE_REF ?? 'origin/main';
const changed = execSync(`git diff --name-only ${base}...HEAD -- docs/adr`, { encoding: 'utf8' }).split('\n').filter(Boolean);
let failed = false;

for (const f of changed) {
  let old: string;
  try { old = execSync(`git show ${base}:${f}`, { encoding: 'utf8' }); } catch { continue; } // new file: allowed
  if (!/^- Status:\s*Accepted/m.test(old)) continue;                          // only protect accepted ADRs
  const cur = execSync(`cat ${f}`, { encoding: 'utf8' });
  const strip = (t: string) => t.replace(/^- Status:.*$/m, '').split(/^## Amendments/m)[0].trim();
  if (strip(old) !== strip(cur)) { console.error(`${f}: Accepted ADR body modified; supersede instead.`); failed = true; }
}
process.exit(failed ? 1 : 0);
