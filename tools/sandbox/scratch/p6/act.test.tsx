import { Component, ReactNode, useTransition, useState } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
class EB extends Component<{children:ReactNode},{e:any}>{state={e:null};static getDerivedStateFromError(e:any){return {e}} render(){return this.state.e?<p>caught {String(this.state.e.message)}</p>:this.props.children}}
test('async transition throw -> boundary', async()=>{
  vi.spyOn(console,'error').mockImplementation(()=>{});
  function C(){ const [p,st]=useTransition(); return <button onClick={()=>st(async()=>{ await Promise.resolve(); throw new Error('act-fail'); })}>go{String(p)}</button>}
  render(<EB><C/></EB>); await act(async()=>{fireEvent.click(screen.getByRole('button'))}); await act(async()=>{});
  console.log('async transition throw:', document.body.textContent);
});
test('event handler throw not caught', async()=>{
  const errs:any[]=[]; const h=(e:any)=>{errs.push(e.message);e.preventDefault()}; window.addEventListener('error',h);
  function C(){ return <button onClick={()=>{throw new Error('evt')}}>x</button>}
  render(<EB><C/></EB>); await act(async()=>{fireEvent.click(screen.getByRole('button'))});
  console.log('event handler throw -> boundary?', document.body.textContent, errs); window.removeEventListener('error',h);
});
