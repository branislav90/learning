// @vitest-environment jsdom
import { test, afterEach } from 'vitest';
import React, { StrictMode, useEffect, useState, act } from 'react';
import { createRoot } from 'react-dom/client';
import { cleanup } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
test('strict update log', async () => {
  const log: string[] = [];
  let bump: any;
  function C() { const [n, setN] = useState(0); bump = () => setN(1); useEffect(() => { log.push('effect ' + n); return () => log.push('cleanup ' + n); }, [n]); return null; }
  const root = createRoot(document.createElement('div'));
  await act(async () => root.render(<StrictMode><C /></StrictMode>));
  const mount = log.splice(0);
  await act(async () => bump());
  console.log('mount:', mount.join(', '), '| update:', log.join(', '));
});
class B extends React.Component<{children: React.ReactNode},{e:any}> { state={e:null}; static getDerivedStateFromError(e:any){return {e}} render(){return this.state.e ? 'fb' : this.props.children} }
test('effect throws', async () => {
  const el = document.createElement('div'); const root = createRoot(el);
  const orig = console.error; console.error = () => {};
  function T() { useEffect(() => { throw new Error('e'); }, []); return <i>ok</i>; }
  function L() { React.useLayoutEffect(() => { throw new Error('e'); }, []); return <i>ok</i>; }
  function Cl() { useEffect(() => () => { throw new Error('cl'); }, []); return <i>ok</i>; }
  await act(async () => root.render(<B><T /></B>)); console.log('useEffect throw ->', el.textContent);
  await act(async () => root.render(<B key="2"><L /></B>)); console.log('layoutEffect throw ->', el.textContent);
  await act(async () => root.render(<B key="3"><Cl /></B>)); await act(async () => root.render(<div>x</div>)); console.log('cleanup throw (unmount) ->', el.textContent);
  console.error = orig;
});
