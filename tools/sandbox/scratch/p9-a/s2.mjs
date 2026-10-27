import React, {Suspense, use} from "react";
import {renderToPipeableStream, renderToString, renderToStaticMarkup} from "react-dom/server";
import {prerender} from "react-dom/static";
import {Writable} from "node:stream";
const h=React.createElement;
const pend=()=>use(new Promise(()=>{}));
const Boom=()=>{throw new Error("boom")};
const run=(el,opts={},abortAt)=>new Promise(res=>{
 let out="";const log=[];const t=Date.now();
 const w=new Writable({write(c,e,cb){out+=c;cb()},final(cb){res({log,out});cb()}});
 const s=renderToPipeableStream(el,{...opts,
  onShellReady(){log.push("shellReady");s.pipe(w)},onAllReady(){log.push("allReady")},
  onShellError(e){log.push("shellError:"+e.message);res({log,out})},
  onError(e){log.push("onError:"+e.message)}});
 if(abortAt)setTimeout(()=>s.abort(),abortAt);
});
console.log("--- renderToString pending suspense");
console.log(renderToString(h("div",null,h(Suspense,{fallback:"FB"},h(pend)))));
console.log("--- renderToString throw in boundary");
try{console.log(renderToString(h("div",null,h(Suspense,{fallback:"FB"},h(Boom)))))}catch(e){console.log("ERR",e.message)}
console.log("--- renderToString throw no boundary");
try{renderToString(h(Boom))}catch(e){console.log("ERR",e.message)}
console.log("--- stream: boundary throw");
let r=await run(h("div",null,h(Suspense,{fallback:"FB"},h(Boom)))); console.log(r.log,r.out);
console.log("--- stream: shell throw");
r=await run(h(Boom)); console.log(r.log);
console.log("--- stream: shell suspends no boundary, abort@300");
r=await run(h(pend),{},300); console.log(r.log,r.out);
console.log("--- stream: pending in boundary abort@300");
r=await run(h("div",null,h(Suspense,{fallback:"FB"},h(pend))),{},300); console.log(r.log,r.out);
console.log("--- prerender pending, abort");
const c=new AbortController();setTimeout(()=>c.abort(),300);
const p=await prerender(h("div",null,h(Suspense,{fallback:"FB"},h(pend))),{signal:c.signal});
console.log(await new Response(p.prelude).text(), p.postponed);
