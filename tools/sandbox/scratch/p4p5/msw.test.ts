import { http as mswHttp, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, expect, it } from "vitest";
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
it("wildcard + 404", async () => {
  server.use(mswHttp.get("*/orders/o_1", () => HttpResponse.json({ ok: 1 })), mswHttp.get("*/orders/missing", () => new HttpResponse(null, { status: 404 })));
  const r = await fetch("https://api.example.com/v1/orders/o_1"); expect(await r.json()).toEqual({ ok: 1 });
  expect((await fetch("https://api.example.com/orders/missing")).status).toBe(404);
});
