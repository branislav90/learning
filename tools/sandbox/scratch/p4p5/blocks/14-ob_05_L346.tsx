const subscribeCache = new Map<string, (cb: () => void) => () => void>();
function getSubscribe(query: string) {
  let s = subscribeCache.get(query);
  if (!s) {
    s = (cb) => { const m = window.matchMedia(query); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb); };
    subscribeCache.set(query, s);
  }
  return s;
}
export {};
