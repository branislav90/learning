# p9-a review changelog (2026-10-22)

Lessons: `react-mastery/09-advanced-rendering-and-ecosystem/01-spa-ssr-ssg-streaming.md`, `02-hydration-internals-deep-dive.md`.
Scratch (all runnable): `tools/sandbox/scratch/p9-a/` (s1-s4, ppr, b1, h1-h6, ser, toy.mts, c3.test.tsx). Runtime: react/react-dom 19.3.x, Node 24, jsdom, Vitest 3.
Note: react.dev returns HTTP 200 for non-existent pages, so every react.dev URL was checked by page content, not status code.

## Lesson 01 - SPA, SSR, SSG, streaming

| # | Claim | How checked | Result | Change |
|---|---|---|---|---|
| 1 | Streamed HTML shape: pending boundary, swap script | s1.mjs (renderToPipeableStream, 2 slow boundaries, chunk timestamps) | Confirmed, and shape is richer than lesson implied: `<!--$?--><template id="B:0">`, `<div hidden id="S:0">`, `$RC("B:0","S:0")`, `$RB/$RV` batching, `<link rel=preload>` in head, `<script async id=_R_>` | Replaced the "never look at markup" warning with the observed 4-chunk output (labelled implementation detail) |
| 2 | 19.2 batching of Suspense reveals, ~2.5 s cutoff | 19.2 blog text + `$RC` source in the output (`2300>a&&2E3<a`) | Confirmed | Added to 2.3 and 3.2 |
| 3 | `onShellReady` / `onAllReady` / `onShellError` / abort behaviour | s2.mjs, s3.mjs; react.dev renderToPipeableStream | Confirmed: shell throw -> onError then onShellError, no bytes; suspending shell + abort -> onShellError; boundary + abort -> onAllReady still fires, `$RX` marks boundary client-render | Corrected 3.1 #2 (a suspending shell without boundary waits, it is not an immediate onShellError) |
| 4 | Status code after boundary error ("200", B1, 5.1 predict) | s2/s3 | **Corrected/nuanced**: a synchronous throw inside a boundary calls onError BEFORE onShellReady, so the lesson's own `didError ? 500 : 200` handler sends 500; a later rejection arrives after pipe -> 200 | Edited 5.1 note (1), predict, and answer B1 |
| 5 | `renderToString` with Suspense | s1/s2 | Confirmed it cannot wait; pending boundary -> `<!--$!-->` + template with explicit message + fallback; throw outside boundary throws | Added to misconceptions table row |
| 6 | `prerender` returns `{ prelude }` | react.dev prerender page, s1/s2/ppr | **Corrected**: returns `{ prelude, postponed }`; prelude is Web Stream; Node variant `prerenderToNodeStream`; aborted prerender -> fallback in prelude + non-null postponed; `nonce` option not available | Edited 3.1 #1/#5, 3.4, 5.2 note |
| 7 | 19.2 resume APIs / PPR (marked volatile) | react.dev prerender page, 19.2 blog, ppr.mjs (prerender+abort then `resume`) | Confirmed and executed: resumed stream contains only the remaining boundary (`$RC("B:0","S:0")`), prelude already ends `</body></html>`; names/locations match (resume, resumeToPipeableStream in server; resumeAndPrerender(+ToNodeStream) in static) | Rewrote 3.4 paragraph and 3.6 with the verified mechanism, removed "volatile" hedge; Next.js: PPR is default with Cache Components (nextjs.org docs) |
| 8 | Web Streams APIs in Node | 19.2 blog; s1 ran `renderToReadableStream` in Node | Confirmed; Node Streams still recommended | Added to 3.1 #1 and links table |
| 9 | nginx `X-Accel-Buffering: no` | nginx proxy module docs | Confirmed | Removed warning, quoted |
| 10 | Compression middleware `res.flush()` | expressjs/compression README | Confirmed for Express `compression` (other libs unverified, hedged) | Edited 3.7 |
| 11 | Dynamic rendering / bot-only onAllReady "cloaking" | Google Search Central dynamic-rendering page (partial text only) | Hedged: Google calls dynamic rendering a workaround, not cloaking when content similar. Crawler JS-rendering claim in 2.7 not independently verified | Reworded 2.7 row and 5.1 note (3) |
| 12 | Islands (Astro) / resumability (Qwik) | Qwik docs ("Qwik applications don't hydrate; they resume"); Astro islands page loaded but text extraction poor | Qwik confirmed; Astro only lightly (page exists, concept standard) | Replaced the warning with source attribution |
| 13 | `serializeForScript` | ser.mjs | **Corrected**: lesson source contained raw U+2028/2029 characters inside regex literals (invisible, and rendered as spaces); function otherwise works (no `</script>`, round-trips). Fixed to ` `/` ` escapes; C2 parenthetical "JSON escapes `<` back to `<`" was garbled | Edited 5.7 and C2 |
| 14 | Paywall / AsyncLocalStorage ⚠ | Google paywalled-content structured data page; Node docs | Hedged | Replaced "flexible sampling ⚠" with structured-data reference; ALS support on edge runtimes hedged |
| 15 | Link list "unverified" items | content check of all react.dev/web.dev/MDN/GitHub URLs; repo paths exist | Confirmed | Removed unverified markers, added resume/resumeAndPrerender links |

Unresolved (01): (a) the 4.1 timing table is illustrative arithmetic, not measured; (b) "major crawlers execute JavaScript with delays" not independently re-verified (hedged to "check current Google docs"); (c) CDN/serverless buffering behaviour per vendor (hedged, not tested); (d) Content-Length forces buffering (D1 answer) not executed.

