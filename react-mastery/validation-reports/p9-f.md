# Review changelog: batch p9-f (Phase 9 lessons 11-14)

Reviewer date: 2026-10-22. Sandbox: react / react-dom 19.3.1, vitest 3.2.7, jsdom, RTL, zod 4.6.7. Scratch code: `/Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/p9-f/` (`ssr.test.tsx`, `form.test.tsx`, `form2.test.tsx`, `replay*.test.tsx`, `enter.test.tsx`, `a11y.test.tsx`, `z.test.ts`, `rt.test.ts`, `b4.tsx`/`inert.tsx` typechecks, `so2/` server-only alias). Saved docs: `scratch/p9-f/src/` (react.dev) and the session scratchpad (Next, Zod, TanStack, W3C, Google, web.dev).

All ⚠/verify/unverified markers in the four lessons are removed (0 remaining); each was either confirmed, corrected, or replaced by an explicit hedge.

Totals (approx.): confirmed 62, corrected 24, hedged/unresolved 9.

---

## Lesson 11: Progressive enhancement

| Claim | How checked | Result | Change |
|---|---|---|---|
| `renderToString(<form action={fn}>)` output | Executed (`ssr.test.tsx`) | **Corrected/clarified**: emits `action="javascript:throw new Error('React form unexpectedly submitted.')"` plus a one-per-response inline `<script>`; `method` is dropped (dev warning "Cannot specify a encType or method for a form that specifies a function as the action") | §5.4 example no longer claims `method="post"` gives a fallback; added explanation + note |
| String action | Executed | Confirmed: `action="/x" method="post"` emitted verbatim | Noted in §5.4 |
| Server Function reference action | Executed with a simulated `$$FORM_ACTION` reference | Confirmed: `action`, `method="POST"`, `encType="multipart/form-data"`, hidden inputs; `formState` option exists in server+client bundles; `<!--F!-->`/`<!--F-->` markers in source | §3.2 expanded (marked as implementation detail) |
| Client-function form pre-hydration ("✘ no handler yet") | Source read + executed `replay.test.tsx` | **Corrected**: the inline script captures the submit (preventDefault, FormData incl. submitter, `document.$$reactFormReplay`) and React replays it on hydration; with JS disabled nothing happens. Verified end to end in jsdom (action received the data after `hydrateRoot`) | Table row, §3.4 rewritten, B4 note |
| Event replay of discrete events | Source (`discreteReplayableEvents` list in react-dom 19.3.1) | List confirmed from source. **Unresolved in execution**: my jsdom harness did not reproduce click replay on a dehydrated Suspense boundary (`replay2.test.tsx`: handler attached after hydration but the queued click was not re-fired) | §3.4 states the list as "read from source", with an explicit "could not reproduce" note |
| `permalink` semantics | react.dev useActionState + server-functions pages | Confirmed; added the two documented conditions (same component/permalink on destination; no effect once interactive) | §2.4, A5 |
| Reset of uncontrolled fields after action | Executed (`form.test.tsx` A1, A2, A4) | Confirmed, including when action *returns* an error object; controlled input keeps value | §5.2 note, linked to lesson 13 |
| `useFormStatus` must be in a child | Executed (C) + react.dev | Confirmed (same-component `pending` always false) | none |
| Zod `.email()` | zod.dev v4 + executed | **Corrected**: `z.string().email()` deprecated; `z.email()` does not trim/lowercase first, so example became `z.string().trim().toLowerCase().pipe(z.email().max(254))` (verified output) | §5.2 code + note |
| `<details name>`, popover, dialog support | MDN pages exist (HTTP 200); compat tables not machine-read | **Hedged** | Wording rewritten; added Invoker Commands mention |
| Playwright `javaScriptEnabled` | playwright.dev/docs/emulation | Confirmed | removed "unverified" |
| MDN links (validation, form, 303) | HTTP 200 | Confirmed | removed "unverified" |
| Skew protection | Not checked | **Hedged** ("some hosts/frameworks offer it") | D2 |

## Lesson 12: Auth boundaries

