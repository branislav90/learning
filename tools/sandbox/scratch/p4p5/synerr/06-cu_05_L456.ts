export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function ProductSearch() {
  const [text, setText] = useState("");
  const debounced = useDebouncedValue(text, 300);
  const results = useProductQuery(debounced);
  …
}
export {};
