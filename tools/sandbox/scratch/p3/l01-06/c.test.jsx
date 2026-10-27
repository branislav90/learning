import React, {useReducer, useState, StrictMode} from 'react';
import {render, screen, act, cleanup} from '@testing-library/react';
import {afterEach, test} from 'vitest';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
test('reducer of current render', async()=>{
  let d,setStep;
  function C({step}){ const [s,dispatch]=useReducer((st,a)=>st+step,0); d=dispatch; return <p>{s}</p>}
  const {rerender}=render(<C step={1}/>);
  // dispatch then rerender with different step in same batch
  await act(async()=>{ d({}); rerender(<C step={100}/>)});
  console.log('reducer used', document.body.textContent);
});
test('strict reducer+init', async()=>{
  const calls={r:0,i:0}; let d;
  function C(){const [s,dispatch]=useReducer((s,a)=>{calls.r++;return s+1},null,()=>{calls.i++;return 0});d=dispatch;return <p>{s}</p>}
  render(<StrictMode><C/></StrictMode>); await act(async()=>d()); console.log('strict calls',JSON.stringify(calls));
});
test('bail same ref', async()=>{
  let n=0,d; function C(){n++;const [s,dispatch]=useReducer(s=>s,{a:1});d=dispatch;return null}
  render(<C/>); n=0; for(let i=0;i<3;i++) await act(async()=>d()); console.log('same ref renders',n);
});
