export {};
function format(input: string | number | null): string {
  if (input === null) return "n/a";
  if (typeof input === "number") return input.toFixed(2);
  return input.trim();
}
