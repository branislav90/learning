# p0p1 part B: 00-web-and-javascript-foundations lessons 08-14

Environment: Node 24.16, React/ReactDOM 19.3.1, jsdom, Vitest 3.2.7. Scratch: tools/sandbox/scratch/p0p1-b/ (f1.js, b2.js, b4.js, e.js, m/*.mjs, r.test.tsx, fs.test.tsx).

## 08 Objects, references, immutability
- structuredClone behaviour (Date/Map/Error/cycles cloned; functions and symbol values throw DataCloneError; class prototype dropped; getters flattened): node, CONFIRMED. Added the checked detail.
- Object.freeze shallow / TypeError in strict mode: node, CONFIRMED.
- toSorted / with exist (Node 24): CONFIRMED.
- Immer auto-freeze "in development": immerjs docs say produce output is frozen (not dev-only). CORRECTED (two places).
- React Compiler note: hedged wording only. Unverified anchors in resource table: UNRESOLVED (not fetched).

## 09 Prototypes and object model
- Class components still supported, error boundaries need class methods: react.dev/reference/react/Component, CONFIRMED; markers removed.
- isReactComponent marker exists in react@19.3.1 source: CONFIRMED.
- Lost `this` on destructured method (undefined in class bodies), #x in o, Object.hasOwn: node, CONFIRMED.
- "No hook equivalent for error boundaries": docs still show only class API; HEDGED.
- useEffectEvent: now stable (19.2), updated.

## 10 Modules
- Cycle B1 (ReferenceError TDZ), B2 (function hoisted: `b sees a = [Function: a]`, then `a sees b = B`), B3 (`2 2`), assignment to import = TypeError "Assignment to constant variable.": node ESM, CONFIRMED.
- React.lazy caches rejection: React 19.3.1 test, factory called once across two mounts, CONFIRMED; wording made definitive.
- Bundler used by Vite: Vite 8 (npm latest 8.3.5) uses Rolldown; CORRECTED/updated note.
- RSC/Fast Refresh/tool-specific claims: UNRESOLVED (left hedged).

## 11 Event loop
- 4.1 / B1 `A E G C D F B`, B2 `5 2 3 1 4`: node, CONFIRMED.
- 4.2 `handler end` then `render 2`: Vitest+jsdom, CONFIRMED.
- Flush mechanism: React 19.3.1 source shows sync-lane update scheduled via scheduleMicrotask/processRootScheduleInMicrotask; passive effects of SyncLane flushed at end of commit. CORRECTED (replaced "implementation detail may be end of dispatch or microtask" with the microtask fact).
- flushSync in useEffect: console error text confirmed, and work is deferred (DOM unchanged on next line). CORRECTED lesson to quote the real message and behaviour.
- useEffectEvent stable in 19.2 (react.dev blog 2025-10-01): CONFIRMED.
- scheduler.yield / rIC / MessageChannel / B3 real-click vs script click semantics: not run (needs browser). UNRESOLVED (kept hedges).

## 12 Promises
- 3.2 `a1 b1 a2 b2 a3`, 4.1 chain output (1,2,x,fin,recovered), 4.2 `a1 b1 sync end a2 b2 a3`, B2, B3, B4 (a rejects, b caught, c "no error" + unhandled), F1 (`a1 b1 p1 p2 a2 p3`; plain-value variant `a1 b1 a2 p1 p2 p3`): node, all CONFIRMED.
- async transition post-await caveat and `use` promise-stability pitfall: react.dev useTransition/use pages, CONFIRMED. Markers removed.
- AbortSignal.any/timeout, Promise.withResolvers exist in Node 24: CONFIRMED (browser support left hedged).

## 13 Browser events
- 4.2 order `native document capture, a capture, c bubble c, a bubble, native root bubble, native document bubble` and stopPropagation variant: Vitest+jsdom, CONFIRMED.
- React registers wheel/touchstart/touchmove as passive: spied addEventListener, CONFIRMED.
- onFocus bubbles (focusin): CONFIRMED. onChange per input event: not run.
- 5.4 "menu flashes open and closes": NOT reproducible with scripted click (no microtask checkpoint). CORRECTED: explained that it needs a real user click; mechanism text fixed (microtask flush).
- Capture-before-bubble at target (DOM spec change): UNRESOLVED, not tested (jsdom would not be evidence); hedge kept.
- Disabled-button click behaviour: jsdom `.click()` does not dispatch; browser differences UNRESOLVED.

## 14 Web APIs
- Strict Mode effect: start, abort, start: CONFIRMED (B5 answer holds).
- Node: no default localStorage in v24, ReadableStream async iterator present, AbortSignal.any present, aborted fetch rejects AbortError, custom reason propagates: node, CONFIRMED/CORRECTED text.
- Network-panel statuses, priority option, bfcache timer note: UNRESOLVED (browser-only).
