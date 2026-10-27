import React, { useOptimistic, useState, useTransition } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
type Like={liked:boolean;count:number};
function mk(fail:boolean, log:string[]){ let resolve!:()=>void,reject!:()=>void;
 function L({initial}:{initial:Like}){
  const [server,setServer]=useState(initial);
  const [o]=useOptimistic(server,(cur:Like,liked:boolean):Like=>({liked,count:cur.count+(liked?1:-1)}));
  return null as any; }
 return L; }
async function run(fail:boolean){
  const log:string[]=[]; let settle!:()=>void;
  const save=(l:boolean)=>new Promise<Like>((res,rej)=>{settle=()=>fail?rej(new Error('x')):res({liked:l,count:l?11:10});});
  function L({initial}:{initial:Like}){
    const [server,setServer]=useState(initial);
    const [optimistic,setOptimistic]=useOptimistic(server,(cur:Like,liked:boolean):Like=>({liked,count:cur.count+(liked?1:-1)}));
    const [error,setError]=useState<string|null>(null);
    const [,startTransition]=useTransition();
    log.push(`render ${optimistic.liked}/${optimistic.count} err=${error}`);
    return <button onClick={()=>{const next=!optimistic.liked; setError(null); startTransition(async()=>{setOptimistic(next); try{ const r=await save(next); startTransition(()=>setServer(r)); }catch{ startTransition(()=>setError('fail')); }});}}>b</button>;
  }
  render(<L initial={{liked:false,count:10}}/>); log.length=0;
  await act(async()=>{fireEvent.click(screen.getByText('b'));});
  await act(async()=>{settle();});
  await act(async()=>{await new Promise(r=>setTimeout(r,10));});
  console.log(fail?'fail':'ok',log);
}
test('ok',()=>run(false)); test('fail',()=>run(true));
