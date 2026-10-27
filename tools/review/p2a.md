# Review changelog: batch p2a (Phase 2, lessons 01-19)

Reviewer: p2a. Date: 2026-10-22. Environment: react / react-dom 19.3.1, scheduler 0.28.0, jsdom, Vitest 3, esbuild, tsc 5.9; React source (`facebook/react` `main`) downloaded to `tools/sandbox/scratch/p2a/src/`; react.dev pages fetched with curl. All experiments are in `tools/sandbox/scratch/p2a/*.test.jsx` (run with `npx vitest run --config vitest.config.mjs`), toy-code extraction scripts in the same folder.

Method notes and limits:
- Render/effect/ordering claims were run in jsdom under React's *development* build (`NODE_ENV=test`). Strict Mode double-invocation is dev-only, so it was only ever observed in dev.
- The Scheduler host in Node/jsdom is `setImmediate`, not `MessageChannel`. Slice behaviour (blocking vs sliced) was demonstrated that way; the 5 ms figure was read from source, not measured in a browser.
- jsdom has no layout engine, so pixel numbers (lesson 19: 202) are derived from the box model, not measured.

Totals: about 62 claims confirmed, 31 corrected, 9 unresolved (listed at the end).

## 01 what-triggers-a-render
- Strict Mode: twice-invoked bodies / initializers, `useMemo` factory run twice in pass 1 and reused in pass 2, ref callbacks re-run (attach, null, attach). Executed on 19.3.1. **Confirmed.** Removed the "version-sensitive" marker, added the execution evidence.
- Passive effects flush synchronously for discrete events. Read `completeRoot` in `ReactFiberWorkLoop` (`includesSyncLane(pendingEffectsLanes)` then `flushPendingEffects()`) and ran a click. **Corrected/narrowed**: it is the `SyncLane` (clicks, `flushSync`), not "discrete events" in general; continuous events do not qualify. Table row and diagram annotation updated.
- `useSyncExternalStore` updates are synchronous: `forceStoreRerender` uses `SyncLane` in source. **Confirmed**, marker removed.
- "One extra render" bail-out quirk: executed (second click with same value re-ran the parent body, `Child` did not). **Confirmed.**
- Context update through `memo` (`Panel` silent, `Themed` logs dark). Executed. **Confirmed.**
- `flushSync` "not allowed inside layout effect/lifecycle": executed; React logs "flushSync was called from inside a lifecycle method" and postpones the flush; it is not an error. **Corrected** the wording.
- React Compiler status: **updated** to "1.0 stable since Oct 2025" (react.dev blog list).

## 02 render-reconcile-commit-paint
- Ref/layout ordering on update. Executed: `ref null`, `layout cleanup`, then `ref attach`, `layout setup`. Lesson had layout cleanup before ref detach. **Corrected** (text, summary line, explanation that the ref is on a child fiber and mutation work is child-first).
- Mount order (`ref attached`, `layout effect`, `passive effect`) **confirmed**; ref cleanup return value replaces the `null` call **confirmed** (executed).
- Host instance created in render phase: read `completeWork` (`createInstance`, `appendAllChildren`). **Confirmed.**
- Passive flush sync for discrete events: narrowed to `SyncLane` as in 01.
- `<Profiler>` disabled in production by default: react.dev. **Confirmed.**

## 03 initial-mount-and-updates
- `root.render` outside an event "may yield during a slow initial render". **Corrected**: it is a default-lane update and the default lane is a blocking lane (`includesBlockingLane`); executed with a ticker, 0 interleaved callbacks. Rewritten.
- `onCaughtError` / `onUncaughtError` / `onRecoverableError` / `identifierPrefix` in `createRoot`: react.dev. **Confirmed**, markers removed.
- Deletion order (parent before child for layout and passive cleanups) and the Strict Mode sequence (layout cleanup, ref null, passive cleanup, ref attach, layout setup, passive setup): executed. **Confirmed**; ref step added.
- `Activity`: now stable (19.2). **Updated.**
- `useState(parse(raw))` vs lazy init counts, effect log walkthrough (A/B/C): reasoned from semantics, consistent with executed effect-order tests. **Confirmed.**

## 04 virtual-dom-what-it-means
- Legacy FAQ virtual DOM wording: fetched `legacy.reactjs.org/docs/faq-internals.html`. **Confirmed.**
- Dev elements frozen, `typeof` object, `_owner`/`_store` keys: executed. **Confirmed.**
- `react-test-renderer` deprecated in 19: Upgrade Guide. **Confirmed.**
- Vue Vapor / Angular signals line: Vue 3.6 is an `rc` dist-tag on npm today. **Hedged/updated.** Compiler status updated.
- Auto-translation / text-node crash note (`removeChild`): not reproducible in jsdom. **Unresolved** (kept as a labelled caution).

