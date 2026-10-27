// Stale-on-error: fall back to the last good value when the dependency fails
const lastGood = new Map<string, { value: unknown; at: number }>();
const recsBreaker = new CircuitBreaker({ failureThreshold: 3, windowMs: 30_000, coolDownMs: 30_000 });

export async function getRecommendations(productId: string, signal?: AbortSignal) {
  const key = `recs:${productId}`;
  try {
    const value = await recsBreaker.exec(() =>
      withRetry(() => fetchJson<RecItem[]>(`/api/recs?product=${encodeURIComponent(productId)}`, { signal, timeoutMs: 3000 }), { retries: 1, signal }));
    lastGood.set(key, { value, at: Date.now() });
    return { items: value, stale: false as const };
  } catch (err) {
    const cached = lastGood.get(key);
    if (cached && Date.now() - cached.at < 10 * 60_000) return { items: cached.value as RecItem[], stale: true as const };
    throw err;                                      // let the widget's boundary handle it
  }
}
