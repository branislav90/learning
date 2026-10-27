import React, {useState, StrictMode, useEffect, useLayoutEffect, useRef, Suspense, Component, use} from 'react';
import {render, act, cleanup} from '@testing-library/react';
import {afterEach, test, vi} from 'vitest';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
const L=[]; const lg=(x)=>L.push(x); const dump=(t)=>{console.log(t+': '+L.join(' | '));L.length=0};
test('DOM detached at passive cleanup', async()=>{
  function K(){const r=useRef();useEffect(()=>{const n=r.current;return()=>lg('passive cleanup connected='+n.isConnected)},[]);useLayoutEffect(()=>{const n=r.current;return()=>lg('layout cleanup connected='+n.isConnected)},[]);return <p ref={r}/>}
  const r=render(<K/>); r.unmount(); dump('unmount');
});
test('error in cleanup', async()=>{
  const e=vi.spyOn(console,'error').mockImplementation(()=>{});
  class EB extends Component{state={e:null};static getDerivedStateFromError(e){return{e}};render(){return this.state.e?<p>caught {this.state.e.message}</p>:this.props.children}}
  function K({v}){useEffect(()=>()=>{throw new Error('boom')},[v]);return <p>ok</p>}
  const r=render(<EB><K v={1}/></EB>); await act(async()=>r.rerender(<EB><K v={2}/></EB>)); console.log('cleanup err ->', document.body.textContent); e.mockRestore();
});
test('ref callback cleanup', async()=>{
  const r=render(<div ref={(el)=>{lg('ref set '+(el&&el.tagName));return()=>lg('ref cleanup')}}/>); dump('mount'); r.unmount(); dump('unmount');
  const r2=render(<StrictMode><div ref={(el)=>{lg('S ref set '+(el&&el.tagName));return()=>lg('S ref cleanup')}}/></StrictMode>); dump('strict mount');
  const r3=render(<div ref={(el)=>{lg('old-style ref '+(el&&el.tagName))}}/>); r3.unmount(); dump('old style');
  const cb1=(el)=>{lg('cb1 '+el)}; const cb2=(el)=>{lg('cb2 '+el)};
  const r4=render(<div ref={cb1}/>); r4.rerender(<div ref={cb2}/>); dump('swap');
});
test('Suspense re-suspend', async()=>{
  let res; const pr=new Promise(r=>res=r); let p2;
  function K(){useLayoutEffect(()=>{lg('K layout setup');return()=>lg('K layout cleanup')},[]);useEffect(()=>{lg('K effect setup');return()=>lg('K effect cleanup')},[]);return <p>k</p>}
  function S({p}){ if(p) use(p); return null}
  const r=render(<Suspense fallback={<i>fb</i>}><K/><S p={null}/></Suspense>); dump('mount');
  let resolve; const pending=new Promise(r=>resolve=r);
  r.rerender(<Suspense fallback={<i>fb</i>}><K/><S p={pending}/></Suspense>); dump('re-suspend (sync)');
  await act(async()=>{}); dump('after act'); console.log(document.body.innerHTML);
  await act(async()=>{resolve()}); r.rerender(<Suspense fallback={<i>fb</i>}><K/><S p={null}/></Suspense>); dump('resolved');
});
