import sys
p='/Users/todorbra/Projects/ReactLearning/react-mastery/09-advanced-rendering-and-ecosystem/09-framework-architecture.md'
s=open(p).read()
n=0
def r(old,new):
    global s,n
    c=s.count(old)
    if c!=1:
        print("FAIL",c,old[:70]); sys.exit(1)
    s=s.replace(old,new); n+=1

r("> ⚠ **Verify against current docs.** This lesson separates *stable concepts* (what any React framework must solve) from *framework APIs* (file names, function names, config keys, defaults). Framework APIs change between majors, sometimes between minors. Every framework-specific identifier below is a **teaching example**; confirm it in the framework's current documentation before using it in production. Where I am unsure of a detail, the text says so.",
"> **Version note (reviewed 2026-10-22).** This lesson separates *stable concepts* (what any React framework must solve) from *framework APIs* (file names, function names, config keys, defaults). Framework APIs change between majors, sometimes between minors, so the identifiers below were checked against the docs current on 2026-10-22: **React 19.3**, **Next.js 16.4** (App Router), **React Router 8.5** (v7 lineage; v8 needs React 19.2.7+ and Node 22.22+), **TanStack Start 1.169+** (first stable release) on TanStack Router 1.x. Re-check them before you depend on them; where a detail could not be verified, the text says so.")

r("documents that bundler/framework integration is required. ⚠ The integration surface is explicitly not meant for app developers. |",
"documents that bundler/framework integration is required. The bundler/framework integration surface is aimed at framework and bundler authors, not app developers. |")

r("""> **Public guarantee (react.dev).** The React team documents that React Server Components need a bundler/framework to be used in a real app, and recommends starting new apps with a framework. *Verify the current wording at* <https://react.dev/learn/creating-a-react-app> — the "full-stack framework" recommendation and its list of frameworks has been revised over time.""",
"""> **Public guarantee (react.dev).** Verified against <https://react.dev/learn/creating-a-react-app> on 2026-10-22: "If you want to build a new app or website with React, we recommend starting with a framework." The page lists three recommended full-stack frameworks: **Next.js (App Router)**, **React Router (v7)** and **Expo** (native apps). It also lists "up-and-coming" frameworks working towards the full-stack React vision (TanStack Start, labelled "Beta" on that page even though 1.169 is the first stable release, and RedwoodSDK). For building from scratch it points to Vite, Parcel or Rsbuild. Create React App was deprecated in February 2025 and is no longer a starting point. The list is revised from time to time, so re-read it.""")

r("*(Teaching model; positions as of this writing. Frameworks evolve — verify.)*","*(Teaching model; positions as of 2026-10-22. Frameworks evolve.)*")

r("""It historically bundled an aggressive multi-layer caching system; the defaults have changed across 14 → 15 → later versions ⚠ and a newer opt-in caching model has been introduced. Treat caching defaults as the most version-sensitive part of Next.""",
"""The latest major is **Next.js 16** (16.4.x on npm). Next 16 made Turbopack the default bundler for `next dev` and `next build` (`--webpack` opts out), renamed the `middleware` file convention to `proxy` (`proxy.ts`, Node.js runtime only; `middleware` is deprecated), and removed the synchronous compatibility for `params`, `searchParams`, `cookies()`, `headers()` and `draftMode()` that Next 15 had kept. Caching changed twice: Next 14 cached `fetch` and `GET` route handlers by default, Next 15 stopped doing so, and Next 16 introduced **Cache Components** (`cacheComponents: true`, the `use cache` directive, `cacheLife`, `cacheTag`) as the opt-in model, which also makes Partial Prerendering the default rendering behaviour. Apps created with the current `create-next-app` have it enabled. Treat caching defaults as the most version-sensitive part of Next.""")

