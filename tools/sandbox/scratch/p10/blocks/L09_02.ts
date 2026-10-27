// src/shared/i18n/format.ts
const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();

function key(kind: string, locale: string, opts: object) {
  return `${kind}|${locale}|${JSON.stringify(opts)}`;
}

export function numberFormat(locale: string, opts: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const k = key("n", locale, opts);
  let f = cache.get(k) as Intl.NumberFormat | undefined;
  if (!f) { f = new Intl.NumberFormat(locale, opts); cache.set(k, f); }
  return f;
}

export function dateFormat(locale: string, opts: Intl.DateTimeFormatOptions = {}): Intl.DateTimeFormat {
  const k = key("d", locale, opts);
  let f = cache.get(k) as Intl.DateTimeFormat | undefined;
  if (!f) { f = new Intl.DateTimeFormat(locale, opts); cache.set(k, f); }
  return f;
}

export const formatCurrency = (locale: string, amount: number, currency: string) =>
  numberFormat(locale, { style: "currency", currency }).format(amount);
