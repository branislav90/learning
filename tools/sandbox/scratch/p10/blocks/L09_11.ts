const MAP: Record<string, string> = { a: "à", e: "é", i: "ï", o: "ö", u: "ü", A: "Å", E: "É", I: "Ï", O: "Ö", U: "Ü" };
export function pseudoLocalize(msg: string): string {
  // Preserve placeholders {name} and tags <x>…</x>; expand ~35%; wrap to reveal truncation.
  const protectedRe = /(\{[^}]+\}|<\/?\w+>)/g;
  const out = msg.split(protectedRe).map((part, i) => i % 2 === 1 ? part : [...part].map((c) => MAP[c] ?? c).join("")).join("");
  const pad = "~".repeat(Math.ceil(msg.length * 0.35));
  return `[!! ${out}${pad} !!]`;
}
