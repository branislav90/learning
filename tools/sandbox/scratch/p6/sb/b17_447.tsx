declare const useTopic: any; type useTopic<T=any,U=any,V=any> = any;
import { useQueryClient } from '@tanstack/react-query';

interface Order { id: number; status: string; version: number }

export function useOrderLive(orderId: number) {
  const qc = useQueryClient();
  const key = ['order', orderId] as const;

  useTopic(`orders:${orderId}`, (ev) => {
    if (ev.type !== 'updated') return;

    const current = qc.getQueryData<Order>(key);
    const incoming = ev.data as Order | undefined;

    if (incoming && current && incoming.version === current.version + 1) {
      // In-order full snapshot: safe to apply directly
      void qc.cancelQueries({ queryKey: key });           // don't let an older in-flight fetch overwrite
      qc.setQueryData<Order>(key, incoming);
    } else if (!current || (incoming && incoming.version > current.version + 1) || !incoming) {
      // Gap, unknown state, or hint-only event: authoritative refetch
      void qc.invalidateQueries({ queryKey: key });
    }
    // else: duplicate/old (version <= current.version): ignore
  });
}
export {};
