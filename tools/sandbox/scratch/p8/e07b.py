from ed import apply
E=[
("⚠ Whether the library cancels in-flight requests","Whether the library cancels in-flight requests"),
("""  const requests: { body: unknown; auth: string | null; ct: string | null }[] = [];
  server.use(
    http.get(url, () => HttpResponse.json([])),
    http.post(url, async ({ request }) => {
      requests.push({ body: await request.json(), auth: request.headers.get("authorization"), ct: request.headers.get("content-type") });
      return HttpResponse.json({ id: "s1", text: "buy milk", done: false }, { status: 201 });
    }),
  );""","""  const requests: { body: unknown; auth: string | null; ct: string | null }[] = [];
  const db: { id: string; text: string; done: boolean }[] = [];   // the refetch after the mutation must see the new item
  server.use(
    http.get(url, () => HttpResponse.json(db)),
    http.post(url, async ({ request }) => {
      requests.push({ body: await request.json(), auth: request.headers.get("authorization"), ct: request.headers.get("content-type") });
      const created = { id: "s1", text: "buy milk", done: false };
      db.push(created);
      return HttpResponse.json(created, { status: 201 });
    }),
  );"""),
("We assert the contract-critical bits (payload shape, header) and exactly one request (the array has one element). We do not assert on `onMutate`/`setQueryData`.",
 "We assert the contract-critical bits (payload shape, header) and exactly one request (the array has one element). We do not assert on `onMutate`/`setQueryData`. The GET handler is stateful on purpose: the component invalidates the query in `onSettled`, so a GET that always returned `[]` would make the new row vanish after the refetch (the first version of this example failed for exactly that reason when run)."),
]
apply("07-testing-api-interactions.md",E)
# lesson 06 adjust AbortSignal remark
E6=[("*Reproduced on Vitest 3.2.7 + jsdom 30 + Node 24 + MSW 2.15.0:* `fetch(url, { signal: new AbortController().signal })` throws `TypeError: RequestInit: Expected signal (\"AbortSignal {}\") to be an instance of AbortSignal`. `happy-dom` showed the **same** error in the same setup, so it is not a remedy. Verified remedy: run tests that exercise cancellable `fetch` in the Node environment with a per-file docblock `// @vitest-environment node` (there, `AbortController` aborts cleanly with `AbortError`). For jsdom component tests, inject the fetching function or avoid passing a signal in those tests; re-check upstream (Vitest/jsdom/undici issue trackers) before inventing a global override. This is environment plumbing; keep any workaround in one clearly commented place.",
 "*Reproduced on **Vitest 3.2.7** + jsdom 30 + Node 24 + MSW 2.15.0:* `fetch(url, { signal: new AbortController().signal })` throws `TypeError: RequestInit: Expected signal (\"AbortSignal {}\") to be an instance of AbortSignal`, because Vitest 3's jsdom environment swaps in jsdom's `AbortController`/`AbortSignal`. This also breaks TanStack Query, whose `queryFn` context passes such a signal to your `fetch`. **Not reproduced on Vitest 4.1.12 or 5.0.5** (same jsdom 30, same MSW): there the signal is accepted and aborting rejects with `AbortError`. Remedies, in order: upgrade to Vitest >= 4; on Vitest 3 run tests that exercise cancellable `fetch` in the Node environment with a per-file docblock `// @vitest-environment node` (verified: aborts cleanly with `AbortError`); for jsdom component tests on Vitest 3, avoid passing the signal to `fetch` in the tested code path. `happy-dom` showed the **same** error on Vitest 3 in the same setup, so it is not a remedy. Keep any workaround in one clearly commented place."),
 ]
apply("06-mocking-strategies-and-msw.md",E6)