## 05 elements-vs-dom-nodes
- `$$typeof` is `Symbol(react.transitional.element)`; `key` is a string; `props` has no `key`; `props.key` read logs "`key` is not a prop" and is `undefined`: executed. **Confirmed.**
- `element.ref`: in 19 reading it logs "Accessing element.ref was removed in React 19" (value still returned). **Corrected** (lesson said "deprecated").
- Unknown props (`false`, functions dropped with console errors): executed. **Confirmed**; custom elements wording replaced by the react.dev React 19 post facts (client property vs attribute, SSR omission rules).
- Snippet typing bug: `document.querySelector("button.primary")` returns `Element`, so `.disabled` fails `tsc --strict`. **Corrected** with `querySelector<HTMLButtonElement>`.
- RSC serialization note now points to react.dev `'use client'` "Serializable types".

## 06 reconciliation-fundamentals
- `lastPlacedIndex` move rule and the 3-moves-vs-1 table: read `ReactChildFiber.js`; executed with a `MutationObserver` (`ABCD->DABC`: 3 re-insertions, `ABCD->BCDA`: 1). **Confirmed.** The `plan()` toy was run: all five printed ops match the lesson.
- Fragment unwrapping: executed four shapes. Top-level unkeyed fragment is treated as its children: `<><Counter/></>` vs `<Counter/>` and `<><Counter/><i/></>` vs `<Counter/>` both **preserve** state; `<><Banner/><Counter/></>` vs `<Counter/>` **loses** it. **Corrected/made precise** (the old text hedged without saying which).
- File/function names (`ReactChildFiber.js`, `createChildReconciler`) checked on `main`; markers removed.

## 07 identity-keys-and-reconciliation
- Duplicate keys: executed, `[1,1,2]` then `[2,1,1]` produced 4 `<li>` from 3 items. **Confirmed** and replaced the vague text with the observed outcome.
- Key spread: React 19 logs "A props object containing a "key" prop is being spread into JSX"; `<div {...rest} key={id}/>` is silent. **Confirmed/corrected** (lesson called it a deprecation).
- Key change effect order: executed (`render b`, old layout cleanup, old ref null, new ref attach, new layout setup, old passive cleanup, new passive setup). **Confirmed**; noted deletion order differs from in-place update order.
- `Key` type `string | number | bigint`: checked in `@types/react`. **Confirmed.** `Activity` and `useOptimistic` notes updated.

## 08 why-fiber
- Release timeline (16.0 2017, 17 Oct 2020, 18 Mar 2022, 19 Dec 2024), plus 19.2/19.3: react.dev/versions. **Confirmed**, row added.
- `workLoopConcurrent`: in the published 19.3.1 build only `workLoopConcurrentByScheduler` exists (main also has `workLoopConcurrent` behind an experimental flag). **Corrected.**
- 5 ms slice: `frameYieldMs = 5` in `SchedulerFeatureFlags.js`. **Confirmed.** Toy begin/complete and cursor outputs executed. **Confirmed.**
- Lin Clark talk and reactwg thread URLs: **unresolved** (index pages only).

## 09 fiber-nodes-and-units-of-work
- Inspected a live fiber on 19.3.1: field list (`tag, key, elementType, type, stateNode, return, child, sibling, index, ref, refCleanup, pendingProps, memoizedProps, updateQueue, memoizedState, dependencies, mode, flags, subtreeFlags, deletions, lanes, childLanes, alternate`, profiler fields). **Confirmed.** `__reactFiber$` key trick works.
- Chain from the button is `button <- Counter <- App <- HostRoot (tag 3)`; the top-level fragment gets **no fiber**. **Corrected** (lesson said a Fragment fiber may appear "in some versions"; it does not in 19.3.1).
- `updatePayload` is gone in 19 (0 occurrences in `react-dom@19.3.1`). **Confirmed.**
- Toy traversal output (`descend App`, `skip Header` ...) executed. **Confirmed.**
- Unmount cleanup order caution made concrete (update: child-first; deletion: parent-first), executed.

## 10 current-and-work-in-progress-trees
- Toy double-buffer outputs (`false true true true`; `1 b1 / 2 NEW / 3 true / 4 false / 5 false / 6 true`): executed and typechecked. **Confirmed.**
- Commit step 3 said "run effects, flip the pointer". **Corrected**: pointer flips (`root.current = finishedWork`) after mutation and before layout effects (source and `flushLayoutEffects`).
- Error-reporting callbacks: `onUncaughtError` vs `onCaughtError` vs `onRecoverableError` roles written out. **Corrected** (lesson lumped them).
- `cloneChildFibers` exists on `main` but not as a named function in the 19.3.1 dev bundle: noted. Activity, Performance Tracks, `cache` statements updated.

