import { useEffect, useRef, useState } from 'react';

const BUILD = import.meta.env.VITE_BUILD_ID as string; // baked at build; unique per build

export function useNewVersionAvailable(pollMs = 5 * 60_000) {
  const [available, setAvailable] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch('/version.json', { cache: 'no-store' });
        if (!res.ok) return;
        const { build } = (await res.json()) as { build: string };
        if (!cancelled && build !== BUILD) setAvailable(true);
      } catch { /* offline or transient: ignore */ }
    }
    const onVisible = () => { if (document.visibilityState === 'visible') void check(); };
    document.addEventListener('visibilitychange', onVisible);
    timer.current = window.setInterval(check, pollMs);
    void check();
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(timer.current);
    };
  }, [pollMs]);

  return available;
}

export function UpdateBanner() {
  const available = useNewVersionAvailable();
  if (!available) return null;
  return (
    <div role="status">
      A new version is available. <button onClick={() => location.reload()}>Reload</button>
    </div>
  );
}
