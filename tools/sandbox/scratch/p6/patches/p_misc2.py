from patchlib import apply
apply('18',[
("validate format with a regex *and* check `NaN` (e.g. `2025-02-31` parses as NaN in `Date.parse` with `T00:00:00Z`; behavior for impossible dates varies by engine, so verify — a stricter calendar check may be needed);","validate format with a regex *and* check the date is real: a `NaN` check alone is **not** enough. Run in Node 24 (V8): `new Date('2025-02-31T00:00:00Z')` is *not* NaN, it rolls over to 3 March, and only out-of-range fields such as month 13 give `NaN`. Use a round-trip check, e.g. `const d = new Date(s + 'T00:00:00Z'); ok = !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s` (verified: it rejects `2025-02-31` and `2025-04-31`, and accepts `2024-02-29`);"),
])
apply('14',[
("(e.g. a maintained library such as `serialize-javascript`; verify)","(e.g. a maintained library such as `serialize-javascript`; its `isJSON` option was run against 7.1.2)"),
("(request-scoped memoisation in RSC environments; verify availability)","(request-scoped memoisation in Server Components; react.dev says `cache` is for Server Components only)"),
("(configurable via `shouldDehydrateQuery`; verify)","(configurable via `shouldDehydrateQuery`; verified in 5.104)"),
("is simply absent from the dehydrated state (verify), and","is simply absent from the dehydrated state (verified in 5.104), and"),
])
apply('16',[
("then `resumePausedMutations()` after restore (verify current API).","then `resumePausedMutations()` after restore (both `setMutationDefaults` and `resumePausedMutations` exist on `QueryClient` in 5.104; `resumePausedMutations` was called in our run)."),
("(verify option placement)","(`networkMode` is an option on `useMutation`/mutation defaults)"),
("own documentation uses this exact example for `useSyncExternalStore`; verify wording at the reference page.","own documentation uses this exact example for `useSyncExternalStore` (the react.dev reference mentions `navigator.onLine` and the `online`/`offline` events)."),
])
apply('15',[
("e.g. Web Locks API; verify support)","e.g. Web Locks API; MDN compat: Chrome 69, Firefox 96, Safari 15.4)"),
])
