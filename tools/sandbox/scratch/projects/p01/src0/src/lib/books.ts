// src/lib/books.ts
import type { Book, BookDraft, BookStats, Rating, ReadingStatus, StatusFilter } from "../types";

export function filterBooks(
  books: readonly Book[],
  query: string,
  status: StatusFilter,
): Book[] {
  const q = query.trim().toLowerCase();
  return books.filter((book) => {
    const matchesStatus = status === "all" || book.status === status;
    const matchesQuery =
      q === "" ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });
}

export function computeStats(books: readonly Book[]): BookStats {
  let finished = 0;
  let ratedCount = 0;
  let ratingSum = 0;
  for (const book of books) {
    if (book.status === "finished") finished += 1;
    if (book.rating !== undefined) {
      ratedCount += 1;
      ratingSum += book.rating;
    }
  }
  return {
    total: books.length,
    finished,
    ratedCount,
    averageRating: ratedCount === 0 ? null : ratingSum / ratedCount,
  };
}

export function setStatus(books: readonly Book[], id: string, status: ReadingStatus): Book[] {
  return books.map((b) => (b.id === id ? { ...b, status } : b));
}

export function setRating(books: readonly Book[], id: string, rating: Rating | undefined): Book[] {
  return books.map((b) => (b.id === id ? { ...b, rating } : b));
}

export function removeBook(books: readonly Book[], id: string): Book[] {
  return books.filter((b) => b.id !== id);
}

export function addBook(books: readonly Book[], id: string, draft: BookDraft): Book[] {
  const book: Book = {
    id,
    title: draft.title.trim(),
    author: draft.author.trim(),
    status: draft.status,
    rating: draft.rating,
  };
  return [book, ...books];
}
