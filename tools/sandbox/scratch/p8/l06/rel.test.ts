// @vitest-environment node
import { test } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
test("relative fetch w/o msw in jsdom", async () => {
  try { await fetch("/api/x"); console.log("RESULT no msw: ok?"); } catch (e: any) { console.log("RESULT no msw:", e.constructor.name, e.message.slice(0, 60), "|", e.cause?.message); }
});
test("relative with msw", async () => {
  const server = setupServer(http.get("/api/rel", () => HttpResponse.json({ rel: true })));
  server.listen({ onUnhandledRequest: "error" });
  try { console.log("RESULT msw+relative:", JSON.stringify(await (await fetch("/api/rel")).json())); } catch (e: any) { console.log("RESULT msw+relative err:", e.message.slice(0, 80)); }
  try { await fetch("/api/other"); } catch (e: any) { console.log("RESULT msw unmatched relative:", e.message.slice(0, 120)); }
  server.close();
});
