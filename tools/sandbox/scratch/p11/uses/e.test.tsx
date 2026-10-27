// @vitest-environment jsdom
import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { it } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
class EB extends Component<any, { e: any }> { state = { e: null }; static getDerivedStateFromError(e: any) { return { e }; } render() { return this.state.e ? 'caught' : this.props.children; } }
const Bomb = () => { throw new Error('boom'); };
it('opts', async () => {
  const out: any[] = [];
  const c1 = document.createElement('div');
  const spy = (console.error as any);
  createRoot(c1, { onCaughtError: (e, i) => out.push(['caught', (e as Error).message, Object.keys(i), typeof i.componentStack, !!(i as any).errorBoundary]),
    onUncaughtError: (e, i) => out.push(['uncaught', (e as Error).message, Object.keys(i)]) }).render(<EB><Bomb /></EB>);
  await sleep(30);
  const c2 = document.createElement('div');
  createRoot(c2, { onCaughtError: (e, i) => out.push(['caught2']), onUncaughtError: (e, i) => out.push(['uncaught', (e as Error).message, Object.keys(i), typeof i.componentStack]) }).render(<Bomb />);
  await sleep(30); console.log('ERR', JSON.stringify(out));
});
