export interface DateRange { readonly start: Date; readonly end: Date; }

export function dateRange(start: Date, end: Date): DateRange {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) throw new RangeError("Invalid date");
  if (start.getTime() > end.getTime()) throw new RangeError("start must be <= end");
  return Object.freeze({ start, end });
}
export const contains = (r: DateRange, d: Date) =>
  d.getTime() >= r.start.getTime() && d.getTime() <= r.end.getTime();
export const overlaps = (a: DateRange, b: DateRange) =>
  a.start.getTime() <= b.end.getTime() && b.start.getTime() <= a.end.getTime();
export {};
