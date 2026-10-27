// src/components/BookCard.tsx
import { useId, useState } from "react";
import type { Book, Rating, ReadingStatus } from "../types";
import { StarRating } from "./StarRating";

interface BookCardProps {
  book: Book;
  onStatusChange: (id: string, status: ReadingStatus) => void;
  onRate: (id: string, rating: Rating | undefined) => void;
  onRemove: (id: string) => void;
}

const STATUS_LABELS: Record<ReadingStatus, string> = {
  want: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

export function BookCard({ book, onStatusChange, onRate, onRemove }: BookCardProps) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const statusId = useId();

  return (
    <li className="card">
      <div className="card__main">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <StarRating
          label={`Rating for ${book.title}`}
          value={book.rating}
          onChange={(rating) => onRate(book.id, rating)}
        />
      </div>

      <div className="card__actions">
        <label htmlFor={statusId}>Status</label>
        <select
          id={statusId}
          value={book.status}
          onChange={(event) => onStatusChange(book.id, event.target.value as ReadingStatus)}
        >
          {(Object.keys(STATUS_LABELS) as ReadingStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Hide notes" : "Show notes"}
        </button>
        <button type="button" onClick={() => onRemove(book.id)}>
          Remove
        </button>
      </div>

      {expanded && (
        <section id={detailsId}>
          <p>{book.notes ?? "No notes yet."}</p>
        </section>
      )}
    </li>
  );
}
