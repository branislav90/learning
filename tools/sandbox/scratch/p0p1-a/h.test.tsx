import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {act} from 'react';
import {test} from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
test('hyd', async()=>{
  const html=renderToString(<p><div>x</div></p>);
  console.log('SSR',html);
  const c=document.createElement('div'); c.innerHTML=html; document.body.append(c);
  console.log('PARSED',c.innerHTML);
  const errs:any[]=[]; const ce=console.error; console.error=(...a)=>{errs.push(String(a[0]).slice(0,120))};
  await act(async()=>{hydrateRoot(c,<p><div>x</div></p>,{onRecoverableError:e=>errs.push('RECOV '+(e as Error).message.slice(0,100))});});
  console.error=ce; console.log('ERRS',JSON.stringify(errs,null,1)); console.log('AFTER',c.innerHTML);
});
