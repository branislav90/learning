// verify-react-internals.ts — run with: npx tsx verify-react-internals.ts
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";

const require = createRequire(import.meta.url);

function findReactDomDev(): string | null {
  const pkgPath = require.resolve("react-dom/package.json");
  const dir = dirname(pkgPath);
  const candidates = [
    join(dir, "cjs/react-dom-client.development.js"), // React 19 client build (⚠ verify)
    join(dir, "cjs/react-dom.development.js"),        // React 18-style build
  ];
  return candidates.find(existsSync) ?? null;
}

const names = [
  "scheduleUpdateOnFiber",
  "ensureRootIsScheduled",
  "performUnitOfWork",
  "beginWork",
  "completeWork",
  "commitRoot",
  "createWorkInProgress",
  "reconcileChildrenArray",
  "renderWithHooks",
  "dispatchSetState",
  "bailoutOnAlreadyFinishedWork",
  "commitTextUpdate",
  "workLoopConcurrent",
  "shouldYield",
];

const file = findReactDomDev();
if (!file) {
  console.error("Could not find a react-dom development build. Is react-dom installed?");
  process.exit(1);
}
const text = readFileSync(file, "utf8");
const lines = text.split("\n");
console.log(`Scanning ${file} (${lines.length} lines)`);

for (const name of names) {
  const defRe = new RegExp(`function\\s+${name}\\s*\\(`);
  const defLine = lines.findIndex((l) => defRe.test(l));
  const uses = (text.match(new RegExp(`\\b${name}\\b`, "g")) ?? []).length;
  console.log(
    defLine >= 0
      ? `FOUND   ${name.padEnd(32)} def at line ${defLine + 1}, ${uses} references`
      : uses > 0
        ? `PRESENT ${name.padEnd(32)} referenced ${uses}x, no 'function ${name}(' definition (renamed/inlined?)`
        : `MISSING ${name.padEnd(32)}`,
  );
}
