// A deliberately simple, reviewable artifact for the ADR conversation.
type Weight = 0 | 1 | 2 | 3; // 0 = not needed, 3 = critical

interface Need { id: string; label: string; weight: Weight }
interface Coverage { [needId: string]: 0 | 1 | 2 } // 0 = not covered, 1 = with extra work, 2 = core capability

interface Candidate { name: string; coverage: Coverage; notes?: string }

const needs: Need[] = [
  { id: 'cache',      label: 'Keyed cache + dedupe',            weight: 3 },
  { id: 'staleness',  label: 'Staleness/refetch policy',        weight: 3 },
  { id: 'invalidate', label: 'Invalidation after mutation',     weight: 3 },
  { id: 'ssr',        label: 'SSR / streaming',                 weight: 0 },
  { id: 'offline',    label: 'Persistence / offline',           weight: 0 },
  { id: 'normalize',  label: 'Entity normalization',            weight: 1 },
  { id: 'realtime',   label: 'Real-time patching',              weight: 1 },
];

export function score(c: Candidate): number {
  return needs.reduce((sum, n) => sum + n.weight * (c.coverage[n.id] ?? 0), 0);
}

export function explain(candidates: Candidate[]) {
  return candidates
    .map((c) => ({ name: c.name, score: score(c), gaps: needs.filter((n) => n.weight > 0 && (c.coverage[n.id] ?? 0) < 2).map((n) => n.label) }))
    .sort((a, b) => b.score - a.score);
}
export {};
