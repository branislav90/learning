// CouponBanner.tsx
import { useServices } from './services/ServicesContext';

export function CouponBanner({ coupon }: { coupon: { code: string; expiresAt: number } }) {
  const { clock, coupons, analytics, storage } = useServices();
  const expired = clock.now() > coupon.expiresAt;

  async function apply() {
    const result = await coupons.apply(coupon.code);
    analytics.track('coupon_applied', { code: coupon.code, ok: result.ok });
    if (result.ok) storage.set('lastCoupon', coupon.code);
  }

  return expired ? <p>Expired</p> : <button onClick={apply}>Apply {coupon.code}</button>;
}
export {};
