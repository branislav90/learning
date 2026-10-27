// @vitest-environment jsdom
import React, {useState, useEffect, StrictMode, act} from 'react';
import {createRoot} from 'react-dom/client';
import {test, vi} from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
function mount(el: React.ReactElement){const c=document.createElement('div');document.body.appendChild(c);const r=createRoot(c);act(()=>r.render(el));return {c,r};}
test('84', ()=>{
  function C(){const [c,s]=useState(0);return <button onClick={()=>{s(c+5);s(x=>x+1);s(42);s(x=>x*2)}}>{c}</button>}
  const {c}=mount(<C/>);act(()=>c.querySelector('button')!.click());console.log('R84',c.textContent);
});
test('effects order', ()=>{
  const log:string[]=[];
  function A(){log.push('child render');useEffect(()=>{log.push('child effect')},[]);return null}
  function P(){log.push('parent render');useEffect(()=>{log.push('parent effect')},[]);return <A/>}
  mount(<P/>);console.log('EFF',log.join(','));
  const l2:string[]=[];
  function E(){const [n,s]=useState(0);useEffect(()=>{l2.push('A')});useEffect(()=>{l2.push('B')},[]);useEffect(()=>{l2.push('C')},[n]);return <button onClick={()=>s(n+1)}/>}
  const {c}=mount(<E/>);console.log('MOUNT',l2.join(''));l2.length=0;act(()=>c.querySelector('button')!.click());console.log('CLICK',l2.join(''));
  const l3:string[]=[];
  function E3(){useEffect(()=>{l3.push('A')});useEffect(()=>{l3.push('B')},[]);return null}
  mount(<StrictMode><E3/></StrictMode>);console.log('STRICTEFF',l3.join(''));
});
test('interval strict', async()=>{
  vi.useFakeTimers();let ticks=0;
  function T(){const [,s]=useState(0);useEffect(()=>{setInterval(()=>{ticks++;s(t=>t+1)},1000)},[]);return null}
  const {r}=mount(<StrictMode><T/></StrictMode>);
  await act(async()=>{vi.advanceTimersByTime(3000)});console.log('TICKS 3s',ticks);
  act(()=>r.unmount());ticks=0;vi.advanceTimersByTime(3000);console.log('after unmount ticks',ticks);vi.useRealTimers();
});
test('controlled no handler & nested def', ()=>{
  const err=vi.spyOn(console,'error').mockImplementation(()=>{});
  function S(){const [t,st]=useState('hi');return <><input id="a" value="fixed"/><input id="b" value={t}/><input id="c" value={t} onChange={e=>st(e.target.value)}/></>}
  mount(<S/>);console.log('WARN',err.mock.calls.length, String(err.mock.calls[0]?.[0]).slice(0,60));
  err.mockRestore();
  function Outer(){const [n,s]=useState('');function Field(){return <input id="f" value={n} onChange={e=>s(e.target.value)}/>};return <Field/>}
  const {c}=mount(<Outer/>);const i1=c.querySelector('input');
  const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!;
  act(()=>{setter.call(i1,'a');i1!.dispatchEvent(new Event('input',{bubbles:true}))});
  console.log('SAME NODE after typing (nested def)', c.querySelector('input')===i1);
});
