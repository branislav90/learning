import React, {useState, StrictMode, startTransition, useTransition} from 'react';
import {render, screen, act, cleanup} from '@testing-library/react';
import {afterEach, test, expect} from 'vitest';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
test('rebase', async () => {
  const seen=[]; let setQ;
  function C(){const [q,s]=useState(1);setQ=s;seen.push(q);return <p>{q}</p>}
  render(<C/>);
  // Make the transition render suspend/yield: act with transition then urgent in same batch
  await act(async()=>{
    startTransition(()=>setQ(x=>x+10));
    setQ(x=>x*2);
  });
  console.log('rebase seen', seen.join(','));
});
test('votes', async () => {
  const calls=[]; let h; let renders=0;
  function V(){const [v,sv]=useState(3);const [l,sl]=useState([]);renders++;
    h=()=>{sv(x=>{calls.push('+1');return x+1});sv(x=>{calls.push('*10');return x*10});sl(a=>[...a,'snap '+v])};
    return <p>{v}|{l.join()}</p>}
  render(<V/>); calls.length=0; renders=0;
  await act(async()=>h()); console.log('votes', document.body.textContent, 'renders',renders,calls.join());
  cleanup(); calls.length=0; renders=0;
  render(<StrictMode><V/></StrictMode>); renders=0; calls.length=0;
  await act(async()=>h()); console.log('strict votes', document.body.textContent,'renders',renders,calls.join());
});
test('function state', async()=>{
  let set; function C(){const [f,s]=useState(()=>(a,b)=>a-b);set=s;return <p>{typeof f}</p>}
  render(<C/>); await act(async()=>set((a,b)=>b-a)); console.log('fn state type',document.body.textContent);
});
