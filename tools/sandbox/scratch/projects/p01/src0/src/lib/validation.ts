// src/lib/validation.ts
import type { BookDraft } from "../types";

export type DraftErrors = Partial<Record<"title" | "author", string>>;

export function validateDraft(draft: BookDraft): DraftErrors {
  const errors: DraftErrors = {};
  if (draft.title.trim() === "") errors.title = "Title is required.";
  else if (draft.title.trim().length > 120) errors.title = "Title must be 120 characters or fewer.";
  if (draft.author.trim() === "") errors.author = "Author is required.";
  return errors;
}

export function isValid(errors: DraftErrors): boolean {
  return Object.keys(errors).length === 0;
}
