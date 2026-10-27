// src/app/components/RelativeTime.tsx
import { useAppData } from '../data/context';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function RelativeTime({ iso }: { iso: string }) {
  const { now } = useAppData();                 // same value on server and client (embedded)
  const days = Math.round((Date.parse(iso) - now) / 86_400_000);
  return <time dateTime={iso}>{rtf.format(days, 'day')}</time>;
}
