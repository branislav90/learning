// features/comments/model/useComments.ts
import { useEffect, useMemo, useState } from "react";
import type { Comment } from "./types";

type Status = "loading" | "error" | "ready";

export function useComments(postId: string) {
  const [status, setStatus] = useState<Status>("loading");
  const [all, setAll] = useState<readonly Comment[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus("loading");
    fetch(`/api/posts/${encodeURIComponent(postId)}/comments`, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<Comment[]>; })
      .then((data) => { setAll(data); setStatus("ready"); })
      .catch(() => { if (!ctrl.signal.aborted) setStatus("error"); });
    return () => ctrl.abort();
  }, [postId]);

  const authors = useMemo(() => [...new Set(all.map((c) => c.author))].sort(), [all]);
  const comments = useMemo(
    () => (selectedAuthor ? all.filter((c) => c.author === selectedAuthor) : all),
    [all, selectedAuthor],
  );

  return { status, comments, authors, selectedAuthor, setSelectedAuthor };
}
export {};
