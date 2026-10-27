import React, {useEffect,useLayoutEffect,useState,Fragment,flushSync} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const mk=()=>{const c=document.createElement('div');document.body.appendChild(c);return [c,createRoot(c)]};
test('fragment state', async ()=>{
  const log=[];
  function Counter(){ const [n,setN]=useState(0); useEffect(()=>{log.push('mount');return()=>log.push('unmount')},[]); return <button onClick={()=>setN(n+1)}>{n}</button>}
  function App({w}){ return w? <><Counter/></> : <Counter/>}
  function App2({w}){ return w? <><Counter/><i/></> : <Counter/>}
  const [c,r]=mk();
  await act(()=>r.render(<App w={false}/>)); await act(()=>c.querySelector('button').click());
  await act(()=>r.render(<App w={true}/>)); console.log('top-level frag wrap: ', c.textContent, log.join());
  log.length=0;
  const [c2,r2]=mk();
  await act(()=>r2.render(<App2 w={false}/>)); await act(()=>c2.querySelector('button').click());
  await act(()=>r2.render(<App2 w={true}/>)); console.log('frag two children: ', c2.textContent, log.join());
  // nested fragment not at top
  function App3({w}){ return <div>{w? <><Counter/></> : <Counter/>}</div>}
  log.length=0; const [c3,r3]=mk();
  await act(()=>r3.render(<App3 w={false}/>)); await act(()=>c3.querySelector('button').click());
  await act(()=>r3.render(<App3 w={true}/>)); console.log('nested frag in div: ', c3.textContent, log.join());
});
test('dup keys', async ()=>{
  const err=console.error; const errs=[]; console.error=(...a)=>errs.push(a.join(' ').slice(0,200));
  const [c,r]=mk();
  const L=({items})=><ul>{items.map(i=><li key={i.k}>{i.t}</li>)}</ul>;
  await act(()=>r.render(<L items={[{k:1,t:'a'},{k:1,t:'b'},{k:2,t:'c'}]}/>)); console.log('dup initial', c.innerHTML);
  await act(()=>r.render(<L items={[{k:2,t:'c'},{k:1,t:'a'},{k:1,t:'b'}]}/>)); console.log('dup after', c.innerHTML);
  await act(()=>r.render(<L items={[{k:1,t:'b'}]}/>)); console.log('dup after2', c.innerHTML);
  console.error=err; console.log(errs);
});
test('key spread', async ()=>{
  const err=console.error; const errs=[]; console.error=(...a)=>errs.push(a.join(' ').slice(0,300));
  const [c,r]=mk(); const props={key:'x',id:'a'};
  await act(()=>r.render(<div {...props}/>)); 
  console.error=err; console.log('keyspread', errs);
  const errs2=[]; console.error=(...a)=>errs2.push(a.join(' ').slice(0,300));
  const o={id:'a'}; await act(()=>r.render(<div {...o} key="y"/>)); console.error=err; console.log('keyafter', errs2);
});
test('discrete passive', async ()=>{
  const log=[];
  function C(){const [n,setN]=useState(0); log.push('render '+n); useEffect(()=>{log.push('passive '+n)}); return <button onClick={()=>{setN(n+1); log.push('handler end')}}>{n}</button>}
  const [c,r]=mk(); await act(()=>r.render(<C/>)); log.length=0;
  // click outside act to observe real scheduling
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  c.querySelector('button').dispatchEvent(new MouseEvent('click',{bubbles:true}));
  log.push('after dispatch (sync)');
  await new Promise(r=>setTimeout(r,50)); 
  console.log('discrete', log.join(' | '));
  log.length=0;
  // non discrete: setTimeout
  setTimeout(()=>{ },0);
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});
test('flushSync in layout effect', async ()=>{
  const err=console.error; const errs=[]; console.error=(...a)=>errs.push(a.join(' ').slice(0,300));
  function C(){const [n,setN]=useState(0); useLayoutEffect(()=>{ flushSync(()=>setN(1)) },[]); return <i>{n}</i>}
  const [c,r]=mk(); await act(()=>r.render(<C/>)); console.error=err; console.log('flushSync layout', c.innerHTML, errs);
});
