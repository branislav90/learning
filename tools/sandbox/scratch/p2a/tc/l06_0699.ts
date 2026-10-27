export function minimalMoves(oldKeys: string[], newKeys: string[]): number {
  const pos = new Map(oldKeys.map((k, i) => [k, i]));
  const seq = newKeys.filter((k) => pos.has(k)).map((k) => pos.get(k)!);
  const tails: number[] = [];                       // patience sorting LIS, O(n log n)
  for (const x of seq) {
    let lo = 0, hi = tails.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < x) lo = mid + 1; else hi = mid; }
    tails[lo] = x;
  }
  return seq.length - tails.length;
}
