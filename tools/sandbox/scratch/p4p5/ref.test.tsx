// @vitest-environment jsdom
import { test } from 'vitest';
import React, { act, cloneElement, createElement } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('refs', async () => {
  const errs: string[] = []; const orig = console.error; console.error = (...a:any[]) => errs.push(String(a[0]).slice(0,200));
  const log: string[] = [];
  const el = document.createElement('div'); const root = createRoot(el);
  const cb = (n: HTMLElement | null) => { log.push('ref ' + (n ? n.tagName : 'null')); return () => log.push('cleanup'); };
  function Child({ ref }: { ref?: React.Ref<HTMLButtonElement> }) { return <button ref={ref} />; }
  await act(async () => root.render(<Child ref={cb as any} />));
  await act(async () => root.render(<div />));
  log.push('--');
  // child.ref access
  const child = <Child ref={cb as any} />;
  const r = (child as any).ref; log.push('child.ref=' + typeof r + ' props.ref=' + typeof (child.props as any).ref);
  const r2 = (<button ref={cb as any} /> as any);
  const x = r2.ref; log.push('dom.ref=' + typeof x);
  console.error = orig;
  console.log(log.join(' | ')); console.log('ERRS', errs);
});