r("""The team has also communicated a future "Remix 3" with a different direction from React-based Remix v2 ⚠ — *verify the current status; do not assume Remix v2 and "Remix 3" are the same thing.* RSC support in React Router has been in progress/experimental ⚠ verify.""",
"""The current major is **React Router 8** (8.5.0 on npm; v7 is still maintained). v8 requires React 19.2.7+ and Node 22.22+, ships ESM only, removes the `react-router-dom` package (import `RouterProvider`/`HydratedRouter` from `react-router/dom`, everything else from `react-router`) and makes middleware always on. **"Remix 3" is a different project, not a successor to Remix v2**: `remix@3.0.0` is published on npm as a web-standards toolkit with its own component runtime (not React). The React-based Remix v2 lineage continues as React Router. RSC support in React Router (framework and data modes) is documented but flagged **unstable/experimental** and may break in minor releases.""")

r("""its maturity (release candidate vs stable, RSC integration) is a moving target ⚠ verify.""",
"""**TanStack Start reached its first stable release in 1.169** (`@tanstack/react-start` 1.169.3 is `latest` on npm; it builds with Vite 8 or Rsbuild). Its RSC support is documented as **experimental** and not enabled by default.""")

r("Waku (minimal RSC framework), RedwoodSDK/Redwood (full-stack opinionated)","Waku (minimal RSC framework; still a release candidate on npm, `1.0.0-rc.4`, when checked), RedwoodSDK (full-stack, Cloudflare-oriented; listed on react.dev as an up-and-coming framework)")

r("plus an encryption/validation story for closed-over variables ⚠ (implementation detail; verify per framework).",
"plus an encryption/validation story for closed-over variables (implementation detail that differs per framework; Next.js, for example, generates encrypted, non-deterministic action ids and encrypts captured variables with a per-build key, per its Data Security guide).")

r("| Route `loader` (isomorphic by default ⚠ verify) + `createServerFn` for server-only code |","| Route `loader` (**isomorphic**: runs on server for the first load, in the browser on client navigations) + `createServerFn` for server-only code |")
r("| Client components + SSR; RSC support experimental ⚠ |","| Client components + SSR; RSC support experimental (docs flag it unstable) |")
r("| Client components + SSR; RSC support in progress ⚠ |","| Client components + SSR; RSC support experimental, opt-in |")
r("| Manual / TypeScript plugin helpers ⚠ | Generated route types (e.g., `Route.ComponentProps`) ⚠ |","| Generated route-aware helpers such as the global `PageProps<'/blog/[slug]'>` (types produced by `next dev`/`next build`/`next typegen`) | Generated route types (`Route.LoaderArgs`, `Route.ComponentProps`) |")
r("| Turbopack/webpack (Next-controlled) ⚠ |","| Turbopack by default in Next 16 (webpack via `--webpack`) |")

r("| Framework data cache | Results of `fetch` or wrapped functions | Framework (⚠ defaults changed across Next versions) |","| Framework data cache | Results of `fetch` or `use cache` functions | Framework (defaults changed across Next versions, see below) |")
r("| Router (client) cache | Prefetched route payloads for instant navigation | Framework (⚠ staleness windows have changed) |","| Router (client) cache | Prefetched route payloads for instant navigation | Framework (staleness windows are framework- and version-specific) |")

r("""> ⚠ **Version-sensitive.** Next.js changed the default for `fetch` and route handler caching between 14 and 15, and subsequently introduced a different opt-in model (the `"use cache"` directive and related APIs, in 15.x canary → later). *Verify the exact current behavior in the Next.js caching documentation before reasoning about staleness.* The durable lesson: when data is stale, **enumerate layers** before changing code.""",
"""> **Version-sensitive (verified against the Next.js docs, 2026-10-22).** Next 15 made `fetch` requests and `GET` route handlers **uncached by default** (opt in with `cache: 'force-cache'`). Next 16 added **Cache Components**: with `cacheComponents: true`, data fetching is dynamic by default and you opt in to caching per function or component with the `use cache` directive, tune it with `cacheLife`, and label it with `cacheTag`. For invalidation, `updateTag(tag)` (Server Functions only) expires the tag immediately for read-your-own-writes, while `revalidateTag(tag, profile)` now takes a second argument (`"max"` is recommended, giving stale-while-revalidate); calling it with one argument is deprecated. Docs for the pre-Cache-Components model live in the "Caching and Revalidating (Previous Model)" guide. The durable lesson: when data is stale, **enumerate layers** before changing code.""")

