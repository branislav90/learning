# Review p9-e: Phase 9 lessons 09 (framework architecture) and 10 (routing and nested layouts)

Date 2026-10-22. Edited: `react-mastery/09-advanced-rendering-and-ecosystem/09-framework-architecture.md`, `10-routing-and-nested-layouts.md`. All ⚠ markers removed (36 in 09, 22 in 10); the version banners were replaced with dated version notes.
Version facts established (npm / docs, 2026-10-22): next 16.4.2 (canary 16.5); react-router 8.5.0 (v7 line 7.18.4); @tanstack/react-start 1.169.3 stable, @tanstack/react-router 1.170.x; remix 3.0.0 (new, non-React project; @remix-run/react stays 2.17.5); waku 1.0.0-rc.4; astro 7.4; vite 8.3; expo 58; React 19.3.1.

## Sources
Next docs raw markdown (vercel/next.js canary and tag v16.4.2, docs/01-app/...): proxy, page, layout, template, error, loading, default, dynamic-routes, intercepting-routes, parallel-routes, use-cache, revalidateTag, updateTag, use-search-params, not-found, link, cacheComponents, caching, upgrading v15 and v16, self-hosting, data-security, mutating-data. React Router docs (remix-run/react-router main/docs) plus installed react-router@8.5.0 CHANGELOG and package.json. TanStack docs (TanStack/router main/docs) and `npm pack @tanstack/start-client-core`. react.dev creating-a-react-app, cache, rsc/server-functions, taint API, CVE blog post. MDN browser-compat-data for Navigation API.
Executed: `/Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/p9-e/rr.test.tsx` (vitest, jsdom via setup-dom.ts, react-router@8.5.0 `createMemoryRouter` + `RouterProvider` from `react-router/dom`): 7 tests pass. Also node check of the URL parser for `/\evil.com`.

## Lesson 09

Confirmed (no change beyond removing marker): React docs recommend a framework (Next.js, React Router, Expo; Vite/Parcel/Rsbuild for from-scratch); Next App Router special files, `params` Promise, `notFound()`; RR framework mode `loader`, `Route.LoaderArgs`/`ComponentProps` with `loaderData`, `./+types/*`, `data()`, `.server` modules, `routes.ts`, un-awaited promise streaming with `Await` or `use`; TanStack Router/Start `createFileRoute`, `createServerFn`, isomorphic loaders (execution-model doc); Next self-hosting cache-handler concern (per-pod cache, `cacheHandler`, `refreshTags`); `revalidateTag`/Server Functions as public POST endpoints, encrypted non-deterministic action ids, closure encryption, allowed origins; React `cache` is per server request and Server Components only; taint APIs still Experimental-only; Server Functions react.dev link valid; `force-dynamic` should be removed under Cache Components (migration guide).

Corrected:
- Next.js section: added current facts (16.x, Turbopack default with `--webpack` opt-out, `middleware` renamed `proxy` Node-only, sync `params`/`cookies()` removed in 16, Cache Components/`use cache`/`cacheLife`/`cacheTag`, PPR becomes default under `cacheComponents`).
- Caching callout rewritten: 14 cached by default, 15 uncached, 16 opt-in Cache Components; `updateTag`, and `revalidateTag(tag, profile)` second argument (one-arg form deprecated).
- "Remix 3" resolved: `remix@3.0.0` is a separate toolkit with its own component runtime; React-based lineage continues as React Router. Added React Router 8 facts (React >=19.2.7, Node >=22.22, `react-router-dom` removed, middleware always on, `json`/`defer` not exported in 8.5.0).
- TanStack Start: now stable (1.169); RSC experimental. `.inputValidator()` was REMOVED in 1.169 and `.validator()` is current (the lesson's code was right, its note said otherwise); note rewritten.
- TanStack "Beta" label on react.dev noted as stale vs npm 1.169.
- Security advisories stated: CVE-2025-55182 (CVSS 10.0, affects 19.0, 19.1.0, 19.1.1, 19.2.0; fixed 19.0.1, 19.1.2, 19.2.1) and follow-ups.
- Type-safety row for Next updated (`PageProps<'/route'>` generated helpers); build tool row; upgrade churn row; react-query v4-style `useQuery(["orders"])` comment changed to v5 object form.

Hedged / unresolved:
- Progressive-enhancement cell for TanStack Start left explicitly "not verified".
- Router-cache staleness windows left generic (no figures checked).
- Astro/RedwoodSDK/Gatsby statements are orientation only; not deeply verified (RedwoodSDK and TanStack Start appear on react.dev "up-and-coming" list; Waku checked on npm only).
- Code snippets for Next/TanStack were not compiled (no type generation in sandbox); RR/TanStack API names were checked against docs and package typings (`validator` in `createServerFn.d.ts`).
- Platform-specific CDN behaviors (stale-while-revalidate at the CDN, `x-vercel-cache`) not verified.

## Lesson 10

Confirmed: layouts not re-rendered on navigation and cannot read `searchParams`/pathname (Next layout docs); template keyed per navigation; `error.js` does not wrap same-segment layout; `global-error`; `loading.js` as Suspense; `searchParams` makes page dynamic; `useSearchParams` needs Suspense when prerendered; intercepting `(.)` syntax and `@slot` not counted as a segment; `default.js` requirement; RR `NavLink` `aria-current="page"`, relative `NavLink to`, `index: true`, nested `Outlet`, layout state preserved (executed); static beats dynamic regardless of order, splat ranks last, `:id?` optional param (executed `matchRoutes`); params are strings (executed); streaming a promise from a loader and `Await` (executed); throwing `redirect` in a loader works, but inside `try/catch` it is swallowed (executed); `data(msg,{status:400})` reaches `ErrorBoundary` as route error response (executed); `href()` exists (`/users/:id` -> `/users/7`); `setSearchParams` functional form (docs, with the no-queueing caveat); TanStack `validateSearch`, `.catch()`, `loaderDeps`, `Route.useNavigate`, `_` pathless prefix, `index` token.

Corrected:
- Segment table: Next has no `[[id]]` optional param; optional exists only as catch-all `[[...slug]]`. Added TanStack `{-$id}`, `$`/`_splat`, RR `:id?`, `*`.
- `error.tsx` example now uses `retry` (stable since Next 16.3; `reset` still exists); `error` typed with digest note.
- RR example: `RouterProvider` imported from `react-router/dom` (docs; v8 changelog), `Route` type import added to guard example.
- `safeReturnTo` had an open-redirect hole: `/\evil.com` passes the old check but the URL parser treats it as `//evil.com` (Node check); added `includes("\\")`.
- Step 3 revalidation claim qualified (RR SSR framework mode revalidates active loaders on every navigation by default; data/SPA mode only on param/search-param change or submission).
- Navigation API support: now Chrome 102+, Firefox 147+, Safari 26.2+ (was "support varies").
- Added: Next 16 Cache Components keep prior routes in `<Activity>` hidden (state preserved) so "unmount" is the default model only; RR transitions default and `useTransitions` flag; Link prefetch differences (Next viewport/production-only vs RR `prefetch` values); Zod 3 vs 4 note for TanStack; `data`/`json` note in B4.
- Next routing doc link replaced with working `getting-started/layouts-and-pages`.

Unresolved / hedged:
- D1 chunk-load recovery: Next version-skew/deployment id confirmed in self-hosting docs; framework-specific chunk-error handlers not verified per framework.
- Soft vs hard navigation nuances and past intercepting-route bugs not tested; structure checked against docs only.
- Next/TanStack snippets not executed (only RR snippets were run).
