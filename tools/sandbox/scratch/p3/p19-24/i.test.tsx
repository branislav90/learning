// @vitest-environment jsdom
import React, { useState } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { test } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('inline ref',async()=>{ const log:string[]=[];
  function C(){ const [n,setN]=useState(0); return <button onClick={()=>setN(n+1)} ref={(el)=>{log.push('ref '+(el?'el':'null'))}}>{n}</button> }
  const {container}=render(<C/>); await act(async()=>{fireEvent.click(container.querySelector('button')!)}); console.log('INLINE',log);
  const log2:string[]=[];
  function D(){ const [n,setN]=useState(0); return <button onClick={()=>setN(n+1)} ref={(el)=>{log2.push('setup'); return ()=>{log2.push('cleanup')}}}>{n}</button> }
  const r=render(<D/>); await act(async()=>{fireEvent.click(r.container.querySelector('button')!)}); console.log('INLINE-CLEANUP',log2);
});
