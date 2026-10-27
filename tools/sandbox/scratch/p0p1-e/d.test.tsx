// @vitest-environment jsdom
import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {test} from 'vitest';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
test('order', ()=>{
  const log:string[]=[];
  const root=document.createElement('div');root.id='root';document.body.appendChild(root);
  const r=createRoot(root);
  act(()=>r.render(<div id="outer" onClickCapture={()=>log.push('React outer capture')} onClick={()=>log.push('React outer bubble')}><button id="inner" onClick={()=>log.push('React inner bubble')}>Go</button></div>));
  document.getElementById('inner')!.addEventListener('click',()=>log.push('native inner'));
  root.addEventListener('click',()=>log.push('native root'),true);
  document.addEventListener('click',()=>log.push('native document'));
  act(()=>{document.getElementById('inner')!.click()});
  console.log('ORDER', log.join(' > '));
  // stopPropagation
  log.length=0;
  act(()=>r.render(<div onClick={()=>log.push('outer')}><button id="inner" onClick={e=>{e.stopPropagation();log.push('inner')}}>Go</button></div>));
  act(()=>{document.getElementById('inner')!.click()});
  console.log('STOP', log.join(' > '));
  // focus bubble & onChange & scroll
  log.length=0;
  act(()=>r.render(<div onFocus={()=>log.push('div focus')} onScroll={()=>log.push('div scroll')} onBlur={()=>log.push('div blur')}><input id="i" onChange={()=>log.push('change')} onFocus={()=>log.push('input focus')}/><div id="s" onScroll={()=>log.push('s scroll')}/></div>));
  act(()=>{(document.getElementById('i') as HTMLInputElement).focus()});
  act(()=>{document.getElementById('s')!.dispatchEvent(new Event('scroll',{bubbles:false}))});
  console.log('FOCUS', log.join(' > '));
});
test('passive & resize', ()=>{
  const added:string[]=[];
  const orig=EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener=function(t:any,l:any,o:any){ if(['wheel','touchstart','touchmove','touchend'].includes(t)) added.push(t+':'+JSON.stringify(o)); return orig.call(this,t,l,o)} as any;
  const root=document.createElement('div');document.body.appendChild(root);
  act(()=>createRoot(root).render(<div/>));
  EventTarget.prototype.addEventListener=orig;
  console.log('PASSIVE', added.join(' '));
});
