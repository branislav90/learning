import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true; // SSR/hydration: assume online

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function ConnectivityBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return <div role="status">You are offline. Changes will be saved and synced when you reconnect.</div>;
}
export {};
