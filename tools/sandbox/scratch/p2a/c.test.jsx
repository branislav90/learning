import React, {useEffect,useLayoutEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const mk=()=>{const c=document.createElement('div');document.body.appendChild(c);return [c,createRoot(c)]};
test('frag nested', async ()=>{
  const log=[];
  function Counter(){ const [n,setN]=useState(0); useEffect(()=>{log.push('mount');return()=>log.push('unmount')},[]); return <button onClick={()=>setN(n+1)}>{n}</button>}
  function A({w}){ return <div>{w? <><Counter/></> : <Counter/>}</div>}
  function B({w}){ return <div>{w? <><Counter/><i/></> : <Counter/>}</div>}
  function D({w}){ return w? <section><Counter/></section> : <div><Counter/></div>}
  function E({w}){ return <div>{w? <><Counter/></> : [<Counter key="a"/>]}</div>}
  for (const [nm,Cmp] of [['nested single frag',A],['nested frag + sibling',B],['div->section',D]]) {
  log.length=0; const [c,r]=mk();
  await act(()=>r.render(<Cmp w={false}/>)); await act(()=>c.querySelector('button').click());
  await act(()=>r.render(<Cmp w={true}/>)); console.log(nm, '=>', c.textContent, log.join()); }
});
test('flushSync in layout effect', async ()=>{
  const err=console.error; const errs=[]; console.error=(...a)=>errs.push(a.join(' ').slice(0,300));
  function C(){const [n,setN]=useState(0); useLayoutEffect(()=>{ flushSync(()=>setN(1)) },[]); return <i>{n}</i>}
  const [c,r]=mk(); await act(()=>r.render(<C/>)); console.error=err; console.log('flushSync layout', c.innerHTML, errs);
  const errs2=[]; console.error=(...a)=>errs2.push(a.join(' ').slice(0,300));
  function D(){ flushSync(()=>{}); return null}
  const [c2,r2]=mk(); await act(()=>r2.render(<D/>)); console.error=err; console.log('flushSync render', errs2);
});
