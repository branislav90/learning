import { describe, it, expect } from 'vitest';
import { checkoutReducer as r, initialCheckoutState as init, MAX_ATTEMPTS } from './checkout-machine';
import type { CheckoutState } from './checkout-machine';

describe('checkoutReducer', () => {
  it('ignores SUBMIT while submitting (same reference)', () => {
    const s1 = r(init, { type: 'SUBMIT' });
    expect(r(s1, { type: 'SUBMIT' })).toBe(s1);
  });
  it('stops allowing RETRY at MAX_ATTEMPTS', () => {
    const exhausted: CheckoutState = { status: 'failure', attempt: MAX_ATTEMPTS, message: 'x' };
    expect(r(exhausted, { type: 'RETRY' })).toBe(exhausted);
    expect(r(exhausted, { type: 'RESET' })).toEqual(init);
  });
  it('RESET from success returns to idle', () => {
    expect(r({ status: 'success', receiptId: 'a' }, { type: 'RESET' })).toEqual(init);
  });
  it('late RESOLVE in failure is ignored', () => {
    const f: CheckoutState = { status: 'failure', attempt: 1, message: 'x' };
    expect(r(f, { type: 'RESOLVE', receiptId: 'late' })).toBe(f);
  });
});
export {};
