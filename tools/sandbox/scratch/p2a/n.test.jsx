import React, {useState,startTransition,useTransition,Suspense,use,useLayoutEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
test('B1 queue', async ()=>{
  const commits=[]; let fire;
  function C(){ const [s,setS]=useState(''); useLayoutEffect(()=>{commits.push(s)}); fire=()=>{ startTransition(()=>setS(x=>x+'A')); setS(x=>x+'B'); startTransition(()=>setS(x=>x+'C')); }; return <b>{s}</b>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<C/>)); commits.length=0;
  await act(()=>{fire()}); console.log('B1COMMITS', JSON.stringify(commits));
});
test('suspend in transition', async ()=>{
  const log=[]; let resolve; const p=new Promise(r=>resolve=r); 
  const Reports=()=>{ log.push('Reports render'); const v=use(p); return <i>{v}</i>};
  function App(){ const [tab,setTab]=useState('home'); const [pending,st]=useTransition();
    useLayoutEffect(()=>{log.push('commit tab='+tab+' pending='+pending)});
    return <><button onClick={()=>st(()=>setTab('reports'))}>go</button><Suspense fallback={<u>spin</u>}>{tab==='home'?<em>home</em>:<Reports/>}</Suspense></>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<App/>)); log.length=0;
  await act(()=>{c.querySelector('button').click()}); log.push('DOM: '+c.innerHTML.replace(/<button>go<\/button>/,''));
  await act(async()=>{resolve('data'); await p;}); log.push('DOM: '+c.innerHTML.replace(/<button>go<\/button>/,''));
  console.log('SUSP', log.join(' | '));
});
