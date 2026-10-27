// scripts/check-flags.ts
import { flags } from '../flags/registry';
const today = new Date().toISOString().slice(0, 10);
const expired = Object.entries(flags).filter(([, f]) => f.expires < today);
if (expired.length) {
  console.error('Expired flags (remove code paths and registry entries):');
  for (const [k, f] of expired) console.error(` - ${k} (owner ${f.owner}, expired ${f.expires})`);
  process.exit(1);
}
