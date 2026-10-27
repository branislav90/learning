// src/todos/api.ts
import { apiFetch } from "../api/client";

export interface Todo { id: string; text: string; done: boolean }

export function parseTodos(data: unknown): Todo[] {
  if (!Array.isArray(data)) throw new Error("Expected an array of todos");
  return data.map((t) => {
    if (!t || typeof t !== "object" || typeof (t as Todo).id !== "string" || typeof (t as Todo).text !== "string") {
      throw new Error("Invalid todo");
    }
    return { id: (t as Todo).id, text: (t as Todo).text, done: Boolean((t as Todo).done) };
  });
}

export const getTodos = (signal?: AbortSignal) => apiFetch<Todo[]>("/api/todos", { signal, parse: parseTodos });
export const addTodo = (text: string) => apiFetch<Todo>("/api/todos", { method: "POST", body: JSON.stringify({ text }) });
