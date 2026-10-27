// @vitest-environment jsdom
import { test, afterEach } from 'vitest';
import React, { Children, cloneElement, act, useId } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { createPortal } from 'react-dom';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('children frag', () => {
  console.log('Children.count frag with 2 kids:', Children.count(<><a /><b /></>), ' vs array of 2:', Children.count([<a key="1" />, <b key="2" />]));
  const els: string[] = []; Children.forEach(<><i /><i /></>, (c: any) => els.push(typeof c.type === 'symbol' ? 'Fragment' : c.type));
  console.log('forEach sees', els);
});
test('clone frag', async () => {
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).replace(/%s/g, '').slice(0, 160));
  const el = document.createElement('div'); const root = createRoot(el);
  const frag = <><span>a</span></>;
  await act(async () => root.render(cloneElement(frag, { 'data-x': 1 } as any)));
  console.error = o; console.log('clone fragment warnings:', errs);
});
test('form action reset', async () => {
  const el = document.createElement('div'); document.body.append(el); const root = createRoot(el);
  let submitted = ''; 
  await act(async () => root.render(<form action={async (fd: FormData) => { submitted = String(fd.get('q')); }}><input name="q" defaultValue="init" /><button>go</button></form>));
  const input = el.querySelector('input')!; input.value = 'typed';
  await act(async () => { el.querySelector('button')!.click(); });
  await act(async () => { await new Promise(r => setTimeout(r, 20)); });
  console.log('submitted', submitted, '| input after action:', input.value);
});
test('portal ssr', () => {
  function P() { return createPortal(<b>x</b>, document.body); }
  try { console.log('renderToString portal:', renderToString(<P />)); } catch (e: any) { console.log('portal ssr threw:', e.message.slice(0, 120)); }
});
test('useId', () => { function C() { return <i>{useId()}</i>; } console.log('useId SSR', renderToString(<C />)); });
