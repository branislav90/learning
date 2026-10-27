import React, { createContext, use, useContext } from 'react';
import { renderToString } from 'react-dom/server';
import { it } from 'vitest';
const C = createContext('d');
it('ctx', () => { const A = () => <>{use(C)}-{useContext(C)}</>; console.log('CTX', renderToString(<C value="v"><A /></C>), renderToString(<C.Provider value="p"><A /></C.Provider>)); });
