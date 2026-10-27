from patchlib import apply
apply('08',[
("(conceptually; verify in source)","(verified: `useBaseQuery` calls `React.useSyncExternalStore` in 5.104)"),
("(tracked property access — verify current behavior in docs)","(tracked property access; verified in 5.104: a component reading only `data` rendered twice in total across load and a forced refetch, i.e. the `isFetching` flips did not re-render it)"),
("(the v4 positional signatures `useQuery(key, fn, opts)` are removed — verify)","(the v4 positional signatures `useQuery(key, fn, opts)` are removed in v5)"),
("(the library's result is a discriminated union — verify exact narrowing in the docs)","(the library's result is a discriminated union)"),
("the default `TError` is `Error` in v5 (it was `unknown` in v4 — verify)","the default `TError` is `Error` in v5 (it was `unknown` in v4)"),
("(verify exact inference helpers in docs)","(`queryOptions` returns a tagged `queryKey`, so `getQueryData(options.queryKey)` is typed)"),
("makes the type honest (verify in docs)","makes the type honest"),
("`initialPageParam` is mandatory in v5 (verify).","`initialPageParam` is mandatory in v5 (it is a required property in the 5.104 typings)."),
("consider `maxPages` (verify) or","consider `maxPages` (exists in 5.104) or"),
("fewer mutation helpers (verify current features)","fewer mutation helpers (SWR was not checked in this review)"),
("(v5 errors on `undefined` data — verify)","(v5 errors on `undefined` data; verified: `status: 'error'` with message \"data is undefined\" and a console error naming the key)"),
("(verify event shape)","(verified in 5.104: events such as `added`, `updated` with `e.query.queryHash`)"),
("(verify plugin)","(`@tanstack/eslint-plugin-query`)"),
("(verify tracking detail)","(tracking verified in 5.104)"),
])
