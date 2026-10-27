// src/app/components/Reviews.tsx
import { use } from 'react';
import { useAppData } from '../data/context';
import { RelativeTime } from './RelativeTime';

export function Reviews({ slug }: { slug: string }) {
  const { cache, services } = useAppData();
  // Stable key => stable promise. The fetch starts on first render, on the server in-process.
  const reviews = use(cache.read(`reviews:${slug}`, () => services.getReviews(slug)));
  if (reviews.length === 0) return <p>No reviews yet. Be the first.</p>;
  return (
    <ol aria-label="Customer reviews">
      {reviews.map((r) => (
        <li key={r.id}>
          <strong>{r.author}</strong> <span aria-label={`${r.rating} out of 5`}>{'★'.repeat(r.rating)}</span>
          <p>{r.body}</p>
          <RelativeTime iso={r.createdAt} />
        </li>
      ))}
    </ol>
  );
}
