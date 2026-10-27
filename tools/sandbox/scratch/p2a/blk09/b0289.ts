// Paste in the browser console on a page rendered by React DOM.
// Uses private properties (verified working on React 19.3.1: `__reactFiber$…` key on the DOM node). Learning aid only; never ship this.
type AnyFiber = {
  type: unknown;
  return: AnyFiber | null;
  child: AnyFiber | null;
  sibling: AnyFiber | null;
  tag: number;
};

function fiberOf(node: Element): AnyFiber | null {
  const key = Object.keys(node).find((k) => k.startsWith("__reactFiber$"));
  return key ? ((node as unknown as Record<string, AnyFiber>)[key] ?? null) : null;
}

function label(f: AnyFiber): string {
  const t = f.type as { name?: string; displayName?: string } | string | null;
  if (typeof t === "string") return `<${t}>`;
  return t?.displayName ?? t?.name ?? `(tag ${f.tag})`;
}

const el = document.querySelector("button");
let f = el ? fiberOf(el) : null;
const chain: string[] = [];
while (f) {
  chain.push(label(f));
  f = f.return;
}
console.log(chain.join(" ← "));
