export function useNow(intervalMs: number, clock: Clock): Date {
  const [now, setNow] = useState(() => clock.now());
  useEffect(() => {
    const id = setInterval(() => setNow(clock.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, clock]);
  return now;
}
export {};
