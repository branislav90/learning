import React, { StrictMode, use, useContext, createContext, useEffect, useLayoutEffect, useMemo, useRef, useState, Suspense } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
function capture(fn){const errs=[];const spy=vi.spyOn(console,'error').mockImplementation((...a)=>errs.push(a.map(String).join(' ').slice(0,700)));let thrown=null;try{fn()}catch(e){thrown=e.message.slice(0,200)}spy.mockRestore();return {thrown,errs}}
class EB extends React.Component{state={e:null};static getDerivedStateFromError(e){return{e}}componentDidCatch(){}render(){return this.state.e?<p>ERR:{this.state.e.message.slice(0,120)}</p>:this.props.children}}
function run(name,tree,update){const errs=[];const spy=vi.spyOn(console,'error').mockImplementation((...a)=>errs.push(a.map(String).join(' ').replace(/\s+/g,' ').slice(0,600)));
  const r=render(<EB>{tree}</EB>); r.rerender(<EB>{update}</EB>); spy.mockRestore();
  console.log('###',name,'\n out:',r.container.textContent,'\n errs:',JSON.stringify(errs.slice(0,3)))}
test('more hooks (BadCounter enabled false->true)', () => {
  function Bad({enabled}){ if(enabled){useEffect(()=>{})} const [n]=useState(0); return <b>{n}</b>}
  run('BadCounter false->true',<Bad enabled={false}/>,<Bad enabled={true}/>);
  run('BadCounter true->false',<Bad enabled={true}/>,<Bad enabled={false}/>);
});
test('early return before useMemo', () => {
  function D({item}){const [o]=useState(false); if(!item) return <i>skel</i>; const l=useMemo(()=>item+'!',[item]); return <b>{l}</b>}
  run('Details undefined->item',<D/>,<D item="a"/>);
  run('Details item->undefined',<D item="a"/>,<D/>);
});
test('same count different type', () => {
  function S({a}){ if(a){useState(0)}else{useRef(0)} return <b>x</b>}
  run('swap state/ref',<S a={true}/>,<S a={false}/>);
  function S2({a}){ if(a){useState(0)}else{useMemo(()=>1,[])} return <b>x</b>}
  run('swap state/memo',<S2 a={true}/>,<S2 a={false}/>);
});
test('hook in handler', () => {
  const C=createContext(1);
  function F(){ function onClick(){ useContext(C) } return <button onClick={onClick}>b</button>}
  const errs=[];const spy=vi.spyOn(console,'error').mockImplementation((...a)=>errs.push(String(a[0]).slice(0,200)));
  render(<F/>); let t=null; try{fireEvent.click(screen.getByText('b'))}catch(e){t=e.message}
  // errors in handlers are reported to window, vitest may capture
  spy.mockRestore(); console.log('handler useContext:',t,errs);
  function G(){ function onClick(){ useState(0) } return <button onClick={onClick}>g</button>}
});
test('Stat() called as function', () => {
  function Stat({label}){const [h,sh]=useState(false);return <span>{label}</span>}
  function Dash({stats}){return <div>{stats.map(s=>Stat({label:s}))}</div>}
  run('call-as-function 2->3',<Dash stats={['a','b']}/>,<Dash stats={['a','b','c']}/>);
  run('call-as-function 3->2',<Dash stats={['a','b','c']}/>,<Dash stats={['a','b']}/>);
});
test('use in try/catch', async () => {
  const p=Promise.resolve(5);
  function U(){ try{ const d=use(p); return <b>{d}</b> }catch(e){ return <i>caught {String(e && e.message || e).slice(0,50)}</i> } }
  const r=render(<Suspense fallback="fb"><U/></Suspense>); await act(async()=>{await p}); console.log('use try/catch:',r.container.textContent);
});
test('conditional use(Context)/use(promise) ok; conditional useContext', () => {
  const C=createContext('d');
  function A({s}){ if(s){const v=use(C);return <b>{v}</b>} return <i>n</i>}
  const r=render(<A s={false}/>); r.rerender(<A s={true}/>); console.log('use cond',r.container.textContent);
  function B({s}){ if(s){const v=useContext(C);return <b>{v}</b>} return <i>n</i>}
  const o=capture(()=>{const r2=render(<B s={false}/>); r2.rerender(<B s={true}/>);r2.rerender(<B s={false}/>)}); console.log('useContext cond',o);
});
test('effect order: cleanups before setups across components', () => {
  const log=[]; function Ch({id,v}){useEffect(()=>{log.push('setup '+id+v);return()=>log.push('cleanup '+id+v)},[v]);return null}
  function Par({v}){useEffect(()=>{log.push('setup P'+v);return()=>log.push('cleanup P'+v)},[v]);return <><Ch id="A" v={v}/><Ch id="B" v={v}/></>}
  const r=render(<Par v={1}/>); log.length=0; r.rerender(<Par v={2}/>); console.log('effect order',JSON.stringify(log));
});
