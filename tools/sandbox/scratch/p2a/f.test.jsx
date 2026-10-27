import React, {useState,useEffect,useLayoutEffect,StrictMode,useDeferredValue,useRef,useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {act} from 'react';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
test('flushSync passive', async ()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  const log=[];
  function C(){const [n,setN]=useState(0); useEffect(()=>{log.push('passive '+n)}); log.push('render '+n); return <button onClick={()=>{ setTimeout(()=>{ flushSync(()=>setN(1)); log.push('flushSync returned'); },0)}}>{n}</button>}
  const c=document.createElement('div'); document.body.appendChild(c); const r=createRoot(c);
  r.render(<C/>); await sleep(50); log.length=0;
  c.querySelector('button').dispatchEvent(new MouseEvent('click',{bubbles:true})); await sleep(50);
  console.log('FLUSHSYNC', log.join(' | '));
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});
test('setTimeout update passive timing + effect setState task', async ()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  const log=[];
  function C(){const [n,setN]=useState(0); const [m,setM]=useState(0);
   useEffect(()=>{log.push('passive n='+n); if(n===1) setM(1)},[n]); log.push('render n='+n+' m='+m);
   return <button onClick={()=>{ setN(1); log.push('handler end'); queueMicrotask(()=>log.push('microtask')); setTimeout(()=>log.push('timeout0'),0) }}>{n}</button>}
  const c=document.createElement('div'); document.body.appendChild(c); const r=createRoot(c);
  r.render(<C/>); await sleep(50); log.length=0;
  c.querySelector('button').dispatchEvent(new MouseEvent('click',{bubbles:true})); log.push('dispatch returned'); await sleep(50);
  console.log('CLICK', log.join(' | '));
  log.length=0;
  // update from a timer (default lane)
  const c2=document.createElement('div'); document.body.appendChild(c2); const r2=createRoot(c2);
  function D(){const [n,setN]=useState(0); useEffect(()=>{log.push('passive '+n)}); log.push('render '+n); useLayoutEffect(()=>{log.push('layout '+n)}); return <i onClick={()=>{ setTimeout(()=>{setN(1); log.push('timer end')},0)}}>{n}</i>}
  r2.render(<D/>); await sleep(50); log.length=0;
  c2.querySelector('i').dispatchEvent(new MouseEvent('click',{bubbles:true})); await sleep(50);
  console.log('TIMER', log.join(' | '));
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});
test('strict counter', async ()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let counter=0; const out=[];
  function Guest(){ counter++; out.push(counter); return <p>{counter}</p>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<StrictMode><Guest/><Guest/><Guest/></StrictMode>));
  console.log('STRICTCOUNTER', out.join(','), c.textContent);
});
test('deferred object', async ()=>{
  const log=[];
  function C({q}){ const o={q}; const d=useDeferredValue(o); log.push('render '+q+' d='+d.q); return <i>{d.q}</i>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<C q="a"/>)); log.push('--'); await act(()=>r.render(<C q="b"/>));
  console.log('DEFERRED', log.join(' | ').slice(0,600), log.length);
});
test('rerender limit & useRef random', async ()=>{
  const err=console.error; console.error=()=>{};
  function Bad(){ const [n,setN]=useState(0); setN(n+1); return null}
  const c=document.createElement('div'); const r=createRoot(c);
  let msg; try{ await act(()=>r.render(<Bad/>)); }catch(e){msg=e.message}
  console.error=err; console.log('LIMIT', msg);
});
test('effect error', async ()=>{
  const log=[]; const err=console.error; console.error=()=>{};
  class EB extends React.Component{state={e:null}; static getDerivedStateFromError(e){return {e}} render(){return this.state.e? <b>err</b> : this.props.children}}
  function A(){ useEffect(()=>{log.push('A setup'); throw new Error('boom')},[]); return null}
  function B(){ useEffect(()=>{log.push('B setup')},[]); return null}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<><EB><A/></EB><B/></>)); console.error=err; console.log('EFFECTERR', log.join(' | '), c.innerHTML);
});
