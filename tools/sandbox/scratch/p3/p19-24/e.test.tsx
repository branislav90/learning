// @vitest-environment jsdom
import React, { useSyncExternalStore } from 'react';
import { render, act } from '@testing-library/react';
import { test } from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
type Listener=()=>void;
interface Store<T>{getState:()=>T;setState:(u:T|((p:T)=>T))=>void;subscribe:(l:Listener)=>()=>void}
function createStore<T>(initial:T):Store<T>{let state=initial;const ls=new Set<Listener>();return{getState:()=>state,setState(u){const next=typeof u==='function'?(u as (p:T)=>T)(state):u;if(Object.is(next,state))return;state=next;ls.forEach(l=>l())},subscribe(l){ls.add(l);return()=>{ls.delete(l)}}}}
function useStore<T,S>(s:Store<T>,sel:(x:T)=>S):S{return useSyncExternalStore(s.subscribe,()=>sel(s.getState()),()=>sel(s.getState()))}
const st=createStore({items:[{id:'a',qty:1}],coupon:null as string|null});
let renders=0;
function Badge(){renders++;const c=useStore(st,s=>s.items.reduce((n,i)=>n+i.qty,0));return <span>{c}</span>}
test('badge',async()=>{
  render(<Badge/>); const r0=renders;
  await act(async()=>{st.setState(s=>({...s,coupon:'SAVE10'}))}); console.log('after coupon', renders-r0);
  await act(async()=>{st.setState(s=>({...s,items:[{id:'a',qty:2}]}))}); console.log('after qty', renders-r0);
});
