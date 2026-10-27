function useDismiss(open: boolean, onDismiss: () => void, refs: Array<React.RefObject<HTMLElement | null>>) {
  const dismissRef = useRef(onDismiss);
  useEffect(() => { dismissRef.current = onDismiss; });
  useEffect(() => {
    if (!open) return;                                          // subscribe only while open
    const controller = new AbortController();
    document.addEventListener('pointerdown', (e) => {
      if (refs.every((r) => !r.current?.contains(e.target as Node))) dismissRef.current();
    }, { signal: controller.signal });
    return () => controller.abort();
  }, [open, refs]);                                             // refs array must be stable (module/`useRef` array)
}
export {};
