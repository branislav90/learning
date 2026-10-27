import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useJobProgressSSE(jobId: string) {
  const qc = useQueryClient();

  useEffect(() => {
    const es = new EventSource(`/api/jobs/${jobId}/events`, { withCredentials: true });

    es.addEventListener('progress', (e) => {
      const { percent } = JSON.parse((e as MessageEvent<string>).data) as { percent: number };
      qc.setQueryData<{ percent: number }>(['job', jobId, 'progress'], { percent });
    });
    es.addEventListener('done', () => {
      void qc.invalidateQueries({ queryKey: ['job', jobId] });
      es.close(); // terminal state: stop auto-reconnect
    });
    es.onerror = () => {
      // EventSource retries by itself, sending Last-Event-ID if the server set `id:` fields.
      // Only intervene for terminal failures (readyState === CLOSED).
      if (es.readyState === EventSource.CLOSED) {
        void qc.invalidateQueries({ queryKey: ['job', jobId] }); // fall back to HTTP truth
      }
    };

    return () => es.close();
  }, [jobId, qc]);
}
export {};
