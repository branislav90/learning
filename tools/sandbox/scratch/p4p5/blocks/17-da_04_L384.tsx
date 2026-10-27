// in a feature that must clear its caches on sign-out
function useClearOnSignOut() {
  const qc = useQueryClient();
  useEffect(() => on("auth/signedOut", () => qc.clear()), [qc]);   // returns the unsubscribe
}
export {};
