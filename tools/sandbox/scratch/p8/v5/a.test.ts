import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, test, expect } from "vitest";
const server = setupServer(http.get("http://localhost/x", async () => { await delay(50); return HttpResponse.text("x"); }));
beforeAll(() => server.listen({ onUnhandledRequest: "error" })); afterAll(() => server.close());
test("jsdom signal", async () => {
  const r = await fetch("http://localhost/x", { signal: new AbortController().signal });
  console.log("RESULT v5 jsdom signal ok", await r.text());
  const ac = new AbortController(); const p = fetch("http://localhost/x", { signal: ac.signal }); setTimeout(() => ac.abort(), 10);
  try { await p; } catch (e: any) { console.log("RESULT v5 abort:", e.name, e.message.slice(0, 60)); }
});
test("unawaited resolves fails in v5", () => { expect(Promise.resolve(1)).resolves.toBe(1); });
test("fake timers", () => { });
