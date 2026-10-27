// Conceptual only: what runtime CSS-in-JS does
const registry = new Set<string>();
let sheet: CSSStyleSheet | null = null;

function hash(s: string) { let h = 5381; for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i); return (h >>> 0).toString(36); }

function css(style: Record<string, string | number>) {
  const body = Object.entries(style).map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}:${v}`).join(";");  // 1. serialise
  const cls = "c" + hash(body);                                                                                              // 2. hash
  if (!registry.has(cls)) {                                                                                                  // 3. registry
    registry.add(cls);
    sheet ??= (() => { const el = document.createElement("style"); document.head.appendChild(el); return el.sheet!; })();
    sheet.insertRule(`.${cls}{${body}}`, sheet.cssRules.length);                                                             // 4. inject
  }
  return cls;
}

function Box({ size }: { size: number }) {
  return <div className={css({ width: size, height: size, background: "tomato" })} />;
}
export {};
