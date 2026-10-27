from patchlib import apply, D
import glob,re
f=glob.glob(D+'07*.md')[0]; t=open(f).read()
a=t.index('| 2 Parse |'); b=t.index('Every ⚠ in that table')
seg=t[a:b].replace(' ⚠','')
t=t[:a]+seg+t[b:]
t=t.replace('Every ⚠ in that table is a "verify against current docs" — the *shape*','Only the TanStack Query column was checked against 5.104 (retry defaults, `dehydrate`/`hydrate`, `useSuspenseQuery`, `invalidateQueries`); the RTK Query, Apollo/urql and framework columns are unverified summaries — the *shape*')
open(f,'w').write(t)
apply('07',[
("largely; 11–12, 14–17 partly or with add-ons ⚠ verify per library)","largely; 11–12, 14–17 partly or with add-ons; TanStack Query checked, SWR not)"),
("`Save-Data` awareness ⚠ verify availability of `navigator.connection`, which is not universally supported)","`Save-Data` awareness via `navigator.connection.saveData`, which MDN lists as Chrome-only)"),
("### 5.2 Practical: the data layer for one feature (TanStack Query v5 style ⚠ verify)","### 5.2 Practical: the data layer for one feature (TanStack Query v5, executed against 5.104)"),
("// ⚠ verify availability/name in your version","// exported by @tanstack/react-query 5.104"),
("- ⚠ `queryOptions`, `signal` in the query function context, `setQueryData`, `prefetchQuery`, and `invalidateQueries` are v5 APIs as commonly documented; verify names/signatures in the current docs.","- `queryOptions`, `signal` in the query function context, `setQueryData`, `prefetchQuery`, and `invalidateQueries` were all exercised against `@tanstack/query-core` 5.104."),
("Flag names ⚠ library-specific; verify. Notice","Flag names are library-specific (`isFetching` in TanStack Query v5). Notice"),
("12–13, 17; partial 11, 15, 16, 18 ⚠ |","12–13, 17; partial 11, 15, 16, 18 |"),
("Similar coverage inside Redux Toolkit ⚠ |","Similar coverage inside Redux Toolkit (not re-verified) |"),
("| Default stale/gc/refetch/retry behavior ⚠ verify |","| Default stale/gc/refetch/retry behavior |"),
])
