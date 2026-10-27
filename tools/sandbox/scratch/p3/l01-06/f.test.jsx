import React, {useState, useEffect} from 'react';
import {render, act} from '@testing-library/react';
import {test, vi} from 'vitest';
import {createRoot} from 'react-dom/client';
test('discrete vs default timing', async()=>{
  globalThis.IS_REACT_ACT_ENVIRONMENT=false;
  const log=[]; let set;
  function C(){const [n,s]=useState(0);set=s;log.push('render'+n);useEffect(()=>{log.push('effect'+n)},[n]);return <button onClick={()=>s(1)}>b</button>}
  const el=document.body.appendChild(document.createElement('div')); const root=createRoot(el);
  root.render(<C/>); await new Promise(r=>setTimeout(r,200)); log.length=0; console.log(el.innerHTML);
  el.querySelector('button').click(); log.push('after click()');
  await Promise.resolve(); log.push('microtask1'); await Promise.resolve(); log.push('microtask2');
  await new Promise(r=>setTimeout(r,50)); console.log('discrete:', log.join(' > '));
  log.length=0; set(2); log.push('after set(2) (non-event)'); await Promise.resolve(); log.push('microtask1'); await Promise.resolve(); log.push('microtask2');
  await new Promise(r=>setTimeout(r,50)); console.log('default-lane:', log.join(' > '));
});
