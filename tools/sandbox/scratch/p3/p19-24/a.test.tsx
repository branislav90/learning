// @vitest-environment jsdom
import React, { use, useActionState, useDeferredValue, useId, useOptimistic, useState, useTransition, startTransition, Suspense } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { useFormStatus } from 'react-dom';
import { test, expect } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));

test('useId format', () => {
  function C(){ return <i id={useId()} /> }
  console.log('SSR', renderToString(<div><C/><C/></div>));
  const { container } = render(<C/>); console.log('client', container.innerHTML);
});

test('useDeferredValue initialValue log', async () => {
  const log:string[]=[];
  function C({v}:{v:string}){ const d=useDeferredValue(v,'INIT'); log.push(d); return <p>{d}</p>}
  const r = render(<C v="a"/>); 
  await act(async()=>{}); console.log('initialValue log', log, r.container.textContent);
  log.length=0; r.rerender(<C v="b"/>); await act(async()=>{}); console.log('update log', log);
  log.length=0; r.rerender(<C v="c"/>); 
  console.log('in transition:'); log.length=0;
  function T(){ const [v,setV]=useState('x'); const [,st]=useTransition(); const d=useDeferredValue(v); log.push(`v=${v} d=${d}`); return <button onClick={()=>st(()=>setV('y'))}>go</button>}
  render(<T/>); await act(async()=>{fireEvent.click(screen.getByText('go'))}); console.log(log);
  log.length=0;
  console.log('SSR initialValue:', renderToString(<C v="a"/>), log);
});

test('useActionState form reset + order + isPending', async () => {
  const log:string[]=[];
  function F(){
    const [s, act2, pending] = useActionState(async (prev:{n:number,err?:string}, fd:FormData)=>{ log.push('start '+fd.get('t')); await sleep(10); log.push('end'); return {n:prev.n+1, err:String(fd.get('t'))}; }, {n:0});
    log.push(`render n=${s.n} pending=${pending}`);
    return <form action={act2}><input name="t" defaultValue="hello"/><button>go</button><output>{s.n}</output></form>;
  }
  const {container}=render(<F/>);
  const input=container.querySelector('input')!; input.value='typed';
  await act(async()=>{ fireEvent.submit(container.querySelector('form')!); });
  await act(async()=>{ await sleep(30); });
  console.log(log, 'input after:', input.value);
});

test('useFormStatus', async () => {
  const log:string[]=[];
  function Btn(){ const s=useFormStatus(); log.push(`pending=${s.pending} method=${s.method} data=${s.data?.get('t')} action=${typeof s.action}`); return <button>x</button>}
  function F(){ const s=useFormStatus(); log.push('parent pending='+s.pending); return <form action={async()=>{await sleep(10)}}><input name="t" defaultValue="v"/><Btn/></form>}
  const {container}=render(<F/>);
  await act(async()=>{ fireEvent.submit(container.querySelector('form')!); });
  await act(async()=>{ await sleep(30); });
  console.log(log);
  console.log(renderToString(<F/>));
});

test('useOptimistic revert & post-await real update', async () => {
  const log:string[]=[];
  function C({fail}:{fail:boolean}){
    const [todos,setTodos]=useState<string[]>([]);
    const [opt,addOpt]=useOptimistic(todos,(c,n:string)=>[...c,n+'*']);
    const [,st]=useTransition();
    log.push('render '+opt.join(','));
    return <button onClick={()=>st(async()=>{ addOpt('a'); await sleep(10); if(fail) throw new Error('x'); setTodos(t=>[...t,'a']); })}>add</button>
  }
  const r=render(<C fail={false}/>);
  await act(async()=>{ fireEvent.click(screen.getByText('add')); });
  await act(async()=>{ await sleep(40); });
  console.log('success path', log);
  log.length=0;
  r.unmount();
  render(<C fail={true}/>);
  const onerr=(e:any)=>{e.preventDefault&&e.preventDefault()};
  window.addEventListener('error',onerr);
  try{ await act(async()=>{ fireEvent.click(screen.getAllByText('add')[0]); }); await act(async()=>{ await sleep(40); }); }catch(e){console.log('thrown',String(e))}
  console.log('fail path', log);
});

test('use(promise) uncached & try/catch', async () => {
  function C(){ const v = use(new Promise<string>(r=>setTimeout(()=>r('x'),5))); return <p>{v}</p> }
  const errs:any[]=[]; const orig=console.error; console.error=(...a:any[])=>errs.push(String(a[0]).slice(0,200));
  try{
    render(<Suspense fallback="fb"><C/></Suspense>);
    await act(async()=>{ await sleep(50); });
  } finally { console.error=orig }
  console.log('uncached errs', errs, document.body.textContent);
});

test('startTransition await caveat', async () => {
  const log:string[]=[];
  function C(){ const [a,setA]=useState(0); const [p,st]=useTransition(); log.push(`a=${a} p=${p}`);
    return <button onClick={()=>st(async()=>{ await sleep(5); setA(1); })}>go</button> }
  render(<C/>); await act(async()=>{ fireEvent.click(screen.getByText('go')) }); await act(async()=>{ await sleep(30) });
  console.log(log);
});
