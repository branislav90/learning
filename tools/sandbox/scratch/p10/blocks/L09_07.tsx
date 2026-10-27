export {};
function CartSummary({ itemCount, totalMinor, currency, deliverBy }: {
  itemCount: number; totalMinor: number; currency: string; deliverBy: string;
}) {
  const { t, n, d } = useI18n();
  const total = n(totalMinor / minorUnitDivisor(currency), { style: "currency", currency });
  return (
    <div className="cart-summary">
      <p>{t("cart.itemCount", { count: itemCount })}</p>
      <p>{t("cart.total", { amount: total })}</p>
      <p>{t("cart.delivery", { date: d(new Date(deliverBy), { dateStyle: "long" }) })}</p>
      <button type="button" className="btn">
        {t("cart.checkout")}
        <ArrowIcon className="icon-directional" aria-hidden="true" />
      </button>
    </div>
  );
}
