// tools/scan-usage.ts — run with tsx or ts-node against checked-out consumer repos
import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({ tsConfigFilePath: process.argv[2] });
const counts = new Map<string, number>();

for (const file of project.getSourceFiles('src/**/*.{ts,tsx}')) {
  for (const imp of file.getImportDeclarations()) {
    const spec = imp.getModuleSpecifierValue();
    if (!spec.startsWith('@acme/ds')) continue;
    for (const named of imp.getNamedImports()) {
      const key = `${spec}#${named.getName()}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
}

const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
console.table(rows.map(([name, uses]) => ({ name, uses })));
