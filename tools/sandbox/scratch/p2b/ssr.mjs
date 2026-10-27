import React, { Suspense, use, createContext, useId } from 'react';
import { renderToString, renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import { prerender } from 'react-dom/static';
import { Writable } from 'node:stream';
const h = React.createElement;
const delay = (v, ms) => new Promise(r => setTimeout(() => r(v), ms));
const p = delay('data', 100);
function Slow() { return h('i', null, use(p)); }
function Boom() { throw new Error('server boom'); }
const App = () => h('html', null, h('head', null, h('title', null, 'T'), h('meta', { name: 'd', content: 'x' })), h('body', null, h('h1', null, 'shell'), h(Suspense, { fallback: h('p', null, 'loading') }, h(Slow))));
console.log('renderToString suspended:', renderToString(App()));
async function stream(el, mode) {
  const chunks = []; let t0 = Date.now(); const ev = [];
  await new Promise((resolve) => {
    const w = new Writable({ write(c, e, cb) { chunks.push([Date.now() - t0, c.toString()]); cb(); }, final(cb) { cb(); resolve(); } });
    const { pipe } = renderToPipeableStream(el, {
      onShellReady() { ev.push('shellReady@' + (Date.now() - t0)); if (mode === 'shell') pipe(w); },
      onAllReady() { ev.push('allReady@' + (Date.now() - t0)); if (mode === 'all') pipe(w); },
      onShellError(e) { ev.push('shellError'); resolve(); },
      onError(e) { ev.push('onError:' + e.message); },
    });
  });
  console.log(mode, ev, chunks.map(([t, c]) => `[${t}ms ${c.length}b] ${c.slice(0, 400)}`).join('\n   '));
}
await stream(App(), 'shell');
await stream(App(), 'all');
const BoomApp = () => h('div', null, h(Suspense, { fallback: h('p', null, 'fb') }, h(Boom)));
await stream(BoomApp(), 'shell');
const { prelude } = await prerender(App(), {});
console.log('prerender:', await new Response(prelude).text());
const Ctx = createContext('def'); function C() { return h('b', null, use(Ctx)); }
console.log('Context as provider:', renderToString(h(Ctx, { value: 'x' }, h(C))));
const TT = () => h('div', null, h('h1', null, 'x'), h('title', null, 'in body'));
console.log('title hoist (renderToString):', renderToString(h('html', null, h('head'), h('body', null, h(TT)))));
