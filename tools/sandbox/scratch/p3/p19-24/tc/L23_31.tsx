export {};
function useWhyRan(name: string, deps: Record<string, unknown>) {
  const prev = useRef(deps);
  useEffect(() => {
    const changed = Object.keys(deps).filter((k) => !Object.is(prev.current[k], deps[k]));
    if (changed.length) console.log(`[${name}] changed:`, changed);
    prev.current = deps;
  });
}
