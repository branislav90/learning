type Listener = () => void;
const listeners = new Set<Listener>();

function notify() { listeners.forEach((l) => l()); }

export function navigate(url: string, { replace = false } = {}) {
  if (replace) history.replaceState(null, '', url);
  else history.pushState(null, '', url);
  notify();                                  // pushState/replaceState emit no event: we must notify
}

window.addEventListener('popstate', notify); // Back/Forward

export const urlStore = {
  subscribe(l: Listener) { listeners.add(l); return () => void listeners.delete(l); },
  getSnapshot: () => window.location.search, // primitive string => stable snapshot identity
};
export {};
