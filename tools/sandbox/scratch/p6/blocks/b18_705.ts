const DAY = 86_400_000;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function parseDay(raw: string | null): number | null {
  if (!raw || !ISO.test(raw)) return null;
  const t = Date.parse(`${raw}T00:00:00Z`);        // UTC midnight: no local timezone drift
  return Number.isNaN(t) ? null : t;
}

export function parseDateRange(sp: URLSearchParams, today = Date.now()) {
  const defTo = Math.floor(today / DAY) * DAY;
  const defFrom = defTo - 29 * DAY;
  let from = parseDay(sp.get('from')) ?? defFrom;
  let to = parseDay(sp.get('to')) ?? defTo;
  if (from > to) [from, to] = [to, from];
  if (to - from > 365 * DAY) from = to - 365 * DAY;
  return { from, to };
}

export function serializeDateRange(r: { from: number; to: number }, sp = new URLSearchParams()) {
  sp.set('from', new Date(r.from).toISOString().slice(0, 10));
  sp.set('to', new Date(r.to).toISOString().slice(0, 10));
  return sp;
}
export {};
