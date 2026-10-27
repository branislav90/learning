function useResettableDraft<T>(source: T, resetKey: unknown) {
  const [draft, setDraft] = useState<T>(source);
  const [prevKey, setPrevKey] = useState(resetKey);
  if (!Object.is(prevKey, resetKey)) {
    setPrevKey(resetKey);
    setDraft(source);                  // calling setState during render of the same component is allowed in this pattern
  }
  return [draft, setDraft] as const;
}
export {};
