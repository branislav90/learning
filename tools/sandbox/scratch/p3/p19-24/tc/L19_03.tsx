export {};
// 🔴 naive: URL read once, state mirrored
function useQueryParamNaive(key: string) {
  const [value, setValue] = useState(() => new URLSearchParams(window.location.search).get(key));

  const set = (next: string | null) => {
    const url = new URL(window.location.href);
    if (next === null) url.searchParams.delete(key);
    else url.searchParams.set(key, next);
    window.history.pushState(null, '', url);
    setValue(next);
  };
  return [value, set] as const;
}
