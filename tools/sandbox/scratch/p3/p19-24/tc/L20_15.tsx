export {};
function useScroll() {
  return useSyncExternalStore(
    (cb) => { window.addEventListener('scroll', cb); return () => window.removeEventListener('scroll', cb); },
    () => ({ x: window.scrollX, y: window.scrollY }),
  );
}
