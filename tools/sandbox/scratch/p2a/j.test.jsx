import React, {useEffect,useLayoutEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('key change', async ()=>{
  const log=[];
  function C({id}){ log.push('render '+id);
    useLayoutEffect(()=>{log.push('L setup '+id);return ()=>log.push('L cleanup '+id)},[]);
    useEffect(()=>{log.push('P setup '+id);return ()=>log.push('P cleanup '+id)},[]);
    return <i ref={el=>log.push('ref '+id+' '+(el?'attach':'null'))}/>}
  const c=document.createElement('div'); const r=createRoot(c);
  await act(()=>r.render(<C key="a" id="a"/>)); log.length=0;
  await act(()=>r.render(<C key="b" id="b"/>)); console.log('KEYCHANGE', log.join(' | '));
});
