function useSessionCacheReset(userId: string | null) {
  const qc = useQueryClient();
  const previous = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (previous.current !== undefined && previous.current !== userId) {
      qc.clear();                     // drop everything: previous identity's data must not leak ⚠ verify `clear` semantics
    }
    previous.current = userId;
  }, [userId, qc]);
}
export {};
