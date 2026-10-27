import { useSecondClock } from '../state/clock';

export function Clock() {
  const now = useSecondClock();
  return <time dateTime={new Date(now).toISOString()}>{new Date(now).toLocaleTimeString()}</time>;
}
