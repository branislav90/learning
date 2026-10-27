import { Component, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
class EB extends Component<{children:ReactNode},{e:any}>{state={e:null};static getDerivedStateFromError(e:any){return {e}} render(){return this.state.e?'caught':this.props.children}}
function Boom(){ throw new Error('boom'); }
test('callbacks', async()=>{
  const log:string[]=[]; vi.spyOn(console,'error').mockImplementation(()=>{});
  const el=document.createElement('div');
  const root=createRoot(el,{onCaughtError:(e:any,i)=>log.push('caught:'+e.message+':'+typeof i.componentStack),onUncaughtError:(e:any)=>log.push('uncaught:'+e.message),onRecoverableError:()=>log.push('rec')});
  await act(async()=>root.render(<EB><Boom/></EB>));
  const el2=document.createElement('div'); const r2=createRoot(el2,{onUncaughtError:(e:any)=>log.push('uncaught:'+e.message)});
  try{await act(async()=>r2.render(<Boom/>));}catch(e:any){log.push("act threw:"+e.message)}
  console.log(log.join(' | '));
});
