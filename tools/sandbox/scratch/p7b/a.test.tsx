import React, { memo, useCallback, useState, useTransition, startTransition, useEffect } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

test('07 colocation', () => {
  const log: string[] = [];
  const Heavy = () => { log.push('heavy'); return <i/>; };
  function Color(){ const [c,setC]=useState('a'); log.push('color'); return <input data-testid="i" value={c} onChange={e=>setC(e.target.value)}/>; }
  function Page(){ log.push('page'); return <div><Color/><Heavy/></div>; }
  render(<Page/>); log.length=0;
  fireEvent.change(screen.getByTestId('i'),{target:{value:'b'}});
  console.log('colocation', log);
  const log2: string[] = [];
  function Shell({children}:{children:React.ReactNode}){ const [o,setO]=useState(false); log2.push('shell'); return <div><button onClick={()=>setO(x=>!x)}>t</button>{o&&children}</div>; }
  const Tbl=()=>{log2.push('tbl');return <b/>};
  function Rep(){ log2.push('rep'); return <Shell><Tbl/></Shell>; }
  render(<Rep/>); log2.length=0;
  const b=screen.getAllByText('t')[0];
  fireEvent.click(b); console.log('open',[...log2]); log2.length=0;
  fireEvent.click(b); console.log('close',[...log2]); log2.length=0;
  fireEvent.click(b); console.log('reopen',[...log2]);
});

test('08 table', () => {
  const log: string[] = [];
  const Row = memo(function Row({id,selected,onToggle}:{id:string;selected:boolean;onToggle:(i:string)=>void}){ log.push('row'+id); return <tr><td><input type="checkbox" checked={selected} onChange={()=>onToggle(id)} aria-label={'s'+id}/></td></tr>; });
  function T({orders}:{orders:string[]}){ log.push('table'); const [sel,setSel]=useState<ReadonlySet<string>>(()=>new Set());
    const onToggle=useCallback((id:string)=>setSel(p=>{const n=new Set(p); if(!n.delete(id)) n.add(id); return n;}),[]);
    return <table><tbody>{orders.map(o=><Row key={o} id={o} selected={sel.has(o)} onToggle={onToggle}/>)}</tbody></table>; }
  render(<T orders={['1','2','3']}/>); log.length=0;
  fireEvent.click(screen.getByLabelText('s2')); console.log('table select', log);
});

test('08 index keys', () => {
  function L({items}:{items:string[]}){ return <ul>{items.map((t,i)=><li key={i}>{t}<input data-testid={'in'+t} defaultValue=""/></li>)}</ul>; }
  const {rerender, container} = render(<L items={['a','b','c']}/>);
  fireEvent.change(container.querySelectorAll('input')[2],{target:{value:'typed'}});
  rerender(<L items={['c','b','a']}/>);
  console.log('idx key', [...container.querySelectorAll('li')].map(l=>l.textContent+'|'+(l.querySelector('input') as HTMLInputElement).value));
});

test('09 same-value bailout', () => {
  const log: string[]=[]; let set:any;
  function C(){ const [s,setS]=useState(0); set=setS; log.push('render'+s); return <p>{s}</p>; }
  render(<C/>); log.length=0;
  act(()=>{set(0);set(0);}); console.log('same value x2',log);
  act(()=>{set(1);}); log.length=0; act(()=>{set(1);}); console.log('same after change',log);
});

test('12 async transition', async () => {
  const log: string[]=[]; let resolve!:()=>void;
  function C(){ const [p,st]=useTransition(); const [saved,setSaved]=useState(0); const [text,setText]=useState('x');
    log.push(`render p=${p} saved=${saved} text=${text}`);
    return <button onClick={()=>st(async()=>{ await new Promise<void>(r=>resolve=r); setSaved(s=>s+1); setText('');})}>go</button>; }
  render(<C/>); log.length=0;
  act(()=>{fireEvent.click(screen.getByText('go'));});
  await act(async()=>{ resolve(); });
  await act(async()=>{ await new Promise(r=>setTimeout(r,20)); });
  console.log('async transition', log);
});
