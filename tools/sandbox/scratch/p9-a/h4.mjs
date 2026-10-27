import {JSDOM} from "jsdom";
const dom=new JSDOM("<!doctype html><html><body></body></html>",{pretendToBeVisual:true});
const g=globalThis;
for(const k of ["window","document","navigator","Node","HTMLElement","Element","MutationObserver","Event","CustomEvent"]) {try{g[k]=dom.window[k]}catch{Object.defineProperty(g,k,{value:dom.window[k],configurable:true})}}
g.IS_REACT_ACT_ENVIRONMENT=false;
const React=(await import("react")).default; const {Suspense}=await import("react");
const {renderToString}=await import("react-dom/server");
const {hydrateRoot}=await import("react-dom/client");
const h=React.createElement;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const log=[];
const mk=n=>()=>{log.push("render "+n);return h("button",{id:n,onClick(){log.push("click "+n)}},n)};
const A=mk("A"),B=mk("B"),C=mk("C");
const tree=()=>h("div",null,h(Suspense,{fallback:"f"},h(A)),h(Suspense,{fallback:"f"},h(B)),h(Suspense,{fallback:"f"},h(C)));
const c=document.createElement("div");c.innerHTML=renderToString(tree());document.body.append(c);log.length=0;
hydrateRoot(c,tree());
// click B synchronously, before any scheduled hydration work
c.querySelector("#B").dispatchEvent(new dom.window.MouseEvent("click",{bubbles:true}));
log.push("-- after sync dispatch");
await sleep(200);
console.log(log);
