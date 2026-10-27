import React from 'react';
import {test} from 'vitest';
import {renderToString} from 'react-dom/server';
test('z',()=>{
 const R=(p:any)=><i/>; const p:any={key:'a',id:1};
 const err=console.error; console.error=(...a:any[])=>{console.log('ERR:',String(a[0]).slice(0,200))};
 renderToString(<div>{[<R {...p}/>]}</div>);
 renderToString(<a href="javascript:alert(1)">x</a>);
 renderToString(<div>{Promise.resolve(1) as any}</div>);
 console.error=err;
});
