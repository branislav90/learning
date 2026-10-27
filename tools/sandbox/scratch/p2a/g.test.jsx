import React, {useState,useEffect,memo,createContext,useContext} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('extra render', async ()=>{
  const log=[]; let child=0;
  const Child=()=>{log.push('Child');return null};
  function C(){const [n,setN]=useState(0); log.push('render '+n); return <><button onClick={()=>setN(1)}>x</button><Child/></>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<C/>)); log.length=0;
  const b=()=>c.querySelector('button');
  await act(()=>b().click()); console.log('EXTRA 1st', log.join(',')); log.length=0;
  await act(()=>b().click()); console.log('EXTRA 2nd same value', log.join(',')); log.length=0;
  await act(()=>b().click()); console.log('EXTRA 3rd', log.join(','));
});
test('ctx memo', async ()=>{
  const log=[]; const Ctx=createContext('light');
  const Themed=()=>{const t=useContext(Ctx); log.push('Themed '+t); return null};
  const Panel=memo(()=>{log.push('Panel'); return <Themed/>});
  function App(){const [t,setT]=useState('light'); return <Ctx value={t}><button onClick={()=>setT('dark')}/><Panel/></Ctx>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<App/>)); log.length=0;
  await act(()=>c.querySelector('button').click()); console.log('CTX', log.join(','));
});
