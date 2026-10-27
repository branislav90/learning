import React, {useState,startTransition,useSyncExternalStore,memo} from 'react';
import {createRoot} from 'react-dom/client';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function busy(ms){const t=performance.now(); while(performance.now()-t<ms);}
let value=0; const ls=new Set();
const store={get:()=>value,set(n){value=n; ls.forEach(l=>l())},subscribe(l){ls.add(l);return()=>ls.delete(l)}};
const Raw=memo(function Raw({i}){ busy(0.1); return <span data-v={store.get()}>{i}</span>});
const Safe=memo(function Safe({i}){ busy(0.1); const v=useSyncExternalStore(store.subscribe,store.get); return <span data-v={v}>{i}</span>});
async function trial(C){
  globalThis.IS_REACT_ACT_ENVIRONMENT=false; value=0;
  const c=document.createElement('div'); document.body.appendChild(c); const r=createRoot(c);
  let set; function App(){const [n,sn]=useState(0); set=sn; return <div>{Array.from({length:n},(_,i)=><C key={i} i={i}/>)}</div>}
  r.render(<App/>); await sleep(30);
  startTransition(()=>set(2000));
  await sleep(40); store.set(1);
  await sleep(1500);
  const vals=[...c.querySelectorAll('span')].map(s=>s.dataset.v);
  const count={}; vals.forEach(v=>count[v]=(count[v]||0)+1);
  return JSON.stringify(count);
}
test('tearing', async ()=>{
  console.log('TEAR raw', await trial(Raw));
  console.log('TEAR safe', await trial(Safe));
});
