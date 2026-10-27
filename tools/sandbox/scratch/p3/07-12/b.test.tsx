// @vitest-environment jsdom
import React, {StrictMode, useState, useRef} from 'react';
import {render, screen, fireEvent, cleanup} from '@testing-library/react';
import {test, afterEach} from 'vitest';
afterEach(()=>cleanup());
test('ref cb strict', () => {
  const log:string[]=[];
  const cb=(e:HTMLDivElement|null)=>{log.push('A '+(e?'node':'null'));return ()=>log.push('A cleanup')};
  render(<StrictMode><div ref={cb}/></StrictMode>); console.log('strict cleanup-returning', log.slice());
  log.length=0; cleanup();
  const cb2=(e:HTMLDivElement|null)=>{log.push('B '+(e?'node':'null'))};
  render(<StrictMode><div ref={cb2}/></StrictMode>); console.log('strict no-cleanup', log.slice());
});
test('inline ref cb identity', () => {
  const log:string[]=[];
  function C(){const [n,setN]=useState(0);return <><button onClick={()=>setN(n+1)}>b</button><div ref={(e)=>{log.push('set '+(e?'node':'null'));return ()=>log.push('cleanup')}}/></>}
  render(<C/>); log.length=0; fireEvent.click(screen.getByRole('button')); console.log('inline identity change', log.slice());
  log.length=0;
  function D(){const [n,setN]=useState(0);return <><button onClick={()=>setN(n+1)}>b</button><div ref={(e)=>{log.push('set '+(e?'node':'null'))}}/></>}
  cleanup(); render(<D/>); log.length=0; fireEvent.click(screen.getByRole('button')); console.log('inline no-cleanup identity change', log.slice());
});
test('ref as prop', () => {
  function Inp({ref}:{ref?:React.Ref<HTMLInputElement>}){return <input ref={ref}/>}
  let r:any; function P(){const x=useRef<HTMLInputElement>(null); r=x; return <Inp ref={x}/>}
  render(<P/>); console.log('ref as prop works', r.current?.tagName);
});
test('forwardRef still works', () => {
  const F=React.forwardRef<HTMLInputElement,{}>((p,ref)=><input ref={ref}/>);
  let r:any; function P(){const x=useRef<HTMLInputElement>(null); r=x; return <F ref={x}/>}
  render(<P/>); console.log('forwardRef', r.current?.tagName);
});
test('ref.current during render first mount null, update stale', () => {
  const seen:any[]=[];
  function C(){const r=useRef<HTMLDivElement>(null);const [n,setN]=useState(0);seen.push(r.current?.tagName??null);return <><button onClick={()=>setN(n+1)}>b</button><div ref={r}/></>}
  render(<C/>); fireEvent.click(screen.getByRole('button')); console.log('render-time ref reads', seen);
});
