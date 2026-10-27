import React, {useState, useEffect} from 'react';
import {render, act, cleanup} from '@testing-library/react';
import {afterEach, test, vi} from 'vitest';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
test('Ticker', async()=>{
  vi.useFakeTimers();
  function T({step}){const [t,s]=useState(0);useEffect(()=>{const id=setInterval(()=>s(x=>x+step),1000);return()=>clearInterval(id)},[]);return <p>{t}</p>}
  const r=render(<T step={1}/>); await act(async()=>{vi.advanceTimersByTime(2500)}); r.rerender(<T step={10}/>); await act(async()=>{vi.advanceTimersByTime(1500)});
  console.log('Ticker total at 4s:',document.body.textContent); vi.useRealTimers();
});
test('effect set loop', async()=>{
  const errs=[]; const e=vi.spyOn(console,'error').mockImplementation((...a)=>errs.push(String(a[0]).slice(0,160)));
  let n=0,stop=false;
  function C(){const [d,sd]=useState([]);n++;useEffect(()=>{ if(n<3000) sd([1,2,3])},[d]);return null}
  await act(async()=>{render(<C/>)});
  console.log('renders',n,'console.error',errs.length, errs[0]); e.mockRestore();
});
test('B2 interval restarts', async()=>{
  vi.useFakeTimers(); let created=0,cleared=0,set;
  function C(){const [c,s]=useState(0);set=s;useEffect(()=>{created++;const id=setInterval(()=>{},1000);return()=>{cleared++;clearInterval(id)}},[c]);return null}
  const r=render(<C/>); for(const v of [1,2,3]) await act(async()=>set(v)); console.log('created',created,'cleared',cleared); r.unmount(); console.log('after unmount cleared',cleared); vi.useRealTimers();
});
