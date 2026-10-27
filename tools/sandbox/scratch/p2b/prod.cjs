const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
global.window = dom.window; global.document = dom.window.document; global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement; global.Node = dom.window.Node; global.MessageChannel = require('worker_threads').MessageChannel;
const React = require('react'); const { renderToString } = require('react-dom/server'); const { hydrateRoot } = require('react-dom/client');
const h = React.createElement;
const tick = (ms) => new Promise(r => setTimeout(r, ms));
async function run(name, s, c, opts={}) {
  const el = document.createElement('div'); document.body.appendChild(el); el.innerHTML = renderToString(s);
  const errs = []; const rec = [];
  const oe = console.error; console.error = (...a) => errs.push(String(a[0]).slice(0, 80));
  const before = el.firstElementChild;
  hydrateRoot(el, c, { onRecoverableError: (e) => rec.push(String(e.message).slice(0, 90)) });
  await tick(100); console.error = oe;
  console.log(name, '| html:', el.innerHTML, '| reused:', before === el.firstElementChild, '| recoverable:', rec.length, rec[0] || '', '| console.error:', errs.length, errs[0]||'');
}
(async () => {
  console.log('NODE_ENV', process.env.NODE_ENV, React.version);
  await run('text', h('div', null, h('p', null, 'server')), h('div', null, h('p', null, 'client')));
  await run('attr', h('div', { className: 's' }, 'x'), h('div', { className: 'c' }, 'x'));
  await run('textInSuspense', h('div', null, h(React.Suspense, {fallback:'fb'}, h('p', null, 'server'))), h('div', null, h(React.Suspense, {fallback:'fb'}, h('p', null, 'client'))));
  await run('suppress', h('div', {suppressHydrationWarning:true}, 'server'), h('div', {suppressHydrationWarning:true}, 'client'));
  await run('extra element', h('div', null, h('p', null, 'a'), h('p', null, 'b')), h('div', null, h('p', null, 'a')));
  await run('missing element', h('div', null, h('p', null, 'a')), h('div', null, h('p', null, 'a'), h('p', null, 'b')));
  process.exit(0);
})();
