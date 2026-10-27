import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
async function run(a,b){
  const c=document.createElement('div'); document.body.appendChild(c); const r=createRoot(c);
  const L=({k})=><ul>{k.map(x=><li key={x}>{x}</li>)}</ul>;
  await act(()=>r.render(<L k={a}/>));
  const recs=[]; const mo=new MutationObserver(m=>recs.push(...m)); mo.observe(c,{childList:true,subtree:true});
  await act(()=>r.render(<L k={b}/>)); await Promise.resolve(); recs.push(...mo.takeRecords());
  const adds=recs.reduce((n,x)=>n+x.addedNodes.length,0), rem=recs.reduce((n,x)=>n+x.removedNodes.length,0);
  return `${a.join('')}->${b.join('')}: records=${recs.length} added=${adds} removed=${rem}`;
}
test('moves', async ()=>{
  console.log('MOVE', await run(['A','B','C','D'],['D','A','B','C']));
  console.log('MOVE', await run(['A','B','C','D'],['B','C','D','A']));
  console.log('MOVE', await run(['A','B','C','D'],['A','C','B','D']));
  console.log('MOVE', await run(['A','B','C','D'],['D','C','B','A']));
});
