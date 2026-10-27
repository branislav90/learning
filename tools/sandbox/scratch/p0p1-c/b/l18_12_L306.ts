export {};
type Result =
  | { ok: true; value: number }
  | { ok: false; error: string };

function show(r: Result | undefined): string {
  if (!r) return "none";
  if (r.ok) return `value=${r.value.toFixed(1)}`;
  return `error=${r.error}`;
}
