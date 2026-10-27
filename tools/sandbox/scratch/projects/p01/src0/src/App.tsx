// src/App.tsx
import { useState } from "react";
import type { Book, BookDraft, Rating, ReadingStatus, StatusFilter } from "./types";
import { seedBooks } from "./data/seedBooks";
import { addBook, computeStats, filterBooks, removeBook, setRating, setStatus } from "./lib/books";
import { SummaryBar } from "./components/SummaryBar";
import { SearchBox } from "./components/Controls/SearchBox";
import { StatusTabs } from "./components/Controls/StatusTabs";
import { DensityToggle } from "./components/Controls/DensityToggle";
import { BookList } from "./components/BookList";
import { AddBookForm } from "./components/AddBookForm";

type Density = "comfortable" | "compact";

export function App() {
  const [books, setBooks] = useState<readonly Book[]>(seedBooks);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [density, setDensity] = useState<Density>("comfortable");

  // Derived during render: no extra state, no effect, cannot go stale.
  const visibleBooks = filterBooks(books, query, statusFilter);
  const stats = computeStats(books);

  function handleAdd(draft: BookDraft) {
    // Impure call (random id) lives in the EVENT HANDLER, not in render.
    const id = crypto.randomUUID();
    setBooks((current) => addBook(current, id, draft));
  }

  function handleStatusChange(id: string, status: ReadingStatus) {
    setBooks((current) => setStatus(current, id, status));
  }

  function handleRate(id: string, rating: Rating | undefined) {
    setBooks((current) => setRating(current, id, rating));
  }

  function handleRemove(id: string) {
    setBooks((current) => removeBook(current, id));
  }

  return (
    <div className="app" data-density={density}>
      <h1>Reading List Explorer</h1>
      <SummaryBar stats={stats} />
      <div className="controls">
        <SearchBox value={query} onChange={setQuery} />
        <StatusTabs value={statusFilter} onChange={setStatusFilter} />
        <DensityToggle value={density} onChange={setDensity} />
      </div>
      <AddBookForm onAdd={handleAdd} />
      <BookList
        books={visibleBooks}
        hasAnyBooks={books.length > 0}
        onStatusChange={handleStatusChange}
        onRate={handleRate}
        onRemove={handleRemove}
      />
    </div>
  );
}
