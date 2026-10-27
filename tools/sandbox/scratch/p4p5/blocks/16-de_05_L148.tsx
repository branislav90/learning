// INCORRECT (for our purposes): environment baked in
import { analytics } from './analytics';

export function CouponBanner({ coupon }: { coupon: { code: string; expiresAt: number } }) {
  const expired = Date.now() > coupon.expiresAt;        // non-deterministic

  async function apply() {
    const res = await fetch(`/api/coupons/${coupon.code}/apply`, { method: 'POST' });   // hidden network
    analytics.track('coupon_applied', { code: coupon.code, ok: res.ok });                // hidden telemetry
    localStorage.setItem('lastCoupon', coupon.code);                                       // hidden storage
  }

  return expired ? <p>Expired</p> : <button onClick={apply}>Apply {coupon.code}</button>;
}
export {};
