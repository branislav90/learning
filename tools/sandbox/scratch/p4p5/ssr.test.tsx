// @vitest-environment node
import { test } from 'vitest';
import React, { useLayoutEffect } from 'react';
import { renderToString } from 'react-dom/server';
test('ssr', () => {
  const errs: string[] = []; const o = console.error; console.error = (...a: any[]) => errs.push(String(a[0]).slice(0, 100));
  function C() { useLayoutEffect(() => {}, []); return <i />; }
  renderToString(<C />); console.error = o; console.log('useLayoutEffect SSR warnings:', errs);
});
