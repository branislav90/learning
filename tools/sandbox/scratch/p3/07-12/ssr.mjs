import React from 'react'; import {renderToString} from 'react-dom/server';
const C=()=>{React.useLayoutEffect(()=>{});return React.createElement('p',null,'x')};
const o=console.error; console.error=(...a)=>{console.log('ERR',a.join(' ').slice(0,200))};
console.log(renderToString(React.createElement(C)));