r("(stale-while-revalidate), if the platform supports it. ⚠ platform-specific.","(stale-while-revalidate), if the platform supports it (platform-specific behavior).")
r("Streaming of slow data is done by returning un-awaited promises and unwrapping with `use`/`<Await>` ⚠ API names vary.","Streaming of slow data is done by returning un-awaited promises (in React Router, as keys of an object) and unwrapping them with `<Await>` or React's `use` under Suspense.")
r("framework-generated `POST` (⚠ transport detail) with the arguments serialized.","framework-generated `POST` (Next.js documents that actions use only the POST method) with the arguments serialized.")
r("(single round trip, in the framework's design) ⚠ verify per framework.","(Next.js documents a single round trip for the updated UI plus data; other frameworks differ).")

r("// app/products/[slug]/page.tsx   (⚠ in recent Next majors `params` is a Promise; verify)","// app/products/[slug]/page.tsx   (in Next 15+ `params` is a Promise; in Next 16 synchronous access is removed)")
r("// app/routes/product.tsx   (⚠ route typing/imports are version-sensitive)","// app/routes/product.tsx   (React Router 7/8 framework mode; ./+types/* is generated by `react-router typegen`)")
r("""Notes: the `.server` suffix is a convention that tells the bundler to exclude a module from the client bundle ⚠ verify. Returning an un-awaited promise lets the framework stream it; consuming it uses Suspense with `use` or the framework's `Await` helper ⚠ varies by version. `data(...)` is how recent versions throw a response with status; older Remix used `json`/`Response` helpers ⚠.""",
"""Notes: the `.server` suffix is a convention that tells the bundler to exclude a module from the client bundle (verified in the React Router docs). Returning an un-awaited promise lets the framework stream it; the loader must return an object (you cannot return a bare promise), and you consume it with `<Await>` or React 19's `use` under `<Suspense>`. The component below, `ReviewsSection`, would do that. `data(...)` is how you throw or return a response with a status in v7/v8; the old `json()` and `defer()` helpers are gone in v8 (checked: neither is exported by `react-router@8.5.0`). By default React Router rejects still-pending streamed promises after 4950 ms (`streamTimeout` export in `entry.server.tsx`).""")

r("// src/routes/products.$slug.tsx   (⚠ API surface moves quickly; verify)","// src/routes/products.$slug.tsx   (@tanstack/react-start 1.169+)")
r("  .validator((slug: string) => slug)     // ⚠ method name has changed across versions","  .validator((slug: string) => slug)     // `.validator()` is current; `.inputValidator()` was removed in 1.169")
r("The `validator` / `inputValidator` naming has changed between releases; check the docs.","The validator method was named `inputValidator` in release candidates and is `.validator()` in the stable 1.169 line (the migration guide lists `.inputValidator()` as removed).")

r("critical advisories affecting RSC server packages have been published ⚠ *verify current advisories for your framework and React versions.*",
"critical advisories affecting RSC server packages have been published. React's December 2025 notice (CVE-2025-55182, CVSS 10.0, unauthenticated remote code execution) affected `react-server-dom-*` in 19.0, 19.1.0, 19.1.1 and 19.2.0 and was fixed in 19.0.1, 19.1.2 and 19.2.1; follow-up denial-of-service and source-exposure advisories (CVE-2025-55184, CVE-2025-67779, CVE-2025-55183) were fixed in later patch releases. Stay on current patch releases of React (19.3.x at the time of review) and your framework, and check advisories for your exact versions.")

r("must provide a shared cache handler across replicas, or each pod serves a different version ⚠ *a documented concern for Next self-hosting; verify the current cache-handler options.*",
"must provide a shared cache handler across replicas, or each pod serves a different version. The Next.js self-hosting guide documents this: each pod keeps its own cache by default, so configure `cacheHandler` (route/data cache) and `cacheHandlers` (`use cache`) with shared storage such as Redis, and note that `revalidateTag()` on one instance does not reach the others unless the handler implements tag coordination (`refreshTags`).")