## 11 render-phase-and-commit-phase
- `flushSync` "passive effects may still be pending". **Corrected**: executed, log `render 1 | passive 1 | flushSync returned`; react.dev flushSync page agrees ("may run pending Effects ... before returning").
- Render-phase re-render limit "tens": **Corrected** to 25 (`RE_RENDER_LIMIT`, message "Too many re-renders ..." executed).
- Click walkthrough (cleanups child-first, then setups, passive flushed synchronously): executed. **Confirmed.**
- `useLayoutEffect` SSR warning: `renderToString` logs nothing on 19.3.1. **Corrected** (lesson implied it might warn).

## 12 why-rendering-must-be-pure
- Strict counter example (6 calls, UI shows 2, 4, 6): executed. **Confirmed.**
- Tearing demo: executed 2,000 siblings in a transition with a store change at 40 ms: raw read gave 231 spans `0` + 1,769 spans `1` in one commit; `useSyncExternalStore` gave all `1`. **Confirmed**; added the nuance that tearing only occurs in time-sliced lanes.
- Strict Mode table vs react.dev (including ref callbacks, dimmed second-render logs): **Confirmed.**
- Code bug: a `{/* comment */}` after `</li>` inside the arrow body is invalid JSX (`tsc` error TS1005/TS1381). **Corrected.** C3 fence changed from `ts` to `tsx` (contains JSX).
- `eslint-plugin-react-hooks` rule names updated to v6+/7 (`purity`, `refs`, `immutability`, ...).

## 13 scheduler-and-priorities
- Scheduler priority timeouts (-1/250/5000/10000/never), `frameYieldMs = 5`, host choice (`setImmediate` > `MessageChannel` > `setTimeout`): read `Scheduler.js` and flags. **Confirmed.**
- Lane to Scheduler priority mapping (`ReactFiberRootScheduler`): continuous/discrete-through-this-path to UserBlocking, default/transition to Normal, idle to Idle; sync via microtask. **Confirmed.**
- Time slicing: `includesBlockingLane` (sync, continuous, default, gesture + hydration variants) and expired lanes are not sliced. **Confirmed** and executed (default lane: 0 interleaved timers over 300 rows; transition: 31). Added.
- Expiration (250 ms sync/continuous/gesture, 5000 ms default/transition, retry/idle/offscreen/deferred never): `computeExpirationTime`. **Confirmed**, replaced the vague "few hundred ms / few seconds".
- Toy `MiniScheduler` demo (`low:1 low:2 low:3 urgent low:4 low:5 low:6`): ran, typechecked, and reproduced with the real `scheduler@0.28.0`. **Confirmed.**
- `performConcurrentWorkOnRoot` renamed to `performWorkOnRootViaSchedulerTask` in 19. **Corrected.** Drag events table fixed (`drag`/`dragover`/`dragenter` continuous; `dragstart`/`dragend`/`drop` discrete, from `getEventPriority`).
- Safari `requestIdleCallback`, `scheduler.postTask` support: **unresolved** (told readers to check MDN).

## 14 lanes
- Real lane layout read from `ReactFiberLane.js` (main) and `react-dom@19.3.1` (31 lanes; Sync=0b10, 14 transition lanes, 4 retry, then selective hydration, idle hydration, idle, offscreen, deferred). Lesson's conceptual list **confirmed**.
- Deferred lanes: `useDeferredValue` uses the last four transition lanes (`claimNextTransitionDeferredLane`) or `OffscreenLane` when prerendering. **Corrected** (lesson said "added in later versions, verify").
- Worked rebasing example (1 to 2 to 4; updater `x*2` runs twice): executed on real React. **Confirmed**; also observed the transition updater runs once because eager state is reused. Noted.
- Toy code: bit-operations output, update-queue permutation test (`sequential = 95`, `2 1 [...]`, `4 4 0`) executed. **Confirmed.**
- Lanes shipped in 17.0.2 (`var SyncLane` present in `react-dom@17.0.2`, absent in 16.14). **Confirmed.**
- Entanglement mechanism: `entangleTransitionUpdate` read in source. **Confirmed.**

## 15 interruptible-restartable-abandoned-rendering
- "Default lane not time-sliced in 18.x": **Confirmed for 18 and 19**, executed.
- B1 queue (A(T), B(U), C(T)) real commits `"B"` then `"ABC"`: executed. **Confirmed.**
- Suspense-in-transition scenario: executed (`commit pending=true`, `Reports render` x2 with first discarded, final commit). **Confirmed.** Pre-warming statement now cites the React 19 post.
- Function names (`workLoopConcurrent`, ...) updated; `isInputPending` statement replaced by what the published scheduler exposes.
- Performance tracks: React 19.2 (blog). **Confirmed.**

