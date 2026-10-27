// @vitest-environment jsdom
import { test } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const log: string[] = [];
class B extends React.Component<{children: React.ReactNode},{e:unknown}> {
  state = { e: null as unknown };
  static getDerivedStateFromError(e: unknown) { log.push('gDSFE'); return { e }; }
  componentDidCatch() { log.push('didCatch'); }
  render() { log.push('boundary render ' + (this.state.e ? 'fallback':'children')); return this.state.e ? 'fb' : this.props.children; }
}
function Bomb(): never { log.push('bomb'); throw new Error('x'); }
test('order', async () => {
  const el = document.createElement('div');
  const root = createRoot(el, { onCaughtError: () => log.push('onCaughtError'), onUncaughtError: () => log.push('onUncaughtError') });
  const orig = console.error; console.error = () => {};
  await act(async () => root.render(<B><Bomb /></B>));
  console.error = orig;
  console.log(log.join(' | '), '=>', el.textContent);
});
