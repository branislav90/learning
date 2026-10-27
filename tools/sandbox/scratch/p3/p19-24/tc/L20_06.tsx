type Viewport = { width: number; height: number };

let cached: Viewport = { width: 0, height: 0 };

function readViewport(): Viewport {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (cached.width !== w || cached.height !== h) {
    cached = { width: w, height: h }; // new identity only on real change
  }
  return cached;
}

const SERVER_VIEWPORT: Viewport = { width: 1024, height: 768 }; // module constant -> stable

export function useViewport(): Viewport {
  return useSyncExternalStore(subscribeResize, readViewport, () => SERVER_VIEWPORT);
}
