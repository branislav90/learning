// @vitest-environment jsdom
import React, {StrictMode, useState, useEffect, useLayoutEffect, useInsertionEffect, useRef, useMemo, useCallback, memo} from 'react';
import {render, screen, act, fireEvent, cleanup} from '@testing-library/react';
import {test, expect, afterEach} from 'vitest';
afterEach(()=>cleanup());
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

test('07 B1 derived via effect render count', () => {
  let renders: string[] = [];
  function C(){const [c,setC]=useState(0);const [d,setD]=useState(0);useEffect(()=>{setD(c*2)},[c]);renders.push(`${c}/${d}`);return <button onClick={()=>setC(c+1)}>{c}/{d}</button>}
  render(<C/>); renders=[]; fireEvent.click(screen.getByRole('button')); console.log('B1 renders', renders);
});
test('07 B2 render-phase setState same value', () => {
  let n=0;
  function C({v}:{v:number}){const [p,setP]=useState(v); n++; if(n<100) setP(v); return null}
  let err:any; const o=console.error; console.error=()=>{};
  try{render(<C v={1}/>)}catch(e){err=e} console.error=o;
  console.log('B2 render count before throw', n, String(err?.message).slice(0,80));
});
test('07 memo calc count', () => {
  let calls=0; const f=(t:number)=>{calls++;return t};
  function C({todos}:{todos:number}){const [d,setD]=useState('');const a=f(todos); calls+=0; return <input value={d} onChange={e=>setD(e.target.value)}/>}
  render(<C todos={1}/>); calls=0; fireEvent.change(screen.getByRole('textbox'),{target:{value:'a'}}); console.log('design2 calls on keystroke', calls);
  let c3=0;
  function D({todos}:{todos:number}){const [d,setD]=useState('');useMemo(()=>{c3++;return todos},[todos]); return <input value={d} onChange={e=>setD(e.target.value)}/>}
  render(<D todos={1}/>); c3=0; fireEvent.change(screen.getAllByRole('textbox')[1],{target:{value:'a'}}); console.log('design3 calls', c3);
});
test('10 B1 strict ref in render', () => {
  const logs:number[]=[];
  function C(){const r=useRef(0); r.current+=1; logs.push(r.current); const [n,setN]=useState(0); return <button onClick={()=>setN(n+1)}>x</button>}
  render(<StrictMode><C/></StrictMode>); console.log('strict mount', logs.slice()); logs.length=0;
  fireEvent.click(screen.getByRole('button')); console.log('strict click', logs.slice());
});
test('10 B2 usePrevious', () => {
  const out:any[]=[];
  function usePrev<T>(v:T){const r=useRef<T>();useEffect(()=>{r.current=v});return r.current}
  function C(){const [c,setC]=useState(0);const p=usePrev(c);out.push([c,p]);return <button onClick={()=>setC(c+1)}>x</button>}
  render(<C/>); fireEvent.click(screen.getByRole('button')); fireEvent.click(screen.getByRole('button')); console.log('prev', JSON.stringify(out));
});
test('08/09 order + refs', () => {
  const log:string[]=[];
  function C(){
    const r=useRef<HTMLDivElement>(null);
    log.push('render ref='+r.current);
    useInsertionEffect(()=>{log.push('insertion ref='+r.current);return ()=>log.push('insertion cleanup')});
    useLayoutEffect(()=>{log.push('layout');return ()=>log.push('layout cleanup')});
    useEffect(()=>{log.push('passive');return ()=>log.push('passive cleanup')});
    return <div ref={(e)=>{log.push('refcb '+(e?'node':'null'));return ()=>log.push('refcb cleanup')}}/>}
  const {unmount}=render(<C/>); console.log('mount', log.slice()); log.length=0; unmount(); console.log('unmount', log.slice());
  log.length=0; const u=render(<StrictMode><C/></StrictMode>); console.log('strict mount', log.slice());
});
test('08 passive flush on discrete event is before paint (sync)', () => {
  const log:string[]=[];
  function C(){const [n,setN]=useState(0);useEffect(()=>{log.push('passive '+n)});return <button onClick={()=>{setN(n+1);log.push('handler end')}}>x</button>}
  render(<C/>); log.length=0;
  // use real dispatch outside act to see when passive runs
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
  document.querySelector('button')!.click();
  log.push('after click() sync');
  return new Promise<void>(r=>setTimeout(()=>{console.log('discrete', log.slice()); (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true; r()},50));
});
test('11 useMemo/useCallback strict double', () => {
  let m=0; function C(){useMemo(()=>{m++;return 1},[]);return null}
  render(<StrictMode><C/></StrictMode>); console.log('useMemo calls in strict mount', m);
});
test('12 memo bailout', () => {
  let child=0; const Ch=memo(function Ch({o}:{o:{a:number}}){child++;return null});
  function P(){const [n,setN]=useState(0);return <><button onClick={()=>setN(n+1)}>x</button><Ch o={{a:1}}/></>}
  render(<P/>); child=0; fireEvent.click(screen.getByRole('button')); console.log('memo with new obj prop child renders', child);
  let ch2=0; const Ch2=memo(function Ch2({children}:{children?:any}){ch2++;return null});
  function P2(){const [n,setN]=useState(0);return <><button onClick={()=>setN(n+1)}>y</button><Ch2><span/></Ch2></>}
  render(<P2/>); ch2=0; fireEvent.click(screen.getAllByRole('button')[1]); console.log('memo with JSX children renders', ch2);
});
