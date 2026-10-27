// src/ui/fields/visibility.ts  — the ONE place that implements F3
export function visibleError(
  error: string | undefined,
  { touched, attempted }: { touched: boolean | undefined; attempted: boolean },
  serverError?: string,
): string | undefined {
  if (serverError) return serverError; // server errors are always shown until the field is edited
  return touched || attempted ? error : undefined;
}
