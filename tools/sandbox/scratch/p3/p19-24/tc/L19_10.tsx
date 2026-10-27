export function usePageParam(): [number, (n: number) => void] {
  const raw = useSearchParam('page');
  const parsed = raw === null ? 1 : Number.parseInt(raw, 10);
  const page = Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
  const setPage = (n: number) =>
    setSearchParam('page', n <= 1 ? null : String(n), 'push');
  return [page, setPage];
}
