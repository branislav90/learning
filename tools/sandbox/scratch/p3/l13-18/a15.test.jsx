import React, { StrictMode, useEffect, useRef, useState, useCallback, useSyncExternalStore } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
function useDebouncedValue(value, delayMs){const [d,setD]=useState(value);useEffect(()=>{const id=setTimeout(()=>setD(value),delayMs);return()=>clearTimeout(id)},[value,delayMs]);return d}
test('15 debounce', async () => {
  vi.useFakeTimers(); let renders=0,eff=0;
  function S(){const [t,setT]=useState('');const d=useDebouncedValue(t,300);renders++;useEffect(()=>{eff++},[d]);return <input value={t} onChange={e=>setT(e.target.value)} data-d={d}/>}
  render(<S/>); const i=screen.getByRole('textbox'); const r0=renders,e0=eff;
  for(const v of ['r','re','rea']){fireEvent.change(i,{target:{value:v}});await act(()=>vi.advanceTimersByTimeAsync(100))}
  await act(()=>vi.advanceTimersByTimeAsync(400));
  console.log('debounce renders since mount',renders-r0,'effect(d) runs',eff-e0,'d=',i.dataset.d);
  vi.useRealTimers();
});
test('15 useJson strict mode requests', async () => {
  const calls=[]; globalThis.fetch=vi.fn((u,{signal})=>{calls.push(u);return new Promise((res,rej)=>{signal.addEventListener('abort',()=>rej(new DOMException('a','AbortError')));setTimeout(()=>res({ok:true,json:async()=>({x:1})}),10)})});
  function useJson(url){const [s,setS]=useState({status:'idle'});useEffect(()=>{if(url===null){setS({status:'idle'});return}const c=new AbortController();setS({status:'loading'});fetch(url,{signal:c.signal}).then(r=>{if(!r.ok)throw new Error('x');return r.json()}).then(data=>setS({status:'success',data})).catch(e=>{if(c.signal.aborted)return;setS({status:'error',error:e})});return()=>c.abort()},[url]);return s}
  function C(){const s=useJson('/a');return <p>{s.status}</p>}
  const r=render(<StrictMode><C/></StrictMode>); await act(()=>new Promise(r=>setTimeout(r,50)));
  console.log('useJson strict fetch calls',calls.length,r.container.textContent);
});
test('15 useEventListener ordering/latest', () => {
  function useEL(type,handler){const hr=useRef(handler);useEffect(()=>{hr.current=handler});useEffect(()=>{const l=e=>hr.current(e);window.addEventListener(type,l);return()=>window.removeEventListener(type,l)},[type])}
  const seen=[]; let adds=0; const orig=window.addEventListener.bind(window); window.addEventListener=(...a)=>{if(a[0]==='foo')adds++;return orig(...a)};
  function C(){const [n,setN]=useState(0);useEL('foo',()=>seen.push(n));return <button onClick={()=>setN(n+1)}>b</button>}
  render(<C/>); fireEvent.click(screen.getByText('b')); fireEvent.click(screen.getByText('b')); window.dispatchEvent(new Event('foo'));
  console.log('EL seen',seen,'adds',adds); window.addEventListener=orig;
});
test('15 usePersistentState + SSR', () => {
  function usePS(key,initial){const initialRef=useRef(initial);
    const subscribe=useCallback(cb=>{const f=e=>{if(e.key===key||e.key===null)cb()};window.addEventListener('storage',f);window.addEventListener('local:'+key,cb);return()=>{window.removeEventListener('storage',f);window.removeEventListener('local:'+key,cb)}},[key]);
    const raw=useSyncExternalStore(subscribe,()=>window.localStorage.getItem(key),()=>null);
    const value=raw===null?initialRef.current:JSON.parse(raw);
    const set=useCallback(next=>{const pr=localStorage.getItem(key);const prev=pr===null?initialRef.current:JSON.parse(pr);const res=typeof next==='function'?next(prev):next;localStorage.setItem(key,JSON.stringify(res));window.dispatchEvent(new Event('local:'+key))},[key]);return [value,set]}
  function C(){const [v,set]=usePS('k',1);return <button onClick={()=>set(x=>x+1)}>{v}</button>}
  render(<C/>); fireEvent.click(screen.getByRole('button')); fireEvent.click(screen.getByRole('button'));
  console.log('persist',screen.getByRole('button').textContent, localStorage.getItem('k'));
});
