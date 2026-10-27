export {};
function RouteErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const referenceId = useMemo(() => crypto.randomUUID().slice(0, 8), []);
  useEffect(() => {
    reporter.capture(error, { source: "route.fallback.shown", level: "warning", referenceId });
  }, [error, referenceId]);

  return (
    <div role="alert">
      <h2>This page could not be displayed</h2>
      <p>You can try again. If the problem continues, contact support and quote <code>{referenceId}</code>.</p>
      <button onClick={reset}>Try again</button>
      <a href="/">Go to the home page</a>
    </div>
  );
}
