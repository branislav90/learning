export function useControllableState<T>({ value, defaultValue, onChange }: Options<T>) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const current = isControlled ? (value as T) : inner;

  const latest = useRef({ current, onChange, isControlled });
  useLayoutEffect(() => { latest.current = { current, onChange, isControlled }; });  // update after commit

  const set = useCallback((next: T) => {
    const l = latest.current;
    if (!l.isControlled) setInner(next);
    if (!Object.is(next, l.current)) l.onChange?.(next);
  }, []);
  return [current, set] as const;
}
export {};
