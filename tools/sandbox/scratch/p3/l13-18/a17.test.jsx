import React, { StrictMode, useEffect, useState, useMemo } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('17 version A vs B', () => {
  let ra=0,rb=0; const commitsA=[];
  function A(){const [f,sf]=useState('Ada');const [l]=useState('L');const [fn,sfn]=useState('Ada L');ra++;
    useEffect(()=>{sfn(`${f} ${l}`)},[f,l]);
    return <><input value={f} onChange={e=>sf(e.target.value)}/><h1>{fn}</h1></>}
  function B(){const [f,sf]=useState('Ada');const [l]=useState('L');rb++;const fn=`${f} ${l}`;return <><input value={f} onChange={e=>sf(e.target.value)}/><h1>{fn}</h1></>}
  const a=render(<A/>);const a0=ra;fireEvent.change(a.getByRole('textbox'),{target:{value:'Adax'}});
  a.unmount();const b=render(<B/>);const b0=rb;fireEvent.change(b.getByRole('textbox'),{target:{value:'Adax'}});
  console.log('A renders per keystroke',ra-a0,'B',rb-b0);
});
test('17 mirrored prop', () => {
  function Av({name}){const [l]=useState(name);return <span>{l}</span>}
  const r=render(<Av name="Ada"/>);r.rerender(<Av name="Grace"/>);console.log('mirror',r.container.textContent);
});
test('17 5.5 setState during render', () => {
  let runs=0; function R({items}){const [e,setE]=useState('x');const [prev,setPrev]=useState(items);if(items!==prev){setPrev(items);setE(null)}runs++;return <p>{String(e)}|{items.length}</p>}
  const r=render(<R items={[1]}/>);const r0=runs;r.rerender(<R items={[1,2]}/>);console.log('render-phase runs',runs-r0,r.container.textContent);
  runs=0; const r2=render(<StrictMode><R items={[1]}/></StrictMode>);const q=runs;r2.rerender(<StrictMode><R items={[1,2]}/></StrictMode>);console.log('strict mount runs',q,'update runs',runs-q);
});
test('17 unguarded -> too many re-renders', () => {
  function U(){const [n,s]=useState(0);s(n+1);return <p>{n}</p>}
  const spy=vi.spyOn(console,'error').mockImplementation(()=>{});let t=null;try{render(<U/>)}catch(e){t=e.message}spy.mockRestore();console.log('unguarded:',t);
});
test('17 setState other component during render warns', () => {
  function Child({set}){set(1);return null}
  function P(){const [n,s]=useState(0);return <><Child set={s}/>{n}</>}
  const errs=[];const spy=vi.spyOn(console,'error').mockImplementation((...a)=>errs.push(a.map(String).join(' ').slice(0,300)));
  try{render(<P/>)}catch(e){errs.push('THROW '+e.message.slice(0,100))}spy.mockRestore();console.log('other comp:',errs);
});
test('17 key reset + safePage + selected', () => {
  function Draft({t}){const [x,sx]=useState(t);return <input value={x} onChange={e=>sx(e.target.value)}/>}
  const r=render(<Draft key="1" t="a"/>);fireEvent.change(r.getByRole('textbox'),{target:{value:'edited'}});
  r.rerender(<Draft key="1" t="b"/>);const same=r.getByRole('textbox').value;r.rerender(<Draft key="2" t="b"/>);console.log('same key',same,'new key',r.getByRole('textbox').value);
});
test('17 useMemo strict twice', () => {
  let c=0;function M(){useMemo(()=>{c++;return 1},[]);return null}
  render(<StrictMode><M/></StrictMode>);console.log('useMemo calls strict mount',c);
});
