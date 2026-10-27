// productSearch.ts
export const SORTS = ['relevance', 'price-asc', 'price-desc'] as const;
export type Sort = (typeof SORTS)[number];

export interface ProductSearch {
  q: string;
  color: string | null;
  tags: string[];      // canonical: sorted, unique
  sort: Sort;
  page: number;        // >= 1
}

export const DEFAULTS: ProductSearch = { q: '', color: null, tags: [], sort: 'relevance', page: 1 };

function toInt(raw: string | null, fallback: number, min: number, max: number): number {
  if (raw === null) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function parseProductSearch(sp: URLSearchParams): ProductSearch {
  const sortRaw = sp.get('sort');
  return {
    q: (sp.get('q') ?? '').trim().slice(0, 100),
    color: sp.get('color') || null,
    tags: [...new Set(sp.getAll('tag').map((t) => t.trim()).filter(Boolean))].sort(),
    sort: (SORTS as readonly string[]).includes(sortRaw ?? '') ? (sortRaw as Sort) : DEFAULTS.sort,
    page: toInt(sp.get('page'), DEFAULTS.page, 1, 10_000),
  };
}

export function serializeProductSearch(s: ProductSearch): URLSearchParams {
  const sp = new URLSearchParams();
  if (s.q) sp.set('q', s.q);
  if (s.color) sp.set('color', s.color);
  for (const t of [...s.tags].sort()) sp.append('tag', t);
  if (s.sort !== DEFAULTS.sort) sp.set('sort', s.sort);
  if (s.page !== DEFAULTS.page) sp.set('page', String(s.page));
  return sp; // defaults omitted; keys written in a fixed order => canonical
}
export {};
