import React, { createContext, use, useContext, useMemo, useState, memo, StrictMode } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

test('13 §5.2 render log', () => {
  const log = [];
  const TC = createContext(null);
  function TP({children}){ const [theme,setTheme]=useState('light'); log.push('TP');
    const value=useMemo(()=>({theme,toggle:()=>setTheme(t=>t==='light'?'dark':'light')}),[theme]);
    return <TC value={value}>{children}</TC>; }
  const useTheme=()=>use(TC);
  function Header(){const {theme,toggle}=useTheme();log.push('Header');return <button onClick={toggle}>{theme}</button>}
  const Article=memo(function Article(){log.push('Article');return <ArticleBody/>});
  function ArticleBody(){const {theme}=useTheme();log.push('ArticleBody');return <article>{theme}</article>}
  function Footer(){log.push('Footer');return <footer/>}
  function Page(){log.push('Page');return <><Header/><Article/><Footer/></>}
  function App(){return <TP><Page/></TP>}
  render(<App/>); log.length=0;
  fireEvent.click(screen.getByRole('button'));
  console.log('13 log:', JSON.stringify(log));
  // inline variant
  const log2=[];
  function TP2({}){ const [theme,setTheme]=useState('light'); log2.push('TP2');
    return <TC value={useMemo(()=>({theme,toggle:()=>setTheme(t=>t==='light'?'dark':'light')}),[theme])}><Page2/></TC>; }
  function Page2(){log2.push('Page2');return <><Header2/><Footer2/></>}
  function Header2(){const {theme,toggle}=use(TC);log2.push('Header2');return <button onClick={toggle}>{theme}</button>}
  function Footer2(){log2.push('Footer2');return null}
  const r=render(<TP2/>); log2.length=0;
  fireEvent.click(r.getAllByRole('button').at(-1));
  console.log('13 inline log:', JSON.stringify(log2));
});

test('13 B1', () => {
  const C=createContext('default');
  function Show({id}){return <i>{id}:{String(use(C))}</i>}
  const {container}=render(<><Show id="1"/><C value="x"><Show id="2"/><C value="y"><Show id="3"/></C><Show id="4"/></C><C value={undefined}><Show id="5"/></C></>);
  console.log('B1', container.textContent);
});
test('13 B2/B3', () => {
  const Ctx=createContext(0); let n=0,m=0;
  const Child=memo(function Child(){n++;return <p>{use(Ctx)}</p>});
  const Plain=memo(function Plain(){m++;return <p/>});
  function Parent(){const [s,setS]=useState(0);return <Ctx value={s}><button onClick={()=>setS(s+1)}>+</button><Child/><Plain/></Ctx>}
  render(<Parent/>); fireEvent.click(screen.getByRole('button'));
  console.log('B2 child renders',n,'plain',m);
});
test('13 B4', () => {
  const Ctx=createContext(0);
  function Inner(){return <b>{use(Ctx)}</b>}
  function Panel(){const v=use(Ctx);return <Ctx value={v+1}><Inner/></Ctx>}
  const {container}=render(<Ctx value={10}><Panel/></Ctx>); console.log('B4',container.textContent);
});
test('13 conditional use after early return + useContext conditional error', () => {
  const Ctx=createContext('d');
  function G({needs}){ if(needs==='') return null; const a=use(Ctx); return <p>{a}</p>}
  const r=render(<G needs=""/>); r.rerender(<G needs="x"/>); console.log('cond use ok', r.container.textContent);
  function U({needs}){ if(needs==='') return null; const a=useContext(Ctx); return <p>{a}</p>}
  const spy=vi.spyOn(console,'error').mockImplementation(()=>{});
  let err=null; try{ const r2=render(<U needs=""/>); r2.rerender(<U needs="x"/>);}catch(e){err=e.message}
  console.log('cond useContext err:', err); spy.mockRestore();
});
test('13 Provider old form + portal context + NaN', () => {
  const C=createContext('d');
  function S(){return <i>{use(C)}</i>}
  const {container}=render(<C.Provider value="p"><S/></C.Provider>); console.log('Provider form', container.textContent);
  console.log(Object.is(NaN,NaN),Object.is(0,-0));
});
