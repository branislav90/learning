// @vitest-environment jsdom
import React from 'react';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
expect.extend(matchers);
declare module 'vitest' { interface Assertion<T = any> { toHaveNoViolations(): T } }
it('bad', async () => {
  const { container } = render(<img src="x.png" />);
  const r = await axe(container);
  expect(r.violations.map(v=>v.id)).toContain('image-alt');
  await expect(async()=>expect(r).toHaveNoViolations()).rejects.toThrow();
});
it('good', async () => {
  const { container } = render(<main><button>Go</button></main>);
  expect(await axe(container)).toHaveNoViolations();
});
