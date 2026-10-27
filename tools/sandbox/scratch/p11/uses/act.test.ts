import { act } from 'react'; import * as tu from 'react-dom/test-utils'; import { it } from 'vitest';
it('x', () => { console.log('ACT', typeof act, Object.keys(tu), tu.act === act); });
