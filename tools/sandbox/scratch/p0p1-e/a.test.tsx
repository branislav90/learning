// @vitest-environment jsdom
import React, {StrictMode, useState, useMemo, useEffect, useRef, act} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {test, expect} from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
function mount(el: React.ReactElement){const c=document.createElement('div');document.body.appendChild(c);const r=createRoot(c);act(()=>r.render(el));return {c,r};}
test('counter strict', ()=>{
  let renders=0;
  function Counter(){renders++;return <p>Rendered {renders} times</p>}
  const {c}=mount(<StrictMode><Counter/><Counter/></StrictMode>);
  console.log('STRICT', c.innerHTML);
  renders=0;
  const m=mount(<><Counter/><Counter/></>);
  console.log('PLAIN', m.c.innerHTML);
});
test('strict misc', ()=>{
  const log:string[]=[];
  function C(){
    const [n,setN]=useState(()=>{log.push('init');return 0});
    const m=useMemo(()=>{log.push('memo');return {}},[]);
    log.push('render');
    useEffect(()=>{log.push('setup');return ()=>log.push('cleanup')},[]);
    const ref=(el:any)=>{log.push('ref '+(el?'attach':'detach'))};
    (globalThis as any).setN=setN;
    return <i ref={ref} onClick={()=>setN(p=>{log.push('upd');return p+1})}>{n}</i>
  }
  const {c}=mount(<StrictMode><C/></StrictMode>);
  console.log('MOUNT', log.join(','));
  log.length=0;
  act(()=>{(c.firstChild as HTMLElement).click()});
  console.log('CLICK', log.join(','), c.innerHTML);
});
test('batching', async()=>{
  let renders=0;
  function C(){const [a,sa]=useState(0);const [b,sb]=useState(0);renders++;
    (globalThis as any).go=()=>{sa(1);sb(1)};return <i>{a}{b}</i>}
  mount(<C/>); renders=0;
  await act(async()=>{await new Promise<void>(r=>setTimeout(()=>{(globalThis as any).go();r()},0))});
  console.log('TIMEOUT renders', renders);
  renders=0;
  await act(async()=>{(globalThis as any).go=()=>{flushSync(()=>{});};});
});
test('form reset', async()=>{
  function F(){
    const [t,setT]=useState('x');
    return <form action={async(fd:FormData)=>{await Promise.resolve()}}>
      <input name="t" value={t} onChange={e=>setT(e.target.value)}/>
      <input name="n" defaultValue="def"/>
      <button>go</button></form>}
  const {c}=mount(<F/>);
  const ins=c.querySelectorAll('input');
  await act(async()=>{ins[0].value='typed';ins[0].dispatchEvent(new Event('input',{bubbles:true}));});
  (ins[1] as HTMLInputElement).value='typed2';
  console.log('before', (ins[0] as any).value,(ins[1] as any).value);
  await act(async()=>{(c.querySelector('button') as HTMLButtonElement).click();});
  await act(async()=>{await new Promise(r=>setTimeout(r,20))});
  console.log('after', (ins[0] as any).value,(ins[1] as any).value);
});
