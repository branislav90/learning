function useEscape(active: boolean, onEscape: () => void) {
  const ref = useLatest(onEscape);
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") ref.current(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [active, ref]);
}
// A: useEscape(open, () => setOpen(false));
export {};
