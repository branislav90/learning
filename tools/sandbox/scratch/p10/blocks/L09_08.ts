// minor units differ per currency; derive instead of hard-coding 100
export function minorUnitDivisor(currency: string): number {
  const digits = new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return 10 ** digits;
}
