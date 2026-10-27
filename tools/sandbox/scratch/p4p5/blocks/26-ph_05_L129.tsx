const store = { width: window.innerWidth };
function useSize() {
  return useSyncExternalStore(
    (cb) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); },
    () => ({ width: window.innerWidth }),
  );
}
export {};
