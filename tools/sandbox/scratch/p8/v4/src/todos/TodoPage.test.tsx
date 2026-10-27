import { delay, http, HttpResponse } from "msw";
import { screen, waitFor, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { API_URL } from "../api/client";
import { renderApp } from "../test/renderApp";
import { server } from "../test/server";
import { TodoPage } from "./TodoPage";

const url = `${API_URL}/api/todos`;

test("shows a loading status, then the list", async () => {
  server.use(http.get(url, () => HttpResponse.json([{ id: "1", text: "write tests", done: false }])));
  renderApp(<TodoPage />);

  expect(screen.getByRole("status")).toHaveTextContent(/loading/i);
  expect(await screen.findByRole("list", { name: "Todos" })).toHaveTextContent("write tests");
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("shows an empty state", async () => {
  server.use(http.get(url, () => HttpResponse.json([])));
  renderApp(<TodoPage />);
  expect(await screen.findByText(/nothing to do yet/i)).toBeInTheDocument();
});

test.each([
  ["500 server error", () => new HttpResponse(null, { status: 500 })],
  ["network failure", () => HttpResponse.error()],
  ["malformed JSON", () => new HttpResponse("<html/>", { headers: { "Content-Type": "text/html" } })],
  ["invalid shape", () => HttpResponse.json([{ nope: true }])],
])("shows a retryable error for %s", async (_name, resolver) => {
  server.use(http.get(url, resolver));
  renderApp(<TodoPage />);
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/couldn't load todos/i);
  expect(screen.getByRole("button", { name: /retry/i })).toBeEnabled();
});

test("retry after failure loads the data", async () => {
  server.use(
    http.get(url, () => new HttpResponse(null, { status: 503 }), { once: true }),
    http.get(url, () => HttpResponse.json([{ id: "1", text: "recovered", done: false }])),
  );
  const { user } = renderApp(<TodoPage />);

  await user.click(await screen.findByRole("button", { name: /retry/i }));
  expect(await screen.findByText("recovered")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("posts the trimmed text as JSON with the auth token", async () => {
  localStorage.setItem("token", "abc");
  const requests: { body: unknown; auth: string | null; ct: string | null }[] = [];
  const db: { id: string; text: string; done: boolean }[] = [];   // the refetch after the mutation must see the new item
  server.use(
    http.get(url, () => HttpResponse.json(db)),
    http.post(url, async ({ request }) => {
      requests.push({ body: await request.json(), auth: request.headers.get("authorization"), ct: request.headers.get("content-type") });
      const created = { id: "s1", text: "buy milk", done: false };
      db.push(created);
      return HttpResponse.json(created, { status: 201 });
    }),
  );
  const { user } = renderApp(<TodoPage />);

  await user.type(await screen.findByLabelText("New todo"), "  buy milk  ");
  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(await screen.findByText("buy milk")).toBeInTheDocument();
  expect(requests).toEqual([{ body: { text: "buy milk" }, auth: "Bearer abc", ct: "application/json" }]);
});

import { deferred } from "../test/deferred";

test("optimistically shows the new todo while pending, then reconciles", async () => {
  const gate = deferred<void>();
  let db = [{ id: "1", text: "a", done: false }];
  server.use(
    http.get(url, () => HttpResponse.json(db)),
    http.post(url, async () => {
      await gate.promise;
      const created = { id: "srv-2", text: "b", done: false };
      db = [...db, created];
      return HttpResponse.json(created, { status: 201 });
    }),
  );
  const { user } = renderApp(<TodoPage />);
  await screen.findByText("a");

  await user.type(screen.getByLabelText("New todo"), "b");
  await user.click(screen.getByRole("button", { name: "Add" }));

  // Pending: optimistic row is visible immediately, marked busy; the form guards against duplicates
  const optimistic = await screen.findByText("b");
  expect(optimistic).toHaveAttribute("aria-busy", "true");
  expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();

  gate.resolve();

  // Settled: the server item replaces the temporary one; exactly one "b"
  await waitFor(() => expect(screen.getByText("b")).not.toHaveAttribute("aria-busy"));
  expect(screen.getAllByText("b")).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Add" })).toBeEnabled();
});

test("rolls back and announces the error when the server rejects", async () => {
  const gate = deferred<void>();
  server.use(
    http.get(url, () => HttpResponse.json([{ id: "1", text: "a", done: false }])),
    http.post(url, async () => { await gate.promise; return HttpResponse.json({ message: "boom" }, { status: 500 }); }),
  );
  const { user } = renderApp(<TodoPage />);
  await screen.findByText("a");

  await user.type(screen.getByLabelText("New todo"), "b");
  await user.click(screen.getByRole("button", { name: "Add" }));
  expect(await screen.findByText("b")).toBeInTheDocument();   // optimistic

  gate.resolve();

  expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't add todo/i);
  await waitFor(() => expect(screen.queryByText("b")).not.toBeInTheDocument());
  expect(screen.getByText("a")).toBeInTheDocument();          // untouched
});

test("shows a field error from the server and keeps focus usable", async () => {
  server.use(
    http.get(url, () => HttpResponse.json([])),
    http.post(url, () => HttpResponse.json({ errors: { text: "Already exists" } }, { status: 422 })),
  );
  const { user } = renderApp(<TodoPage />);

  const input = await screen.findByLabelText("New todo");
  await user.type(input, "dup");
  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(await screen.findByText("Already exists")).toBeInTheDocument();
  expect(input).toBeInvalid();
  expect(input).toHaveAccessibleDescription("Already exists");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();   // field error is not also a generic banner
});

test("sends exactly one POST for rapid double submits", async () => {
  const gate = deferred<void>();
  let posts = 0;
  server.use(
    http.get(url, () => HttpResponse.json([])),
    http.post(url, async () => { posts++; await gate.promise; return HttpResponse.json({ id: "s", text: "x", done: false }, { status: 201 }); }),
  );
  const { user } = renderApp(<TodoPage />);
  const input = await screen.findByLabelText("New todo");

  await user.type(input, "x{Enter}");           // submit #1 via keyboard
  await user.type(input, "x{Enter}");           // submit #2 while #1 is in flight
  gate.resolve();

  await screen.findByText("x");
  expect(posts).toBe(1);
});

test("shows cached todos immediately and refreshes in the background", async () => {
  const gate = deferred<void>();
  server.use(http.get(url, async () => { await gate.promise; return HttpResponse.json([{ id: "1", text: "fresh", done: false }]); }));

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity, staleTime: 0 } } });
  queryClient.setQueryData(["todos"], [{ id: "1", text: "stale", done: false }]);

  render(<QueryClientProvider client={queryClient}><TodoPage /></QueryClientProvider>);

  expect(screen.getByText("stale")).toBeInTheDocument();             // no loading state: data from cache
  expect(screen.queryByRole("status")).not.toBeInTheDocument();

  gate.resolve();
  expect(await screen.findByText("fresh")).toBeInTheDocument();
  expect(screen.queryByText("stale")).not.toBeInTheDocument();
});
