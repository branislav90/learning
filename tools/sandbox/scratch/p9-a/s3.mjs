import React, {Suspense, use} from "react";
import {renderToPipeableStream} from "react-dom/server";
import {prerender, prerenderToNodeStream, resumeAndPrerender} from "react-dom/static";
import * as S from "react-dom/server";
console.log(Object.keys(S), Object.keys(await import("react-dom/static")));
const h=React.createElement;
const late=()=>use(new Promise((_,rej)=>setTimeout(()=>rej(new Error("late")),100)));
let log=[];
await new Promise(res=>{
 const {pipe}=renderToPipeableStream(h("div",null,h(Suspense,{fallback:"FB"},h(late))),{
  onShellReady(){log.push("shellReady");pipe({write(c){log.push("w:"+String(c).slice(0,80));return true},end(){res()},on(){},once(){},emit(){},removeListener(){}})},
  onError(e){log.push("onError:"+e.message)},onAllReady(){log.push("allReady")}});
});
console.log(log);
