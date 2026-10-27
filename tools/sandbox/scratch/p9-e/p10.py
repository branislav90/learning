import sys
p='/Users/todorbra/Projects/ReactLearning/react-mastery/09-advanced-rendering-and-ecosystem/10-routing-and-nested-layouts.md'
s=open(p).read()
n=0
def r(a,b):
    global s,n
    c=s.count(a)
    if c!=1:
        print("FAIL",c,a[:80]); sys.exit(1)
    s=s.replace(a,b); n+=1

r("> ⚠ **Verify against current docs.** Route file names, conventions, hooks and config shown for Next.js, React Router and TanStack Router are *examples of a stable idea* (the route tree). Their exact APIs change; confirm them in each project's documentation.",
"> **Version note (reviewed 2026-10-22).** Route file names, conventions, hooks and config shown for Next.js, React Router and TanStack Router are *examples of a stable idea* (the route tree). They were checked against **Next.js 16.4**, **React Router 8.5** (v7 APIs shown here are unchanged in v8) and **TanStack Router 1.x / Start 1.169**. Exact APIs still change between majors; confirm them in each project's documentation.")

r("⚠ Verify the framework's semantics: for example, in Next App Router layouts do **not** re-render on navigation between their child pages, which is why layout-level auth checks are not sufficient ([12](./12-auth-boundaries.md)).",
"Framework semantics differ. In the Next App Router, layouts do **not** re-render on navigation between their child pages (the layout docs say so explicitly), which is why layout-level auth checks are not sufficient ([12](./12-auth-boundaries.md)); and `template.js` gets a unique key per navigation, so child Client Components reset state, effects re-sync and Suspense fallbacks inside it show on every navigation (inside a layout they show only on first load).")

r("| Optional param | `[[id]]` / `:id?` | Zero or one | Syntax varies ⚠ |","| Optional param | `{-$id}` (TanStack) / `:id?` (React Router) | Zero or one | Next has no single optional param; it only has the optional *catch-all* `[[...slug]]` |")
r("| Catch-all / splat | `[...slug]` / `*` | Remaining path | Order and priority rules differ ⚠ |","| Catch-all / splat | `[...slug]` (Next, `params.slug` is a `string[]`) / `*` (React Router) / `$` (TanStack, value under `_splat`) | Remaining path | Splats rank below static and dynamic segments; verified in React Router with `matchRoutes` |")
r("| Parallel slot | `@modal` (Next) | N/A: renders simultaneously as a named slot | Independent navigation state per slot ⚠ |","| Parallel slot | `@modal` (Next) | N/A: renders simultaneously as a named slot | Independent navigation state per slot; slot folders are not URL segments; needs `default.js` for unmatched slots after a hard navigation |")
r("| Intercepting | `(.)photo/[id]` (Next) | Intercepts a navigation to render in a different context | Modal-over-list with shareable deep link ⚠ |","| Intercepting | `(.)photo/[id]` (Next; also `(..)`, `(..)(..)`, `(...)`) | Intercepts a navigation to render in a different context | Modal-over-list with shareable deep link; the markers count route segments, not folders |")

r("which won't update when only the query changes in some frameworks ⚠ (Next layouts do not receive updated `searchParams` on navigation between pages in the same layout; use the page or a client hook; verify).",
"which won't update when only the query changes in some frameworks. In Next, layouts do not re-render on navigation and do not receive `searchParams` at all (verified in the layout docs): read the page's `searchParams` prop, or use `useSearchParams` in a Client Component. Reading `searchParams` or `params` is request-time access, so wrap such Client Components in `<Suspense>` when the route is prerendered.")

r("⚠ Behavior is framework-specific and has changed over versions: verify whether your router shows old UI, a fallback, or both, and how `loading` files interact with transitions.",
"Behavior is framework-specific and has changed over versions. React Router (v7 and v8) wraps router state updates in `React.startTransition` by default, and offers a `useTransitions` prop to opt out (or, in React 19, to opt in to the `useOptimistic`-based variant that v8 plans to make the default). A Next `loading.js` is an automatic Suspense boundary for the segment. Check whether your router shows old UI, a fallback, or both.")

r("⚠ Conflicts such as `/users/new` vs `/users/:id` are resolved by static-beats-dynamic in mainstream routers; verify yours.",
"Conflicts such as `/users/new` vs `/users/:id` are resolved by static-beats-dynamic in mainstream routers (executed against `react-router@8.5.0` `matchRoutes`: `/users/new` matched the static route even though the dynamic route was listed first).")

r("cached payloads make this instant. ⚠ A client router cache's staleness window and what it caches differ by framework and version.",
"cached payloads make this instant. A client router cache's staleness window and what it caches differ by framework and version. Note that Next 16 with `cacheComponents: true` also uses React's `<Activity>` so that recently visited routes are kept `\"hidden\"` (state preserved, effects cleaned up, DOM retained) instead of unmounted, so \"unmount\" below describes the default model.")
# 3.3 prefetch note
r("Interactions with `popstate`","Prefetch triggers differ: Next's `<Link>` prefetches when it enters the viewport and only in production; React Router's `<Link prefetch=\"intent\" | \"viewport\" | \"render\" | \"none\">` is opt-in per link.\n\nInteractions with `popstate`")

r("They are implemented as thrown values caught by the framework and are *not* errors in the application sense. ⚠ Wrapping them in `try/catch` swallows them — a classic bug.",
"They are implemented as thrown values caught by the framework and are *not* errors in the application sense (Next's `notFound()` throws a `NEXT_HTTP_ERROR_FALLBACK;404` error). Wrapping them in `try/catch` swallows them, a classic bug (reproduced for React Router's `redirect` in the sandbox: the `catch` block received it, and the redirect never happened). Also call `notFound()` in the render path, not inside an un-awaited promise.")
r("(Next: `error.tsx` doesn't catch errors in the layout of the same segment; verify).","(Next: `error.js` wraps `loading.js`, `not-found.js`, `page.js` and *nested* layouts, but not the `layout.js`/`template.js` above it in the same segment; use `global-error.js`, which must render its own `<html>` and `<body>`, for the root layout).")
r("otherwise it revalidates. ⚠ policy differs.","otherwise it revalidates. The policy differs per framework.")

