import { formatAge } from '../lib/format';
import { useMinuteClock } from '../state/clock';

export function Age({ iso }: { iso: string }) {
  const now = useMinuteClock();
  return <span className="age">{formatAge(iso, now)}</span>;
}
