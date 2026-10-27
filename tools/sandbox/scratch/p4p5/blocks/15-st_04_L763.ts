export function useUrlState<T>(
  searchParams: URLSearchParams,
  setSearchParams: (next: URLSearchParams, opts?: { replace?: boolean }) => void,
  key: string,
  parse: (raw: string) => T | undefined,   // return undefined for invalid
  serialize: (value: T) => string,
  defaultValue: T,
): [T, (next: T) => void] {
  const raw = searchParams.get(key);
  const parsed = raw === null ? undefined : parse(raw);
  const value = parsed === undefined ? defaultValue : parsed;
  const set = (next: T) => {
    const p = new URLSearchParams(searchParams);
    if (Object.is(next, defaultValue)) p.delete(key); else p.set(key, serialize(next));
    setSearchParams(p, { replace: true });
  };
  return [value, set];
}
export {};
