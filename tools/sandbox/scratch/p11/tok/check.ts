mport { readFileSync } from "node:fs";

type Tree = { [k: string]: Tree | { $value: unknown } };
const isLeaf = (n: unknown): n is { $value: unknown } => typeof n === "object" && n !== null && "$value" in n;

function flatten(tree: Tree, prefix = "", out = new Map<string, string>()) {
  for (const [k, v] of Object.entries(tree)) {
    if (k.startsWith("$")) continue;               // group-level $type, $description, ...
    const path = prefix ? `${prefix}.${k}` : k;
    if (isLeaf(v)) out.set(path, typeof v.$value === "string" ? v.$value : JSON.stringify(v.$value));
    else flatten(v as Tree, path, out);
  }
  return out;
}

const load = (f: string) => flatten(JSON.parse(readFileSync(f, "utf8")));
const core = load("tokens/core.json");
const light = load("tokens/semantic.light.json");
const dark = load("tokens/semantic.dark.json");
const all = new Map([...core, ...light]); // resolution universe for light
const errors: string[] = [];

const ref = /^\{([^}]+)\}$/;
function resolves(universe: Map<string, string>, start: string, seen = new Set<string>()): boolean {
  if (seen.has(start)) { errors.push(`cycle at ${start}`); return false; }
  seen.add(start);
  const v = universe.get(start);
  if (v === undefined) { errors.push(`missing token ${start}`); return false; }
  const m = ref.exec(v);
  return m ? resolves(universe, m[1], seen) : true;
}

for (const [name] of light) resolves(new Map([...core, ...light]), name);
for (const [name] of dark) resolves(new Map([...core, ...dark]), name);
for (const name of light.keys()) if (!dark.has(name)) errors.push(`semantic token ${name} missing in dark`);
for (const name of dark.keys()) if (!light.has(name)) errors.push(`semantic token ${name} missing in light`);

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
