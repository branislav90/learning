import {JSDOM} from "jsdom";
const dom=new JSDOM("<!doctype html><html><head><title>t</title></head><body><div id=r></div></body></html>",{pretendToBeVisual:true});
const g=globalThis;
for(const k of ["window","document","navigator","Node","HTMLElement","Element","MutationObserver","Event","CustomEvent"]) {try{g[k]=dom.window[k]}catch{Object.defineProperty(g,k,{value:dom.window[k],configurable:true})}}
g.IS_REACT_ACT_ENVIRONMENT=false;
const React=(await import("react")).default;const {StrictMode,useEffect}=await import("react");
const {renderToString}=await import("react-dom/server");const {hydrateRoot}=await import("react-dom/client");
const h=React.createElement;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const log=[];
const C=()=>{useEffect(()=>{log.push("setup");return()=>log.push("cleanup")},[]);return h("p",null,"x")};
const r=document.getElementById("r");r.innerHTML=renderToString(h(C));
hydrateRoot(r,h(StrictMode,null,h(C)));await sleep(100);console.log("strict hydration effects:",log);
// extension nodes in head/body, hydrate document
const App=()=>h("html",null,h("head",null,h("title",null,"t")),h("body",null,h("p",null,"hi")));
const d2=new JSDOM(renderToString(h(App)),{pretendToBeVisual:true}).window;
d2.document.head.insertAdjacentHTML("beforeend","<style id=ext>x{}</style>");
d2.document.body.insertAdjacentHTML("beforeend","<div id=extdiv>ext</div>");
d2.document.body.insertAdjacentHTML("afterbegin","<div id=extfirst>ext</div>");
globalThis.document=d2.document;globalThis.window=d2;
const errs=[];const ce=console.error;console.error=(...a)=>errs.push(String(a[0]).slice(0,80));
hydrateRoot(d2.document,h(App),{onRecoverableError(e){errs.push("REC "+e.message.slice(0,60))}});await sleep(100);
console.log("doc hydration errors:",errs, d2.document.documentElement.outerHTML);
