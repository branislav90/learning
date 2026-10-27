export interface Page<T> {
  items: T[];
  nextCursor: string | null;       // null = no more
  total?: number;                  // optional: not all APIs provide it
}

// API A: { results: [...], next: "https://api/x?cursor=abc" | null, count: 120 }
// API B: { data: [...], meta: { page: 3, per_page: 20, total_pages: 6 } }
export function pageFromA<T>(raw: unknown, item: (x: unknown, p: string) => T): Page<T> {
  const o = object(raw, 'page');
  const next = o.next;
  return {
    items: array(item)(o.results, 'page.results'),
    nextCursor: typeof next === 'string' ? new URL(next).searchParams.get('cursor') : null,
    total: typeof o.count === 'number' ? o.count : undefined,
  };
}
export function pageFromB<T>(raw: unknown, item: (x: unknown, p: string) => T): Page<T> {
  const o = object(raw, 'page');
  const meta = object(o.meta, 'page.meta');
  const page = Number(meta.page);
  const totalPages = Number(meta.total_pages);
  return {
    items: array(item)(o.data, 'page.data'),
    nextCursor: page < totalPages ? String(page + 1) : null,   // offset API exposed as an opaque cursor
    total: undefined,
  };
}
export {};
