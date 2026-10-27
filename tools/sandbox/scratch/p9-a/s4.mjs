import React,{useLayoutEffect,useEffect} from "react";
import {createPortal} from "react-dom";
import {renderToString} from "react-dom/server";
const h=React.createElement;
const w=[];console.error=(...a)=>w.push(String(a[0]).slice(0,150));
const L=()=>{useLayoutEffect(()=>{});useEffect(()=>{});return h("p",null,"x")};
console.log(renderToString(h(L)),"warnings:",w);
try{console.log(renderToString(h("div",null,createPortal(h("p",null,"in portal"),{nodeType:1}))))}catch(e){console.log("portal ERR:",e.message)}
