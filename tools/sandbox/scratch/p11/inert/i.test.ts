import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { it } from 'vitest';
it('inert', () => {
  console.log(renderToString(h('div', { inert: true } as any)), renderToString(h('div', { inert: false } as any)), renderToString(h('div', { inert: '' } as any)));
});
