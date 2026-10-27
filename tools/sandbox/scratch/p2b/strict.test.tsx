import React, { useState, useMemo, useCallback, useEffect, useLayoutEffect, useRef, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
async function m(ui: any) { const c = document.createElement('div'); document.body.appendChild(c); const root = createRoot(c); await act(async () => root.render(ui)); return { c, root }; }
test('double render details', async () => {
  const log: string[] = []; let setN: any;
  function C() {
    const [n, sn] = useState(() => { log.push('init'); return 0; }); setN = sn;
    const memo = useMemo(() => { log.push('memo'); return n; }, [n]);
    log.push('render n=' + n);
    useEffect(() => { log.push('effect setup'); return () => log.push('effect cleanup'); }, []);
    useLayoutEffect(() => { log.push('layout setup'); return () => log.push('layout cleanup'); }, []);
    return <div ref={(el) => { log.push('ref ' + (el ? 'attach' : 'null')); return () => log.push('ref cleanup'); }} />;
  }
  const { root } = await m(<StrictMode><C /></StrictMode>);
  console.log('MOUNT', log.slice()); log.length = 0;
  await act(async () => setN((x: number) => { log.push('updater'); return x + 1; }));
  console.log('UPDATE', log.slice());
});
test('scoped strict + later mount', async () => {
  const log: string[] = [];
  function E({ name }: any) { useEffect(() => { log.push(name + ' setup'); return () => log.push(name + ' cleanup'); }, []); log.push(name + ' render'); return null; }
  let setShow: any; function App() { const [s, ss] = useState(false); setShow = ss; return <><E name="outside" /><StrictMode><E name="inside" />{s && <E name="later" />}</StrictMode></>; }
  await m(<App />); console.log('SCOPED', log.slice()); log.length = 0;
  await act(async () => setShow(true)); console.log('LATER', log.slice());
  log.length = 0;
  let setShow2: any; function App2() { const [s, ss] = useState(false); setShow2 = ss; return <StrictMode><E name="r1" />{s && <E name="late" />}</StrictMode>; }
  await m(<App2 />); log.length = 0; await act(async () => setShow2(true)); console.log('ROOT-STRICT LATER', log.slice());
});
test('useMemo second render reuse', async () => {
  let calls = 0; function C({ v }: any) { const x = useMemo(() => { calls++; return v * 2; }, [v]); return <i>{x}</i>; }
  const { root } = await m(<StrictMode><C v={1} /></StrictMode>); const a = calls; await act(async () => root.render(<StrictMode><C v={2} /></StrictMode>));
  console.log('USEMEMO calls after mount', a, 'after update', calls);
});
test('error reporting', async () => {
  const caught: string[] = [], unc: string[] = [];
  const c = document.createElement('div'); const root = createRoot(c, { onCaughtError: (e: any) => caught.push(e.message), onUncaughtError: (e: any) => unc.push(e.message) });
  class EB extends React.Component<any, any> { state = { e: false }; static getDerivedStateFromError() { return { e: true }; } render() { return this.state.e ? 'x' : this.props.children; } }
  function Bad(): any { throw new Error('bad'); }
  const o = console.error; console.error = () => {};
  await act(async () => root.render(<StrictMode><EB><Bad /></EB></StrictMode>));
  const root2 = createRoot(document.createElement('div'), { onCaughtError: (e: any) => caught.push('c2 ' + e.message), onUncaughtError: (e: any) => unc.push(e.message) });
  await act(async () => root2.render(<StrictMode><Bad /></StrictMode>));
  console.error = o; console.log('ERRORS caught', caught, 'uncaught', unc);
});
