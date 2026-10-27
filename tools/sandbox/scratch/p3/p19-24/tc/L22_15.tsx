export {};
function PriceLabel({ amount, hidden }: { amount: number; hidden: boolean }) {
  if (hidden) return null;
  const { currency, locale } = use(CurrencyContext); // OK: conditional, unlike useContext
  return <span>{new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)}</span>;
}
