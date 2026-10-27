// @vitest-environment jsdom
import React, { useOptimistic, useState, useTransition, startTransition, useActionState } from 'react';
import { render, screen, act, fireEvent, cleanup } from '@testing-library/react';
import { test, afterEach } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));

for (const variant of ['plain','wrapped','form-plain','form-wrapped','catch']) {
test('optimistic '+variant, async () => {
  const log:string[]=[];
  function C(){
    const [todos,setTodos]=useState<string[]>([]);
    const [opt,addOpt]=useOptimistic(todos,(c,n:string)=>[...c,n+'*']);
    const [pending,st]=useTransition();
    log.push('render '+opt.join(',')+' pending='+pending);
    const run=async()=>{ addOpt('a'); await sleep(10);
      if(variant==='catch'){ try{ throw new Error('x') }catch{ return } }
      if(variant.endsWith('wrapped')) startTransition(()=>setTodos(t=>[...t,'a'])); else setTodos(t=>[...t,'a']); };
    if(variant.startsWith('form')) return <form action={run}><button>add</button></form>;
    return <button onClick={()=>st(run)}>add</button>
  }
  render(<C/>);
  await act(async()=>{ variant.startsWith('form')? fireEvent.submit(document.querySelector('form')!) : fireEvent.click(screen.getByText('add')); });
  await act(async()=>{ await sleep(40); });
  console.log(variant, JSON.stringify(log));
});
}
test('async transition post-await', async () => {
  const log:string[]=[];
  function C(){ const [a,setA]=useState(0); const [p,st]=useTransition(); log.push(`a=${a} p=${p}`);
    return <button onClick={()=>st(async()=>{ await sleep(5); setA(1); })}>go</button> }
  render(<C/>); await act(async()=>{ fireEvent.click(screen.getByText('go')) }); await act(async()=>{ await sleep(30) });
  console.log(log);
});
