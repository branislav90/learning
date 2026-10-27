import React from 'react';
import {test} from 'vitest';
import {createRoot} from 'react-dom/client';
import {act} from 'react';
import {jsx} from 'react/jsx-runtime';
import {jsxDEV} from 'react/jsx-dev-runtime';
import {renderToString} from 'react-dom/server';
test('x', async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  console.log('version', React.version);
  const e:any = React.createElement('div',{id:'a'},'hi');
  console.log(Object.keys(e), e.$$typeof, e.ref, e.key, Object.isFrozen(e), Object.isFrozen(e.props), e.type);
  const e2:any = React.createElement('div',{ref:()=>{}, key:'k'});
  console.log('ref in props?', 'ref' in e2.props, e2.key, e2.ref, Object.keys(e2.props));
  const e3:any = jsxDEV('div',{ref:1},'k',false,{fileName:'a',lineNumber:1,columnNumber:1},null);
  console.log(Object.keys(e3), e3.props);
  console.log(jsx('div',{a:1},'k'));
  const F=(p:any)=>null; const e4:any = React.createElement(F,{ref:1});
  console.log('fn el', Object.keys(e4.props), e4.ref);
  try{ e.props.id='b'; console.log('assigned ok'); }catch(err){console.log('throw',String(err))}
  // key in props
  const K=(p:any)=>{console.log('props.key read');return p.key;};
  try{ console.log(renderToString(React.createElement(K,{key:'z'}))); }catch(err){console.log(err)}
  // undefined return, bigint, defaultProps
  const D:any=(p:any)=><i>{String(p.x)}</i>; D.defaultProps={x:'dflt'};
  console.log(renderToString(<D/>));
  console.log(renderToString(<div>{10n}{undefined}{null}{false}{true}{0}</div>));
  console.log(renderToString(React.createElement(()=>undefined as any)));
  // context as provider
  const C=React.createContext('d'); const R=()=><C.Consumer>{v=>v}</C.Consumer>;
  console.log(renderToString(<C value="v19"><R/></C>));
  console.log(typeof React.Activity, typeof (React as any).forwardRef, typeof React.useEffectEvent);
  // events: root listeners, pooling, persist
  const div=document.createElement('div'); document.body.appendChild(div);
  const root=createRoot(div);
  const log:string[]=[];
  div.addEventListener('click',()=>log.push('native root bubble'));
  div.addEventListener('click',()=>log.push('native root capture'),true);
  document.addEventListener('click',()=>log.push('document bubble'));
  let saved:any;
  await act(async()=>root.render(<div onClickCapture={()=>log.push('R cap parent')} onClick={()=>log.push('R parent')}><button id="b" onClick={(ev)=>{saved=ev;log.push('R btn '+ev.constructor.name+' '+(ev.nativeEvent instanceof MouseEvent));}}>x</button><input onChange={()=>log.push('change')} onFocus={()=>log.push('focus')}/></div>));
  await act(async()=>{div.querySelector('button')!.click();});
  console.log(log.join(' | '));
  console.log('after: type', saved.type, saved.target?.tagName, saved.currentTarget, typeof saved.persist);
  log.length=0;
  const inp=div.querySelector('input')!; await act(async()=>{inp.focus();});
  console.log(log);
});