## Lesson 02 - Hydration internals

| # | Claim | How checked | Result | Change |
|---|---|---|---|---|
| 1 | Text/structure mismatch = recoverable error, tree regenerated | h1.mjs (jsdom, dev and NODE_ENV=production) | Confirmed. Dev message "Hydration failed because the server rendered text/HTML didn't match the client. As a result this tree will be regenerated on the client..." with `+`/`-` diff; prod "Minified React error #418" (args text/HTML); errorInfo keys = ["componentStack"] | Added real messages to 2.2, 3.2, 3.7, 5.1, Symptom A |
| 2 | Attribute mismatch semantics | h1.mjs | **Corrected/strengthened**: attribute mismatch is dev `console.error` ("won't be patched up") with a diff, DOM keeps server value, **not** delivered to onRecoverableError, silent in production | Edited 2.2, 3.1 #3, 3.7 taxonomy + notes, 5.1 notes (monitoring caveat), C3 note |
| 3 | Blast radius = nearest Suspense boundary above, else root | h2.mjs (node identity checks) | Confirmed: with boundary `<h1>`/`<footer>` nodes kept; without, all replaced | Added executed evidence |
| 4 | `suppressHydrationWarning`: one level deep, no patching | h1.mjs dev+prod; react.dev hydrateRoot | Confirmed: text and attribute suppressed, server value kept in DOM; suppress on parent does NOT cover mismatching child (full error) | Edited 2.5, 5.6 (replaced warning marker), A5 consistent |
| 5 | Text separators `<!-- -->` and marker comments | s1/h1, 19.3 output | Confirmed `Hello <!-- -->Ada`; markers `$ $? $! /$` confirmed; extra `<!--$~-->` (queued for batched reveal) exists in 19.2+ | Edited 3.4, removed warning |
| 6 | Event capture and replay (3.6, 4.1, Q6) | h3/h4 + reading react-dom-client.development.js `dispatchEvent`, `discreteReplayableEvents`, `queueIfContinuousEvent` | **Corrected**: discrete events on a dehydrated boundary cause synchronous hydrate-then-dispatch (executed: handler ran inside the same dispatch, boundary B hydrated before A, C); if boundary can't hydrate (lazy chunk pending) the click was dropped; focusin/dragenter/mouseover/pointerover are queued and replayed (so "continuous events not replayed" was too broad; pointermove is not) | Rewrote 3.6, 4.1 steps 4-5, gantt label, Q6, checkpoint line |
| 7 | useSyncExternalStore hydration (B3, 5.3) | h2.mjs | Confirmed: renders server snapshot (1024) then client snapshot (390), no error | none |
| 8 | useId prefix / format | executed (`_R_0_`), 19.2 blog | Updated with 19.0 `:r:`, 19.1 `«r»`, 19.2 `_r_` history | Edited 3.8 |
| 9 | useLayoutEffect warns on server ⚠ | s4.mjs | No warning on 19.3 | Edited 3.8, removed marker |
| 10 | Portals ⚠ | s4.mjs | `renderToString` throws "Portals are not currently supported by the server renderer..." | Edited 3.8 |
| 11 | React 19 skips unexpected head/body tags | h5.mjs (`hydrateRoot(document)` with extra style in head, extra divs first/last in body); 19 blog | Confirmed, no errors | Added executed evidence |
| 12 | Strict Mode + hydration | h5.mjs; 19.3 changelog (#35961) | Confirmed 19.3 double-invokes effects during hydration (`setup, cleanup, setup`) | Edited 3.9; softened "twice as visibly" |
| 13 | Toy hydrator and predictions (3.3, B1, 6.1) | toy.mts via node --experimental-strip-types; tsc --strict | Confirmed: "expected <span>", "extra server nodes inside <div>", "expected <li>"; only tsc error is harness `jsdom` types | Added "executed" note |
| 14 | onRecoverableError default | read react-dom-client source (defaultOnRecoverableError -> reportGlobalError); react.dev | Confirmed; also fires for server-error boundaries (h6.mjs: "Switched to client rendering because the server rendering errored: ...", client retry succeeds) | Edited 5.1 notes |
| 15 | C3 Vitest hydration test | c3.test.tsx run under Vitest 3 + jsdom | Works with `IS_REACT_ACT_ENVIRONMENT=true`, `act` from react; detects text mismatch; lesson sample lacked imports | Added imports + note |
| 16 | 19.3 `browser()` | r193.txt, b1.mjs (use(browser()) -> `<!--$!-->` + fallback, onBrowserBailout(error, {componentStack})) | Confirmed | Added pointer in links section |
| 17 | Links | content checks | Confirmed; discussion #37 title matches | Removed unverified markers |

Unresolved (02): (a) exact set of events replayed is read from 19.3 source, not documented, and may change (hedged in text); (b) real-browser behaviours (Safari-specific, extension-induced mismatches, whitespace/comment skipping rules in C2) not testable in jsdom - hedged; (c) D1 "wrong product" mechanism remains a plausible-scenario answer (clarified that handlers come from the client's item at that DOM position while attributes stay server-side); (d) "root.render before hydration finishes clears server HTML" (hydrateRoot docs) not added or executed.

## Counts
Confirmed ~21 claim groups, corrected ~10 (status code timing, prerender return shape, attribute-mismatch reporting, event replay semantics, shell-suspends behaviour, suppressHydrationWarning child case, useLayoutEffect/portal notes, serializeForScript source, continuous events, useId format), unresolved/hedged 8 (listed above).
