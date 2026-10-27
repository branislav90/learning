// @vitest-environment jsdom
import React, {useState, memo, createContext, useContext, useCallback} from 'react';
import {render, screen, fireEvent, cleanup} from '@testing-library/react';
import {test, afterEach} from 'vitest';
afterEach(()=>cleanup());
test('memo + ref prop inline callback', () => {
  let n=0; const M=memo(function M({ref}:{ref?:React.Ref<HTMLDivElement>}){n++;return <div ref={ref}/>});
  function P(){const [c,setC]=useState(0);return <><button onClick={()=>setC(c+1)}>b</button><M ref={(e)=>{}}/></>}
  render(<P/>); n=0; fireEvent.click(screen.getByRole('button')); console.log('inline ref cb child renders',n);
  let m=0; const M2=memo(function M2({ref}:{ref?:React.Ref<HTMLDivElement>}){m++;return <div ref={ref}/>});
  const stable=(e:HTMLDivElement|null)=>{};
  function Q(){const [c,setC]=useState(0);return <><button onClick={()=>setC(c+1)}>q</button><M2 ref={stable}/></>}
  render(<Q/>); m=0; fireEvent.click(screen.getByText('q')); console.log('stable ref cb child renders',m);
});
test('memo + context + state', () => {
  const Ctx=createContext(0); let n=0;
  const M=memo(function M(){n++;const v=useContext(Ctx);return <i>{v}</i>});
  function P(){const [c,setC]=useState(0);return <Ctx.Provider value={c}><button onClick={()=>setC(c+1)}>b</button><M/></Ctx.Provider>}
  render(<P/>); n=0; fireEvent.click(screen.getByRole('button')); console.log('memo ctx consumer renders',n);
});
test('memo custom compare + dev double', () => {
  let cmp=0; const M=memo(function M({a}:{a:number}){return <i>{a}</i>},(p,n)=>{cmp++;return p.a===n.a});
  function P(){const [c,setC]=useState(0);return <><button onClick={()=>setC(c+1)}>b</button><M a={1}/></>}
  render(<P/>); fireEvent.click(screen.getByRole('button')); console.log('cmp calls',cmp);
});
