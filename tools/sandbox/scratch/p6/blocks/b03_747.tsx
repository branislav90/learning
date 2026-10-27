export function useDelayedFlag(active: boolean, delayMs = 200, minMs = 400) {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef<number | null>(null);
  useEffect(() => {
    if (active) {
      const t = setTimeout(() => { shownAt.current = performance.now(); setVisible(true); }, delayMs);
      return () => clearTimeout(t);
    }
    if (visible && shownAt.current !== null) {
      const remaining = Math.max(0, minMs - (performance.now() - shownAt.current));
      const t = setTimeout(() => { shownAt.current = null; setVisible(false); }, remaining);
      return () => clearTimeout(t);
    }
  }, [active, visible, delayMs, minMs]);
  return visible;
}
export {};
