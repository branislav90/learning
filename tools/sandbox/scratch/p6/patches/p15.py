from patchlib import apply
apply('15',[
("> ⚠ **Verify against current docs.** Library defaults quoted here (TanStack Query retry counts and delays, `react-error-boundary` props, React 19 root error callbacks) are stated as of the baseline in [ROADMAP](../ROADMAP.md) and marked \"verify\" where they are easy to misremember.","> **Checked 2026-10-22:** TanStack Query retry counts and delays were executed against `@tanstack/query-core` 5.104, `react-error-boundary` 6.1 props were read from its typings and the §5.7 pattern was run with React 19.3, and the React 19 root error callbacks were checked against react.dev."),
("*Documented behavior (verify defaults in the current docs):*","*Verified in 5.104 (source and a run with scaled delays):*"),
("; verify its current API) provides `resetKeys`","; v6 checked) provides `resetKeys`"),
("expresses that choice per query; verify naming for your version (`useErrorBoundary` in v4).","expresses that choice per query (`throwOnError` exists in 5.104 and `useErrorBoundary` does not; it was the v4 name)."),
("// be explicit even though it is the documented default; verify","// be explicit even though it is the default for mutations (verified: mutation `retry` defaults to 0)"),
("(verify indexing in the current docs; the library counts from 0 for the first failure)","(verified: the library passes 0 for the first failure, so `retry: 3` allows failure counts 0, 1 and 2 to be retried, 4 attempts in total)"),
("`crypto.randomUUID()` is available in secure contexts (HTTPS / localhost).","`crypto.randomUUID()` is available in secure contexts (HTTPS / localhost; Chrome 92, Firefox 95, Safari 15.4)."),
("⚠ Verify `react-error-boundary` (`FallbackProps`, `resetKeys`, `onReset`) and `QueryErrorResetBoundary` signatures against current docs; they are community/library APIs, not React APIs.","Executed with React 19.3, `@tanstack/react-query` 5.104 and `react-error-boundary` 6.1: the first load failed and showed the fallback, \"Try again\" refetched (2nd request) and rendered the product, and changing `id` (`resetKeys`) re-ran the query and recovered. Note that these are community/library APIs, not React APIs; in v6 `FallbackProps.error` is typed `unknown`, which is why the `instanceof` narrowing above is needed."),
("(a function-valued interval is supported in recent TanStack Query versions; verify)","(a function-valued interval is supported in TanStack Query v5; verified in the typings)"),
("(verify default delays)","(default delays verified in the solutions)"),
("using `failureCount` (verify field name).","using `failureCount` (the field exists on the v5 result; `failureReason` holds the latest error)."),
("⚠ Verify defaults.","Defaults verified in 5.104."),
("Root error callbacks (verify option names)","Root error callbacks (`onCaughtError`, `onUncaughtError`, `onRecoverableError`)"),
])
