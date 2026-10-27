import React, { Component, useTransition } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
class EB extends Component<{children:any},{e:any}>{ state={e:null}; static getDerivedStateFromError(e:any){return {e}} render(){return this.state.e? <p>BOUNDARY {String(this.state.e.message)}</p>: this.props.children} }
function C({mode}:{mode:string}){ const [,st]=useTransition();
 return <button onClick={()=>{ try{ st(mode==='sync'? (()=>{throw new Error('sync')}) : (async()=>{ await Promise.resolve(); throw new Error('async')})); console.log(mode,'no exception in handler'); }catch(e){ console.log(mode,'caught in handler',String(e)); } }}>go</button>; }
for (const mode of ['sync','async']) test(mode, async()=>{
  const spy=vi.spyOn(console,'error').mockImplementation(()=>{});
  render(<EB><C mode={mode}/></EB>);
  await act(async()=>{fireEvent.click(screen.getByText('go'));});
  await act(async()=>{await new Promise(r=>setTimeout(r,10));});
  console.log(mode, document.body.textContent); spy.mockRestore();
});
