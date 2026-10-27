import React,{Suspense,use} from "react";
import {prerender,resumeAndPrerender} from "react-dom/static";
import {resume} from "react-dom/server";
const h=React.createElement;
let ready=false; const data=new Promise(r=>globalThis.release=()=>{ready=true;r("DYNAMIC")});
// cache per "render attempt": component reads a pending promise during prerender; later during resume it is resolved
const mkDyn=(p)=>()=>h("p",null,use(p));
const App=(p)=>h("html",null,h("body",null,h("h1",null,"static"),h(Suspense,{fallback:"hole"},h(mkDyn(p)))));
const ac=new AbortController(); setTimeout(()=>ac.abort(),100);
const pend=new Promise(()=>{});
const {prelude,postponed}=await prerender(App(pend),{signal:ac.signal,onError(){}});
const html1=await new Response(prelude).text();
console.log("PRELUDE:",html1,"\npostponed null?",postponed===null);
const stream=await resume(App(Promise.resolve("DYNAMIC")),JSON.parse(JSON.stringify(postponed)));
console.log("RESUME:",await new Response(stream).text());
