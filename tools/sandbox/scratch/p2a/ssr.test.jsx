import React, {useLayoutEffect} from 'react';
import {renderToString} from 'react-dom/server';
test('ssr layout', ()=>{
  const errs=[]; const e=console.error; console.error=(...a)=>errs.push(a.join(' ')); 
  function C(){ useLayoutEffect(()=>{}); return <i/>}
  console.log('SSR', renderToString(<C/>), JSON.stringify(errs)); console.error=e;
});
