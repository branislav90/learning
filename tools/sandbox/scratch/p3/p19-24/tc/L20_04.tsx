export {};
// 🔴
function useViewport() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('resize', cb);
      return () => window.removeEventListener('resize', cb);
    },
    () => ({ width: window.innerWidth, height: window.innerHeight }),
  );
}
