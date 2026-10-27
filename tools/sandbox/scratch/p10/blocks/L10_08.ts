export function loadScript(src: string, opts: { timeoutMs: number; integrity?: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    if (opts.integrity) { s.integrity = opts.integrity; s.crossOrigin = "anonymous"; }
    const timer = setTimeout(() => { cleanup(); reject(new Error("script timeout")); }, opts.timeoutMs);
    const cleanup = () => { clearTimeout(timer); s.onload = s.onerror = null; };
    s.onload = () => { cleanup(); resolve(); };
    s.onerror = () => { cleanup(); reject(new Error("script failed")); };   // ad blockers produce this too
    document.head.appendChild(s);
  });
}
