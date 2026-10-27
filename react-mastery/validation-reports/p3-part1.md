# p3 part 1: lessons 01-06 (03-react-state-and-hooks)

Sources: react.dev reference pages (useState, useReducer, useEffect, useEffectEvent, createContext, Activity), React 19.2 and 19.3 blog posts, react.dev/versions. Executed: Vitest + RTL + jsdom against react/react-dom 19.3.1, `tsc` 5.9 against @types/react 19.3. Scratch tests: `tools/sandbox/scratch/p3/l01-06/*.test.jsx`, `ts/a.tsx`. Date 2026-10-22.

## 01 useState internals
- Batched `setN(1)` x3 -> 1 render; repeat click -> bail-out, one extra component call on 2nd click, none on 3rd (matches lesson's hedge): **confirmed**.
- Typing a, b, submit -> 3 renders, final `{draft:'', saves:1}`: **confirmed**.
- Mutate + `setItems(items)` -> no render; appears after unrelated render: **confirmed**.
- Lazy init / eager arg in Strict Mode both called 2x: **confirmed**.
- Setter after unmount logs no warning: **confirmed**. Set-state-during-render: child never sees stale value: **confirmed**.
- Changes: removed the ⚠ on the unmounted-setter note and the "(unverified deep link)" tag (URL returns 200).

## 02 functional updates
- Fold example 43/42, `votes` walkthrough (40, one render; Strict Mode doubles updater calls `+1,+1,*10,*10` but same state): **confirmed**.
- Rebase example (base 1, transition `+10`, urgent `*2`): rendered values `1, 2, 22`: **confirmed**.
- Function-as-state ambiguity (setter called with a function is an updater): **confirmed**.
- Changes: `useEffectEvent` rows/answers now state "stable since 19.2", Effect-only callable, unstable identity; removed ⚠ legend.

## 03 useReducer
- Reducer + init double-invoked in Strict Mode: **confirmed** (react.dev + run).
- Reducer used is from the render that processes the queue: **confirmed** (observed), hedge kept.
- **Corrected:** §3.3 claimed an eager reducer evaluation in `dispatch` as for `useState`. In 19.3, three no-op dispatches (reducer returns same state) called the component 3 times (children skipped); there is no eager bail-out for `useReducer`. Rewrote §3.3.
- `<Context value>`: react.dev now calls `.Provider` "legacy"; reworded the version note, removed ⚠.

## 04 useEffect synchronization
- Chat-room log sequences, prod and Strict Mode (mount/switch/unmount): **confirmed**.
- Discrete event flushes passive effects synchronously (render+effect back-to-back in one microtask flush for a click; later macrotask for timer `setState`): **confirmed**, matches react.dev useEffect page. Removed ⚠.
- Cross-component order (cleanups all first, then setups; child before parent on mount/update): **confirmed**.
- **Corrected:** async effect. Warning text is `useEffect must not return anything besides a function...` plus an "It looks like you wrote useEffect(async () => ...)" hint; and in 19.3 dev the later unmount/re-run throws `TypeError: destroy is not a function` (not a silent no-op). TS error on `Promise<void>`: **confirmed** with tsc.
- Added observed `<Activity hidden>` effect teardown to the Strict Mode section; removed `useEffectEvent ⚠` markers (stable 19.2).
- Deps-array size warning exists ("changed size between renders"): **confirmed** (lesson 05 §3.2).

## 05 effect dependencies / stale closures
- Ticker prediction (total = 4 at t=4s): **confirmed**. B2 (4 created, 3 cleared while mounted, 4th on unmount): **confirmed**. Stale interval logs the first-render value: **confirmed**.
- **Corrected:** B3 said React throws "Maximum update depth exceeded" for an effect that sets a new array each run. In 19.3 effect-driven loops only emit a dev `console.error` with that text and keep looping (3000 iterations run); the throw ("Too many re-renders") is for render-phase setState.
- `useEffectEvent`: callable from useEffect/useLayoutEffect/useInsertionEffect and other Effect Events, throws if called in render, identity changes every render, stable since 19.2: **confirmed** (react.dev + run). Rewrote the version note and removed all ⚠.
- React Compiler 1.0 released Oct 2025 (react.dev blog list): replaced the "verify" hedge. useMemo cache may be discarded (docs: editing file in dev, suspending on initial mount): **confirmed**.

## 06 effect cleanup
- Race log order: observed `setup 1, cleanup 1, setup 2, aborted 1, apply 2`; **corrected** the listed order in the lesson (it contradicted its own explanation).
- Probe order `cleanup A, cleanup B, setup A, setup B`: **confirmed**. Passive cleanup sees detached DOM (`isConnected` false), layout cleanup sees it attached: **confirmed**.
- Error in cleanup reaches nearest error boundary: **confirmed**. Anonymous-listener leak counts (3 after 3 cycles; 2 on first Strict mount): **confirmed**.
- Ref callback cleanup (19): returned function replaces `null` call; Strict Mode set, cleanup, set; TS error for implicit-return arrow: **confirmed**.
- **Corrected:** §3.8. `<Activity mode="hidden">` tears down both layout and passive effects and restores them on show (hidden-at-mount runs none). For `<Suspense>` re-suspending visible content only layout effect cleanups ran; passive effects stayed. Lesson had said effects are unmounted in both cases.
- Removed ⚠/verify markers; removed "(unverified deep link)" tags. All URLs in lessons 01-06 return 200 (npmjs.com returns 403 to bots only).

## Unresolved
- None of substance. The "eager state" internals in 01 §3.4 remain labelled implementation detail (observed behaviour matches, source not read). Newer-major notes (TS 7, Vitest 5, MSW 3) not applicable in 01-06.
