export {};
function f(v: string | number | undefined) {
  if (typeof v === "string") return `s:${v.length}`;
  if (v) return `n:${v.toFixed(0)}`;
  return `other:${String(v)}`;
}
console.log(f("ab"), f(5), f(0), f(undefined), f(""));
