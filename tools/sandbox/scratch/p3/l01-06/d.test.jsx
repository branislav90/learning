import React, {useState, StrictMode, useEffect, useLayoutEffect, useEffectEvent, useRef, Activity, useInsertionEffect} from 'react';
import {render, screen, act, cleanup} from '@testing-library/react';
import {afterEach, test, vi} from 'vitest';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
const L=[]; const lg=(x)=>L.push(x); const dump=(t)=>{console.log(t+': '+L.join(' | '));L.length=0};
test('chat room prod/strict', async()=>{
  function Room({id}){const [d,s]=useState('');useEffect(()=>{lg('connect '+id);return()=>lg('disconnect '+id)},[id]);return <input value={d} onChange={e=>s(e.target.value)}/>}
  let r=render(<Room id="general"/>); r.rerender(<Room id="random"/>); r.unmount(); dump('prod');
  r=render(<StrictMode><Room id="general"/></StrictMode>); dump('strict mount'); r.rerender(<StrictMode><Room id="random"/></StrictMode>); dump('strict switch'); r.unmount(); dump('strict unmount');
});
test('order across components', async()=>{
  function Ch({v}){useLayoutEffect(()=>{lg('Ch layout setup');return()=>lg('Ch layout cleanup')},[v]);useEffect(()=>{lg('Ch setup');return()=>lg('Ch cleanup')},[v]);return null}
  function Ch2({v}){useEffect(()=>{lg('Ch2 setup');return()=>lg('Ch2 cleanup')},[v]);return null}
  function P({v}){useEffect(()=>{lg('P e1 setup');return()=>lg('P e1 cleanup')},[v]);useEffect(()=>{lg('P e2 setup');return()=>lg('P e2 cleanup')},[v]);return <><Ch v={v}/><Ch2 v={v}/></>}
  const r=render(<P v={1}/>); dump('mount'); r.rerender(<P v={2}/>); dump('update'); r.unmount(); dump('unmount');
});
test('discrete event sync passive flush', async()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT=false;
  let ran=false; function C(){const [n,s]=useState(0);useEffect(()=>{ran=true},[n]);return <button onClick={()=>s(1)}>b</button>}
  const root=(await import('react-dom/client')).createRoot(document.body.appendChild(document.createElement('div')));
  root.render(<C/>); await new Promise(r=>setTimeout(r,50)); ran=false;
  document.querySelector('button').click(); // discrete event dispatched via DOM
  console.log('effect ran synchronously after click()?', ran);
  await new Promise(r=>setTimeout(r,50)); console.log('later', ran);
  // non-discrete: setState from timeout
  ran=false; let set; function D(){const [n,s]=useState(0);set=s;useEffect(()=>{ran=true},[n]);return null}
  const root2=(await import('react-dom/client')).createRoot(document.body.appendChild(document.createElement('div')));
  root2.render(<D/>); await new Promise(r=>setTimeout(r,50)); ran=false;
  await new Promise(res=>setTimeout(()=>{set(1); const t=Date.now(); queueMicrotask(()=>{console.log('after timeout set, microtask: ran?',ran);res()})},0));
  await new Promise(r=>setTimeout(r,50)); console.log('timeout-set later', ran);
  globalThis.IS_REACT_ACT_ENVIRONMENT=true;
});
test('async effect warning', async()=>{
  const e=vi.spyOn(console,'error').mockImplementation(()=>{});
  function C(){useEffect(async()=>{},[]);return null} render(<C/>);
  console.log('async warn:', e.mock.calls.map(c=>String(c[0]).slice(0,200)+' // '+String(c[1]||'').slice(0,100)).join('\n')); e.mockRestore();
});
test('deps size warning', async()=>{
  const e=vi.spyOn(console,'error').mockImplementation(()=>{});
  function C({a}){useEffect(()=>{},a);return null} const r=render(<C a={[1]}/>); r.rerender(<C a={[1,2]}/>);
  console.log('size warn:', e.mock.calls.map(c=>String(c[0]).slice(0,120)+' '+(c[1]||'')+' '+(c[2]||'')).join('\n')); e.mockRestore();
});
test('useEffectEvent', async()=>{
  const ids=[]; 
  function R({id,theme}){const ev=useEffectEvent(()=>lg('evt theme='+theme));ids.push(ev);
    useEffect(()=>{lg('connect '+id);ev();return()=>lg('disc '+id)},[id]);return null}
  const r=render(<R id="a" theme="light"/>); r.rerender(<R id="a" theme="dark"/>); dump('ee rerender theme (no reconnect)');
  console.log('identity stable across renders?', ids[0]===ids[1]);
  function Lay({t}){const ev=useEffectEvent(()=>lg('layout ev '+t));useLayoutEffect(()=>{ev()},[]);useInsertionEffect(()=>{ev()},[]);return null}
  render(<Lay t="x"/>); dump('layout/insertion ok');
  const e=vi.spyOn(console,'error').mockImplementation(()=>{});
  function Bad(){const ev=useEffectEvent(()=>1);try{ev()}catch(err){lg('render call threw: '+err.message)}return null}
  render(<Bad/>); dump('bad'); e.mockRestore();
});
test('Activity', async()=>{
  function K(){useLayoutEffect(()=>{lg('layout setup');return()=>lg('layout cleanup')},[]);useEffect(()=>{lg('effect setup');return()=>lg('effect cleanup')},[]);const [n]=useState(()=>{lg('state init');return 0});return <p>kid</p>}
  const r=render(<Activity mode="visible"><K/></Activity>); dump('visible mount');
  r.rerender(<Activity mode="hidden"><K/></Activity>); dump('hide');
  console.log('display of hidden', document.querySelector('p').parentElement.outerHTML, document.querySelector('p').style.display);
  r.rerender(<Activity mode="visible"><K/></Activity>); dump('show');
  r.rerender(<Activity mode="hidden"><K/></Activity>); dump('hide again');
  r.unmount(); dump('unmount hidden');
  const r2=render(<Activity mode="hidden"><K/></Activity>); dump('mount hidden');
});
test('stale interval', async()=>{
  vi.useFakeTimers(); const seen=[]; let set;
  function T(){const [c,s]=useState(0);set=s;useEffect(()=>{const id=setInterval(()=>seen.push(c),1000);return()=>clearInterval(id)},[]);return null}
  render(<T/>); await act(async()=>set(5)); vi.advanceTimersByTime(2000); console.log('stale seen',seen.join()); vi.useRealTimers();
});
