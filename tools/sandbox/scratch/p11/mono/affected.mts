// tools/affected.ts — conceptual; use your build tool's built-in in practice
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

type Pkg = { name: string; dir: string; deps: string[] };

function loadPackages(root = '.'): Pkg[] {
  const dirs = ['apps', 'packages'].flatMap((g) =>
    existsSync(g) ? readdirSync(g).map((d) => join(g, d)) : []);
  const pkgs = dirs
    .filter((d) => existsSync(join(d, 'package.json')))
    .map((dir) => {
      const j = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
      return { name: j.name as string, dir, deps: Object.keys({ ...j.dependencies, ...j.devDependencies }) };
    });
  const names = new Set(pkgs.map((p) => p.name));
  return pkgs.map((p) => ({ ...p, deps: p.deps.filter((d) => names.has(d)) })); // internal edges only
}

const GLOBAL_INPUTS = ['pnpm-lock.yaml', 'package.json', 'tsconfig.base.json', '.github/'];

export function affected(base = 'origin/main'): string[] {
  const changed = execSync(`git diff --name-only $(git merge-base ${base} HEAD)`, { encoding: 'utf8' })
    .split('\n').filter(Boolean);

  const pkgs = loadPackages();
  if (changed.some((f) => GLOBAL_INPUTS.some((g) => f.startsWith(g)))) return pkgs.map((p) => p.name); // be conservative

  const direct = new Set(pkgs.filter((p) => changed.some((f) => f.startsWith(p.dir + '/'))).map((p) => p.name));
  // reverse-dependency closure
  const result = new Set(direct);
  let grew = true;
  while (grew) {
    grew = false;
    for (const p of pkgs) {
      if (!result.has(p.name) && p.deps.some((d) => result.has(d))) { result.add(p.name); grew = true; }
    }
  }
  return [...result];
}

console.log(affected('main'));
