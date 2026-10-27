import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RealtimeClient, type ServerEvent } from './realtime';

const Ctx = createContext<RealtimeClient | null>(null);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [client, setClient] = useState<RealtimeClient | null>(null);

  useEffect(() => {
    const c = new RealtimeClient({
      url: async () => (await (await fetch('/api/realtime-token')).json()).url as string,
      onReconnect: () => void qc.invalidateQueries({ refetchType: 'active' }), // blunt but safe resync
    });
    setClient(c);
    return () => c.close(); // Strict Mode: first client closed, second created
  }, [qc]);

  return <Ctx.Provider value={client}>{children}</Ctx.Provider>;
}

export function useConnectionStatus() {
  const client = useContext(Ctx);
  return useSyncExternalStore(
    client ? client.subscribeStatus : () => () => {},
    client ? client.getStatus : () => 'idle',
    () => 'idle',
  );
}

export function useTopic(topic: string, onEvent: (e: ServerEvent) => void) {
  const client = useContext(Ctx);
  const handlerRef = useRef(onEvent);
  useEffect(() => { handlerRef.current = onEvent; }); // always call the latest handler without resubscribing

  useEffect(() => {
    if (!client) return;
    return client.subscribe(topic, (e) => handlerRef.current(e));
  }, [client, topic]);
}
export {};
