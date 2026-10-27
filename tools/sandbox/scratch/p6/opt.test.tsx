import { useOptimistic, useRef, useState, startTransition, useTransition } from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function mk(postAwait: 'transition'|'plain', fail=false, log: string[] = []) {
  let resolve!: (v:any)=>void, reject!:(e:any)=>void;
  const gate = () => new Promise((res,rej)=>{resolve=res;reject=rej});
  function C() {
    const [comments,setComments]=useState<string[]>([]);
    const [opt,add]=useOptimistic(comments,(cur:string[],d:string)=>[...cur,d+'*']);
    const ref=useRef<HTMLFormElement>(null);
    log.push('render:'+opt.join(','));
    async function submit(fd: FormData){
      const t=String(fd.get('text'));
      add(t);
      try{ await gate();
        if(postAwait==='transition') startTransition(()=>setComments(c=>[...c,t])); else setComments(c=>[...c,t]);
      }catch{ }
    }
    return <form action={submit} ref={ref}><input name="text" defaultValue="hi"/><button>go</button><ul>{opt.map(x=><li key={x}>{x}</li>)}</ul></form>;
  }
  return {C, res:(v?:any)=>resolve(v), rej:(e?:any)=>reject(e)};
}
for (const mode of ['transition','plain'] as const) {
  test('post-await '+mode, async () => {
    const log:string[]=[]; const {C,res}=mk(mode,false,log); const sp=vi.spyOn(console,'error');
    render(<C/>);
    await act(async()=>{ fireEvent.click(screen.getByText('go')); });
    log.push('--clicked');
    await act(async()=>{ res(); });
    await act(async()=>{});
    console.log(mode, log.join(' | '), 'console.error calls:', sp.mock.calls.length);
    console.log('input value after', (document.querySelector('input') as HTMLInputElement).value);
  });
}
test('failure', async()=>{
  const log:string[]=[]; const {C,rej}=mk('transition',true,log);
  render(<C/>);
  await act(async()=>{ fireEvent.click(screen.getByText('go')); });
  await act(async()=>{ rej(new Error('x')); });
  await act(async()=>{});
  console.log('fail', log.join(' | '));
});
test('outside action', async()=>{
  const errs:any[]=[]; const spy=vi.spyOn(console,'error').mockImplementation((...a)=>{errs.push(a.join(' ').slice(0,200))});
  function C(){ const [o,add]=useOptimistic(0,(c:number,d:number)=>c+d); return <button onClick={()=>add(1)}>{o}</button>}
  render(<C/>); await act(async()=>{fireEvent.click(screen.getByRole('button'))});
  console.log('outside action: console.error calls', errs, 'value', screen.getByRole('button').textContent); spy.mockRestore();
});
test('multiple adds', async()=>{
  let r!:()=>void; function C(){ const [o,add]=useOptimistic<number[],number>([],(c,d)=>[...c,d]); const [p,st]=useTransition();
    return <button onClick={()=>st(async()=>{add(1);add(2);await new Promise<void>(x=>r=x);})}>{o.join(',')}|{String(p)}</button>}
  render(<C/>); await act(async()=>{fireEvent.click(screen.getByRole('button'))});
  console.log('multi during', screen.getByRole('button').textContent);
  await act(async()=>{r()}); await act(async()=>{});
  console.log('multi after', screen.getByRole('button').textContent);
});
