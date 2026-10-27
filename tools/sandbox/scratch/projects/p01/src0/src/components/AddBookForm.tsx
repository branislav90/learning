// src/components/AddBookForm.tsx
import { useId, useRef, useState, type FormEvent } from "react";
import type { BookDraft, Rating, ReadingStatus } from "../types";
import { isValid, validateDraft } from "../lib/validation";

interface AddBookFormProps {
  onAdd: (draft: BookDraft) => void;
}

const EMPTY_DRAFT: BookDraft = { title: "", author: "", status: "want", rating: undefined };

export function AddBookForm({ onAdd }: AddBookFormProps) {
  const [draft, setDraft] = useState<BookDraft>(EMPTY_DRAFT);
  const [touched, setTouched] = useState({ title: false, author: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const titleId = useId();
  const authorId = useId();
  const titleErrorId = `${titleId}-error`;
  const authorErrorId = `${authorId}-error`;

  const errors = validateDraft(draft); // derived each render
  const showTitleError = (touched.title || submitAttempted) && errors.title !== undefined;
  const showAuthorError = (touched.author || submitAttempted) && errors.author !== undefined;

  function update<K extends keyof BookDraft>(key: K, value: BookDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    if (!isValid(errors)) return;

    onAdd(draft);
    setDraft(EMPTY_DRAFT);
    setTouched({ title: false, author: false });
    setSubmitAttempted(false);
    titleRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Add a book">
      <div>
        <label htmlFor={titleId}>Title</label>
        <input
          ref={titleRef}
          id={titleId}
          value={draft.title}
          onChange={(e) => update("title", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          aria-invalid={showTitleError}
          aria-describedby={showTitleError ? titleErrorId : undefined}
        />
        {showTitleError && (
          <p id={titleErrorId} role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={authorId}>Author</label>
        <input
          id={authorId}
          value={draft.author}
          onChange={(e) => update("author", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, author: true }))}
          aria-invalid={showAuthorError}
          aria-describedby={showAuthorError ? authorErrorId : undefined}
        />
        {showAuthorError && (
          <p id={authorErrorId} role="alert">
            {errors.author}
          </p>
        )}
      </div>

      <label>
        Status
        <select
          value={draft.status}
          onChange={(e) => update("status", e.target.value as ReadingStatus)}
        >
          <option value="want">Want to read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
      </label>

      <label>
        Rating (optional)
        <select
          value={draft.rating ?? ""}
          onChange={(e) =>
            update("rating", e.target.value === "" ? undefined : (Number(e.target.value) as Rating))
          }
        >
          <option value="">No rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Add book</button>
    </form>
  );
}
