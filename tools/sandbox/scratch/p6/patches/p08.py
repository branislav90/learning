from patchlib import apply
apply('08',[
("> ⚠ **Verify against current docs.** This lesson targets **TanStack Query v5** (`@tanstack/react-query`). Option names, defaults, and experimental APIs change between majors and minors. Every API detail below is marked \"verify\" where it is easy to misremember; the authority is <https://tanstack.com/query/latest>.",
 "> **Checked against `@tanstack/react-query` 5.104 (executed and read from the shipped typings, 2026-10-22).** This lesson targets **TanStack Query v5**. Option names, defaults, and experimental APIs can still change between minors (for example, in 5.104 mutation callbacks gained a trailing `context` argument and `onMutate`'s return value is passed as `onMutateResult`); the authority is <https://tanstack.com/query/latest>."),
("(default `0` — verify)","(default `0`; confirmed in 5.104, and `'static'` is also accepted to mean \"never stale\")"),
("(default 5 minutes — verify; named `cacheTime` before v5)","(default 5 minutes in the browser, `Infinity` on the server; confirmed in 5.104; named `cacheTime` before v5)"),
("(default 3 times with exponential backoff on the client — verify; the default on the server is 0 in SSR contexts per the docs)","(default 3 times on the client with delay `min(1000 * 2^failureCount, 30000)` ms, i.e. 1 s, 2 s, 4 s; the default is 0 retries when the library detects a server environment; both confirmed in the 5.104 source, and a run with scaled delays made 4 attempts in total)"),
("(removed in v5 — verify)","(removed in v5; `onSuccess`/`onError`/`onSettled` exist only on mutations in the 5.104 typings)"),
("⚠ With `skipToken` the `enabled` is unnecessary (verify).","With `skipToken` as the `queryFn` the `enabled` option is unnecessary (confirmed: the observer stayed `pending`/`idle`; note `refetch()` is then not usable)."),
])
