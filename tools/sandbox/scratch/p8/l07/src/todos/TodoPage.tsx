// src/todos/TodoPage.tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId, useState, type FormEvent } from "react";
import { ValidationError } from "../api/client";
import { addTodo, getTodos, type Todo } from "./api";

const KEY = ["todos"] as const;

export function TodoPage() {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const inputId = useId();
  const errId = useId();

  const todos = useQuery({ queryKey: KEY, queryFn: ({ signal }) => getTodos(signal) });

  const add = useMutation({
    mutationFn: addTodo,
    onMutate: async (newText: string) => {
      await qc.cancelQueries({ queryKey: KEY });
      const previous = qc.getQueryData<Todo[]>(KEY);
      qc.setQueryData<Todo[]>(KEY, (old = []) => [...old, { id: `tmp-${newText}`, text: newText, done: false }]);
      return { previous };
    },
    onError: (_err, _text, ctx) => { qc.setQueryData(KEY, ctx?.previous); },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || add.isPending) return;
    add.mutate(value);
    setText("");
  }

  const fieldError = add.error instanceof ValidationError ? add.error.fieldErrors.text : undefined;
  const genericError = add.isError && !fieldError ? "Couldn't add todo. Please try again." : undefined;

  return (
    <main>
      <h1>Todos</h1>

      {todos.isPending && <p role="status">Loading todos…</p>}
      {todos.isError && (
        <div role="alert">
          Couldn't load todos. <button type="button" onClick={() => todos.refetch()}>Retry</button>
        </div>
      )}
      {todos.isSuccess && todos.data.length === 0 && <p>Nothing to do yet.</p>}
      {todos.isSuccess && todos.data.length > 0 && (
        <ul aria-label="Todos">
          {todos.data.map((t) => (
            <li key={t.id} aria-busy={t.id.startsWith("tmp-") || undefined}>{t.text}</li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} aria-label="Add todo">
        <label htmlFor={inputId}>New todo</label>
        <input id={inputId} value={text} onChange={(e) => setText(e.target.value)}
               aria-invalid={fieldError ? true : undefined} aria-describedby={fieldError ? errId : undefined} />
        {fieldError && <p id={errId}>{fieldError}</p>}
        <button type="submit" disabled={add.isPending}>Add</button>
        {genericError && <p role="alert">{genericError}</p>}
      </form>
    </main>
  );
}