r("platform cache headers like `x-vercel-cache` or similar ⚠ platform-specific)","platform cache headers like `x-vercel-cache`, which are platform-specific)")
r("**A5.** React's `cache` for Server Components memoizes per-request (deduplicating calls within one render pass). Not the framework's data cache and not the query library's cache. ⚠ Verify the API's current scope and semantics at react.dev reference.",
"**A5.** React's `cache` for Server Components memoizes per-request (deduplicating calls within one render pass). Not the framework's data cache and not the query library's cache. Verified against react.dev/reference/react/cache: it is for Server Components only and gives a separate memoized function per server request.")
r("consider `server-only` and taint APIs ⚠ (experimental; verify).","consider `server-only` and the taint APIs (`experimental_taintObjectReference` / `experimental_taintUniqueValue`, which react.dev still lists as available only in Experimental builds of React, not stable).")
r("set the framework's loader-revalidation policy (`shouldRevalidate`-style option) ⚠ naming varies;","set the framework's loader-revalidation policy (`shouldRevalidate` in React Router; `staleTime` or `shouldReload` on a TanStack Router route);")

r("(e.g., minimal ones like Waku exist as references ⚠ verify)","(e.g., minimal ones like Waku exist as references; Waku was still at `1.0.0-rc.4` on npm when checked)")
r("Frameworks add some protections (CSRF origin checks, unguessable ids ⚠ verify), but","Frameworks add some protections (Next.js, for example, compares the Origin header to the host, with an `allowedOrigins` option, and uses encrypted non-deterministic action ids, and removes unused actions from the client bundle), but")
r("| React — Server Functions / directives | <https://react.dev/reference/rsc/server-functions> *(unverified deep link)* |","| React — Server Functions | <https://react.dev/reference/rsc/server-functions> |")
r("Deep links not fetched in this session are marked *(unverified)*; use each site's search if a path moved.","Links were checked on 2026-10-22 (react.dev pages returned HTTP 200); use each site's search if a path moves.")
r("| Next.js documentation | <https://nextjs.org/docs> |","| Next.js documentation | <https://nextjs.org/docs/app> |")
r("| Upgrade churn | Low | Higher (major releases change defaults) | Medium (v1→v7 merged lineage) | Higher (pre-1.0 history) ⚠ |","| Upgrade churn | Low | Higher (major releases change defaults: 15 uncached fetch, 16 Cache Components, `middleware` to `proxy`) | Medium (Remix v2 to RR v7 merge, then v8 raised React/Node minimums) | Medium (stable since 1.169; release-candidate history included removed APIs) |")
r("| RSC | No | **Yes, production-grade** | Experimental/in progress ⚠ | In progress ⚠ |","| RSC | No | **Yes, production-grade** | Experimental (docs flag unstable) | Experimental |")
r("| Progressive enhancement | Poor (requires JS) | Possible for forms with Server Functions ([11](./11-progressive-enhancement.md)) | Strong by design | Possible, depends on usage ⚠ |","| Progressive enhancement | Poor (requires JS) | Possible for forms with Server Functions ([11](./11-progressive-enhancement.md)) | Strong by design | Possible, depends on usage (not verified for this review) |")
r("| Type-safe routing | Via TanStack Router or manual | Limited out of the box ⚠ |","| Type-safe routing | Via TanStack Router or manual | Typed `PageProps`/route helpers generated for params; links are not fully type-checked by default |")
r("self-hosting supported but needs care for caching/ISR features ⚠ |","self-hosting supported but needs care for caching/ISR features (see §9) |")
r("| Node/edge/serverless via adapters ⚠ |","| Node/edge/serverless via Vite or Rsbuild builds and hosting presets (e.g. Nitro) |")
r("Server functions become entries in a server manifest keyed by an opaque id. ⚠ *Implementation detail.*","Server functions become entries in a server manifest keyed by an opaque id. *Implementation detail.*")
open(p,'w').write(s)
print("applied",n)