# step 3 revalidation nuance
r("(unless revalidation is triggered by a mutation or a matching option)","(unless revalidation is triggered by a mutation, a search-param change or a `shouldRevalidate` option; in React Router SSR framework mode the default is the opposite: active loaders are revalidated on every navigation unless `shouldRevalidate` opts out)") 

r("// routes.tsx   (⚠ React Router APIs: verify current imports and data-router setup)\nimport { createBrowserRouter, RouterProvider, Outlet, NavLink } from \"react-router\";",
"// routes.tsx   (React Router data mode, v7/v8)\nimport { createBrowserRouter, Outlet, NavLink } from \"react-router\";\nimport { RouterProvider } from \"react-router/dom\"; // the DOM entry wires up react-dom's flushSync")
r("- `NavLink` adds `aria-current=\"page\"` to the active link (verify in your version), which helps assistive tech","- `NavLink` adds `aria-current=\"page\"` to the active link (documented, and confirmed by rendering `createMemoryRouter` with `NavLink` in jsdom), which helps assistive tech")
r("The layout element sits at the same position with the same type, so its state is preserved.","The layout element sits at the same position with the same type, so its state is preserved (executed in the sandbox with `createMemoryRouter`: clicking the counter, then the Billing link, left the count at 1 and the layout's mount effect ran once).")

r("type SearchParams = Promise<{ sort?: string; page?: string }>; // ⚠ Promise in recent Next versions","type SearchParams = Promise<{ sort?: string; page?: string }>; // a Promise since Next 15; sync access removed in 16")
r("`digest` correlates with server logs ⚠ verify.","`digest` correlates with server logs (documented). In Next 16.3+ the props are `error` and `retry` (`retry()` re-fetches and re-renders the segment; `reset()` still exists and only clears the error state).")
r("export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {","export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {")
r("<button onClick={reset}>Try again</button>","<button onClick={retry}>Try again</button>")
r("- `searchParams` in `page.tsx` makes the page dynamic ⚠ (reading request-time data opts out of static rendering; verify current rules).","- `searchParams` in `page.tsx` makes the page dynamic: it is a request-time API, so it opts the page into dynamic rendering at request time (verified in the `page.js` docs). With Cache Components enabled, where in the tree you read it decides how much of the page can still be prerendered into the static shell.")

r("// src/routes/products.index.tsx   (⚠ verify current API)","// src/routes/products.index.tsx   (TanStack Router 1.x; Zod 4 schemas are accepted directly by validateSearch)")
r("Why it is valuable: search params are","With Zod 3 you wrap the schema in `zodValidator` from `@tanstack/zod-adapter` and use its `fallback()` helper instead of `.catch()` to keep type inference. Why it is valuable: search params are")
r("// React Router loader-style guard (⚠ verify API)","// React Router loader-style guard (v7/v8; `redirect` may be thrown or returned)\nimport type { Route } from \"./+types/dashboard\";")
r("also consider backslash tricks and verify with a URL parse against your origin)","also consider backslash tricks such as `/\\\\evil.com`, which browsers normalize to `//evil.com`; verify with a URL parse against your origin)")

r("⚠ This is Next-specific, subtle (soft vs hard navigation, `default.tsx` requirements, closing behavior), and has had version-specific bugs.","The structure above matches the Next docs: slot folders (`@modal`) are not route segments, so `(.)photos` matches the same segment level, and a `default.js` is required for unmatched slots after a hard navigation (otherwise Next returns an error; a `default.js` that calls `notFound()` restores the old 404 behavior). This is Next-specific and subtle (soft vs hard navigation, closing behavior).")
r("Verify current docs (\"Intercepting Routes\", \"Parallel Routes\") before adopting.","Read the current \"Intercepting Routes\" and \"Parallel Routes\" docs before adopting.")

r("Older/simple routers using first-match-wins would depend on order; verify your router's rules.","Older/simple routers using first-match-wins would depend on order. This was executed against React Router 8.5 `matchRoutes` with the dynamic route listed first, and the static route still won.")
r("(⚠ `data`/`redirect` naming and whether to throw or return varies by version.)","(`data()` and `redirect()` are the current names in React Router 7/8: `data(body, { status })` replaced `json()`, which `react-router@8.5.0` no longer exports, and `redirect` may be thrown or returned. Import `data` and `redirect` from `react-router`.)")
r("(framework offers handling, e.g. listening for chunk-load errors; ⚠ verify)","(frameworks offer handling, e.g. listening for chunk-load errors; Next documents version skew and a deployment id for self-hosting; React Router's `/__manifest` route discovery can also surface it)")
r("| Next.js docs — Routing | <https://nextjs.org/docs/app/building-your-application/routing> *(unverified path; docs reorganize)* |","| Next.js docs — Layouts and Pages | <https://nextjs.org/docs/app/getting-started/layouts-and-pages> (HTTP 200 on 2026-10-22; the old `building-your-application/routing` path redirects here) |")
r("Emerging standard for SPA navigation ⚠ support varies","SPA navigation standard; per MDN browser-compat-data it is now in Chrome 102+, Firefox 147+ and Safari 26.2+")
r("Links not fetched in this session: use each site's search if a path moved.","Links checked on 2026-10-22; use each site's search if a path moves.")
open(p,'w').write(s)
print("applied",n)
