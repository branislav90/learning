import React, {useEffect,useLayoutEffect,useState,StrictMode,useMemo,useRef,Fragment,memo} from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const mk=()=>{const c=document.createElement('div');document.body.appendChild(c);return [c,createRoot(c)]};
test('effect order', async ()=>{
  const log=[];
  function Child({n,label}){ log.push(label+' render');
    useLayoutEffect(()=>{log.push(label+' layout setup');return ()=>log.push(label+' layout cleanup')},[n]);
    useEffect(()=>{log.push(label+' passive setup');return ()=>log.push(label+' passive cleanup')},[n]);
    return <span ref={(el)=>{log.push(label+' ref '+(el?'attach':'null'))}}/>}
  function Parent({n}){log.push('P render');
    useLayoutEffect(()=>{log.push('P layout setup');return ()=>log.push('P layout cleanup')},[n]);
    useEffect(()=>{log.push('P passive setup');return ()=>log.push('P passive cleanup')},[n]);
    return <div><Child n={n} label="C1"/><Child n={n} label="C2"/></div>}
  const [c,r]=mk();
  await act(()=>r.render(<Parent n={1}/>)); console.log('MOUNT\n'+log.join('\n')); log.length=0;
  await act(()=>r.render(<Parent n={2}/>)); console.log('UPDATE\n'+log.join('\n')); log.length=0;
  await act(()=>r.unmount()); console.log('UNMOUNT\n'+log.join('\n'));
});
test('strict', async ()=>{
  const log=[];
  function C(){ log.push('render'); const v=useMemo(()=>{log.push('memo');return 1},[]); const [s]=useState(()=>{log.push('init');return 0});
   useLayoutEffect(()=>{log.push('layout setup');return ()=>log.push('layout cleanup')},[]);
   useEffect(()=>{log.push('passive setup');return ()=>log.push('passive cleanup')},[]);
   return <i ref={(el)=>{log.push('ref '+(el?'attach':'null'))}}/>}
  const [c,r]=mk(); await act(()=>r.render(<StrictMode><C/></StrictMode>)); console.log('STRICT\n'+log.join('\n'));
});
test('ref cleanup', async ()=>{
  const log=[];
  function C({k}){return <i ref={(el)=>{log.push('attach '+k);return ()=>log.push('cleanup '+k)}}/>}
  const [c,r]=mk(); await act(()=>r.render(<C k={1}/>)); await act(()=>r.render(<C k={2}/>)); await act(()=>r.unmount()); console.log('REFCLEAN\n'+log.join('\n'));
});
test('element', ()=>{
  const el=<p className="ok">Saved</p>;
  console.log('ELEMENT', el.$$typeof.toString(), Object.isFrozen(el), Object.keys(el), JSON.stringify(Object.keys(el.props)), React.version);
  const el2 = <p ref={()=>{}} />;
  try{ console.log('ref access', typeof el2.ref, typeof el2.props.ref)}catch(e){console.log(e)}
});
