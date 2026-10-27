// @vitest-environment jsdom
import React, { StrictMode, useState, useEffect, useLayoutEffect, useCallback, createContext, useContext, useActionState, startTransition } from 'react';
import { render, screen, act, fireEvent, cleanup } from '@testing-library/react';
import { test, afterEach } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
test('B1', async()=>{ const log:string[]=[];
  function Counter(){ const [count,setCount]=useState(0); function handle(){setCount(count+1);setCount(c=>c+2);setCount(count+3)} log.push('render '+count); return <button onClick={handle}>{count}</button> }
  render(<Counter/>); await act(async()=>{fireEvent.click(screen.getByRole('button'))}); console.log('B1',log, screen.getByRole('button').textContent); });
test('B2', ()=>{ const log:string[]=[];
  function Child(){ useLayoutEffect(()=>{log.push('child layout');return()=>{log.push('child layout cleanup')}}); useEffect(()=>{log.push('child passive')}); return null }
  function Parent(){ useLayoutEffect(()=>{log.push('parent layout')}); useEffect(()=>{log.push('parent passive')}); return <Child/> }
  render(<Parent/>); console.log('B2',log); });
test('B3', async()=>{ const log:string[]=[];
  function Room({roomId}:{roomId:string}){ useEffect(()=>{log.push('connect '+roomId);return()=>{log.push('disconnect '+roomId)}},[roomId]); return null }
  const r=render(<StrictMode><Room roomId="a"/></StrictMode>); console.log('B3 mount',[...log]); log.length=0;
  r.rerender(<StrictMode><Room roomId="b"/></StrictMode>); console.log('B3 change',log); });
test('B4', async()=>{ const log:any[]=[]; const o=console.log; 
  function App(){ const [count,setCount]=useState(0); function handle(){ setCount(count+1); setTimeout(()=>log.push(['timeout',count]),20)} return <button onClick={handle}>{count}</button> }
  render(<App/>); await act(async()=>{fireEvent.click(screen.getByRole('button'))}); await act(async()=>{await sleep(40)});
  await act(async()=>{fireEvent.click(screen.getByRole('button'))}); await act(async()=>{await sleep(40)}); console.log('B4',JSON.stringify(log), screen.getByRole('button').textContent); });
test('B5', async()=>{ const log:string[]=[];
  const Row=React.memo(function Row({onSelect,id}:{onSelect:(id:string)=>void;id:string}){log.push('Row '+id);return <li onClick={()=>onSelect(id)}>{id}</li>});
  function List(){ const [q,setQ]=useState(''); const [s,setS]=useState<string|null>(null); const select=useCallback((id:string)=>setS(id),[]);
    return <><input value={q} onChange={e=>setQ(e.target.value)}/><ul><Row id="a" onSelect={select}/><Row id="b" onSelect={(id)=>setS(id)}/></ul></> }
  render(<List/>); log.length=0; await act(async()=>{fireEvent.change(screen.getByRole('textbox'),{target:{value:'x'}})}); console.log('B5',log); });
test('B6', async()=>{ 
  for (const mode of ['const','obj']) { const log:string[]=[]; const Ctx=createContext<any>(mode==='const'?'light':{mode:'light'});
    function Provider({children}:{children:React.ReactNode}){ const [t,setT]=useState(0); const v = mode==='const'?'dark':{mode:'dark'}; return <Ctx value={v}><button onClick={()=>setT(t+1)}>tick {t}</button>{children}</Ctx> }
    const Consumer=React.memo(function Consumer(){ const th=useContext(Ctx); log.push('Consumer'); return <p>{mode==='const'?th:th.mode}</p> });
    render(<Provider><Consumer/></Provider>); log.length=0; await act(async()=>{fireEvent.click(screen.getByRole('button'))}); console.log('B6',mode,log); cleanup(); } });
test('B8', async()=>{ const t0=Date.now();
  async function add(prev:number,inc:number){ await sleep(10); return prev+inc }
  const seen:number[]=[]; 
  function Calc(){ const [total,dispatch,p]=useActionState(async(prev:number,inc:number)=>{seen.push(prev);return add(prev,inc)},0); return <button onClick={()=>startTransition(()=>{dispatch(1);dispatch(2)})}>{total} {p?'…':''}</button> }
  render(<Calc/>); await act(async()=>{fireEvent.click(screen.getByRole('button'))}); await act(async()=>{await sleep(60)}); console.log('B8',seen,screen.getByRole('button').textContent, Date.now()-t0); });
