import {JSDOM} from "jsdom";
const dom=new JSDOM("<!doctype html><html><body></body></html>",{pretendToBeVisual:true});
const g=globalThis;
for(const k of ["window","document","navigator","Node","HTMLElement","Element","MutationObserver","Event","CustomEvent"]) {try{g[k]=dom.window[k]}catch{Object.defineProperty(g,k,{value:dom.window[k],configurable:true})}}
g.IS_REACT_ACT_ENVIRONMENT=false;
const React=(await import("react")).default; const {Suspense,lazy,useSyncExternalStore,useState}=await import("react");
const {renderToString}=await import("react-dom/server");
const {hydrateRoot}=await import("react-dom/client");
const h=React.createElement;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const errs=[];console.error=(...a)=>errs.push(String(a[0]).slice(0,100));
// 1) blast radius identity
{
 const App=({x})=>h("main",null,h("h1",null,"keep"),h(Suspense,{fallback:"fb"},h("section",null,h("p",null,x))),h("footer",null,"f"));
 const NoB=({x})=>h("main",null,h("h1",null,"keep"),h("section",null,h("p",null,x)),h("footer",null,"f"));
 for(const [n,C] of [["boundary",App],["no boundary",NoB]]){
  const c=document.createElement("div");c.innerHTML=renderToString(h(C,{x:"srv"}));document.body.append(c);
  const h1=c.querySelector("h1"),f=c.querySelector("footer"),sec=c.querySelector("section");
  hydrateRoot(c,h(C,{x:"cli"}),{onRecoverableError(){}});await sleep(50);
  console.log(n,"h1 kept:",c.querySelector("h1")===h1,"footer kept:",c.querySelector("footer")===f,"section kept:",c.querySelector("section")===sec, c.innerHTML);
 }
}
// 2) event replay on dehydrated boundary
{
 let resolveLazy;const Lz=lazy(()=>new Promise(r=>{resolveLazy=()=>r({default:()=>h("button",{id:"b",onClick(){log.push("clicked@"+(Date.now()-t0))}},"go")})}));
 const Eager=()=>h("button",{id:"b",onClick(){}},"go");
 const log=[];const t0=Date.now();
 const c=document.createElement("div");
 c.innerHTML=renderToString(h("div",null,h(Suspense,{fallback:"fb"},h(Eager))));document.body.append(c);
 hydrateRoot(c,h("div",null,h(Suspense,{fallback:"fb"},h(Lz))));
 await sleep(50);
 console.log("markers before:",c.innerHTML);
 c.querySelector("#b").dispatchEvent(new dom.window.MouseEvent("click",{bubbles:true}));
 log.push("dispatched@"+(Date.now()-t0));
 await sleep(100); console.log("log before lazy resolves:",log);
 resolveLazy(); await sleep(200); console.log("log after:",log, c.innerHTML);
}
// 3) uSES
{
 const C=()=>{const v=useSyncExternalStore(()=>()=>{},()=>390,()=>1024);renders.push(v);return h("p",null,v)};const renders=[];
 const c=document.createElement("div");c.innerHTML=renderToString(h(C));renders.length=0;document.body.append(c);
 hydrateRoot(c,h(C),{onRecoverableError(e){renders.push("ERR "+e.message.slice(0,60))}});await sleep(100);console.log("uSES renders:",renders,c.innerHTML);
}
console.log("console.error calls:",errs);
