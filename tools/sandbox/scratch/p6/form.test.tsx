import { useState } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('form reset', async()=>{
  let n=0;
  function C(){ const [e,setE]=useState(''); async function a(fd:FormData){ n++; await Promise.resolve(); if(fd.get('t')==='bad') throw new Error('x'); }
    return <form action={a}><input name="t" defaultValue=""/><button>go</button></form> }
  const {container}=render(<C/>);
  const inp=container.querySelector('input')!;
  fireEvent.change(inp,{target:{value:'hello'}});
  await act(async()=>{ fireEvent.submit(container.querySelector('form')!); });
  await act(async()=>{});
  console.log('after successful action, value=', JSON.stringify(inp.value), 'calls', n);
});
test('form reset on throw', async()=>{
  vi.spyOn(console,'error').mockImplementation(()=>{});
  function C(){ async function a(fd:FormData){ await Promise.resolve(); throw new Error('x'); }
    return <form action={a}><input name="t" defaultValue=""/><button>go</button></form> }
  const {container}=render(<C/>); const inp=container.querySelector('input')!;
  fireEvent.change(inp,{target:{value:'hello'}});
  try { await act(async()=>{ fireEvent.submit(container.querySelector('form')!); }); await act(async()=>{});}catch(e:any){console.log('act threw',e.message)}
  console.log('after throwing action, value=', JSON.stringify(inp.value));
});
