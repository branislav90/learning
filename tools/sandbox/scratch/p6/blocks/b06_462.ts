const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('app-cache') : null;

export function broadcastInvalidate(prefix: readonly unknown[]) {
  channel?.postMessage({ type: 'invalidate', prefix });
}

export function listenForInvalidations(cache: MiniCache) {
  if (!channel) return () => {};
  const onMessage = (e: MessageEvent<{ type: string; prefix: readonly unknown[] }>) => {
    if (e.data?.type === 'invalidate' && Array.isArray(e.data.prefix)) cache.invalidate(e.data.prefix);
  };
  channel.addEventListener('message', onMessage);
  return () => channel.removeEventListener('message', onMessage);
}
export {};
