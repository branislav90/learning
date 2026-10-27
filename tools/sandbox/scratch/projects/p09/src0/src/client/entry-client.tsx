// src/client/entry-client.tsx
import { hydrateRoot } from 'react-dom/client';
import { App } from '../app/App';
import { createMapCache, fulfilled } from '../app/data/cache';
import { createClientServices } from './services';
import { matchRoute } from '../app/routes';

declare global { interface Window { __DATA__?: Array<[string, unknown]>; __NOW__?: number } }

const cache = createMapCache();
const seed = () => {
  for (const [k, v] of window.__DATA__ ?? []) if (!cache.entries.has(k)) cache.entries.set(k, fulfilled(v));
};
seed();

// Data scripts that arrive after bootstrap: pick them up lazily at read time.
const baseRead = cache.read.bind(cache);
cache.read = <T,>(key: string, f: () => Promise<T>) => { seed(); return baseRead(key, f); };

hydrateRoot(
  document,
  <App
    route={matchRoute(new URL(location.href))}
    data={{ cache, services: createClientServices(), now: window.__NOW__ ?? Date.now() }}
    now={window.__NOW__ ?? Date.now()}
  />,
  {
    onRecoverableError(error, info) {
      // Hydration mismatches that React recovered from by client-rendering end up here.
      console.error('[recoverable]', error, info.componentStack);
      navigator.sendBeacon?.('/__rum', JSON.stringify({ type: 'recoverable', message: String(error) }));
    },
  },
);