| Claim | How checked | Result | Change |
|---|---|---|---|
| CVE-2025-29927 middleware bypass | GitHub advisory GHSA-f82v-jwr5-mffw | Confirmed + completed: `x-middleware-subrequest`, CVSS 9.1, fixed 15.2.3 / 14.2.25 / 13.5.9 / 12.3.5, 11.x workaround, Vercel-hosted auto-protected | §2.4 |
| Middleware "constrained runtime, no DB" | Next 16.4 proxy docs | **Corrected**: Next 16 renames middleware to `proxy`, defaults to Node.js runtime; docs still recommend optimistic checks only | §2.4 |
| Layout checks don't re-run | Next auth guide ("Due to Partial Rendering...") | Confirmed | cited |
| Server Actions CSRF (Origin vs Host, allowedOrigins) | Next data-security guide + serverActions config page | Confirmed + extended: POST-only, `X-Forwarded-Host`, wildcards, missing `Origin` is allowed with a warning, runs in production, config under `experimental.serverActions` | §2.6, §5.3, §10, D3 |
| React `cache()` scope | react.dev/reference/react/cache | Confirmed (per server request, Server Components only) | §3.1 |
| Closure variable encryption | Next data-security guide | Confirmed (auto-encrypted, key per build, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, "don't rely on encryption alone") | §3.3 |
| Taint APIs status | react.dev pages + Next guide | Confirmed still experimental; `experimental.taint`; "only protects against simple mistakes" | §3.3 |
| `cookies()` async | Next cookies reference | Confirmed (async since 15.0.0-RC; sync access removed in 16 per upgrade guide/codemod text) | §5.1 comment |
| IDOR/BOLA is OWASP API #1 | OWASP API1:2023 page; OWASP Top 10:2025 redirect | Confirmed for the 2023 edition; no newer edition found. **Hedged** ("current edition I could find") | §3.2 |
| Cookie `__Host-` rules | MDN cookies | Confirmed | none |
| Auth.js / Better Auth / Clerk | authjs.dev, better-auth.com, Next auth guide | Confirmed: authjs.dev banner "The Auth.js project is now part of Better Auth"; Better Auth blog (Jul 2026) "Better Auth is joining Vercel"; Next guide lists Auth0, Better Auth, Clerk, NextAuth.js, etc. **Unresolved**: migration guidance / support terms not checked | New library-landscape paragraph in §7.2 (+ JWT-vs-session-claims note) |
| React Server Components RCE and follow-ups | react.dev Dec 3 and Dec 11 2025 posts; CHANGELOG | Confirmed: CVE-2025-55182 (CVSS 10, 19.0/19.1.0/19.1.1/19.2.0 -> 19.0.1/19.1.2/19.2.1); DoS CVE-2025-55184/67779, source exposure CVE-2025-55183; 19.0.3/19.1.4/19.2.3 incomplete, fixed 19.0.4/19.1.5/19.2.4; hardening through 19.2.7. **Unresolved**: CVE-2026-23864 not found on react.dev | §8; hedged in text |
| `server-only` in Vitest | Executed (`so2/`) | Confirmed: default import throws; `resolve.alias` to `empty.js` makes it a no-op | C2 note |
| C3 `safeReturnTo` | Executed (`rt.test.ts`) | **Bug found and fixed**: `/..//evil.com` returned `//evil.com` (open redirect) because `new URL()` collapses `..`; added `startsWith("//")` guard (all test inputs now return `/` or a safe path) | C3 code + explanation |
| Zod `z.string().uuid()` | zod 4 | **Corrected** to `z.uuid()` (3 places) | code |
| Paywall structured data | Google paywalled-content doc | Confirmed (`isAccessibleForFree: false`, `hasPart` + `cssSelector`) | §9 |
| Framework cache defaults | Next 16 upgrade/caching docs | **Hedged** (changed in 15 and 16) | §3.4 |
| RLS, NEXT_PUBLIC_, deep links | Next docs, HTTP 200 checks | Confirmed | markers removed |

## Lesson 13: Forms, actions and mutations

| Claim | How checked | Result | Change |
|---|---|---|---|
| Reset after success, incl. returned error object | Executed (A1-A4) | Confirmed; throwing action goes to error boundary (confirmed); `onReset` fires on automatic reset (confirmed, matches 19.3 notes) | §2.5 |
| Async-transition limitation after `await` | react.dev useTransition (19.3) + executed (E) | Confirmed: renders `v=0 pending=true`, `v=1 pending=true`, `v=1 pending=false` | §2.3 |
| `useActionState` queueing | react.dev + executed (B) | Confirmed: 3 submits -> 3 sequential calls with prev 1,2,3, 2 renders; thrown error cancels queue (docs) | §3.2 |
| Render sequence for single submit | Executed | `state=0 pending=true` then `state=1 pending=false` | §3.2 |
| `useOptimistic` rollback / no flicker | Executed (D, D3, D4) | **Corrected**: no flicker only if the real update is in the same transition; plain `setState` after `await` gave an intermediate duplicate frame (`a,x(tmp)` / `a,x,x(tmp)` / `a,x`); with `startTransition` it is `a,x(tmp)` / `a,x`; failure case reverts | §3.3, §4 |
| Optimistic warning text | Executed | **Corrected**: exact text on 19.3.1 is lowercase "outside a transition or action..." | table, §10 |
| `requestFormReset` | Exported (source), executed in transition, react.dev page 404 | Confirmed available; **no reference page** (hedged) | table row |
| Enter double submit | Executed with user-event + HTML implicit-submission rule | **Corrected**: disabled default button blocks Enter (1 invocation for 3 presses); no-button form ran 3 times | §4 |
| Submitter name/value in FormData; multi-intent | Executed (G) | **Corrected**: button with function `formAction` loses `name` (React overrides, warns) and handler gets no `intent`; plain submitter contributes `intent` | §5.7 code: removed `name/value` from `formAction` button and `encType` (React sets it; warns) |
| Next `revalidatePath/Tag`, `updateTag`, `refresh` | Next 16.4 docs | **Corrected/extended**: `revalidateTag(tag, profile)` required second arg (one-arg deprecated), `updateTag` (Server Actions only), `refresh()` | §3.6 |
| Next body size limit | serverActions config page | Confirmed: default 1MB, `serverActions.bodySizeLimit` | §5.7 |
| Zod 4 error API | Executed + zod.dev | `z.flattenError`, `z.treeifyError`, `error.issues` confirmed; `.flatten()`/`.format()` deprecated | §5.2 code + note |
| TanStack Query retries/offline/variables-based optimistic | TanStack docs | **Corrected**: mutations don't retry by default (opt-in); paused offline mutations resume in order; "via the UI" variant confirmed | table, §5.8 |
| B4 TypeScript catches `(formData) =>` | tsc (`b4.tsx`) | Confirmed (TS2769) | none |
| `redirect` inside try/catch | Next redirect doc consulted; lesson text unchanged | Confirmed | none |
| File uploads / FormData `File` | Not executed | Hedged by principle (client-declared `type`) | none |
| React Hook Form / TanStack Form status | Not checked | **Unresolved** (lesson does not make claims about them) | none |
| IETF Idempotency-Key draft status | Not fetched | **Unresolved** | hedged text |

