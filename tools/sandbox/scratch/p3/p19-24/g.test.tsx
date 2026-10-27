// @vitest-environment jsdom
import React, { useActionState } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { test } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
for (const keep of [false,true]) test('C5 keep='+keep, async()=>{
  function Contact(){ const [s,fa]=useActionState(async(_:any,fd:FormData)=>{await sleep(5); return keep?{error:'bad',email:String(fd.get('email'))}:{error:'bad',email:''}},{error:'',email:''});
    return <form action={fa}><input name="email" defaultValue={keep?s.email:undefined}/></form> }
  const {container}=render(<Contact/>); const i=container.querySelector('input')!; i.value='abc';
  await act(async()=>{fireEvent.submit(container.querySelector('form')!)}); await act(async()=>{await sleep(30)});
  console.log('C5 keep',keep,'input value after =',JSON.stringify(i.value));
});
