import { useMemo } from "react";

function Price({ sku, priceCents }: { sku: string; priceCents: number }) {
  const label = useMemo(() => formatCents(priceCents), [priceCents]); // pure derived value
  return <span aria-label={`Price for ${sku}`}>{label}</span>;
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
