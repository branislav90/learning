import React, {useState,useEffect,act,StrictMode,Activity,Children} from 'react';
import {test} from 'vitest';
import {createRoot} from 'react-dom/client';
test('y', async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  const log:string[]=[];
  const mk=()=>{const d=document.createElement('div');document.body.appendChild(d);return createRoot(d)};
  // strict mode render count + effects
  const A=()=>{log.push('A render');useEffect(()=>{log.push('A eff');return()=>log.push('A cleanup')},[]);return <p/>};
  let r=mk(); await act(async()=>r.render(<StrictMode><A/></StrictMode>)); console.log('strict:',log.join(','));
  log.length=0; r=mk(); await act(async()=>r.render(<A/>)); console.log('plain:',log.join(','));
  // batching + setTimeout, bailout
  log.length=0; let set1:any,set2:any;
  const T=()=>{const[a,sa]=useState(0);const[b,sb]=useState(0);set1=sa;set2=sb;log.push('T render');return <p>{a}{b}</p>};
  r=mk(); await act(async()=>r.render(<T/>)); log.length=0;
  await act(async()=>{setTimeout(()=>{set1(1);set2(1)},0); await new Promise(r=>setTimeout(r,10));}); console.log('timeout batch:',log.join(','));
  log.length=0; await act(async()=>set1(1)); console.log('same value bailout:',log.join(',')||'(none)');
  log.length=0; await act(async()=>set1(1)); console.log('same again:',log.join(',')||'(none)');
  // children bailout
  log.length=0; let setC:any;
  const Counter=()=>{log.push('Inner');return <i/>};
  const W=({children}:any)=>{const[n,s]=useState(0);setC=s;log.push('W');return <div>{n}{children}</div>};
  const App=()=><W><Counter/></W>;
  r=mk(); await act(async()=>r.render(<App/>)); log.length=0; await act(async()=>setC(1)); console.log('children skip:',log.join(','));
  // Activity
  log.length=0; const E=()=>{useEffect(()=>{log.push('E mount');return()=>log.push('E cleanup')},[]);const[n,s]=useState(0);return <button onClick={()=>s(n+1)}>{n}</button>};
  const Host=({m}:any)=><Activity mode={m}><E/></Activity>;
  r=mk(); await act(async()=>r.render(<Host m="visible"/>)); await act(async()=>r.render(<Host m="hidden"/>)); console.log('activity:',log.join(','));
  await act(async()=>r.render(<Host m="visible"/>)); console.log('activity:',log.join(','));
  // Children.map with empty
  const out:any[]=[]; Children.map([<a key=""/>,false,null,<b/>],(c,i)=>{out.push(i);return c}); console.log('Children.map idx',out, Children.count([false,null,<b/>,'x']), Children.toArray([false,null,<b/>]).length);
  // form event: onChange fires on each input
});
