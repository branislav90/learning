# Review changelog: batch p2b (Phase 2, lessons 20-38)

Date: 2026-10-22. Reviewer environment: react / react-dom 19.3.1, scheduler 0.28.0, jsdom 30, Vitest 3.2.7, @testing-library/react 16.3.3, Node + tsx. Primary sources: react.dev (useEffect, useLayoutEffect, useTransition, useDeferredValue, useSyncExternalStore, Suspense, use, Profiler, StrictMode, flushSync, Activity, hydrateRoot, cache, `'use client'`, Server Components, React 19 / 19.2 posts, React 19 upgrade guide, React 18 upgrade guide, React Performance tracks), and the `facebook/react` `main` source (fetched raw: `ReactFiberConfigDOM.js`, `ReactFiberCommitWork.js`, `ReactFiberCommitHostEffects.js`, `ReactFiberCompleteWork.js`, `ReactFiberBeginWork.js`, `ReactFiberWorkLoop.js`, `ReactFiberLane.js`, `ReactFiberThrow.js`, `ReactDOMInput.js`, `ReactDOMEventListener.js`, `ReactDOMEventReplaying.js`, `ReactDOMUpdateBatching.js`, scheduler flags) and the installed `react-dom-client.development.js`.

Scratch experiments: `/Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/p2b/` (`dom`, `hide`, `paint`, `batch`, `trans`, `susp`, `susp2`, `hyd`, `hyd2`, `prod.cjs`, `ssr.mjs`, `ssr2.mjs`, `strict`, `strict2`, `unnec`, `scenA/A2/B/C/C2/D/D2/E/F`, `assess*`, `impl/*`, `verify-react-internals.mts`, `toy.ts`; config `vitest.config.ts`, edit scripts in `ed/`).

Summary counts (claim clusters, not lines): confirmed 61, corrected 33, hedged/softened 24, unresolved 9.

## Most significant corrections

