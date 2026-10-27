import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('fiber chain', async ()=>{
  function Header(){return <h1>Shop</h1>}
  function Counter(){const [n,setN]=useState(0); return <button onClick={()=>setN(n+1)}>Count: {n}</button>}
  function App(){return <><Header/><Counter/></>}
  const c=document.createElement('div'); document.body.appendChild(c); const r=createRoot(c);
  await act(()=>r.render(<App/>));
  const el=c.querySelector('button'); const key=Object.keys(el).find(k=>k.startsWith('__reactFiber$'));
  let f=el[key]; const chain=[];
  while(f){ const t=f.type; chain.push(typeof t==='string'?`<${t}>`:(t&&(t.displayName||t.name))||`(tag ${f.tag})`); f=f.return;}
  console.log('CHAIN', chain.join(' <- '), Object.keys(el).filter(k=>k.startsWith('__react')).join());
  const btn=el[key]; console.log('FIELDS', Object.keys(btn).join(','));
  console.log('TEXT nodes', [...el.childNodes].map(n=>n.nodeType+':'+n.data).join('|'));
});