## Lesson 14: Accessibility and SEO

| Claim | How checked | Result | Change |
|---|---|---|---|
| WCAG 2.2 criteria | W3C WCAG 2.2 text | Confirmed: 2.4.11 Focus Not Obscured (Minimum) AA, 2.5.7 Dragging Movements AA, 2.5.8 Target Size (Minimum) AA, 3.2.6 Consistent Help A, 3.3.7 Redundant Entry A, 3.3.8 Accessible Authentication (Minimum) AA, 4.1.1 Parsing "Obsolete and removed" | Table row rewritten with numbers/levels; "valid parseable" wording corrected |
| Metadata hoisting | react.dev title/meta/link + `renderToString` | Confirmed; **Corrected**: multiple `<title>` are all emitted; React says behavior is undefined (no "last/closest wins") | §2.7 |
| `useId` format | react.dev 19.2 post + executed | **Corrected**: `:r:` (19.0), `«r»` (19.1), `_r_` (19.2+); server output looked like `_R_0_` | line notes |
| `inert` typing/support | Executed + tsc | Confirmed | marker removed |
| Next route announcer | Next accessibility docs | Confirmed (title, then h1, then pathname) | §3.4 |
| Next streaming metadata & bots | generateMetadata docs | Confirmed (HTML-limited bots block; `htmlLimitedBots`) | §2.6 |
| Soft 404 with streaming | Next not-found docs | Confirmed and extended: 404 before streaming; 200 after, with injected `noindex` | §5.5 |
| Google JS SEO / dynamic rendering | Google docs | Confirmed: crawl/render/index, evergreen Chromium, dynamic rendering page marked Deprecated | §2.5 |
| JSON-LD `<` escape | Next JSON-LD guide | Confirmed | §5.5 |
| CWV thresholds, INP replaced FID | web.dev vitals/INP | Confirmed (2.5 s / 200 ms / 0.1; INP successor of FID). The exact "March 2024" date was not found on the fetched pages (not stated in lesson) | §3.5, §9 |
| Next metadata API (`viewport` export, sitemap/robots/opengraph-image) | generateMetadata docs | Confirmed | bullet in §5.5 |
| StrictMode focus-effect misfire | Executed | Confirmed (focus fired on initial mount) | note |
| Automated tools find "a third" | Not re-fetched | **Hedged** (estimates vary) | §2.8 |
| EAA from mid-2025 | Not fetched | **Hedged** (28 June 2025 from memory; verify scope) | §9 |
| jest-axe / vitest-axe / jsx-a11y / @axe-core/playwright status | npm registry | Confirmed versions; vitest-axe 0.1.0 (Jan 2025), jsx-a11y 6.10.2 (Oct 2024, ESLint <=9 peer) | tooling workflow |
| Legacy React a11y doc; react.dev/learn/accessibility | curl | legacy 200, react.dev 404 | resource table |
| WAI-ARIA 1.2/1.3, APG, "Using ARIA" | HTTP 200 only | Not content-checked; lesson makes no version-specific claim | **Unresolved** (minor) |

## Most significant corrections
1. Lesson 11: client-function form actions are NOT dead pre-hydration: React's inline script queues and replays submits after hydration; and `method="post"` on a function-action form is dropped, so §5.4's "fallback" was wrong.
2. Lesson 12: `safeReturnTo` allowed `/..//evil.com` (open redirect); Next 16 `proxy` runs on Node; CVE-2025-29927 and RSC CVE details filled in.
3. Lesson 13: `useOptimistic` no-flicker only holds when the real update is in the same transition; multi-intent `name`/`value` with function `formAction` does not work; Next 16 `revalidateTag` signature and `updateTag`.
