import React,{createContext,use,useState,memo} from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
for (const m of [false,true]) test('14 B1 memoA='+m,()=>{
  const log=[];const Ctx=createContext(0);
  const A0=()=>{log.push('A');return null}; const A=m?memo(A0):A0;
  function B(){log.push('B');return <span>{use(Ctx)}</span>} function C(){log.push('C');return null}
  function P2({children}){const [n,setN]=useState(0);return <Ctx value={n}><button onClick={()=>setN(1)}>go</button><A/>{children}</Ctx>}
  const App=()=><P2><B/><C/></P2>; render(<App/>);log.length=0;fireEvent.click(screen.getByText('go'));console.log('B1 memoA',m,JSON.stringify(log));
});
test('14 B3 batch add overwrites',()=>{
  const {useMemo}=React; let api; function P(){const [items,setItems]=useState([]);api=useMemo(()=>({items,add:x=>setItems([...items,x])}),[items]);return <i>{items.join(',')}</i>}
  const r=render(<P/>); const {act}=require('@testing-library/react'); act(()=>{api.add(1);api.add(2)}); console.log('B3',r.container.textContent);
});
