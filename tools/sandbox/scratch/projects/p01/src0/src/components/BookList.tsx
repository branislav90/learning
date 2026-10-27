// src/components/BookList.tsx
import type { Book, Rating, ReadingStatus } from "../types";
import { BookCard } from "./BookCard";
import { EmptyState } from "./EmptyState";

interface BookListProps {
  books: readonly Book[];
  hasAnyBooks: boolean;
  onStatusChange: (id: string, status: ReadingStatus) => void;
  onRate: (id: string, rating: Rating | undefined) => void;
  onRemove: (id: string) => void;
}

export function BookList({ books, hasAnyBooks, ...handlers }: BookListProps) {
  if (books.length === 0) {
    return hasAnyBooks ? (
      <EmptyState title="No matches" message="Try a different search or status filter." />
    ) : (
      <EmptyState title="Your list is empty" message="Add your first book above." />
    );
  }

  return (
    <ul className="book-list" aria-label="Books">
      {books.map((book) => (
        <BookCard key={book.id} book={book} {...handlers} />
      ))}
    </ul>
  );
}
