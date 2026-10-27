// src/components/SummaryBar.tsx
import type { BookStats } from "../types";

export function SummaryBar({ stats }: { stats: BookStats }) {
  const avg = stats.averageRating === null ? "no ratings yet" : stats.averageRating.toFixed(1);
  return (
    <p className="summary" aria-live="polite">
      {stats.total} {stats.total === 1 ? "book" : "books"} · {stats.finished} finished · average rating: {avg}
    </p>
  );
}
