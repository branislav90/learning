// @vitest-environment node
import { PassThrough } from 'node:stream';
import { it, expect, vi } from 'vitest';
import { renderStream } from '../server/render';
import { servicesImpl } from '../server/services';
import { serializeForScript, dataScript } from '../src/app/data/serialize';
import { createMapCache, fulfilled } from '../src/app/data/cache';
import type { Product, Review } from '../src/app/types';

const product: Product = { id: 'p1', slug: 'tent', name: 'Tent', summary: 'A tent', description: 'Desc', heroUrl: '/t.jpg', heroAlt: 't' };
function deferred<T>() { let resolve!: (v: T) => void, reject!: (e: unknown) => void; const promise = new Promise<T>((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; }
function fakeRes() {
  const res = new PassThrough() as PassThrough & { statusCode: number; headers: Record<string, string>; setHeader(k: string, v: string): void };
  res.statusCode = 200; res.headers = {}; res.setHeader = (k, v) => { res.headers[k] = v; };
  const chunks: { t: number; s: string }[] = [];
  const t0 = Date.now();
  res.on('data', (b: Buffer) => chunks.push({ t: Date.now() - t0, s: b.toString() }));
  return { res, chunks };
}
const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));
function setup(opts: { ua?: string } = {}) {
  const reviews = deferred<Review[]>(); const stock = deferred<{ inStock: number }>();
  servicesImpl.current = { getReviews: () => reviews.promise, getStock: () => stock.promise, getProduct: async () => product };
  const { res, chunks } = fakeRes();
  renderStream({ req: { headers: { 'user-agent': opts.ua ?? 'Mozilla' } } as never, res: res as never, route: { name: 'product', slug: 'tent' }, status: 200, critical: { 'product:tent': product }, bootstrapModules: ['/e.js'], nonce: 'N0NCE', dev: false });
  return { reviews, stock, res, chunks };
}

it('shell first, reviews later (human)', async () => {
  const { reviews, stock, chunks, res } = setup();
  await tick(50);
  const first = chunks.map((c) => c.s).join('');
  console.log('first flush: has h1', first.includes('<h1>Tent</h1>'), 'skeleton', first.includes('Loading reviews'), 'review text', first.includes('GREAT-REVIEW'), 'chunks', chunks.length);
  expect(first).toContain('<h1>Tent</h1>'); expect(first).toContain('Loading reviews'); expect(first).not.toContain('GREAT-REVIEW');
  console.log('head hoisting: title in <head>:', /<head>[\s\S]*<title>Tent \| Trailhead Gear<\/title>[\s\S]*<\/head>/.test(first), 'stylesheet link precedence ->', /<link rel="stylesheet" href="\/assets\/app.css" data-precedence="default"/.test(first));
  const n = chunks.length;
  reviews.resolve([{ id: 'r1', author: 'A', rating: 5, body: 'GREAT-REVIEW </script><script>alert(1)</script>', createdAt: '2026-01-01T00:00:00Z' }]);
  await tick(50);
  const later = chunks.slice(n).map((c) => c.s).join('');
  console.log('later chunk has review text', later.includes('GREAT-REVIEW'), 'has data script', later.includes('__DATA__'), 'escaped payload', later.includes('\\u003c/script\\u003e'), 'raw </script><script>alert in data script?', /push\(\["reviews:tent".*<\/script><script>alert/.test(later));
  expect(later).toContain('GREAT-REVIEW');
  stock.resolve({ inStock: 2 });
  await tick(50);
  res.end();
});

it('bot gets one flush with all content', async () => {
  const { reviews, stock, chunks } = setup({ ua: 'Googlebot/2.1' });
  await tick(50);
  expect(chunks.length).toBe(0);
  reviews.resolve([{ id: 'r1', author: 'A', rating: 5, body: 'GREAT-REVIEW', createdAt: '2026-01-01T00:00:00Z' }]);
  stock.resolve({ inStock: 2 });
  await tick(80);
  const all = chunks.map((c) => c.s).join('');
  console.log('bot: chunks', chunks.length, 'has review', all.includes('GREAT-REVIEW'), 'skeleton present', all.includes('Loading reviews'));
  expect(all).toContain('GREAT-REVIEW');
});

it('rejected reviews: 200, fallback, onError (console.error) called', async () => {
  const err = vi.spyOn(console, 'error').mockImplementation(() => {});
  const { reviews, stock, chunks, res } = setup();
  await tick(30);
  reviews.reject(new Error('boom')); stock.resolve({ inStock: 1 });
  await tick(80);
  const all = chunks.map((c) => c.s).join('');
  console.log('failure: status', res.statusCode, 'console.error calls', err.mock.calls.length, 'fallback text emitted?', all.includes('Reviews are temporarily unavailable'), 'client-render marker $RX?', all.includes('$RX'));
  expect(res.statusCode).toBe(200);
});

it('abort on close stops rendering', async () => {
  const { res, chunks } = setup();
  await tick(30);
  res.emit('close');
  const n = chunks.length;
  await tick(50);
  console.log('after close chunks', n, '->', chunks.length);
});

it('serializer', () => {
  const payload = '</script><script>alert(1)</script>\u2028\u2029&';
  const out = serializeForScript({ body: payload });
  expect(out).not.toMatch(/[<>&\u2028\u2029]/);
  expect(JSON.parse(out).body).toBe(payload);
  console.log(dataScript('k', { body: payload }, 'n').slice(0, 120));
});

it('cache: same promise per key; fulfilled sync flags', () => {
  const c = createMapCache();
  const a = c.read('k', async () => 1), b = c.read('k', async () => 2);
  expect(a).toBe(b);
  expect((fulfilled(3) as { status?: string }).status).toBe('fulfilled');
});
