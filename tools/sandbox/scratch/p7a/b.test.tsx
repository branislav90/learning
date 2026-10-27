// @vitest-environment jsdom
import React, {createContext,useContext,useReducer,memo,useState,act,Dispatch,ReactNode} from "react";
import {render,screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {test,expect,vi} from "vitest";
type CartState={items:{id:string;qty:number}[]}; type CartAction={type:"add";id:string}|{type:"remove";id:string};
function cartReducer(state:CartState,action:CartAction):CartState{switch(action.type){case "add":{const e=state.items.find(i=>i.id===action.id);return {items:e?state.items.map(i=>i.id===action.id?{...i,qty:i.qty+1}:i):[...state.items,{id:action.id,qty:1}]}} case "remove":return {items:state.items.filter(i=>i.id!==action.id)}}}
const S=createContext<CartState|null>(null); const D=createContext<Dispatch<CartAction>|null>(null);
function CartProvider({children}:{children:ReactNode}){const [s,d]=useReducer(cartReducer,{items:[]});return <D value={d}><S value={s}>{children}</S></D>}
const useCartState=()=>useContext(S)!; const useCartDispatch=()=>useContext(D)!;
test("c2",async()=>{
  const counts={badge:0,button:0};
  function Badge(){counts.badge++;return <span>{useCartState().items.length}</span>}
  function Button(){counts.button++;const d=useCartDispatch();return <button onClick={()=>d({type:"add",id:"x"})}>add</button>}
  render(<CartProvider><Badge/><Button/></CartProvider>);
  counts.badge=0;counts.button=0;
  await userEvent.click(screen.getByRole("button"));
  console.log("c2",counts);
});
test("01c2",()=>{
  const renders=vi.fn(); const Row=memo(function Row({label}:{label:string}){renders();return <li>{label}</li>});
  function List({rows}:{rows:string[]}){const [,s]=useState(0);(globalThis as any).__tick=()=>s(t=>t+1);return <ul>{rows.map(r=><Row key={r} label={r}/>)}</ul>}
  render(<List rows={["a","b","c"]}/>);renders.mockClear();
  for(let i=0;i<10;i++)act(()=>(globalThis as any).__tick());
  console.log("01c2",renders.mock.calls.length);
});
