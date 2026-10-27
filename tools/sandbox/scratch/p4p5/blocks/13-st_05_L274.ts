import { checkoutReducer, initialCheckoutState } from './checkout-machine';

test('double submit is ignored', () => {
  const s1 = checkoutReducer(initialCheckoutState, { type: 'SUBMIT' });
  const s2 = checkoutReducer(s1, { type: 'SUBMIT' });
  expect(s2).toBe(s1);
});
export {};
