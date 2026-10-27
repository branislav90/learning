// @vitest-environment jsdom
import React, {StrictMode, useState, useMemo, useCallback, useRef} from 'react';
import {render, screen, fireEvent, cleanup} from '@testing-library/react';
import {test, afterEach} from 'vitest';
afterEach(()=>cleanup());
test('useMemo strict update', () => {
  let calls=0; const cbs=new Set<any>(); let renders=0;
  function C(){const [a,setA]=useState(0);const [b,setB]=useState(0);renders++;
    useMemo(()=>{calls++;return a},[a]); const f=useCallback(()=>a,[a]); cbs.add(f);
    return <><button onClick={()=>setA(a+1)}>A</button><button onClick={()=>setB(b+1)}>B</button></>}
  render(<StrictMode><C/></StrictMode>); console.log('mount calls',calls,'renders',renders,'distinct cb',cbs.size); calls=0;renders=0;
  fireEvent.click(screen.getByText('A')); console.log('A click calls',calls,'renders',renders,'distinct cb',cbs.size); calls=0;
  fireEvent.click(screen.getByText('B')); console.log('B click calls',calls);
});
