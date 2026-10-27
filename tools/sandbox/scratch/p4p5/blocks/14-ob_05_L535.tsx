// theme-store.ts
import { createStore } from './store';

type ThemePref = 'system' | 'light' | 'dark';
const KEY = 'theme';

function read(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch { return 'system'; }                      // storage may throw (privacy mode)
}

export const themeStore = createStore<ThemePref>('system');
let initialised = false;

export function initThemeStore() {                  // call once on the client
  if (initialised) return;
  initialised = true;
  themeStore.setState(read());
  window.addEventListener('storage', (e) => {       // other tabs
    if (e.key === KEY) themeStore.setState(read());
  });
}

export function setTheme(t: ThemePref) {
  try { localStorage.setItem(KEY, t); } catch { /* quota/privacy: keep in-memory only */ }
  themeStore.setState(t);                           // same-tab subscribers update, too
}
export {};
