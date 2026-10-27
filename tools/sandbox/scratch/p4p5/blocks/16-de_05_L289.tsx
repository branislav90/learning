// CouponBanner.test.tsx (Vitest + React Testing Library)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { CouponBanner } from './CouponBanner';
import { makeServices, wrapperFor } from './test-utils';

it('shows Expired when the injected clock is past expiry', () => {
  const services = makeServices({ clock: { now: () => 2_000 } });
  render(<CouponBanner coupon={{ code: 'X', expiresAt: 1_000 }} />, { wrapper: wrapperFor(services) });
  expect(screen.getByText('Expired')).toBeInTheDocument();
});

it('tracks and stores on successful apply', async () => {
  const track = vi.fn();
  const services = makeServices({ analytics: { track }, coupons: { apply: async () => ({ ok: true }) } });
  render(<CouponBanner coupon={{ code: 'SAVE10', expiresAt: Number.MAX_SAFE_INTEGER }} />, { wrapper: wrapperFor(services) });
  await userEvent.click(screen.getByRole('button', { name: /apply save10/i }));
  expect(track).toHaveBeenCalledWith('coupon_applied', { code: 'SAVE10', ok: true });
  expect(services.storage.get('lastCoupon')).toBe('SAVE10');
});
export {};
