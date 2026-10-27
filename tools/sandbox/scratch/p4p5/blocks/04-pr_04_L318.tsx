// props-only
export function PriceLabel({ amountText, onSelect }: { amountText: string; onSelect?: () => void }) {
  return onSelect
    ? <button type="button" onClick={onSelect}>{amountText}</button>
    : <span>{amountText}</span>;
}

// data-aware at the feature level, once per list not per label
export function ProductRow({ product }: { product: Product }) {
  const { currency } = useSettings();
  const navigate = useNavigate();
  return <PriceLabel amountText={formatMoney(product.price, currency)} onSelect={() => navigate(`/p/${product.id}`)} />;
}
export {};
