import React, {Suspense, use} from "react";
import {renderToPipeableStream, renderToString, renderToReadableStream} from "react-dom/server";
import {prerender} from "react-dom/static";
import {Writable} from "node:stream";
const h=React.createElement;
const mk=(ms,v)=>{let p;return ()=>{p??=new Promise(r=>setTimeout(()=>r(v),ms));return use(p)}};
const Slow=mk(100,"slow"); const Slower=mk(200,"slower");
const A=()=>h("p",null,Slow());
const B=()=>h("p",null,Slower());
const App=()=>h("html",null,h("body",null,h("h1",null,"Hi ",""+"x"),h(Suspense,{fallback:"fa"},h(A)),h(Suspense,{fallback:"fb"},h(B))));
const t0=Date.now();
await new Promise(done=>{
 const chunks=[];
 const w=new Writable({write(c,e,cb){console.log("CHUNK@",Date.now()-t0,JSON.stringify(c.toString()));cb()},final(cb){done();cb()}});
 const {pipe}=renderToPipeableStream(h(App),{bootstrapScripts:["/c.js"],
  onShellReady(){console.log("shellReady",Date.now()-t0);pipe(w)},onAllReady(){console.log("allReady",Date.now()-t0)}});
});
console.log("---renderToString");
try{console.log(renderToString(h(App)))}catch(e){console.log("ERR",e.message)}
console.log("---prerender");
const r=await prerender(h(App),{});
console.log(Object.keys(r), await new Response(r.prelude).text());
console.log("---readable");
const rs=await renderToReadableStream(h(App));
console.log(await new Response(rs).text().then(t=>t.length));
