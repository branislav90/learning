// deliveryDate.ts (excerpt)
export function toApiDate(input: string): string {        // `input` is the date picker's *display* value
  return new Date(input).toISOString().slice(0, 10);      // line 28
}
// The picker shows dates formatted with Intl.DateTimeFormat(locale), e.g. de-DE "15.03.2026", en-US "3/15/2026"
