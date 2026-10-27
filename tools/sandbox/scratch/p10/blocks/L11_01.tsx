// packages/ds/src/internal/deprecate.ts
const warned = new Set<string>();

export function deprecated(
  id: string,
  message: string,
  { removeIn }: { removeIn: string }
): void {
  if (process.env.NODE_ENV === 'production') return;
  if (warned.has(id)) return;
  warned.add(id);
  console.warn(`[@acme/ds] ${id} is deprecated and will be removed in ${removeIn}. ${message}`);
}
