import React, {useState,useTransition,startTransition,memo,useDeferredValue} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function busy(ms){const t=performance.now(); while(performance.now()-t<ms);}
test('5.1', async ()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const log=[];
  function Demo(){ const [u,setU]=useState(0); const [s,setS]=useState(0); const [p,st]=useTransition();
    log.push(`render ${u} ${s} ${p}`);
    return <button onClick={()=>{ st(()=>setS(x=>x+1)); setU(x=>x+1)}}>x</button>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<Demo/>)); log.length=0;
  await act(()=>c.querySelector('button').click()); console.log('DEMO51', log.join(' | '));
});
test('slicing', async ()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  const marks=[]; 
  const Row=memo(function Row({i, tag}){ busy(0.5); marks.push([tag, i, performance.now()]); return <li>{i}</li>});
  function List({tag, n}){ return <ul>{Array.from({length:n},(_,i)=><Row key={i} i={i} tag={tag+n}/>)}</ul>}
  let setN, setNT;
  function App(){ const [n,sn]=useState(0); const [m,sm]=useState(0); setN=sn; setNT=sm;
    return <><List tag="default" n={n}/><List tag="trans" n={m}/></>}
  const c=document.createElement('div'); document.body.appendChild(c); const r=createRoot(c);
  r.render(<App/>); await sleep(50); marks.length=0;
  const gaps=(tag)=>{ const a=marks.filter(m=>m[0].startsWith(tag)).map(m=>m[2]); let g=0, mx=0; for(let i=1;i<a.length;i++){ const d=a[i]-a[i-1]; if(d>2){g++; mx=Math.max(mx,d)} } return {rows:a.length, gaps:g, maxGap: mx.toFixed(1), total:(a[a.length-1]-a[0]).toFixed(0)}};
  let ticks=0, run=true; const tickTimes=[]; const tick=()=>{ticks++; tickTimes.push(performance.now()); if(run) setTimeout(tick,0)}; tick();
  setN(300); await sleep(1500); const dt=ticks; ticks=0; // default-lane (outside event)
  const d=gaps('default'); const dm=marks.map(m=>m[2]); const dIn=tickTimes.filter(t=>t>dm[0]&&t<dm[dm.length-1]).length;
  marks.length=0;
  startTransition(()=>setNT(300)); await sleep(1500);
  const tm=marks.map(m=>m[2]); const tIn=tickTimes.filter(t=>t>tm[0]&&t<tm[tm.length-1]).length; const t=gaps('trans'); run=false;
  console.log('TIMERS_DURING_RENDER default:',dIn,'transition:',tIn); console.log('SLICE default', JSON.stringify(d), 'transition', JSON.stringify(t));
});
