import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('key/props', async ()=>{
  const errs=[]; const e=console.error; console.error=(...a)=>errs.push(String(a[0]).slice(0,160));
  const el=<li key={1}>x</li>; console.log('KEY', typeof el.key, el.key);
  function C(props){ return <i>{String(props.key)}</i>} 
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<C key="a"/>)); console.log('PROPSKEY', c.innerHTML);
  await act(()=>r.render(<div foo={false} bar={()=>1} baz="s" qux={3}/>)); console.log('UNKNOWN', c.innerHTML);
  console.error=e; console.log('ERRS', errs);
});
