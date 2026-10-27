// main.tsx (composition root for the browser)
import { createRoot } from 'react-dom/client';
import { ServicesProvider } from './services/ServicesContext';
import type { Services } from './services/ports';

const services: Services = {
  clock: { now: () => Date.now() },
  storage: {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  },
  analytics: { track: (event, props) => navigator.sendBeacon?.('/collect', JSON.stringify({ event, props })) },
  coupons: {
    async apply(code, signal) {
      const res = await fetch(`/api/coupons/${encodeURIComponent(code)}/apply`, { method: 'POST', signal });
      return { ok: res.ok };
    },
  },
};

createRoot(document.getElementById('root')!).render(
  <ServicesProvider services={services}><App /></ServicesProvider>,
);
export {};
