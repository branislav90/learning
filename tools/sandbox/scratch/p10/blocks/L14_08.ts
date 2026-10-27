type RouteDef<N extends string, P extends Record<string, string>> = {
  name: N; pattern: RegExp; keys: (keyof P)[]; build: (p: P) => string;
};

const product: RouteDef<'product', { slug: string }> = {
  name: 'product', pattern: /^\/p\/([^/]+)$/, keys: ['slug'],
  build: ({ slug }) => `/p/${encodeURIComponent(slug)}`,
};
const legacyProduct = { pattern: /^\/product\/([^/]+)$/ }; // legacy URL still resolves

export function matchRoute(path: string):
  | { name: 'product'; params: { slug: string } }
  | null {
  const m = product.pattern.exec(path) ?? legacyProduct.pattern.exec(path);
  return m ? { name: 'product', params: { slug: decodeURIComponent(m[1]) } } : null;
}

// test (Vitest)
import { describe, it, expect } from 'vitest';
describe('route compatibility', () => {
  it.each(['/p/blue-shirt', '/product/blue-shirt'])('resolves %s', (url) => {
    expect(matchRoute(url)).toEqual({ name: 'product', params: { slug: 'blue-shirt' } });
  });
  it('round-trips', () => {
    expect(matchRoute(product.build({ slug: 'a b' }))?.params.slug).toBe('a b');
  });
});
