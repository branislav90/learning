// Deterministic, sticky bucketing: same user + flag => same bucket; raising % only adds users.
export function bucket(userId: string, flagKey: string): number {
  // FNV-1a 32-bit hash
  let h = 0x811c9dc5;
  const s = `${flagKey}:${userId}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h % 100;
}

export function isEnabled(rule: { percent: number; allow?: string[] }, userId: string, flagKey: string): boolean {
  if (rule.allow?.includes(userId)) return true;
  return bucket(userId, flagKey) < rule.percent;
}
