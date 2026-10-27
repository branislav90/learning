export function negotiateLocale(requested: readonly string[], supported: readonly string[], fallback: string): string {
  const lower = new Map(supported.map((s) => [s.toLowerCase(), s]));
  for (const tag of requested) {
    let candidate = tag.toLowerCase();
    while (candidate) {
      const hit = lower.get(candidate);
      if (hit) return hit;
      const i = candidate.lastIndexOf("-");
      if (i === -1) break;
      candidate = candidate.slice(0, i);          // truncate: fr-ch -> fr
    }
  }
  return fallback;
}
