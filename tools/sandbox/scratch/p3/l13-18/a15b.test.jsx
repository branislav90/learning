import React,{useCallback,useState} from 'react';
import {renderHook,act} from '@testing-library/react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test('toggle stable',()=>{const useToggle=(i=false)=>{const [on,setOn]=useState(i);const t=useCallback(()=>setOn(v=>!v),[]);return [on,t]};
 const {result,rerender}=renderHook(()=>useToggle());const f=result.current[1];act(()=>result.current[1]());rerender();console.log('stable',result.current[1]===f,result.current[0])});
