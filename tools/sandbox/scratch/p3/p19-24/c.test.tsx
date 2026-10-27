// @vitest-environment jsdom
import React, { useActionState, startTransition } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { test } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
test('queue', async()=>{
  const log:string[]=[];
  function C(){ const [s,d,p]=useActionState(async(prev:number,x:number)=>{log.push(`start ${x} prev=${prev}`);await sleep(10);log.push(`end ${x}`);return prev+x},0);
   log.push(`render s=${s} p=${p}`);
   return <button onClick={()=>{startTransition(()=>d(1));startTransition(()=>d(10));startTransition(()=>d(100));}}>go</button>}
  render(<C/>); await act(async()=>{fireEvent.click(screen.getByText('go'))}); await act(async()=>{await sleep(80)}); console.log(JSON.stringify(log,null,0));
});
