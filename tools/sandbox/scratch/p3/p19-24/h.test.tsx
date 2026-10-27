// @vitest-environment jsdom
import React, { startTransition, useState } from 'react';
import { requestFormReset } from 'react-dom';
import { render, act, fireEvent } from '@testing-library/react';
import { test } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('rfr', async()=>{
  function F(){ return <form onSubmit={e=>{e.preventDefault(); startTransition(()=>{requestFormReset(e.currentTarget)})}}><input name="a" defaultValue="d"/></form> }
  const {container}=render(<F/>); const i=container.querySelector('input')!; i.value='typed';
  await act(async()=>{fireEvent.submit(container.querySelector('form')!)}); console.log('RFR', i.value);
});
test('action throws -> reset?', async()=>{
  const {ErrorBoundary}=await import('react') as any;
  class EB extends React.Component<any,{e:any}>{state={e:null};static getDerivedStateFromError(e:any){return{e}}render(){return this.state.e?<p>err</p>:this.props.children}}
  function F(){ return <form action={async()=>{ throw new Error('x') }}><input name="a" defaultValue="d"/></form> }
  const o=console.error; console.error=()=>{};
  const {container}=render(<EB><F/></EB>); const i=container.querySelector('input')!; i.value='typed';
  await act(async()=>{fireEvent.submit(container.querySelector('form')!)}); await act(async()=>{await new Promise(r=>setTimeout(r,20))});
  console.error=o; console.log('THROW', container.innerHTML);
});
