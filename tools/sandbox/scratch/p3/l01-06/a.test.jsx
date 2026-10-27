import React, {useState, StrictMode, useEffect} from 'react';
import {render, screen, act, cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, test, expect, vi} from 'vitest';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
afterEach(cleanup);

test('B1 three same sets, then again', async () => {
  const logs=[];
  function C(){const [n,setN]=useState(0); logs.push(n); return <button onClick={()=>{setN(1);setN(1);setN(1);}}>go</button>;}
  render(<C/>); const u=userEvent.setup();
  await u.click(screen.getByText('go')); console.log('B1 after click1', logs.join(','));
  await u.click(screen.getByText('go')); console.log('B1 after click2', logs.join(','));
  await u.click(screen.getByText('go')); console.log('B1 after click3', logs.join(','));
});
test('submit scenario', async () => {
  const logs=[];
  function P(){const [d,setD]=useState('');const [s,setS]=useState(0);logs.push(d+'|'+s);
   return <form onSubmit={e=>{e.preventDefault();setS(s+1);setD('');}}><input value={d} onChange={e=>setD(e.target.value)}/><button>save</button></form>;}
  render(<P/>); const u=userEvent.setup();
  await u.type(screen.getByRole('textbox'),'ab'); await u.click(screen.getByText('save'));
  console.log('submit logs', logs.join(' ; '));
});
test('mutate push', async () => {
  function Cart(){const [items,setItems]=useState(['apple']);const [,f]=useState(0);
   return <><button onClick={()=>{items.push('pear');setItems(items)}}>add</button><button onClick={()=>f(x=>x+1)}>other</button><ul>{items.map(i=><li key={i}>{i}</li>)}</ul></>;}
  render(<Cart/>); const u=userEvent.setup();
  await u.click(screen.getByText('add')); console.log('after add', screen.getAllByRole('listitem').length);
  await u.click(screen.getByText('other')); console.log('after other', screen.getAllByRole('listitem').length);
});
test('lazy init strict', () => {
  let n=0,m=0,r=0;
  function C(){const [a]=useState(()=>{n++;return 0});const [b]=useState((m++,0));r++;return null}
  render(<StrictMode><C/></StrictMode>); console.log('strict init calls',n,'eager arg calls',m,'renders',r);
});
test('unmounted setter no warning', async () => {
  const err=vi.spyOn(console,'error'); let set;
  function C(){const [a,s]=useState(0);set=s;return a}
  const {unmount}=render(<C/>); unmount(); act(()=>set(1)); console.log('errors', err.mock.calls.length);
});
test('same-value bailout extra render', async () => {
  const logs=[]; let effects=0;
  function C(){const [n,setN]=useState(0);logs.push(n);useEffect(()=>{effects++},[n]);return <button onClick={()=>setN(1)}>x</button>}
  render(<C/>); const u=userEvent.setup();
  for (let i=0;i<4;i++) await u.click(screen.getByText('x'));
  console.log('bailout logs',logs.join(','),'effects',effects);
});
test('set during render', () => {
  const kids=[];
  function Kid({s}){kids.push(s);return null}
  function P({items}){const [sel,setSel]=useState(items[0]);const [prev,setPrev]=useState(items);
    if(prev!==items){setPrev(items);setSel(items[0]);}
    return <Kid s={sel}/>}
  const {rerender}=render(<P items={['a']}/>); rerender(<P items={['b']}/>);
  console.log('kid saw', kids.join(','));
});
