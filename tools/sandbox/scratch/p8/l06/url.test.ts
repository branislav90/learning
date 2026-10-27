import { test } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
test("urls", async () => {
  const server = setupServer(
    http.post("http://localhost/api/a", () => HttpResponse.json({ h: "no-port" })),
    http.post("*/api/b", () => HttpResponse.json({ h: "wildcard" })),
    http.post("/api/c", () => HttpResponse.json({ h: "relative" })),
  );
  server.listen({ onUnhandledRequest: "error" });
  console.log("RESULT location:", location.href);
  for (const p of ["/api/a", "/api/b", "/api/c"]) {
    try { const r = await fetch(p, { method: "POST" }); console.log("RESULT", p, JSON.stringify(await r.json())); } catch (e: any) { console.log("RESULT", p, "ERR", e.message.slice(0, 60)); }
  }
  server.close();
});
