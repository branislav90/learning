import { http, HttpResponse, delay, graphql, ws, passthrough, bypass, sse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, expect, test, vi } from "vitest";
const API = "http://localhost:3000";
interface Todo { id: string; text: string; done: boolean }
let db: Todo[] = []; let nextId = 1;
const handlers = [
  http.get(`${API}/api/todos`, ({ request }) => { const q = new URL(request.url).searchParams.get("done"); return HttpResponse.json(q === null ? db : db.filter(t => String(t.done) === q)); }),
  http.post<never, { text: string }, Todo | { message: string }>(`${API}/api/todos`, async ({ request }) => {
    const body = await request.json(); if (!body.text?.trim()) return HttpResponse.json({ message: "text is required" }, { status: 422 });
    const todo: Todo = { id: `t${nextId++}`, text: body.text.trim(), done: false }; db.push(todo); return HttpResponse.json(todo, { status: 201 }); }),
  http.patch<{ id: string }, Partial<Pick<Todo, "text" | "done">>>(`${API}/api/todos/:id`, async ({ params, request }) => { const todo = db.find(t => t.id === params.id); if (!todo) return HttpResponse.json({ message: "Not found" }, { status: 404 }); Object.assign(todo, await request.json()); return HttpResponse.json(todo); }),
  graphql.query("GetUser", ({ variables }) => HttpResponse.json({ data: { user: { id: variables.id, name: "Ada" } } })),
];
const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: "error" })); afterEach(() => server.resetHandlers()); afterAll(() => server.close());
test("once fallthrough", async () => {
  server.use(http.get(`${API}/api/todos`, () => new HttpResponse(null, { status: 503 }), { once: true }));
  expect((await fetch(`${API}/api/todos`)).status).toBe(503);
  expect((await fetch(`${API}/api/todos`)).status).toBe(200);
});
test("network error", async () => { server.use(http.get(`${API}/api/todos`, () => HttpResponse.error())); await expect(fetch(`${API}/api/todos`)).rejects.toThrow(TypeError); });
test("malformed json", async () => { server.use(http.get(`${API}/api/todos`, () => new HttpResponse("<html>oops</html>", { headers: { "Content-Type": "application/json" } }))); const r = await fetch(`${API}/api/todos`); await expect(r.json()).rejects.toThrow(); });
test("delay infinite stays pending", async () => {
  server.use(http.get(`${API}/api/todos`, async () => { await delay("infinite"); }));
  const ac = new AbortController();
  const p = Promise.race([fetch(`${API}/api/todos`).then(() => "done"), new Promise(r => setTimeout(r, 300, "pending"))]);
  expect(await p).toBe("pending");
});
test("unmatched rejects", async () => { const spy = vi.spyOn(console, "error").mockImplementation(() => {}); await expect(fetch("https://api.test/other")).rejects.toThrow(); spy.mockRestore(); });
test("post 422", async () => { const r = await fetch(`${API}/api/todos`, { method: "POST", body: JSON.stringify({ text: "  " }) }); expect(r.status).toBe(422); console.log("RESULT 422", await r.json()); });
test("gql", async () => { const r = await fetch(`${API}/graphql`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: "query GetUser($id:ID!){user(id:$id){id name}}", variables: { id: "7" } }) }); console.log("RESULT gql", JSON.stringify(await r.json())); });
test("ws api exists", () => { const feed = ws.link("wss://api.example.test/prices"); console.log("RESULT ws.link keys", Object.keys(feed), typeof feed.addEventListener); });
test("graphql.link", () => { console.log("RESULT graphql.link", typeof graphql.link); });
test("passthrough/bypass/sse", () => { console.log("RESULT", typeof passthrough, typeof bypass, typeof sse); });
