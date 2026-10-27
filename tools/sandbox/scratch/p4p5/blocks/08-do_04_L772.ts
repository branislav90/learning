class LegacyMappingError extends Error {
  constructor(public readonly field: string, public readonly value: unknown) {
    super(`Cannot map ${field}: ${String(value)}`);
  }
}
export function toCardHolder(dto: { cust_no: string; cust_nm: string; cr_lim: string }, currency: CurrencyCode): CardHolder {
  if (!/^\d+(\.\d{1,2})?$/.test(dto.cr_lim)) throw new LegacyMappingError("cr_lim", dto.cr_lim);
  const minor = Math.round(Number(dto.cr_lim) * 100);   // acceptable at this single boundary; or parse digit-wise
  return { driverId: dto.cust_no as DriverId, displayName: dto.cust_nm.trim(), limit: money(minor, currency), pinStatus: "unset" };
}
export {};
