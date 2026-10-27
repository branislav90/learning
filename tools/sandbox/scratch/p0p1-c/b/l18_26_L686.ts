export {};
function isNonEmptyArray<T>(x: readonly T[]): x is [T, ...T[]] {
  return x.length > 0;
}
const xs: string[] = getNames();
if (isNonEmptyArray(xs)) {
  const first: string = xs[0];     // no `| undefined` even with noUncheckedIndexedAccess
}
