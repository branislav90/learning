import React, {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('frag banner', async ()=>{
  const log=[];
  function Counter(){ const [n,setN]=useState(0); useEffect(()=>{log.push('mount');return()=>log.push('unmount')},[]); return <button onClick={()=>setN(n+1)}>{n}</button>}
  const Banner=()=><b/>;
  function A({w}){ return <div>{w? <><Banner/><Counter/></> : <Counter/>}</div>}
  function B({w}){ return <div>{w? <Banner/> : null}<Counter/></div>}
  function C({w}){ return w? <><Banner/><Counter/></> : <Counter/>}
  for (const [nm,Cmp] of [['banner-first frag in div',A],['cond &&',B],['banner-first top-level',C]]) {
  log.length=0; const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<Cmp w={false}/>)); await act(()=>c.querySelector('button').click());
  await act(()=>r.render(<Cmp w={true}/>)); console.log(nm, '=>', c.textContent, log.join()); }
});