## 16 concurrent-react-misconceptions
- B2/D2: `useDeferredValue({ q })` with a fresh object each render does **not** loop forever. Executed: logs `render a` (urgent, stale), `render b` (deferred), then stable. Source: in a deferred render `updateDeferredValueImpl` adopts the new value. **Corrected** (lesson claimed repeated background renders); cost reframed as one extra render per urgent render.
- M16 / async transition: react.dev calls post-`await` updates a "known limitation". Executed: `isPending` stays true over the `await`, post-await `setB` commits immediately, re-wrapped `setC` commits with the action. **Confirmed**, evidence added.
- `useTransition` batching caveat and "can't control text inputs": react.dev quotes. **Confirmed.**
- React 19.x feature row corrected: pre-warming is 19.0, `Activity` + performance tracks 19.2, stable `<ViewTransition>` 19.3.

## 17 hooks-and-fiber-state
- Hook record shape: inspected a live fiber (5 fields; `useRef` `{current}`, `useMemo`/`useCallback` `[value, deps]`, effect `{tag, create, deps, inst, next}`, `useId` string, `useTransition` two slots, `useContext` no slot, uSES snapshot + effect). **Confirmed.**
- Dispatcher names and error strings (`Rendered more hooks ...`, `Do not call Hooks inside useEffect(...)`, `RE_RENDER_LIMIT = 25`): grepped in `react-dom@19.3.1`. **Confirmed.**
- Strict Mode memo reuse **confirmed** (executed). `useEffectEvent` stable since 19.2; `Activity` stable.

## 18 effects-and-their-timing
- Mount/update/unmount orders and "all cleanups, then all setups" **confirmed** (executed, four orderings).
- Effects after Suspense hide: executed, layout cleanup/setup re-run, passive untouched; `Activity` hidden runs both. **Confirmed**, now stated.
- Thrown effect error does not stop sibling effects; boundary renders fallback: executed. **Confirmed.**
- `commitRootImpl` no longer exists in 19 (`completeRoot`, `commitRoot`, `flushPendingEffects`). **Corrected.**
- `useEffectEvent`: executed on 19.3.1; "in flux" text **corrected** to stable since 19.2.

## 19 layout-vs-passive-effects
- `setState` in layout effect re-renders before the task yields (executed: `render 0, layout 0, render 1, layout 1` before a pending `setTimeout(0)` and `setImmediate`). **Confirmed.**
- Passive-effect `setState` is at most default priority (`lowerEventPriority(DefaultEventPriority, ...)`), rendered in a separate task (executed). **Confirmed.**
- Unmount: layout cleanup sees the node (`isConnected` true), passive cleanup sees `ref.current === null`. Executed. **Confirmed**, made definite.
- `NESTED_UPDATE_LIMIT = 50` and "Maximum update depth exceeded": executed. **Confirmed.**
- Measured width example said `useEffect` ends at 200 and `useLayoutEffect` at 202 in the same box. **Corrected** (both end at 202; `getBoundingClientRect` includes the 1px borders). Not measured (jsdom).
- `useLayoutEffect` SSR warning removed in 19 (executed `renderToString`). **Corrected.** `commitLayoutEffects` search hint updated.

## Cross-cutting edits
- Added/updated Activity (stable 19.2), `useEffectEvent` (stable 19.2), React Compiler (1.0 stable, Oct 2025), Performance Tracks (19.2), React 19.3 (Sep 2026: stable `<ViewTransition>`, Fragment Refs; latest on npm 19.3.1) where lessons marked these as volatile.
- All 101 external URLs in lessons 01-19 returned HTTP 200 (curl, 2026-10-22). `tools/linkcheck.mjs`: 0 broken relative links after edits.
- Remaining `⚠` characters are deliberate warnings in code comments or the lesson-08 legend, not verification flags.

## Unresolved
1. Real-browser timing of the sync-lane flush ("microtask" vs "end of event handler"): only observed in jsdom (microtask after `dispatchEvent`); source also shows `flushSyncWork` after events with controlled-input state restore. The lessons keep their hedge.
2. The 5 ms slice and `MessageChannel` host in real browsers (verified in source, executed only with `setImmediate`).
3. Pixel results (lesson 19, 202 px) and flicker claims: no layout engine in jsdom.
4. Safari `requestIdleCallback`, Long Animation Frames, anchor positioning, `interpolate-size`: browser support claims left as "check MDN/caniuse".
5. Lin Clark "A Cartoon Intro to Fiber" and individual reactwg discussion threads: not verified (index pages only).
6. Lesson 04 translation-extension crash scenario: plausible, not reproduced.
7. Vue Vapor / Angular positioning in lesson 04: checked only via npm dist-tags.
8. DevTools settings name for hiding second-render logs: react.dev says an off-by-default setting exists; exact UI label not verified.
9. Lesson claims about React 17/legacy mode behaviours (e.g. 17 not batching after `await`): not re-run (React 17 not installed).
