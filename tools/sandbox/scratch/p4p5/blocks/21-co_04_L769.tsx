export function useControllableState<T>({ value, defaultValue, onChange }: {
  value: T | undefined; defaultValue: T; onChange?: (next: T) => void;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = (isControlled ? value : internal) as T;
  const currentRef = useRef(current);
  currentRef.current = current;   // ⚠ writing a ref during render: acceptable only if you accept the purity trade-off; alternatively update in an effect/layout effect.

  const set = useCallback((next: T | ((prev: T) => T)) => {
    const resolved = typeof next === "function" ? (next as (p: T) => T)(currentRef.current) : next;
    if (Object.is(resolved, currentRef.current)) return;
    if (!isControlled) setInternal(resolved);
    onChange?.(resolved);
  }, [isControlled, onChange]);
  return [current, set] as const;
}
export {};
