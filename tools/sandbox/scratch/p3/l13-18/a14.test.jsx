import React, { createContext, use, useMemo, useReducer, useRef, useState, useSyncExternalStore, memo } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

test('14 5.1 fat context', () => {
  let n=0; const FC=createContext(null);
  function Provider({children}){const [count,setCount]=useState(0);const [label]=useState('hello');
    return <FC value={{count,label}}><button onClick={()=>setCount(c=>c+1)}>inc</button>{children}</FC>}
  function LabelOnly(){const c=use(FC);n++;return <p>{c.label}</p>}
  render(<Provider><LabelOnly/></Provider>); const m=n;
  for(let i=0;i<3;i++) fireEvent.click(screen.getByText('inc'));
  console.log('5.1 mount',m,'after 3 clicks',n-m);
});
test('14 5.2 split cart', () => {
  const log=[];
  const I=createContext(null),D=createContext(null);
  function red(items,a){switch(a.type){case'add':return [...items,a.sku];case 'clear':return items.length===0?items:[]}}
  function CP({children}){const [items,d]=useReducer(red,[]);log.push('CP');return <D value={d}><I value={items}>{children}</I></D>}
  function Btn({sku}){const d=use(D);log.push('Btn'+sku);return <button onClick={()=>d({type:'add',sku})}>add{sku}</button>}
  function Badge(){const i=use(I);log.push('Badge');return <span>{i.length}</span>}
  function Shop(){return <CP><header><Badge/></header><Btn sku="A"/><Btn sku="B"/></CP>}
  render(<Shop/>); log.length=0; fireEvent.click(screen.getByText('addA'));
  console.log('5.2 log',JSON.stringify(log));
  log.length=0; // clear on empty: bailout
  const CP2=null;
});
test('14 reducer same state bailout', () => {
  let cp=0; const red=(s,a)=>s; 
  function C(){const [s,d]=useReducer(red,[]);cp++;return <button onClick={()=>d({})}>x</button>}
  render(<C/>); const m=cp; fireEvent.click(screen.getByText('x')); fireEvent.click(screen.getByText('x'));
  console.log('same-state dispatch extra renders', cp-m);
});
function createStore(initial){let state=initial;const ls=new Set();return{getState:()=>state,setState(u){const n=u(state);if(Object.is(n,state))return;state=n;ls.forEach(l=>l())},subscribe(l){ls.add(l);return()=>{ls.delete(l)}}}}
function mk(){const Ctx=createContext(null);
  function SP({initial,children}){const ref=useRef(null);if(ref.current===null)ref.current=createStore(initial);return <Ctx value={ref.current}>{children}</Ctx>}
  const useStore=()=>use(Ctx);
  function useSelector(sel){const s=useStore();return useSyncExternalStore(s.subscribe,()=>sel(s.getState()),()=>sel(s.getState()))}
  return {SP,useStore,useSelector}}
test('14 5.5 selector context', () => {
  const {SP,useStore,useSelector}=mk(); let sb=0,q=0;
  function QueryBox(){const query=useSelector(s=>s.query);const st=useStore();q++;return <input value={query} onChange={e=>st.setState(s=>({...s,query:e.target.value}))}/>}
  function ST(){const o=useSelector(s=>s.sidebarOpen);sb++;return <span>{String(o)}</span>}
  render(<SP initial={{query:'',sidebarOpen:false}}><QueryBox/><ST/></SP>); const a=sb,b=q;
  fireEvent.change(screen.getByRole('textbox'),{target:{value:'x'}});
  console.log('5.5 sidebar extra',sb-a,'query extra',q-b);
});
test('14 selector returning object', () => {
  const {SP,useSelector}=mk(); 
  function Bad(){const o=useSelector(s=>({q:s.query}));return <i>{o.q}</i>}
  const errs=[]; const spy=vi.spyOn(console,'error').mockImplementation((...a)=>errs.push(String(a[0]).slice(0,120)));
  let thrown=null; try{render(<SP initial={{query:'a'}}><Bad/></SP>)}catch(e){thrown=e.message.slice(0,120)}
  spy.mockRestore(); console.log('bad selector thrown:',thrown,'errs:',JSON.stringify(errs.slice(0,2)));
});
test('14 5.6 memo reader', () => {
  const TC=createContext({theme:'a',other:1}); let body=0,ch=0;
  const Body=memo(function Body({theme,data}){body++;return <svg/>});
  const data=[1];
  function Chart(){const {theme}=use(TC);ch++;return <Body theme={theme} data={data}/>}
  function P(){const [o,setO]=useState(1);return <TC value={{theme:'a',other:o}}><button onClick={()=>setO(o+1)}>go</button><Chart/></TC>}
  render(<P/>); fireEvent.click(screen.getByText('go'));
  console.log('5.6 chart',ch,'body',body);
});
