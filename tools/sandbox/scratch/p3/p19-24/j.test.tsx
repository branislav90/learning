// @vitest-environment jsdom
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import { test } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
for (const x of [0,5]) test('B4-1 x='+x,()=>{
  function C({x}:{x:number}){ const [a,setA]=useState(0); setA(x); return null }
  const o=console.error; console.error=()=>{};
  try{ render(<C x={x}/>); console.log('B4R',x,'no error') }catch(e){ console.log('B4R',x,String(e).slice(0,80)) } console.error=o;
});
test('B4-3',()=>{ let n=0;
  function C({x}:{x:number}){ n++; const [a,setA]=useState(0); const [prev,setPrev]=useState(x); if(x!==prev){setPrev(x);setA(x)} return <p>{a}</p> }
  const r=render(<C x={1}/>); n=0; r.rerender(<C x={2}/>); console.log('B4R3 renders',n, r.container.textContent);
});
