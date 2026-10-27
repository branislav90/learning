// src/api/client.test.ts
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, test } from "vitest";
import { server } from "../test/server";
import { API_URL, ApiError, NetworkError, ValidationError, apiFetch } from "./client";



beforeEach(() => localStorage.clear());

describe("apiFetch", () => {
  test("sends Accept and Authorization headers when a token exists", async () => {
    localStorage.setItem("token", "t0k");
    let seen: Headers | undefined;
    server.use(http.get(`${API_URL}/api/me`, ({ request }) => { seen = request.headers; return HttpResponse.json({ id: 1 }); }));

    await apiFetch("/api/me");

    expect(seen?.get("authorization")).toBe("Bearer t0k");
    expect(seen?.get("accept")).toBe("application/json");
  });

  test("sets Content-Type only when there is a body", async () => {
    let ct: string | null = "unset";
    server.use(http.get(`${API_URL}/api/x`, ({ request }) => { ct = request.headers.get("content-type"); return HttpResponse.json({}); }));
    await apiFetch("/api/x");
    expect(ct).toBeNull();
  });

  test("maps 4xx/5xx to ApiError with status and server message", async () => {
    server.use(http.get(`${API_URL}/api/x`, () => HttpResponse.json({ message: "Nope" }, { status: 403 })));
    await expect(apiFetch("/api/x")).rejects.toMatchObject({ name: "ApiError", status: 403, message: "Nope" });
  });

  test("maps 422 with errors to ValidationError", async () => {
    server.use(http.post(`${API_URL}/api/x`, () => HttpResponse.json({ errors: { text: "Required" } }, { status: 422 })));
    const err = await apiFetch("/api/x", { method: "POST", body: "{}" }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).fieldErrors).toEqual({ text: "Required" });
  });

  test("maps connection failures to NetworkError (not ApiError)", async () => {
    server.use(http.get(`${API_URL}/api/x`, () => HttpResponse.error()));
    await expect(apiFetch("/api/x")).rejects.toBeInstanceOf(NetworkError);
  });

  test("treats a 200 with a non-JSON body as malformed", async () => {
    server.use(http.get(`${API_URL}/api/x`, () => new HttpResponse("<html/>", { headers: { "Content-Type": "text/html" } })));
    await expect(apiFetch("/api/x")).rejects.toBeInstanceOf(ApiError);
  });

  test("runs the parse function and surfaces its error", async () => {
    server.use(http.get(`${API_URL}/api/x`, () => HttpResponse.json({ wrong: true })));
    const parse = (d: unknown) => { if (!d || typeof d !== "object" || !("id" in d)) throw new Error("bad shape"); return d as { id: number }; };
    await expect(apiFetch("/api/x", { parse })).rejects.toThrow("bad shape");
  });

  test("propagates AbortError unchanged", async () => {
    server.use(http.get(`${API_URL}/api/slow`, async () => { await new Promise(() => {}); }));
    const ctrl = new AbortController();
    const p = apiFetch("/api/slow", { signal: ctrl.signal });
    ctrl.abort();
    await expect(p).rejects.toMatchObject({ name: "AbortError" });
  });
});