1. **Host props are not diffed in `completeWork` in React 19** (lessons 20, 31, 32, 33, 34). `updateHostComponent` only checks `oldProps === newProps`; any re-rendered parent gives its host children a new props object, so they are flagged `Update` and `commitUpdate` diffs per property at commit time (finds nothing, writes nothing). Scenario A's timeline (T10, T13, T14, T16, §2.3, §3.3, mermaid) and scenario B/C narration said "empty diff, no flag, commit does not visit Child". Verified by `ReactFiberCompleteWork.js` and by checking that unchanged `<article>`/`<h3>` nodes' internal props records were replaced after a parent re-render (not for a `memo` child). Observable DOM claims were all correct.
2. **Hydration** (lessons 25, 37, 38). (a) "Text mismatches are not fatal / React doesn't patch text in production" (25 §4.3) was wrong: text and element mismatches are recoverable errors with client re-render in dev and production (error #418); only attribute mismatches are silently kept. (b) "`suppressHydrationWarning`... text differences are patched" (37 §5.4) was wrong: React does not patch text (react.dev and executed). (c) Event replay: the lessons said "unspecified/queued discrete events are replayed". Source and execution: a discrete event on a dehydrated boundary triggers synchronous hydration and is then dispatched; if the boundary cannot hydrate (lazy chunk missing) the event is dropped; only continuous events are queued and replayed.
3. **Suspense** (lessons 24, 36, 38). (a) Reveal throttling made the 100 ms/400 ms timeline in 24 §4.1 wrong; measured reveals were at ~310 ms and ~611 ms (documented 300 ms rule, `FALLBACK_THROTTLE_MS`). (b) "A component suspended while responding to synchronous input" is legacy-root only; React 19 concurrent roots with no boundary simply never commit (executed for `root.render` and `flushSync`). (c) Passive effects are not cleaned up by a Suspense hide (layout only), while `<Activity mode="hidden">` cleans up both; executed.

Other notable fixes: `<Profiler onRender>` fires whenever the Profiler fiber itself re-renders even when all children bail out (the I1 assessment test failed as written: fixed with a memo wrapper and a jest-dom import); controlled-input `onChange` flushes sync inside the dispatch (22, 35); RTL sync `render()` with `use`/Suspense hangs forever unless wrapped in `await act(async ...)`; the `<input>` update path toggles `name` (observable noise, 20 vs 12 records in 34); `react-dom/profiling` aliasing, `scheduler/tracing` removed (30); `performConcurrentWorkOnRoot` no longer exists (31).

## Per lesson

### 20 Commit and DOM mutation
- Claims checked: host-config function names and files; `commitUpdate` signature / update payload history; `hideInstance` / `unhideInstance` (display `none !important`, text nodes blanked); Activity; ref cleanup; keyed-move counts and the toy planner (`planKeyed`); one-insertion initial mount; single `removeChild` for a deleted subtree; `ContentReset`; controlled input behavior; custom elements (React 19 post).
- How: fetched source on `main`; ran jsdom + `MutationObserver` (`dom.test.tsx`, `hide.test.tsx`, `toy.ts`).
- Results: confirmed names/files (they exist); confirmed move counts (`abcd`->`dabc` = 3 moves, swap first two = 1, front insert = 1 `insertBefore`); toy table verified. Corrected: prepareUpdate/updatePayload history (now diff in `commitUpdate`); host-prop flagging (identity, see above); controlled input updates produce `name` + `value` attribute records, so "one write" is false for form controls; Activity statement (stable since 19.2, cleans up passive too; Suspense hides only layout effects). Hedged: translation-extension guidance, `content-visibility`, scroll-position loss on `display:none` (browser-dependent, not executable).
- Unresolved: browser-vendor translation behavior (Chrome `translated-ltr`), scroll retention while hidden.

### 21 Browser paint and React updates
- Checked: "documented" `useEffect` after-paint wording; discrete-event passive flush; `flushSync` and passive effects; log order click/timer with rAF; ref cleanup in React 19; `useLayoutEffect` SSR warning; Suspense throttle; scheduler yielding mechanism.
- How: `paint.test.tsx`; react.dev useEffect/flushSync/useLayoutEffect; React 18 upgrade guide; source flags.
- Results: corrected the claim that the `useEffect` reference documents "after paint" (it only says runs when the component commits; before-paint guarantee is on `useLayoutEffect`); confirmed the "consistent useEffect timing" quote; click order `render, layout, passive, rAF` confirmed; flush happens in a microtask (not inside `click()`); `flushSync` ran passive effects before returning; SSR layout-effect warning is gone in 19 (executed); `FALLBACK_THROTTLE_MS = 300`; scheduler uses `setImmediate` when present, else `MessageChannel`. 
- Unresolved: real-frame ordering of passive vs rAF for timer-triggered updates (jsdom has no frames); Event Timing/INP browser support.

### 22 Automatic batching
- Checked: Demo timeline (2 commits), B2 (setN(1) alone then batched), save flow (2 renders), microtask/native batching, render-phase update, "different component" warning, `flushSync` inside effect.
- How: `batch.test.tsx` real events outside `act`.
- Results: all confirmed (B2 two commits `1 0` then `2 3`, reason documented). Corrected: sync-lane flush is in a microtask (not "at end of dispatch"), except controlled-input events flush synchronously inside dispatch (`finishEventHandler`); flushSync inside an effect logs a warning and does not flush there. Hedged `useSyncExternalStore`-in-transition wording now matches the docs.

### 23 Transitions and deferred rendering
- Checked: tab-switch timeline (incl. second click abandoning render), rebase example (1 -> 2 -> 4), `useDeferredValue` mount/update/initialValue/in-transition, async action `isPending`, expiration constants.
- How: `trans.test.tsx`; docs; `ReactFiberLane.js`.
- Results: confirmed. Corrected the commit count in §4.1 (second click produced no separate urgent-only commit because `isPending` was already true). Expiration/starvation confirmed with constants (5000 ms transitions, 250 ms sync). Performance tracks note updated (19.2, dev/profiling).

### 24 Suspense conceptual internals
- Checked: sibling pre-warm, state preservation on hide, no-boundary behavior, `use` in try/catch message, uncached promise, status fields, reveal throttle, nested timeline, §5.5 lab, §3.5 hidden-tree effects.
- How: `susp.test.tsx`, `susp2.test.tsx`, source.
- Results: confirmed pre-warm (A, A, B ordering), 300 ms rule, state preserved, thenable `status`/`value`, "Suspense Exception" text. Corrected: root-level/no-boundary behavior; passive effects not cleaned on Suspense hide; §4.1 timestamps; §5.5 expected effects (no-deps effects re-run on reveal). Lesson 36's no-boundary text aligned.
- Unresolved: React 18 behavior (not installed); the "uncached promise" dev warning did not appear in my runs even though the string exists in the bundle.

### 25 Hydration and selective hydration
- Checked: mismatch categories (text, attribute, tag, missing/extra, inside Suspense), `suppressHydrationWarning`, effects only on client, `useId`, `getServerSnapshot`, lazy-in-boundary hydration, event handling before hydration, `useLayoutEffect` SSR warning.
- How: `hyd.test.tsx`, `hyd2.test.tsx`, `prod.cjs` (dev and production), event source files.
- Results: see top corrections. Confirmed boundary isolation (sibling `<h1>` reused), attribute kept server value, effects/refs after hydration, getServerSnapshot converges. Corrected replay model, text-mismatch severity, Symptom D wording.
- Unresolved: React 19 `<head>`/`<body>` unexpected-tag tolerance (documented, not reproduced); streaming HTML script swap in a real browser.

### 26 SSR and client rendering
- Checked: `renderToString` with a suspending child, `renderToPipeableStream` `onShellReady`/`onAllReady`/error-in-boundary/abort, `prerender`, context-as-provider, metadata hoisting, JSON escaping.
- How: `ssr.mjs`, `ssr2.mjs` (Node). Results: confirmed; added concrete outputs (`<!--$!-->` marker + template for `renderToString`). Corrected: JSON escape text rendered as `<` (now `<`). Added 19.2 `resume`/PPR note. Unresolved: framework-level partial prerendering behavior.

### 27 React Server Components intro
- Checked: serializable-props list vs the `'use client'` reference; `cache` per-request scope; taint APIs; `server-only`; semver caveat quote; links. Corrected the serialization table (documented list, no "streams"/"cycles" claims). No RSC runtime available in the sandbox: payload format descriptions, framework behavior, DevTools display remain unresolved.

### 28 Strict Mode
- Checked: mount/click/unmount logs, initializer/updater/useMemo doubling and second-pass reuse, ref callback double invoke, extra effect cycle at root vs scoped vs later mounts, RTL `reactStrictMode`, Activity, `useEffectEvent`.
- How: `strict.test.tsx`, `strict2.test.tsx` (dev and production). Corrected: log order (`render, init, init, render`), updater/render interleaving, later-mounted components do get the extra cycle (even in scoped Strict Mode), scoped Strict Mode skips only the initial tree mount. Unresolved: React 19 error-reporting console text (the error-reporting test threw through `act`; claim left as documented).

### 29 Reasoning about unnecessary renders
- Checked: same-state bailout extra call, `memo` no-props child, unstable object prop, context via memo, element-identity bailout, Profiler phases; React Compiler status. Results: confirmed; added exact same-state bailout behavior (one extra component call, no child render). Corrected Profiler-fires-on-parent-render caveat. Compiler status: 1.0.0 on npm (`latest`), react.dev has a section.

### 30 DevTools profiler
- Checked what is checkable: `onRender` signature and phases, profiling-build aliasing (`react-dom/profiling` export present; `scheduler/tracing` gone), Performance tracks, DevTools package names. Corrected aliasing advice and the Profiler "fires only when descendants render" claim. **Unresolved**: all browser-extension UI details (panels, flamegraph colors, Timeline tab, settings labels).

### 31 Reading React source
- Checked: every file and function name (GitHub tree + grep on `main` and on the installed bundle), ran the lesson's `verify-react-internals.ts` unchanged. Results: files all exist; 12/14 names FOUND in 19.3.1, `workLoopConcurrent` MISSING there (exists on `main`), `shouldYield` PRESENT. Corrected `performConcurrentWorkOnRoot` (replaced by `performWorkOnRoot`), commit function names, host-prop flagging in Step 9, `updateState` / `reconcileChildFibers` declaration forms. Documented `react.development.js` `exports.useState` shape.

### 32 Scenario A
- Checked: V0-V3, bad memo, `children` panel pattern, §5.8 test, flagging details. Results: logs/DOM exactly as claimed; narration corrected (see top).

### 33 Scenario B
- Checked: text-shape records (`childNodes` 2/1/1), equal re-render (no records), empty-string transitions (childList), style/class/title records, batching (`"0"->"3"`), §5.7 expectations. All confirmed; narration of diff-at-complete corrected; empty-string child creates no DOM text node (corrected A1).

### 34 Scenario C
- Checked: all key modes x (reverse, insert head, delete B) with real `Row`/`List` code; 8 reorder cases vs simulator; algorithm vs `reconcileChildrenArray`. Results: confirmed everything except observer record count for index keys (20, not 12: React's input update toggles `name`); `moveBefore` flag is off by default; Profiler/no-flag wording fixed.

### 35 Scenario D
- Checked: full instrumented demo (500 rows x 1 ms), one keystroke, second keystroke at +150 ms, §5.7 test, async action. Confirmed logs and 3 commits; noted controlled-input sync flush; confirmed expiration constants and `frameYieldMs = 5`.

### 36 Scenario E
- Checked: cases a/b/c with the lesson's exact code, §5.6 RTL test. Confirmed logs, pre-warm lines, hide/reveal effects, counter preservation, no fallback in transition. Added: `Fallback render` is logged inside the uncommitted transition render; no-boundary behavior corrected; RTL sync `render()` + `use` hang finding (the lesson's `await act` version works).

### 37 Scenario F
- Checked: clean hydration, text mismatch (root vs boundary), attribute mismatch persistence, two-pass and `getServerSnapshot` fixes, invalid nesting (C3), §5.6 tests, client render counts, `useId` formats (per 19.2 post). Corrected `suppressHydrationWarning` text-patching claim and `useId` format notes; confirmed rest.

### 38 Phase assessment (answer key consistency)
- Executed R1-R6, D1, D2, D4, I1-I4 reference code. R1, R2, R4, R5, R6 confirmed as keyed; R3 confirmed (focus claim browser-dependent). D1 mechanism confirmed (input value reverts immediately). D2 corrected: with an instantly resolving fetch it recovers by luck (3 requests), with 50 ms latency it loops (36 requests/1.5 s), `useMemo` variant also loops. D4 confirmed all symptoms. I1 key test failed as written (jest-dom import missing; Profiler assertion false) and was rewritten; I2/I3/I4 pass, `tsc --strict` clean. Key aligned with corrected lessons: replay (E10, R8), pre-warm/throttle (E9), Suspense passive effects, `performWorkOnRoot`, `useId` prefix history.

## Unresolved (could not verify here)
1. Real-browser frame/paint ordering (passive vs rAF for timer updates; focus loss on `insertBefore`; iframe/video reset on moves; scroll retention).
2. React DevTools extension UI and Timeline details (lesson 30).
3. React 18 behaviors cited as contrast (not installed).
4. React 19 `<head>`/`<body>` extension-node tolerance in hydration.
5. RSC wire format, framework RSC behavior, taint APIs (experimental only).
6. Browser translation-tool DOM mutations (Chrome class names).
7. Streaming-SSR inline-script swap and selective hydration in a real network trace.
8. React 19 error-reporting console output under Strict Mode (documented, not executed).
9. "Uncached promise" dev warning in real runs (string exists, did not fire in sandbox).
