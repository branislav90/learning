import React from 'react';
import {test} from 'vitest';
import {renderToString} from 'react-dom/server';
test('z',()=>{
 const err=console.error; console.error=(...a:any[])=>{console.log('ERR:',String(a[0]).slice(0,200))};
 console.log(renderToString(<a href="javascript:alert(1)">x</a>));
 console.error=err;
});
