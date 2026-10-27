const SORTS = ['new', 'price-asc', 'price-desc'] as const;
type Sort = (typeof SORTS)[number];
export interface ListSearch { q: string; sort: Sort; tags: string[]; page: number }
const DEFAULTS: ListSearch = { q: '', sort: 'new', tags: [], page: 1 };

export function parseListSearch(sp: URLSearchParams): ListSearch {
  const sortRaw = sp.get('sort');
  const pageRaw = Number.parseInt(sp.get('page') ?? '', 10);
  return {
    q: (sp.get('q') ?? '').trim().slice(0, 100),
    sort: (SORTS as readonly string[]).includes(sortRaw ?? '') ? (sortRaw as Sort) : DEFAULTS.sort,
    tags: [...new Set(sp.getAll('tag').map((t) => t.trim()).filter(Boolean))].sort(),
    page: Number.isFinite(pageRaw) ? Math.min(1000, Math.max(1, pageRaw)) : DEFAULTS.page,
  };
}

export function serializeListSearch(s: ListSearch): URLSearchParams {
  const sp = new URLSearchParams();
  if (s.q) sp.set('q', s.q);
  if (s.sort !== DEFAULTS.sort) sp.set('sort', s.sort);
  for (const t of [...s.tags].sort()) sp.append('tag', t);
  if (s.page !== DEFAULTS.page) sp.set('page', String(s.page));
  return sp;
}
export {};
