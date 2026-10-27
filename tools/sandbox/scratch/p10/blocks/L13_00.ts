export {};
// scripts/ratchet.ts (conceptual)
const baseline = JSON.parse(fs.readFileSync('migration-baseline.json', 'utf8')) as { classComponents: number };
const current = countClassComponents('src');          // AST or regexp scan
if (current > baseline.classComponents) {
  console.error(`Class components increased: ${baseline.classComponents} -> ${current}`);
  process.exit(1);
}
if (current < baseline.classComponents) {
  // lower the bar so progress is locked in
  fs.writeFileSync('migration-baseline.json', JSON.stringify({ classComponents: current }));
}
