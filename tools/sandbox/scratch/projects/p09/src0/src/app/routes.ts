// src/app/routes.ts
export type Route =
  | { name: 'home' }
  | { name: 'product'; slug: string }
  | { name: 'search'; q: string }
  | { name: 'not-found' };

export function matchRoute(url: URL): Route {
  const { pathname, searchParams } = url;
  if (pathname === '/') return { name: 'home' };
  if (pathname === '/search') return { name: 'search', q: searchParams.get('q') ?? '' };
  const m = /^\/products\/([a-z0-9-]+)\/?$/.exec(pathname);
  if (m) return { name: 'product', slug: m[1]! };
  return { name: 'not-found' };
}
