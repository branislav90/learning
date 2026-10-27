import React, {useState, StrictMode, useEffect} from 'react';
import {render, act, cleanup} from '@testing-library/react';
import {afterEach, test, vi} from 'vitest';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
const L=[]; const lg=(x)=>L.push(x);
test('race log order', async()=>{
  vi.useFakeTimers();
  globalThis.fetch=(url,{signal})=>new Promise((res,rej)=>{const ms=url.endsWith('1')?800:100;const t=setTimeout(()=>res({json:async()=>({name:'user'+url.slice(-1)})}),ms);signal.addEventListener('abort',()=>{clearTimeout(t);rej(new DOMException('x','AbortError'))})});
  function P({userId}){const [n,s]=useState('…');useEffect(()=>{const c=new AbortController();lg('setup '+userId);
    fetch('/api/users/'+userId,{signal:c.signal}).then(r=>r.json()).then(u=>{lg('apply '+userId);s(u.name)}).catch(()=>{if(c.signal.aborted)lg('aborted '+userId)});
    return()=>{lg('cleanup '+userId);c.abort()}},[userId]);return <h1>{n}</h1>}
  const r=render(<P userId="1"/>); await act(async()=>{vi.advanceTimersByTime(200)});
  await act(async()=>{r.rerender(<P userId="2"/>)}); await act(async()=>{vi.advanceTimersByTime(1000)});
  console.log('race:',L.join(' > '),'| screen',document.body.textContent); L.length=0; vi.useRealTimers();
});
test('probe', async()=>{
  function Pr({id,dep}){useEffect(()=>{lg(`setup ${id} ${dep}`);return()=>lg(`cleanup ${id} ${dep}`)},[dep]);return null}
  const r=render(<><Pr id="A" dep={0}/><Pr id="B" dep={0}/></>); L.length=0; r.rerender(<><Pr id="A" dep={1}/><Pr id="B" dep={1}/></>); console.log('probe:',L.join(' | ')); L.length=0;
});
test('scroll listeners', async()=>{
  let count=0; const add=window.addEventListener.bind(window), rem=window.removeEventListener.bind(window);
  window.addEventListener=(t,f,o)=>{if(t==='scroll')count++;add(t,f,o)}; window.removeEventListener=(t,f,o)=>{if(t==='scroll'&&true){ }; rem(t,f,o)};
  const live=new Set(); window.addEventListener=(t,f,o)=>{if(t==='scroll')live.add(f);add(t,f,o)}; window.removeEventListener=(t,f,o)=>{if(t==='scroll')live.delete(f);rem(t,f,o)};
  function C(){const [,s]=useState(0);useEffect(()=>{window.addEventListener('scroll',()=>s(1));return()=>window.removeEventListener('scroll',()=>s(1))},[]);return null}
  for(let i=0;i<3;i++){const r=render(<C/>);r.unmount()} console.log('prod live listeners after 3 cycles',live.size); live.clear();
  const r=render(<StrictMode><C/></StrictMode>); console.log('strict first mount',live.size); 
  window.addEventListener=add; window.removeEventListener=rem;
});
