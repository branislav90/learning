# Review changelog: p0p1 part A (00-web-and-javascript-foundations 01-07), 2026-10-22

Methods: node 24 (strip-types) run of all ts/js code blocks in 01-07 (non-DOM ones; failures were intentional demos: stack overflow, TDZ, uncaught async errors, module `export`s); vitest+jsdom with react 19.3 for React claims; tsc 5.9 for ref typing; curl/python fetches of react.dev, MDN; HTTP check of every "unverified" link. Scratch: tools/sandbox/scratch/p0p1-a/.

## 01 How the browser works
- Long Tasks API availability: MDN says limited availability, confirmed, hedge replaced with dated statement. Corrected wording.
- `scheduler.yield()`: MDN "limited availability / not Baseline", confirmed; rewrote unverified note.
- 3 unverified links (MDN How browsers work, Chrome inside-browser): HTTP 200, markers removed.
- Process-model teaching model: kept (portable claims only). Confirmed.

## 02 HTML parsing / DOM / CSSOM
- React 19 head hoisting/stylesheet precedence: consistent with react.dev; left as general statement (not run). Confirmed (docs).
- `<Activity>`: was "volatile"; **corrected**: stable in React 19.2 (blog 2025-10-01); hidden mode unmounts effects (contrast with `hidden` attribute).
- D2 hydration mismatch (`<p><div>`): **executed** (renderToString + jsdom + hydrateRoot): jsdom reparses to `<p></p><div>x</div><p></p>`, React emits nesting warning and recoverable error, ends with client-rendered DOM. Confirmed; detail added.
- Links: 4 unverified MDN/spec links all HTTP 200; markers removed.

## 03 Rendering pipeline
- `field-sizing`: MDN now Baseline newly available (June 2026); updated.
- Ref callback cleanup (React 19) executed: `attach0,cleanup0,attach1`; confirmed. TS claim that returning a non-function value from a ref callback errors: tsc with @types/react 19.3 gives TS2322; confirmed.
- CSS triggers table, anchor positioning, View Transitions, useEffect-after-paint: hedged heuristics left as is; **unresolved** (not executable; engine-dependent). Anchor positioning support not re-checked.
- web.dev link HTTP 200.

## 04 DOM structure and mutation
- React 17+ root-container event delegation: confirmed (documented behaviour; not executed).
- Focus/selection on moves, LIS reorder explanation: standard; **unresolved** for browser-specific focus-on-move (not run, hedge retained).
- Chart `useEffect([])` example: type-only; no change.

## 05 Execution contexts and call stack
- Code samples executed: TDZ/hoisting, recursion RangeError, async ordering (1, A, B), trampoline 1M: all behave as stated. Confirmed.
- Tail-call claim (only JSC implements PTC): consistent with known state; not re-fetched. Left hedged.
- Scheduler/MessageChannel note: matches React scheduler design; "verify file names" marker removed, links 200.

## 06 Lexical scope and closures
- Closure demos executed: `2 1`, `[3,3,3]` (var) vs `[0,1,2]` (let). Confirmed.
- `useEffectEvent`: was "volatile/verify"; **corrected**: stable in 19.2, not in 19.0/19.1, Effects-only, intentionally non-stable identity, must not be in deps (react.dev reference). All ⚠ on it removed (06 and 07, incl. tables).
- React Compiler: v1.0 stable (blog 2025-10-07); updated.
- Strict Mode effect double-run: documented behaviour; marker removed.

## 07 Functions and referential identity
- Strict Mode double compute of useMemo: executed (2 calls at mount), confirmed.
- `setState(sameRef)` extra component call before bailout: executed (component function ran again, no commit change), confirmed; marker removed.
- Ref callback identity/cleanup: executed, confirmed.
- React Compiler rows updated to v1.0 stable; `useEffectEvent` rows now say React 19.2+.
- `memo` wrapper-vs-fiber ⚠ note kept (teaching model).

## Unresolved
- Browser-specific compositor/layer-promotion claims (03), focus retention on node moves (04), anchor-positioning support (03), PTC in Safari (05). All already hedged in-text.
