function subscribeVisibility(cb: () => void) {
  document.addEventListener('visibilitychange', cb);
  return () => document.removeEventListener('visibilitychange', cb);
}
export function useDocumentVisibility(): 'visible' | 'hidden' {
  return useSyncExternalStore(
    subscribeVisibility,
    () => (document.visibilityState === 'hidden' ? 'hidden' : 'visible'),
    () => 'visible',
  );
}
