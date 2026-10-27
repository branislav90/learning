import React, { Suspense, use } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
const h = React.createElement;
const errs = [];
await new Promise(res => {
  const w = new Writable({ write(c, e, cb) { cb(); }, final(cb) { cb(); res(); } });
  const { pipe, abort } = renderToPipeableStream(h('div', null, 'hi'), { onShellReady() { pipe(w); }, onError(e) { errs.push(e.message); } });
  w.on('close', () => { try { abort(); console.log('abort after complete: ok'); } catch (e) { console.log('abort threw', e.message); } });
});
console.log('errs', errs);
// abort mid-stream
const never = new Promise(() => {});
const chunks = []; const errs2 = [];
await new Promise(res => {
  const w = new Writable({ write(c, e, cb) { chunks.push(c.toString()); cb(); }, final(cb) { cb(); res(); } });
  const { pipe, abort } = renderToPipeableStream(h('div', null, h(Suspense, { fallback: h('p', null, 'fb') }, h(function S() { return use(never); }))), { onShellReady() { pipe(w); setTimeout(() => abort(), 20); }, onError(e) { errs2.push(e.message); } });
});
console.log('abort mid-stream:', chunks.join('').slice(0, 500).replace(/\n/g,' '), errs2);
