import React, {useState,Suspense,use,useEffect,useLayoutEffect,Activity,useEffectEvent,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
test('suspense hides', async ()=>{
  const log=[]; let resolve; let p=null; let setP;
  function Kid(){ useLayoutEffect(()=>{log.push('kid L setup');return()=>log.push('kid L cleanup')},[]); useEffect(()=>{log.push('kid P setup');return()=>log.push('kid P cleanup')},[]); return <b>kid</b>}
  function Sus({p}){ if(p) use(p); return null}
  function App(){ const [pr,sp]=useState(null); setP=sp; return <Suspense fallback={<u>fb</u>}><Kid/><Sus p={pr}/></Suspense>}
  const c=document.createElement('div'); const r=createRoot(c); await act(()=>r.render(<App/>)); log.length=0;
  const pr=new Promise(r=>resolve=r);
  await act(()=>{ setP(pr) }); log.push('after suspend: '+c.innerHTML);
  await act(async()=>{ resolve(1); await pr; setP(null)}); log.push('after resolve: '+c.innerHTML);
  console.log('SUSPHIDE', log.join(' | '));
});
test('activity', async ()=>{
  const log=[]; let setM;
  function Kid(){ useLayoutEffect(()=>{log.push('L setup');return()=>log.push('L cleanup')},[]); useEffect(()=>{log.push('P setup');return()=>log.push('P cleanup')},[]); log.push('render'); return <b>kid</b>}
  function App(){ const [m,sm]=useState('visible'); setM=sm; return <Activity mode={m}><Kid/></Activity>}
  const c=document.createElement('div'); const r=createRoot(c); await act(()=>r.render(<App/>)); log.push('--hide'); 
  await act(()=>setM('hidden')); log.push('DOM:'+c.innerHTML); log.push('--show'); await act(()=>setM('visible'));
  console.log('ACTIVITY', log.join(' | '));
});
test('useEffectEvent', async ()=>{
  const log=[]; let setT;
  function C({theme}){ const onE=useEffectEvent(()=>log.push('theme='+theme)); useEffect(()=>{ onE(); },[]); return <i/> }
  function App(){const [t,st]=useState('a'); setT=st; return <C theme={t}/>}
  const c=document.createElement('div'); const r=createRoot(c); await act(()=>r.render(<App/>)); await act(()=>setT('b'));
  console.log('EFFECTEVENT', log.join(','));
});
