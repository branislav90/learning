// @vitest-environment jsdom
import React, {StrictMode, useState, useMemo, useCallback, useEffect, act} from 'react';
import {createRoot} from 'react-dom/client';
import {test} from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
function mount(el: React.ReactElement){const c=document.createElement('div');document.body.appendChild(c);const r=createRoot(c);act(()=>r.render(el));return {c,r};}
function setVal(el:HTMLInputElement,v:string){Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));}
test('form reset', async()=>{
  function F(){
    const [t,setT]=useState('x');
    return <form action={async()=>{await Promise.resolve()}}>
      <input name="t" value={t} onChange={e=>setT(e.target.value)}/>
      <input name="n" defaultValue="def"/><button>go</button></form>}
  const {c}=mount(<F/>);
  const ins=c.querySelectorAll('input');
  await act(async()=>{setVal(ins[0],'typed');});
  await act(async()=>{setVal(ins[1],'typed2');});
  console.log('before', ins[0].value,ins[1].value);
  await act(async()=>{c.querySelector('button')!.click();});
  await act(async()=>{await new Promise(r=>setTimeout(r,20))});
  console.log('after', ins[0].value,ins[1].value);
});
test('memo on update', ()=>{
  const log:string[]=[];
  function C(){const [n,setN]=useState(0);
    const m=useMemo(()=>{log.push('memo'+n);return n},[n]);
    log.push('render');
    return <button onClick={()=>setN(n+1)}>{m}</button>}
  const {c}=mount(<StrictMode><C/></StrictMode>);
  log.length=0; act(()=>c.querySelector('button')!.click());
  console.log('UPD', log.join(','));
});
test('updater order & batching in handler', ()=>{
  let r=0;
  function C(){const [n,setN]=useState(0);r++;
    return <button onClick={()=>{setN(n+1);setN(n+1);setN(x=>x+1)}}>{n}</button>}
  const {c}=mount(<C/>); r=0; act(()=>c.querySelector('button')!.click());
  console.log('BATCH', c.innerHTML, r);
});
test('state preservation', ()=>{
  function K({k}:{k:number}){const [n,setN]=useState(0);return <button onClick={()=>setN(n+1)}>{k}:{n}</button>}
  function A({flag,key2}:{flag:boolean,key2?:number}){return flag? <div><K k={1}/></div> : <section><K k={2}/></section>}
  const {c,r}=mount(<A flag={true}/>);
  act(()=>c.querySelector('button')!.click());
  act(()=>r.render(<A flag={false}/>)); console.log('diff-type', c.innerHTML);
  function B({p}:{p:boolean}){return p? <K k={1}/>: <K k={2}/>}
  const m=mount(<B p={true}/>); act(()=>m.c.querySelector('button')!.click());
  act(()=>m.r.render(<B p={false}/>)); console.log('same-type', m.c.innerHTML);
  function D({p}:{p:boolean}){return p? <K k={1}/>: null}
  const e=mount(<><K k={9}/></>);
});
