import React, {useState,useRef,useMemo,useCallback,useEffect,useContext,useId,useTransition,useDeferredValue,useReducer,use,createContext,useSyncExternalStore} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
test('hooks list', async ()=>{
  const Ctx=createContext(1); const p=Promise.resolve(5); let fiberEl;
  function C(){ const a=useState(0); const r=useRef(1); const m=useMemo(()=>2,[1]); const cb=useCallback(()=>1,[2]); useEffect(()=>{},[3]);
    const c=useContext(Ctx); const id=useId(); const t=useTransition(); const d=useDeferredValue(1); const red=useReducer((s,a)=>s,0); useSyncExternalStore(()=>()=>{},()=>1);
    return <i ref={e=>{fiberEl=e}}/> }
  const c=document.createElement('div'); const r=createRoot(c); await act(()=>r.render(<C/>));
  const key=Object.keys(fiberEl).find(k=>k.startsWith('__reactFiber$')); let f=fiberEl[key].return; // C fiber
  const types=f._debugHookTypes; let h=f.memoizedState; const out=[]; let i=0;
  while(h){ const ms=h.memoizedState; out.push(`${types[i]}: keys=[${Object.keys(h)}] memoized=${Array.isArray(ms)?'array('+ms.length+')':(ms&&typeof ms==='object'?'{'+Object.keys(ms)+'}':String(ms))}`); h=h.next; i++; }
  console.log('HOOKS\n'+out.join('\n')); console.log('HOOKTYPES', types.join(','));
});
