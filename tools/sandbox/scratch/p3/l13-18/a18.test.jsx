import React,{useState,useEffect,Activity} from 'react';
import {render,screen,fireEvent,act} from '@testing-library/react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('18 scenario2/4', () => {
  let chart=0; function SlowChart(){chart++;return <i/>}
  function Page(){const [q,sq]=useState('');return <><input value={q} onChange={e=>sq(e.target.value)}/><SlowChart/></>}
  const r=render(<Page/>);let v='';for(const c of 'abcde'){v+=c;fireEvent.change(r.getByRole('textbox'),{target:{value:v}})}
  console.log('S2 chart renders',chart);r.unmount();chart=0;
  function SB(){const [q,sq]=useState('');return <input value={q} onChange={e=>sq(e.target.value)}/>}
  function Page2(){return <><SB/><SlowChart/></>}
  const r2=render(<Page2/>);v='';for(const c of 'abcde'){v+=c;fireEvent.change(r2.getByRole('textbox'),{target:{value:v}})}
  console.log('S2 fixed chart renders',chart);r2.unmount();chart=0;
  function CP({children}){const [c,sc]=useState('tomato');return <div><input value={c} onChange={e=>sc(e.target.value)}/>{children}</div>}
  function App(){return <CP><SlowChart/></CP>}
  const r3=render(<App/>);v='';for(const c of 'abcde'){v+=c;fireEvent.change(r3.getByRole('textbox'),{target:{value:v}})}
  console.log('S4 chart renders',chart);
});
test('18 temperature', () => {
  function Field({label,value,onChange}){return <input aria-label={label} value={value} onChange={e=>onChange(e.target.value)}/>}
  function T(){const [c,setC]=useState('');const cel=parseFloat(c);const f=Number.isNaN(cel)?'':String(Math.round(cel*9/5+32));
    return <><Field label="C" value={c} onChange={setC}/><Field label="F" value={f} onChange={x=>{const n=parseFloat(x);setC(Number.isNaN(n)?'':String(Math.round((n-32)*5/9)))}}/></>}
  render(<T/>);fireEvent.change(screen.getByLabelText('C'),{target:{value:'100'}});console.log('F=',screen.getByLabelText('F').value);
  fireEvent.change(screen.getByLabelText('F'),{target:{value:'213'}});console.log('after F=213: C=',screen.getByLabelText('C').value,'F=',screen.getByLabelText('F').value);
});
test('18 Activity', () => {
  const log=[];function P(){const [v,sv]=useState('');useEffect(()=>{log.push('setup');return()=>log.push('cleanup')},[]);return <input value={v} onChange={e=>sv(e.target.value)}/>}
  function A({m}){return <Activity mode={m}><P/></Activity>}
  const r=render(<A m="visible"/>);fireEvent.change(r.getByRole('textbox'),{target:{value:'draft'}});
  r.rerender(<A m="hidden"/>);const hidden=r.container.querySelector('input');console.log('hidden display',hidden&&hidden.parentElement.outerHTML.slice(0,100),hidden&&hidden.style.display);
  r.rerender(<A m="visible"/>);console.log('restored value',r.getByRole('textbox').value,JSON.stringify(log));
});
