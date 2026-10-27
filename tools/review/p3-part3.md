# p3 part 3 changelog: lessons 13-18 (03-react-state-and-hooks)

Reviewer date: 2026-10-22. Sandbox: React/ReactDOM 19.3.1, vitest 3.2.7, jsdom, RTL 16. Scratch tests: `tools/sandbox/scratch/p3/l13-18/a13..a18*.test.jsx` (run with `run.sh`).
Sources: react.dev reference pages (useContext, createContext, use, useMemo, useEffectEvent, Activity, eslint-plugin-react-hooks, rules-of-hooks), React 19 upgrade guide, React 19.2 / 19.3 / Compiler 1.0 blog posts, plugin README on GitHub.

## 13 useContext and propagation
- Render log of the theme example (TP, Header, ArticleBody only; not Page/Article/Footer): executed, CONFIRMED. Inline-children variant re-renders Page and Footer: CONFIRMED.
- B1 (`1:default 2:x 3:y 4:x 5:undefined`), B2 (memo consumer re-renders, memo non-consumer does not), B4 (11), conditional `use` after early return, `Context.Provider` still works, Object.is(NaN,NaN)/(0,-0): all CONFIRMED by execution.
- `Context.Provider` deprecation: CORRECTED. react.dev createContext now calls it "a legacy way to provide the context value before React 19"; removed "will be deprecated, verify" hedging in 3 places.
- Legacy `contextTypes`/`getChildContext` removed in 19: CONFIRMED (upgrade guide); removed warning marker.
- NEW finding: a conditional `useContext` does not throw or warn at runtime in 19.3.1 (no hook slot). Added a parenthetical to the useContext-vs-use table (still unsupported/linted).
- Server Components: added 19.3 note (context object can be rendered directly in a Server Component when imported from a 'use client' module). Compiler paragraph updated to 1.0 stable.
- Unresolved: reconciler file names (link kept; marker removed, generic repo path only).

## 14 Context performance
- 5.1 fat context (3 extra renders after 3 clicks): CONFIRMED. 5.2 split cart (click Add: only CartBadge renders; buttons do not): CONFIRMED. 5.5 selector store (sidebar 0 extra renders): CONFIRMED. Selector returning fresh object: CONFIRMED, React logs "The result of getSnapshot should be cached to avoid an infinite loop" then throws "Maximum update depth exceeded". 5.6 memo reader (Chart 2, Body 1): CONFIRMED. Exercise B1/B2 (A,B / B): CONFIRMED. B3 (batched `add` overwrites; result 2): CONFIRMED.
- CORRECTED: the claim that returning an identical reducer state makes React "bail out entirely, maybe rendering once more": for `useReducer` in 19.3.1 the component function re-ran on each dispatch (children skipped). Reworded.
- Compiler paragraph updated (1.0 stable, 2025-10-07); doc link fixed to /learn/react-compiler/introduction; removed "unverified" markers.

## 15 Custom hooks
- useDebouncedValue timeline (4 renders over 3 keystrokes + 1 debounced, d effect once): CONFIRMED. useJson in StrictMode makes 2 fetches, first aborted: CONFIRMED. useEventListener latest-ref (handler sees latest, 1 subscription): CONFIRMED. usePersistentState increments via functional set: CONFIRMED. useToggle identity stable via renderHook: CONFIRMED.
- useEffectEvent: CORRECTED from "experimental/verify" to stable since 19.2, with the doc's rules (top-level only, call only from Effects/Effect Events, not passed along, not in deps, identity not stable). Five markers removed.
- ESLint note: `set-state-in-effect` is in the recommended preset (react.dev lint reference): lint note made concrete.
- renderHook availability (RTL >=13.1, present in 16) and anchor: CONFIRMED.

## 16 Rules of hooks
- Executed in dev build: more hooks ("Rendered more hooks than during the previous render."), fewer hooks ("Rendered fewer hooks than expected. This may be caused by an accidental early return statement."), order-change console error with table, component-called-as-function trap (both directions), hook in event handler ("Invalid hook call"). CONFIRMED.
- CORRECTED/ADDED: effect-before-state removed case gives "Should have a queue. You are likely calling Hooks conditionally..." instead; same-count type swaps: useState/useRef swap renders silently, useState/useMemo swap crashes with TypeError. Table updated.
- CORRECTED F1: lesson claimed `useContext` allocates a positional slot; in 19.3.1 it does not (conditional useContext ran without error). Rewritten to separate the contract (forbidden) from the implementation.
- `use` inside try/catch: docs confirm; dev build also logs a console error, and the catch block receives React's internal Suspense exception for a pending promise. Wording added.
- D2 said the order warning needs Strict Mode: CORRECTED (it does not).
- Effect ordering: all cleanups (children then parent) before any setup in 19.3.1: CONFIRMED, marked version-sensitive.
- ESLint config: added README flat preset (`reactHooks.configs.flat.recommended`, plugin v7.1.1 latest); compiler paragraph updated; link markers resolved (all fetched 200).

## 17 Derived state
- Effect-synced fullName: 2 renders per keystroke vs 1 derived: CONFIRMED. Mirrored prop stays stale: CONFIRMED. Render-phase setState: body runs twice (3 in StrictMode update): CONFIRMED. Unguarded: "Too many re-renders. React limits the number of renders to prevent an infinite loop.": CONFIRMED. Setting another component's state in render warns "Cannot update a component (`P`) while rendering a different component (`Child`)": CONFIRMED. key reset vs same key: CONFIRMED. useMemo runs twice in StrictMode: CONFIRMED.
- useMemo cache-discard behavior and 1 ms heuristic: CONFIRMED against react.dev useMemo; added the two documented discard cases. Compiler paragraph and link updated.

## 18 State colocation and lifting
- Scenario 2 (SlowChart 6 renders -> 1 after moving state down), Scenario 4 (children trick, 1 render), temperature converter: CONFIRMED.
- Activity: CORRECTED from "experimental, verify" to stable in 19.2 with documented behavior (display:none, Effects destroyed, state kept, lower priority); sandbox: draft survived, effect setup/cleanup/setup. Interview answer Q5 updated.
- Added concrete lossy round-trip example (213 F -> 101 C -> 214 F). All external links fetched OK; "unverified" note replaced.

## Unresolved / not executed
- Internal mechanics (§3 propagation walk, hook list shape): teaching models, hedged in place, not verified against reconciler source.
- Profiler "Context changed" reason labels and DevTools UI steps in §10 of 13/14/18: not executed (no browser).
- Performance figures in prose (4 ms charts, 20 Hz ticks): illustrative, unmeasured.
- Lessons 15/14 later exercise answers (C/D/E/F levels) were read for plausibility, not each executed.
